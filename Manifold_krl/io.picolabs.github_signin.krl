ruleset io.picolabs.github_signin {
  meta {
    use module io.picolabs.github_keys

    shares __testing
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      //, { "name": "entry", "args": [ "key" ] }
      ] , "events":
      [ //{ "domain": "github", "type": "test" }
      //, { "domain": "d2", "type": "t2", "attrs": [ "a1", "a2" ] }
      ]
    }

    DID_Policy = {
        "name": "only allow github authorized_user events",
        "event": {
            "allow": [
                { "domain": "github", "type": "authorized_user"},
                { "domain": "github", "type": "clear_uuid"}
            ]
        }
    }

    DID_polling_policy = {
        "name": "only allow github owner_DID_requested events",
        "event": {
            "allow": [
                { "domain": "github", "type": "owner_DID_requested"}
            ]
        }
    }
  }

  rule createRootDID {
    select when wrangler ruleset_added where rids >< meta:rid
    every{
      engine:newPolicy(DID_Policy) setting(registered_policy)
      engine:newChannel(name="github", type="signin", policy_id = registered_policy{"id"})
      engine:newPolicy(DID_polling_policy) setting(registered_policy2)
      engine:newChannel(name="github", type="DID_poll", policy_id = registered_policy2{"id"})
    }
  }

  rule receiveOauth {
    select when github authorized_user
    pre {
      code = event:attrs{"code"}
    }
    if code then
      http:post("https://github.com/login/oauth/access_token", json = {
        "client_id": keys:github_manifold{"clientID"},
        "client_secret": keys:github_manifold{"clientSecret"},
        "code": code
      }) setting(result)
    fired {
      raise github event "received_access_token"
        attributes { "response": result }
    }
  }

  rule validAccessToken {
    select when github received_access_token
    pre {
      //We receive content in the form "key=value&key2=value2..."
      parseContent = function(x) {
        keyValuePairs = x.split(re#&#);
        keyValuePairs.reduce(function(counter, current) {
          //split key=value into an array of [key, value]
          splitKeyValue = current.split(re#=#);
          counter.put([splitKeyValue[0]], splitKeyValue[1])
        }, {})
      }
      valid_status = (event:attrs{["response", "status_code"]} == 200)
      contentMap = valid_status => parseContent(event:attrs{["response", "content"]}) | ""
    }
    if valid_status && contentMap then
      noop()
    fired {
      raise github event "validation_success"
        attributes { "content": contentMap }
    } else {
      raise github event "validation_failure"
        attributes event:attrs
    }
  }



  //raise the owner creation event. The account_management ruleset handles the case where it already exists. Redirect to Manifold with a UUID that Manifold can use to poll for the owner DID.
  rule createOwnerAndRedirect {
    select when github validation_success
    pre {
      access_token = event:attrs{["content", "access_token"]}
      response = http:get(<<https://api.github.com/user?access_token=#{access_token}>>, headers = {"user-agent": "node.js"})
      isValid = response{"status_code"} == 200
      newContent = isValid => response{"content"}.decode() | ""
      githubProfile = {
        "displayName": newContent["login"],
        "name": newContent["name"],
        "profileImgURL": newContent["avatar_url"],
        "email": newContent["email"]
      }
      uuid = random:uuid()
    }
    if isValid && newContent then
      send_directive("_redirect", { "url": <<http://manifold.picolabs.io/#/github/authsuccess/#{uuid}>> })
    fired {
      raise owner event "creation"
        attributes {
          "method": "did",
          "request_type": "github_signin",
          "name": newContent{"id"}.as("String"),
          "rids": "io.picolabs.manifold_owner;io.picolabs.profile"
        };
      ent:pollData{[uuid]} := {
        "owner_id": newContent{"id"}.as("String"),
        "new_content": newContent,
        "githubProfile": githubProfile
      };
      schedule github event "clear_uuid" at time:add(time:now(), {"minutes": 1})
        attributes { "uuid": uuid }
    }
  }
  
  rule clearUUID {
    select when github clear_uuid
    always {
      clear ent:pollData{[event:attr("uuid")]}
    }
  }

  rule respondToPoll {
    select when github owner_DID_requested
    pre {
      uuid = event:attrs{"uuid"}
      pollInfo = ent:pollData{[uuid]}
    }
    if uuid && pollInfo then
      noop()
    fired {
      raise owner event "eci_requested"
        attributes event:attrs.put({
          "owner_id": pollInfo{"owner_id"},
          "request_type": "github_signin",
          "new_content": pollInfo{"new_content"},
          "githubProfile": pollInfo{"githubProfile"}
        })
    } else {
      raise github event "invalid_DID_poll"
        attributes event:attrs
    }
  }

  rule generateOwnerDID {
    select when owner login_attempt where event:attr("request_type") == "github_signin"
    pre {
      pico_id = event:attr("eci") => engine:getPicoIDByECI(event:attr("eci").klog("eci"))
               | null;
    }
    if pico_id then every {
      engine:newChannel(pico_id, time:now(), "github_signin") setting(new_channel);
      event:send({"eci":new_channel{"id"}, "domain":"profile", "type":"github_profile_save", "attrs":{"profile":event:attr("githubProfile")}})
      send_directive("Returning github_signin DID", {"DID": new_channel{"id"}});
    }
    fired {
      // schedule owner event "authenticate_channel_expired" at time:add(time:now(), {"minutes": 120})
      //   attributes {"eci": new_channel{"id"}};
    }
  }

  rule ownerIsStillBeingCreated {
    select when owner no_such_owner_id where event:attr("request_type") == "github_signin"
    //do nothing. The owner pico should only be created in the validation_success rule
  }
}

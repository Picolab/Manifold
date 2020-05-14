ruleset io.picolabs.google_signin {
  meta {
    shares __testing
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      //, { "name": "entry", "args": [ "key" ] }
      ] , "events":
      [ //{ "domain": "d1", "type": "t1" }
      //, { "domain": "d2", "type": "t2", "attrs": [ "a1", "a2" ] }
      ]
    }

    DID_Policy = {
        "name": "only allow google owner_did_requested events",
        "event": {
            "allow": [
                { "domain": "google", "type": "owner_did_requested"}
            ]
        }
    }

    APPLICATION_ID = "548552688547-i40k0nigeafm0vjnqgmoj2oldddgbjqi.apps.googleusercontent.com"

  }

  rule createRootDID {
    select when wrangler ruleset_added where rids >< meta:rid
    every{
      engine:newPolicy(DID_Policy) setting(registered_policy)
      engine:newChannel(name="google", type="signin", policy_id = registered_policy{"id"})
    }
  }

  rule validateIDToken {
    select when google owner_did_requested
    pre {
      id_token = event:attr("id_token");
      profile = event:attr("profile").decode();
      resp = id_token => http:get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + id_token) | "";
      valid_code = resp{"status_code"} == 200;
      content = resp{"content"}.decode();
    }
    //still need to validate the "aud" attribute and make sure this validated token was meant for our application, and is not some token id for a different app...
    if id_token && valid_code && content{"aud"} == APPLICATION_ID then
       noop()
    fired {
      raise google event "validation_success"
        attributes event:attrs.put({ "resp_content": content }).put({"profile":profile})
    }else {
      raise google event "validation_failure"
        attributes event:attrs
    }
  }

  //we need to raise the owner eci_requested in the account_management ruleset
  rule signalForOwnerID {
    select when google validation_success
    pre {
      account_id = event:attr("resp_content"){"sub"}; //not really sure why google called it sub...
    }
    if account_id then
      noop()
    fired {
      raise owner event "eci_requested"
        attributes event:attrs.put({
          "owner_id": account_id,
          "request_type": "google_signin"
        })
    }
  }

  rule generateOwnerDID {
    select when owner login_attempt where event:attr("request_type") == "google_signin"
    pre {
      pico_id = event:attr("eci") => engine:getPicoIDByECI(event:attr("eci").klog("eci"))
               | null;
    }
    if pico_id then every {
      engine:newChannel(pico_id, time:now(), "google_signin") setting(new_channel);
      event:send({"eci":new_channel{"id"}, "domain":"profile", "type":"google_profile_save", "attrs":{"profile":event:attr("profile")}})
      send_directive("Returning google_signin DID", {"DID": new_channel{"id"}});
    }
    fired {
      // schedule owner event "authenticate_channel_expired" at time:add(time:now(), {"minutes": 1})
      //   attributes {"eci": new_channel{"id"}};
    }
  }

  rule manifoldPicoChannelExpiration {
    select when owner authenticate_channel_expired
    pre {
      channel = event:attr("eci")
    }
    if channel then noop()
    fired {
      engine:removeChannel(channel)
    }
  }

  rule requestNewOwnerPico {
    select when owner no_such_owner_id where event:attr("request_type") == "google_signin"
    pre {
      account_id = event:attr("resp_content"){"sub"}; //not really sure why google called it sub...
    }
    always {
      raise owner event "creation"
        attributes {
          "method": "did",
          "name": account_id,
          "rids": "io.picolabs.manifold_owner;io.picolabs.profile"
        }
    }
  }
}

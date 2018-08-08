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
      resp = id_token => http:get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + id_token) | "";
      valid_code = resp{"status_code"} == 200;
      content = resp{"content"}.decode();
    }
    if id_token && valid_code && content{"aud"} == APPLICATION_ID then
       noop()
    fired {
      raise google event "validation_success"
        attributes event:attrs.put({ "resp_content": content })
    }else {
      raise google event "validation_failure"
        attributes event:attrs
    }
  }
}

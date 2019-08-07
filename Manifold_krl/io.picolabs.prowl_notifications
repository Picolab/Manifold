ruleset io.picolabs.prowl_notifications {
  meta {
    shares __testing, getPriority, getAPIKey
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      //, { "name": "entry", "args": [ "key" ] }
      ] , "events":
      [ {"domain": "prowl", "type": "notify"}//{ "domain": "d1", "type": "t1" }
      //, { "domain": "d2", "type": "t2", "attrs": [ "a1", "a2" ] }
      ]
    }

    getAPIKey = function(id, rs) {
      ent:rs_toAPIKey{id}{rs}
    }

    getPriority = function(id, rs) {
      ent:rs_toPriority{id}{rs}
    }
  }

  rule setAPIKey {
    select when prowl set_APIKey
    pre {
      key = event:attr("key");
      rs = event:attr("ruleSet");
      id = event:attr("id");
    }
    always {
      ent:rs_toAPIKey := (ent:rs_toAPIKey == null) => {}.put(id, {}.put(rs, key)) |
                           (ent:rs_toAPIKey{id} == null) => ent:rs_toAPIKey.put(id, {}.put(rs, key)) |
                           (ent:rs_toAPIKey{id}{rs} == null) => ent:rs_toAPIKey.put([id, rs], key) |
                            ent:rs_toAPIKey.set([id,rs], key);
    }
  }

  rule setPriority {
    select when prowl set_priority
    pre {
      priority = event:attr("priority");
      rs = event:attr("ruleSet");
      id = event:attr("id");
    }
    always {
      ent:rs_toPriority := (ent:rs_toPriority == null) => {}.put(id, {}.put(rs, priority)) |
                           (ent:rs_toPriority{id} == null) => ent:rs_toPriority.put(id, {}.put(rs, priority)) |
                           (ent:rs_toPriority{id}{rs} == null) => ent:rs_toPriority.put([id, rs], priority) |
                            ent:rs_toPriority.set([id,rs], priority);
    }
  }

  rule prowl {
    select when prowl notify_through_prowl
    pre {
      rs = event:attr("rs");
      app = event:attr("application");
      description = event:attr("Body");
      id = event:attr("id");
    }
    http:post(<<https://api.prowlapp.com/publicapi/add>>, form = {
      "apikey": ent:rs_toAPIKey{id}{rs},
      "priority": ent:rs_toPriority{id}{rs}.defaultsTo(0),
      "application": app,
      "description": description
    })
  }
}

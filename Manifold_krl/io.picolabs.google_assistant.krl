ruleset alexa {
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
  }

  rule onInstallation {
      select when wrangler ruleset_added where rids >< meta:rid
      always {
          raise wrangler event "channel_creation_requested" attributes {
              "type":meta:rid,
              "name":"Google Assistant Entry Point"
          }
      }
  }
  
  rule event_received {
    select when user spoke
    pre {
      message = event:attr("message")
    }
    fired {
      ent:lastMessage := message
    }
  }
}

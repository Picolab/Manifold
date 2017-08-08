ruleset io.picolabs.child_login {
  meta {
    use module io.picolabs.wrangler alias wrangler
    shares __testing
  }
  global {
    __testing =
      { "queries": [ { "name": "__testing", "name":"getManifoldPico" } ],
        "events": [ { "domain": "manifold", "type": "channel_needed",
                      "attrs": [ "eci_to_manifold_child" ] } ,
                    { "domain": "wrangler", "type": "ruleset_added",
                      "attrs": [  ] }
                   ] }

  }

  rule channel_needed {
    select when wrangler ruleset_added where rids.klog("rids") >< meta:rid.klog("meta rid")
    pre { }
      every{
        engine:newChannel( meta:picoId ,"Login_"+time:now(),"login")
          setting(new_channel)
        event:send(
          { "eci": wrangler:parent_eci(){"parent"}.klog("parent eci"),
            "domain": "owner", "type": "token_created",
            "attrs": ({
              "eci":new_channel{"id"},
              "event_type":"account",
              "rs_attrs":event:attrs()
              })
          }
        );
      }
  }

}

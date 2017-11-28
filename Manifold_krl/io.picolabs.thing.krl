ruleset io.picolabs.thing {
  meta {
    use module io.picolabs.pico alias wrangler
    shares __testing, getManifoldInfo
    //provides 
  }
  global {
    __testing =
      { "queries": [ { "name": "__testing", "name":"getManifoldPico" },
                     { "name": "__testing", "name":"getManifoldInfo" }],
        "events": [ { "domain": "manifold", "type": "create_thing",
                      "attrs": [ "name" ] } ] }

  }


  rule initialization {
    select when wrangler ruleset_added where rids.klog("rids") >< meta:rid.klog("meta rid")
    pre{}
    noop()
    fired{
    }
  }

  rule installApp {
    select when manifold installapp
    pre {}
    noop()
    always{
      raise wrangler event "install_rulesets_requested"
        attributes event:attrs();
    }
  }


}//end ruleset

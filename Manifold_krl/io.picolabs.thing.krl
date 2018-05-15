ruleset io.picolabs.thing {
  meta {
    use module io.picolabs.wrangler alias wrangler
    shares __testing, getManifoldInfo
    //provides
  }
  global {
    __testing =
      { "queries": [ { "name": "__testing", "name":"getManifoldPico" },
                     { "name": "__testing", "name":"getManifoldInfo" }],
        "events": [ { "domain": "manifold", "type": "create_thing",
                      "attrs": [ "name" ] } ] }

    app = {"name":"thing","version":"0.0"/* img: , pre: , ..*/};
    bindings = function(){
      {
        //currently no bindings
      };
    }
  }

  rule discovery { select when manifold apps send_directive("app discovered...", {"app": app, "rid": meta:rid, "bindings": bindings()} ); }


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
    fired{
      raise wrangler event "install_rulesets_requested"
        attributes event:attrs;
    }
  }


}//end ruleset

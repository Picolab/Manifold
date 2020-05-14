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

  //rule discovery { select when manifold apps send_directive("app discovered...", {"app": app, "rid": meta:rid, "bindings": bindings(), "iconURL": "https://cdn0.iconfinder.com/data/icons/app-pack-1-musket-monoline/32/app-22-cog-512.png"} ); }


  rule initialization {
    select when wrangler ruleset_added where rids.klog("rids") >< meta:rid.klog("meta rid")
    pre{}
    noop()
    fired{
      raise wrangler event "install_rulesets_requested"
      attributes {
        "rid" : "io.picolabs.safeandmine"
      }
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
  
  rule uninstallApp {
    select when manifold uninstallapp
    pre {}
    noop();
    fired {
      raise wrangler event "uninstall_rulesets_requested"
        attributes event:attrs;
    }
  }


}//end ruleset

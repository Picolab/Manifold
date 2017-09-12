ruleset io.picolabs.manifold_pico {
  meta {
    use module io.picolabs.wrangler alias wrangler
    shares __testing, getManifoldInfo
    provides getManifoldInfo
  }
  global {
    __testing =
      { "queries": [ { "name": "__testing", "name":"getManifoldPico" },
                     { "name": "__testing", "name":"getManifoldInfo" }],
        "events": [ { "domain": "manifold", "type": "create_thing",
                      "attrs": [ "name" ] } ] }

    getManifoldInfo = function(){
      {
        "things": {
          "things": wrangler:children(),
          "lastUpdated": ent:thingsUpdate.defaultsTo("null")
        }
      }
    }
  }

  rule createThing {
    select when manifold create_thing
    pre {}
    if event:attr("name") then every {
      send_directive("Attempting to create new Thing")
    }
    fired{
      raise wrangler event "child_creation"
        attributes event:attrs().put({"event_type": "manifold_create_thing"})
    }else{
      send_directive("Missing a name for your Thing!")
    }
  }

  rule thingCompleted{
    select when wrangler child_initialized where rs_attrs{"event_type"} == "manifold_create_thing"
    pre{}
    noop()
    fired{
      ent:thingsUpdate := time:now();
    }
  }


}//end ruleset

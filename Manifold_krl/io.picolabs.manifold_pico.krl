ruleset io.picolabs.manifold_pico {
  meta {
    use module io.picolabs.pico alias wrangler
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
          "thingsPosition": ent:thingsPos.defaultsTo({}),
          "lastUpdated": ent:thingsUpdate.defaultsTo("null")
        }
      }
    }
  }

  rule createThing {
    select when manifold create_thing
    pre {}
    if event:attr("name") then every {
      send_directive("Attempting to create new Thing",{"thing":event:attr("name")})
    }
    fired{
      raise wrangler event "child_creation"
        attributes event:attrs().put({"event_type": "manifold_create_thing"/*,"rids":"io.manifold.thing;io.manifold.timeline;io.manifold.safeNmind;io.manifold.journal"*/})
    }else{
      //send_directive("Missing a name for your Thing!")
    }
  }

  rule removeThing {
    select when manifold remove_thing
    pre {}
    if event:attr("name") then every {
      send_directive("Attempting to remove Thing",{"thing":event:attr("name")})
    }
    fired{
      raise wrangler event "child_deletion"
        attributes event:attrs().put({"event_type": "manifold_remove_thing"})
    }else{
      //send_directive("Missing a name for your Thing!")
    }
  }

  rule thingCompleted{
    select when wrangler child_initialized where rs_attrs{"event_type"} == "manifold_create_thing"
    pre{}
    event:send(
        { "eci": event:attr("eci"),
          "domain": "wrangler", "type": "install_rulesets_requested",
          "attrs": {"rid":"io.picolabs.thing"} })
    fired{
      ent:thingsPos := ent:thingsPos.defaultsTo({});
      ent:thingsPos := ent:thingsPos.put([event:attr("name")], {
        "x": 0,
        "y": 0,
        "w": 3,
        "h": 2.25,
        "minw": 3,
        "minh": 2.25,
        "maxw": 8,
        "maxh": 5});
      ent:thingsUpdate := time:now();
    }
  }

  rule updateLocation {
    select when manifold move_thing
    pre {}
    noop()
    fired {
      ent:thingsPos := ent:thingsPos.defaultsTo({});
      ent:thingsPos := ent:thingsPos.put([event:attr("name")], {
        "x": event:attr("x").as("Number"),
        "y": event:attr("y").as("Number"),
        "w": event:attr("w").as("Number"),
        "h": event:attr("h").as("Number"),
        "minw": 3,
        "minh": 2.25,
        "maxw": 8,
        "maxh": 5});
    }
  }

}//end ruleset

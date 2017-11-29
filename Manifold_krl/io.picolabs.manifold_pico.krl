ruleset io.picolabs.manifold_pico {
  meta {
    use module io.picolabs.pico alias wrangler
    use module io.picolabs.Tx_Rx alias subscription
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
    subscriptionSpanningTree = function(){
      manifold_subs = subscription:buses(["Rx_role"],"manifold;master");
      span(manifold_subs);
    }

    span = function(bus){
      moreChildren = wrangler:skyQuery(bus{"Tx"}, "io.picolabs.Tx_Rx", "buses",{"collectBy" : ["Rx_role"],"filterValue":"manifold;master"}).klog("Sky query result: ");

      gatherbusessbuses = function(bus){
        arrayOfBusArrays = bus.map(function(sub){ span(sub.klog("bus child: ")) }).klog("More,bus child: ");
        arrayOfBusArrays.reduce(function(a,b){ a.append(b) });
      };

      result = (bus.length() == 0) => [] | bus.append(gatherbusessbuses(bus));
      result
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
        attributes event:attrs().put({"event_type": "manifold_create_thing"})
                                .put({"rids":"io.picolabs.thing;io.picolabs.Tx_Rx"})
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
      ent:thingsPos := ent:thingsPos.filter(function(v,k){k != event:attr("name")});
      raise wrangler event "child_deletion"
        attributes event:attrs().put({"event_type": "manifold_remove_thing"})
    }else{
      //send_directive("Missing a name for your Thing!")
    }
  }

  rule thingCompleted{
    select when wrangler child_initialized where rs_attrs{"event_type"} == "manifold_create_thing"
    pre{eci = event:attr("eci") }
      noop()
    always{
      raise wrangler event "subscription" 
        attributes {"rid"         : "io.picolabs.thing",
                    "name"        : "manifold"+";"+event:attr("name")+";"+time:now(),
                    "Rx_role"     : "manifold"+";"+"master",
                    "Tx_role"     : "manifold"+";"+"slave",
                    "common_Tx"   : wrangler:skyQuery( eci , "io.picolabs.pico", "channel",{"value" : "common_Rx"}){"channels"}{"id"}/*{["channels","id"]}*/,
                    "channel_type": "Manifold" };  
      ent:thingsPos := ent:thingsPos.defaultsTo({});
      ent:thingsPos := ent:thingsPos.put([event:attr("name")], {
        "x": 0,
        "y": 0,
        "w": 3,
        "h": 2.25,
        "minw": 3,
        "minh": 2.25,
        "maxw": 8,
        "maxh": 5,
        "color": "#cccccc"});
      ent:thingsUpdate := time:now();
    }
  }

  rule updateLocation {
    select when manifold move_thing
    pre {}
    noop()
    fired {
      ent:thingsPos := ent:thingsPos.defaultsTo({});
      ent:thingsPos := ent:thingsPos.put([event:attr("name"), "x"], event:attr("x").as("Number"));
      ent:thingsPos := ent:thingsPos.put([event:attr("name"), "y"], event:attr("y").as("Number"));
      ent:thingsPos := ent:thingsPos.put([event:attr("name"), "w"], event:attr("w").as("Number"));
      ent:thingsPos := ent:thingsPos.put([event:attr("name"), "h"], event:attr("h").as("Number"));
    }
  }

  rule colorThing {
    select when manifold color_thing
    pre {}
    if event:attr("dname") then every {
      send_directive("Attempting to color Thing",{"thing":event:attr("dname")})
    }
    fired{
      ent:thingsPos := ent:thingsPos.defaultsTo({});
      ent:thingsPos := ent:thingsPos.put([event:attr("dname"), "color"], event:attr("color"));
    }else{
      //send_directive("Missing a name for your Thing!")
    }
  }

}//end ruleset

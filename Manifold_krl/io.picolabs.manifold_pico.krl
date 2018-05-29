ruleset io.picolabs.manifold_pico {
  meta {
    use module io.picolabs.wrangler alias wrangler
    use module io.picolabs.subscription alias subscription
    shares __testing, getManifoldInfo, isAChild, getThings
    provides getManifoldInfo, __testing, getThings
  }
  global {
    __testing =
      { "queries": [ { "name":"getManifoldPico" },
                     { "name": "getManifoldInfo" },
                     { "name": "getThings" },
                     { "name": "isAChild", "args": ["name"] }],
        "events": [ { "domain": "manifold", "type": "create_thing",
                      "attrs": [ "name" ] },
                    { "domain": "manifold", "type": "devReset",
                      "attrs": [ ] }] }

    thingRids = "io.picolabs.thing;io.picolabs.subscription"
    communityRids = "io.picolabs.community;io.picolabs.subscription"
    thing_role = "manifold_thing"
    community_role = "manifold_community"

    getManifoldInfo = function(){
      {
        "things": {
          "things": getThings(),
          "thingsPosition": ent:thingsPos.defaultsTo({}),
          "lastUpdated": ent:thingsUpdate.defaultsTo("null")
        },
        "communities": {
          "communities": getCommunities(),
          "communitiesPosition": ent:communitiesPos.defaultsTo({}),
          "lastUpdated": ent:communitiesUpdate
        }
      }
    }

    initiate_subscription = defaction(eci, channel_name, wellKnown, role_type, optionalHost = meta:host){
      every{
        event:send({
          "eci": eci, "eid": "subscription",
          "domain": "wrangler", "type": "subscription",
          "attrs": {
                   "name"        : event:attr("name"),
                   "pico_id"     : event:attr("id"),
                   "Rx_role"     : role_type,
                   "Tx_role"     : "manifold_pico",
                   "Tx_Rx_Type"  : "Manifold" , // auto_accept
                   "channel_type": "Manifold",
                   "wellKnown_Tx": wellKnown, //this should by best practice be the parent's or the pico being requested's wellknown eci
                   "Tx_host"     : meta:host } //allow cross engine subscriptions
        }, host = optionalHost)
      }
    }

    getThings = function(){
      sub_info = subscription:established("Tx_role", thing_role);
      sub_info.map(function(sub) {
        things = ent:things.defaultsTo({});
        desired_info = {
          "name": things{[sub{"Id"}]}{"name"}.defaultsTo("ERROR: Missing name attribute in ent:things."),
          "pico_id": things{[sub{"Id"}]}{"pico_id"}.defaultsTo("ERROR: missing pico_id attribute in ent:things."),
          "color": things{[sub{"Id"}]}{"color"}.defaultsTo("ERROR: missing color attribute in ent:things.")
        };
        sub.put(desired_info)
      })
    }

    getCommunities = function(){
      sub_info = subscription:established("Tx_role", community_role);
      sub_info.map(function(sub) {
        communities = ent:communities.defaultsTo({});
        desired_info = {
          "name": communities{[sub{"Id"}]}{"name"}.defaultsTo("ERROR: Missing name attribute in ent:communities."),
          "pico_id": communities{[sub{"Id"}]}{"pico_id"}.defaultsTo("ERROR: missing pico_id attribute in ent:communities."),
          "color": communities{[sub{"Id"}]}{"color"}.defaultsTo("ERROR: missing color attribute in ent:communities.")
        };
        sub.put(desired_info)
      })
    }

    isAChild = function(name){
      children = wrangler:children();
      childNames = children.map(function(child) {
        child{"name"}
      });
      childNames >< name
    }

    picoIdFromSubId = function(sub_id){
      thing = ent:things.defaultsTo({}){[sub_id]};
      community = ent:communities.defaultsTo({}){[sub_id]};
      thing => thing{"pico_id"} | community{"pico_id"}//if undefined is returned, then: (ERROR: Could not find the picoID with the provided sub_id!)
    }
  }//end global

  rule createThing {
    select when manifold create_thing
    pre {}
    if event:attr("name") then every {
      send_directive("Attempting to create new Thing",{"thing":event:attr("name")})
    }
    fired{
      raise wrangler event "child_creation"
        attributes event:attrs.put({"event_type": "manifold_create_thing"})
                                .put({"rids": thingRids})
    }
  }

  rule thingCompleted {
    select when wrangler child_initialized where rs_attrs{"event_type"} == "manifold_create_thing"
    pre{eci = event:attr("eci") }
      initiate_subscription(event:attr("eci"), event:attr("rs_attrs"){"name"}, subscription:wellKnown_Rx(){"id"}, thing_role);
    always{
      raise manifold event "move_thing"
        attributes {"pico_id": event:attr("id"),
                    "x": 0, "y": 0, "w": 3, "h": 2.25};
    }
  }

  rule createCommunity {
    select when manifold create_community
    pre {}
    if event:attr("name") then every {
      send_directive("Attempting to create new Community",{"community":event:attr("name")})
    }
    fired{
      raise wrangler event "child_creation"
        attributes event:attrs.put({"event_type": "manifold_create_community"})
                                .put({"rids": communityRids})
    }
  }

  rule communityCompleted {
    select when wrangler child_initialized where rs_attrs{"event_type"} == "manifold_create_community"
      initiate_subscription(event:attr("eci"), event:attr("rs_attrs"){"name"}, subscription:wellKnown_Rx(){"id"}, community_role);
    always{
      raise manifold event "move_community"
        attributes {"pico_id": event:attr("id"),
                    "x": 0, "y": 0, "w": 3, "h": 2.25};
    }
  }

  rule trackThingSubscription {
    select when wrangler subscription_added where event:attr("Tx_role") == thing_role
    pre{
      sub_id = event:attr("Id");
      name = event:attr("name");
      pico_id = event:attr("pico_id");
      obj_structure = {
        "name": name,
        "sub_id": sub_id,
        "pico_id": pico_id,
        "color": "#eceff1"//default color
      }
    }
    if sub_id && name && pico_id then
      noop()
    fired{
      ent:things := ent:things.defaultsTo({}).put([sub_id], obj_structure);
      ent:thingsUpdate := time:now();
    }
  }

  rule trackCommSubscription {
    select when wrangler subscription_added where event:attr("Tx_role") == community_role
    pre{
      sub_id = event:attr("Id");
      name = event:attr("name");
      pico_id = event:attr("pico_id");
      obj_structure = {
        "name": name,
        "sub_id": sub_id,
        "pico_id": pico_id,
        "color": "#87cefa" //default community color
      }
    }
    if sub_id && name && pico_id then
      noop()
    fired{
      ent:communities := ent:communities.defaultsTo({}).put([sub_id], obj_structure);
      ent:communitiesUpdate := time:now();
    }
  }

  rule removeThingSubscription {
    select when manifold remove_thing
    pre {
      sub = subscription:established("Id", event:attr("sub_id"))[0].klog("found sub: ");
    }
    if event:attr("name") && event:attr("sub_id") then
      send_directive("Attempting to cancel subscription to Thing",{"thing":event:attr("name")})
    fired{
      raise wrangler event "subscription_cancellation"
        attributes event:attrs.put({"Id": sub{"Id"}, "event_type": "thing_deletion"})
    }else{
      raise manifold event "removeThingFailed"
        attributes event:attrs
    }
  }

  rule handleRemoveFail{
    select when manifold removeThingFailed
    send_directive("removeThingFailed", { "body": "Expected name attr, received " + event:attr("name") + ". Also expected sub_id attr, received " + event:attr("sub_id") + "."})
  }

  rule deleteThing {
    select when wrangler subscription_removed where event:attr("event_type") == "thing_deletion"
    pre{
      pico_id = picoIdFromSubId(event:attr("Id"));
    }
    if event:attr("name") && isAChild(event:attr("name")) && event:attr("Id") then
      send_directive("Attempting to remove Thing",{"thing":event:attr("name"), "sub_id": event:attr("Id")})
    fired{
      ent:thingsPos := ent:thingsPos.filter(function(v,k){k != pico_id});
      ent:things := ent:things.filter(function(thing){ thing{"sub_id"} != event:attr("Id")});
      raise wrangler event "child_deletion"
        attributes event:attrs.put({"event_type": "manifold_remove_thing"})
    }
  }

  rule removeCommunity {
    select when manifold remove_community
    pre {
      sub = subscription:established("Id", event:attr("sub_id"))[0].klog("found sub: ");
    }
    if event:attr("name") && event:attr("sub_id") then
      send_directive("Attempting to cancel subscription to Community",{"community":event:attr("name")})
    fired{
      raise wrangler event "subscription_cancellation"
        attributes event:attrs.put({"Id": sub{"Id"}, "event_type": "community_deletion"})
    }else{
      raise manifold event "removeCommFailed"
        attributes event:attrs
    }
  }

  rule handleRemoveCommFail{
    select when manifold removeCommFailed
    send_directive("removeThingFailed", { "body": "Expected name attr, received " + event:attr("name") + ". Also expected sub_id attr, received " + event:attr("sub_id") + "."})
  }

  rule deleteCommunity {
    select when wrangler subscription_removed where event:attr("event_type") == "community_deletion"
    pre{
      pico_id = picoIdFromSubId(event:attr("Id"));
    }
    if event:attr("name") && isAChild(event:attr("name")) && event:attr("Id") then
      send_directive("Attempting to remove Community",{"community":event:attr("name"), "sub_id": event:attr("Id")})
    fired{
      ent:communitiesPos := ent:communitiesPos.filter(function(v,k){k != pico_id});
      ent:communities := ent:communities.filter(function(thing){ thing{"sub_id"} != event:attr("Id")});
      raise wrangler event "child_deletion"
        attributes event:attrs.put({"event_type": "manifold_remove_thing"})
    }
  }

  rule createCollection {// doubles as a event router
    select when manifold create_collection
    pre {}
    if event:attr("name") then every {
      send_directive("Attempting to create new collection",{"collection":event:attr("name")})
    }
    fired{
      raise wrangler event "child_creation"
        attributes event:attrs.put({"event_type": "manifold_create_collection"})
                                .put({"rids":"io.picolabs.collection;io.picolabs.subscription"})
    }
  }

  rule collectionCompleted{
    select when wrangler child_initialized where rs_attrs{"event_type"} == "manifold_create_collection"
    pre{eci = event:attr("eci") }
      event:send(
        { "eci": eci,
          "domain": "wrangler", "type": "autoAcceptConfigUpdate",
          "attrs": {"variable"    : "Tx_Rx_Type",
                    "regex_str"   : "Manifold" }})
    always{
      raise wrangler event "subscription"
        attributes {"name"        : event:attr("name"),
                    "Rx_role"     : "manifold_master",
                    "Tx_role"     : "manifold_slave",
                    "wellKnown_Tx"   : wrangler:skyQuery( eci , "io.picolabs.subscription", "wellKnown_Rx"){"id"},
                    "channel_type": "Manifold",
                    "Tx_Rx_Type"  : "Manifold" };
      raise manifold event "move_thing"
        attributes {"name":event:attr("name"),
                    "x": 0, "y": 0, "w": 3, "h": 2.25};
      ent:thingsUpdate := time:now();
      // ent:thingsColor := ent:thingsColor.defaultsTo({}).put([event:attr("name")], {
      //   "color": "#eceff1"
      // }); STORE THE COLOR DIRECTLY IN THE OBJECT
    }
  }

  rule updateThingLocation {
    select when manifold move_thing
    pre {}
    noop()
    fired {
      ent:thingsPos := ent:thingsPos.defaultsTo({}).put([event:attr("pico_id")], {
        "x": event:attr("x").as("Number"),
        "y": event:attr("y").as("Number"),
        "w": event:attr("w").as("Number"),
        "h": event:attr("h").as("Number"),
        "minw": 3,
        "minh": 2.25,
        "maxw": 8,
        "maxh": 5
      });
    }
  }

  rule updateCommunityLocation {
    select when manifold move_community
    pre {}
    noop()
    fired {
      ent:communitiesPos := ent:communitiesPos.defaultsTo({}).put([event:attr("pico_id")], {
        "x": event:attr("x").as("Number"),
        "y": event:attr("y").as("Number"),
        "w": event:attr("w").as("Number"),
        "h": event:attr("h").as("Number"),
        "minw": 3,
        "minh": 2.25,
        "maxw": 8,
        "maxh": 5
      });
    }
  }

  rule colorThing {
    select when manifold color_thing
    pre {}
    noop()
    fired {
      // ent:thingsColor := ent:thingsColor.defaultsTo({}).put([event:attr("dname")], {
      //   "color": event:attr("color")
      // }); STORE THE COLOR DIRECTLY IN THE OBJECT
    }
  }

  rule devReset {
    select when manifold devReset
    always{
      clear ent:things;
      clear ent:thingsColor;
      clear ent:thingsUpdate;
      clear ent:thingsPos;

      clear ent:communities;
      clear ent:communitiesPos;
      clear ent:communitiesUpdate;
      clear ent:communitiesColor
    }
  }

}//end ruleset

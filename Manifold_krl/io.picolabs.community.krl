ruleset io.picolabs.community {
  meta {
    use module io.picolabs.wrangler alias wrangler
    use module io.picolabs.subscription alias subscription
    shares __testing, things, thingsWithRID, queryThing, 
          getActions, getListeners, sequences, findDispatchActions
  }
  global {
    __testing = { "queries":
      [ { "name": "things" }
      , { "name": "thingsWithRID", "args": [ "rid" ] }
      , { "name": "queryThing", "args": [ "id", "rid", "func", "params" ] }
      , { "name": "getActions" }
      , { "name": "getListeners" }
      , { "name": "sequences" }
      , { "name": "findDispatchActions", "args": [ "domain", "type" ] }
      ] , "events":
      [ { "domain": "community", "type": "add_thing", "attrs": [ "host", "eci" ] }
      , { "domain": "community", "type": "add_thing", "attrs": [ "eci" ] }
      , { "domain": "community", "type": "remove_thing", "attrs": [ "picoId" ] }
      , { "domain": "community", "type": "raise_thing_event", "attrs": [ "id", "domain", "type", "attrs" ] }
      , { "domain": "community", "type": "raise_all_things_event", "attrs": [ "domain", "type", "attrs" ] }
      , { "domain": "community", "type": "add_sequence", "attrs": [ "trigger_event", "dispatch_events"] }
      , { "domain": "community", "type": "remove_sequence", "attrs": [ "trigger_event", "dispatch_events"] }
      ]
    }
    
    things = function() {
      ent:things.filter(function(x) {
        x{"subscription"} != "pending" &&
        x{["subscription", "Tx_role"]} == "thing"
      })
    }
    thingsWithRID = function(rid) {
      ent:things.filter(function(v,k) {
        v{"rids"} >< rid
      })
    }
    
    initiate_subscription = defaction(eci, channel_name, wellKnown, role_type, optionalHost = meta:host) {
      every{
        event:send({
          "eci": eci, "eid": "subscription",
          "domain": "wrangler", "type": "subscription",
          "attrs": {
                   "name"        : event:attr("name"),
                   "picoID"      : event:attr("id"),
                   "Rx_role"     : role_type,
                   "Tx_role"     : "community",
                   "Tx_Rx_Type"  : "Community" , // auto_accept
                   "channel_type": "Community",
                   "wellKnown_Tx": wellKnown, //this should by best practice be the parent's or the pico being requested's wellknown eci
                   "Tx_host"     : meta:host } //allow cross engine subscriptions
        }, host = optionalHost)
      }
    }
    
    queryThing = function(id, rid, func, params) {
      eci = ent:things{[id,"subscription"]}{"Tx"};
      (eci) => wrangler:skyQuery(eci, rid, func, params.decode()) | null
    }
    
    getActions = function() {
      things().map(function(v,k) {
        actions = queryThing(k, "io.picolabs.community_thing", "actions");
        {}.put(actions)
      }).values().reduce(function(a,b) {
        a.put(b)
      })
    }
    
    getListeners = function() {
      things().map(function(v,k) {
        actions = queryThing(k, "io.picolabs.community_thing", "listeners");
        {}.put(actions)
      }).values().reduce(function(a,b) {
        a.put(b)
      })
    }
    
    sequences = function() {
      ent:sequences
    }
    
    findDispatchActions = function(domain, type) {
      listeners = getListeners();
      triggers = listeners.filter(function(v,k) {
        v{"domain"} == domain && 
        v{"type"} == type && 
        ent:sequences >< k
      }).keys();
      dispatch = ent:sequences.filter(function(v,k) {
        triggers >< k
      });
      
      dispatch.values().reduce(function(a,b) {
        a.put(b)
      },[])
    }
    
    findDispatchEvents = function(dispatchActions) {
      getActions().filter(function(v,k) {
        dispatchActions >< k
      }).values()
    }
  } // end global
  
  rule initialized {
    select when wrangler ruleset_installed
    fired {
      ent:things := ent:things.defaultsTo({});
      ent:sequences := ent:sequences.defaultsTo({})
    }
  }
  
  rule on_startup {
    select when system online
    fired {
      ent:things := ent:things.defaultsTo({});
      ent:sequences := ent:sequences.defaultsTo({})
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
  
  rule add_thing {
    select when community add_thing
    pre {
      thing_host = event:attr("host") || null
      thing_eci = event:attr("eci")
      dname = wrangler:skyQuery(thing_eci, "io.picolabs.visual_params", "dname")
      thing = wrangler:skyQuery(thing_eci, "io.picolabs.wrangler", "myself")
      rids = wrangler:skyQuery(thing_eci, "io.picolabs.wrangler", "installedRulesets")
    }
    if thing then 
    initiate_subscription(
      thing_eci,
      wrangler:myself(){"name"} + ":" + thing{"name"}, 
      subscription:wellKnown_Rx(){"id"}, // community wellknown Rx
      "thing", // thing role
      thing_host
    );
    fired {
      ent:things{thing{"id"}} := { 
        "id": thing{"id"}, "dname": dname, "rids": rids, "subscription": "pending" 
      }
    }
  }
  
  rule thing_added {
    select when wrangler subscription_added
    pre {
      subscription = event:attr("bus")
      id = wrangler:skyQuery(subscription{"Tx"}, "io.picolabs.wrangler", "myself"){"id"}
      rids = wrangler:skyQuery(subscription{"Tx"}, "io.picolabs.wrangler", "installedRulesets")
    }
    if (not (rids >< "io.picolabs.community_thing")) then
    event:send(
      {
        "eci": subscription{"Tx"}, "eid": "install_community_thing",
        "domain": "wrangler", "type": "install_rulesets_requested",
        "attrs": {"rid": "io.picolabs.community_thing"}
      })
    always {
      ent:things{[id, "subscription"]} := subscription
    }
  }
  
  rule remove_thing {
    select when community remove_thing or wrangler subscription_removed
    pre {
      picoId = event:attr("picoId")
      Id = (picoId) => ent:things{[picoId, "subscription", "Id"]} | event:attr("Id")
      things = ent:things.filter(function(v,k) {
        v{["subscription", "Id"]} != Id
      })
      err = (not Id) => "missing subscription Id" | 
            (not ent:things{picoId}) => "community does not have thing of picoId " + id |
            false
    }
    if not err then noop()
    fired {
      raise wrangler event "subscription_cancellation"
        attributes { "Id": ent:things{[picoId, "subscription", "Id"]} };
      ent:things := things
    }
    else {
      error info err
    }
  }
  
  rule raise_thing_event {
    select when community raise_thing_event
    pre {
      id = event:attr("id")
      domain = event:attr("domain")
      type = event:attr("type")
      attrs = event:attr("attrs").decode().klog("attrs")
    }
    event:send(
      {
        "eci": ent:things{[id, "subscription", "Tx"]}, "eid": "community_to_thing",
        "domain": domain, "type": type, "attrs": attrs
      })
  }
  
  rule raise_all_things_event {
    select when community raise_all_things_event
    foreach things() setting(thing)
    pre {
      domain = event:attr("domain")
      type = event:attr("type")
      attrs = event:attr("attrs").decode().klog("attrs")
    }
    event:send(
      {
        "eci": thing{["subscription", "Tx"]}, "eid": "community_to_thing",
        "domain": domain, "type": type, "attrs": attrs
      })
  }
  
  rule thing_event_occurred {
    select when community thing_event_occurred
    pre {
      domain = event:attr("domain")
      type = event:attr("type")
      attrs = event:attr("attrs")
      // find dispatch events to raise
      dispatchActions = findDispatchActions(domain, type).klog("actions to raise")
      shouldDispatch = dispatchActions.length() == 0 => false | true
      dispatchEvents = findDispatchEvents(dispatchActions).klog("events to raise")
    }
    send_directive("thing_event_received", { "domain": domain, "type": type, "attrs": attrs})
    fired {
      raise community event "dispatch_actions"
        attributes { "dispatch_events": dispatchEvents, "trigger_attrs": attrs }
        if dispatchEvents.length() > 0
    }
  }
  
  rule prepare_dispatch_actions {
    select when community prepare_dispatch
    
  }
  
  rule dispatch_actions {
    select when community dispatch_actions
    foreach(event:attr("dispatch_events")) setting(dispatch_event)
    pre {
      domain = dispatch_event{"domain"}
      type = dispatch_event{"type"}
      trigger_attrs = event:attr("trigger_attrs")
    }
    fired {
      raise community event "raise_all_things_event"
        attributes { "domain": domain, "type": type, "attrs": trigger_attrs }
    }
  }
  
  rule add_event_sequence {
    select when community add_sequence
    pre {
      trigger = event:attr("trigger_event")
      de = (event:attr("dispatch_events") == "") => null | event:attr("dispatch_events")
      dispatch = (de.typeof() == "Array") => de |
                (de.typeof() == "String") => de.split(re#,#) | null
      isNew = ent:sequences{trigger} == null
      sequence = (isNew) => dispatch
              | dispatch.filter(function(x) {
                  not (ent:sequences{trigger} >< x)
                })
    }
    if (dispatch.klog("dispatch")) then noop()
    fired {
      ent:sequences{trigger} := sequence if isNew;
      ent:sequences{trigger} := ent:sequences{trigger}.append(sequence) if not isNew
    }
  }
  
  rule remove_event_sequence {
    select when community remove_sequence
    pre {
      trigger = event:attr("trigger_event")
      de = (event:attr("dispatch_events") == "") => null | event:attr("dispatch_events")
      dispatch = (de.typeof() == "Array") => de |
                (de.typeof() == "String") => de.split(re#,#) | null
    }
    if (dispatch) then noop()
    fired {
      ent:sequences{trigger} := ent:sequences{trigger}.filter(function(x) {
        not (dispatch >< x)
      })
    }
    else {
      ent:sequences := ent:sequences.filter(function(v,k) { k != trigger })
    }
  }
  
  rule handle_error {
    select when system error
    pre {
      level = event:attr("level")
      data = event:attr("data")
      rid = event:attr("rid")
      rule_name = event:attr("rule_name")
      genus = event:attr("genus")
      info = {
        "level": level,
        "data": data,
        "source": rid+":"+rule_name,
        "genus": genus,
        "time": time:now()
      }
    }
    always {
      log error info.encode()
    }
  }
}

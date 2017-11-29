ruleset io.picolabs.Tx_Rx {
  meta {
    name "Tx/Rx "
    description <<
      Tx/Rx ruleset for Manifold.
    >>
    author "Tedrub Modulas"
    use module io.picolabs.pico alias wrangler
    provides buses, autoAcceptConfig, __testing
    shares buses, autoAcceptConfig, __testing
    logging on
  }

 global{
    __testing = { "queries": [  { "name": "buses", "args":["collectBy","filterValue"] },
                                { "name": "autoAcceptConfig"} ],
                  "events": [ { "domain": "wrangler", "type": "subscription",
                                "attrs": [ "name","Rx_role","Tx_role","common_Tx","channel_type","wild"] },
                              { "domain": "wrangler", "type": "pending_subscription_approval",
                                "attrs": [ "name" ] },
                              { "domain": "wrangler", "type": "autoAcceptConfigUpdate",
                                "attrs": [ "variable", "regex_str" ] },
                              { "domain": "wrangler", "type": "subscription_cancellation",
                                "attrs": [ "name" ] } ]}
/*
comunication bus structure.
{
  <name>: {
          "name":"Test",
          "common_Tx":""}} //only in originating bus
          "Tx":"",
          "Rx":"",
          "Tx_role":"",
          "Rx_role":"",
          "status":"",
          "Tx_host": ""
} 

      buses([collectBy[, filterValue]]) with no arguments returns the value of ent:Tx_Rx (the subscriptions map)
      parameters:
        collectBy - if filterValue is omitted, the string or hashpath,
          that indexes the subscriptions map values used to collect()
          each subscription map by. 
          For example if the subscriptions map is
          {
            "ns:n1": {
              "name": "ns:n1",
              "attributes": {
                "my_role": "peer",
                ...
              },
              ...
            },
            ...
          }
          buses(["attributes", "my_role"]) returns
          {
            "peer": [
              {
                "ns:n1": {
                  "name": "ns:n1",
                  "attributes": {
                    "my_role": "peer",
                    ...
                  },
                  ...
                }
              },
              ...
            ],
            ...
          }
        filterValue - buses(["attributes", "my_role"], "peer")
          returns the array indexed by "peer" above
    */
    buses = function(collectBy, filterValue){
      subs = ent:Tx_Rx.defaultsTo({});
      collectBy.isnull() => subs | function(){
        subArray = subs.keys().map(function(name){{}.put(name, subs{name})});
        filterValue.isnull() => subArray.collect(function(sub){
          sub.values()[0]{collectBy}
        }) | subArray.filter(function(sub){
          sub.values()[0]{collectBy} == filterValue
        })
      }()
    }
    // this only creates 5 random names; if none are unique keep prepending '_' and trying again
    randomName = function(name_base){
        base = name_base.defaultsTo("");
        buses = buses();
        array = 1.range(5).map(function(n){ random:word() });
        names = array.filter(function(name){ buses{"" + base + name}.isnull() }); // do we need to add a empty string??????
        names.length() > 0 => names[0] | randomName( base + "_")
    }
    checkName = function(name){
      buses = buses();
      (buses{name}.isnull() && wrangler:channel(name){"channels"}.isnull() )
    }
    pending_entry = function(status){
      {
        "name"         : event:attr("name"),
        "Rx_role"      : event:attr("Rx_role").defaultsTo("peer", "peer used as Rx_role"),
        "Tx_role"      : event:attr("Tx_role").defaultsTo("peer", "peer used as Tx_role"),
        "Tx_host"      : event:attr("Tx_host"),
        "status"       : status
      }
    }
    autoAcceptConfig = function(){ 
      ent:autoAcceptConfig.defaultsTo({})
    }
  }

  rule create_common_Rx{
    select when wrangler ruleset_added where rids >< meta:rid
    pre{
      channel = wrangler:channel("common_Rx"){"channels"}
    }
    if(channel.isnull() || channel{"type"} != "Tx_Rx") then
      engine:newChannel(meta:picoId, "common_Rx", "Tx_Rx")//wrangler:createChannel(...)
    fired{
      raise Tx_Rx event "common_Rx_created" attributes event:attrs();
    }
    else{
      raise Tx_Rx event "common_Rx_not_created" attributes event:attrs(); //exists 
    }
  }

  rule NameCheck {
    select when wrangler subscription
    if(checkName(event:attr("name") || randomName().klog("random name") )) then noop()
    fired{
      raise wrangler event "checked_name_Tx_Rx" attributes  event:attrs()
    }
    else{
      raise wrangler event "duplicate_name_Tx_Rx_failure" attributes  event:attrs() // API event
    }
  }

  rule createMySubscription {
    select when wrangler checked_name_Tx_Rx
    pre {
      channel_type  = event:attr("channel_type").defaultsTo("Tx_Rx","Tx_Rx channel_type used.")
      pending_entry = pending_entry("outbound")
                        .put(["common_Tx"],event:attr("common_Tx")) //.klog("pending entry")
    }
    if( not pending_entry{"common_Tx"}.isnull()) // check if we have someone to send a request too
    then every {
      engine:newChannel(wrangler:myself(){"id"}, event:attr("name") , channel_type) setting(channel); // create Rx
      //wrangler:createChannel(wrangler:myself(){"id"}, name ,channel_type) setting(channel); // create Rx
    }
    fired {
      newBus = pending_entry.put(["Rx"],channel{"id"});
      ent:Tx_Rx := buses().put([newBus{"name"}] , newBus );
      raise wrangler event "pending_subscription" attributes event:attrs().put(newBus.put(["channel_type"], channel_type)) // send channel type but dont store in ent:
    } 
    else {
      raise wrangler event "no_common_Tx_failure" attributes  event:attrs() // API event
    }
  }
  
  rule sendSubscribersSubscribe {
    select when wrangler pending_subscription status re#outbound#
      event:send({
          "eci"   : event:attr("common_Tx").klog(">> sent Tx_Rx request to >>"), 
          "domain": "wrangler", "type": "pending_subscription",
          "attrs" : event:attrs().put(["status"],"inbound")
                                 .put(["Rx_role"], event:attr("Tx_role"))
                                 .put(["Tx_role"], event:attr("Rx_role"))
                                 .put(["Tx"]     , event:attr("Rx"))
                                 .put(["Tx_host"], event:attr("Tx_host").isnull() => null | meta:host)
          }, event:attr("Tx_host"));
  }

 rule addOutboundPendingSubscription {
    select when wrangler pending_subscription status re#outbound#
    always { 
      raise wrangler event "outbound_pending_subscription_added" attributes event:attrs()// API event
    } 
  }

  rule InboundNameCheck {
    select when wrangler pending_subscription status re#inbound#
    if( not checkName(event:attr("name"))) then
        event:send({  "eci"    : event:attr("Tx"),
                      "domain" : "wrangler", "type": "outbound_subscription_cancellation",
                      "attrs"  : event:attrs().put({"failed_request":"not a unique comunication bus"})}, event:attr("subscriber_host"))
    fired{
      raise wrangler event "duplicate_name_Tx_Rx_failure" attributes  event:attrs() // API event
    }
    else{
      raise wrangler event "checked_name_inbound" attributes event:attrs()
    }
  }

  rule addInboundPendingSubscription { 
    select when wrangler checked_name_inbound
   pre {
      pending_entry = pending_entry(event:attr("status"))
                        .put(["Tx"],event:attr("Tx"))
                        //.klog("pending entry")
    }
    if( not pending_entry{"Tx"}.isnull()) then
      engine:newChannel(wrangler:myself(){"id"}, pending_entry{"name"} ,event:attr("channel_type").defaultsTo("Tx_Rx","Tx_Rx channel_type used.")) setting(channel) // create Rx
      //wrangler:createChannel(wrangler:myself(){"id"}, name ,channel_type) setting(channel); // create Rx
    fired { 
      newBus = pending_entry.put(["Rx"],channel{"id"});
      ent:Tx_Rx := buses().put( [newBus{"name"}] , newBus );
      raise wrangler event "inbound_pending_subscription_added" attributes event:attrs(); // API event
    } 
    else {
      raise wrangler event "no_Tx_failure" attributes  event:attrs() // API event
    }
  }

  rule approveInboundPendingSubscription { 
    select when wrangler pending_subscription_approval
    pre{ bus = buses(){event:attr("name")} }
      event:send({
          "eci": bus{"Tx"},
          "domain": "wrangler", "type": "pending_subscription_approved",
          "attrs": {"Tx"     : bus{"Rx"} , 
                    "status" : "outbound",
                    "name"   : bus{"name"} }
          }, bus{"Tx_host"})
    always {
      raise wrangler event "pending_subscription_approved" attributes {
        "name" : bus{"name"},
        "status" : "inbound"
      }
    } 
  }

  rule addOutboundSubscription { 
    select when wrangler pending_subscription_approved status re#outbound#
    pre{
      buses      = buses()
      bus        = buses{event:attr("name")}
      updatedBus = bus.put({"status" : "established"})
                      .put({"Tx"     : event:attr("Tx")})
    }
    always{
      ent:Tx_Rx := buses.put([updatedBus{"name"}],updatedBus);
      raise wrangler event "subscription_added" attributes { "bus" : bus }// API event
    } 
  }

  rule addInboundSubscription { 
    select when wrangler pending_subscription_approved status re#inbound#
    pre{
      buses      = buses()
      bus        = buses{event:attr("name")}
      updatedBus = bus.put({"status" : "established"})
    }
    always {
      ent:Tx_Rx := buses.put([updatedBus{"name"}],updatedBus);
      raise wrangler event "subscription_added" attributes { "bus" : bus }// API event
    }
  }

  rule cancelSubscription {
    select when wrangler subscription_cancellation
            or  wrangler inbound_subscription_rejection
            or  wrangler outbound_subscription_cancellation
    pre{
      bus     = buses(){event:attr("name")}
      Tx_host = bus{"Tx_host"}
      Tx      = bus{"Tx"}.defaultsTo(bus{"common_Tx"})
    }
    event:send({
          "eci"   : Tx,
          "domain": "wrangler", "type": "subscription_removal",
          "attrs" : { "name": event:attr("name") }
          }, Tx_host)
    always {
      raise wrangler event "subscription_removal" attributes { "name" : event:attr("name") }
    }
  } 

  rule removeSubscription {
    select when wrangler subscription_removal
    pre{
      buses      = buses()
      bus        = buses{event:attr("name")}
      updatedBus = buses.delete(bus{"name"})
    }
    engine:removeChannel(bus{"Rx"}) //wrangler:removeChannel ... 
    always {
      ent:Tx_Rx := updatedBus;
      raise wrangler event "subscription_removed" attributes { "bus" : bus } // API event
    } 
  }

  rule autoAccept {
    select when wrangler inbound_pending_subscription_added
    pre{
      /*autoAcceptConfig{
        var : [regex_str,..,..]
      }*/
      matches = ent:autoAcceptConfig.map(function(regs,k) { 
                              var = event:attr(k);
                              matches = not var.isnull() => regs.map(function(regex_str){ var.match(regex_str)}).any( function(bool){ bool == true }) | false;
                              matches }).values().any( function(bool){ bool == true })
    }
    if matches.klog("matches") then noop()
    fired {
      raise wrangler event "pending_subscription_approval" attributes event:attrs(); //{"name":event:attr("name")}; // only raise event with name ?      
      raise wrangler event "auto_accepted_Tx_Rx_request" attributes event:attrs(); // API event  
    }// else ...
  }

  rule autoAcceptConfigUpdate {
    select when wrangler autoAcceptConfigUpdate
    pre{ config = autoAcceptConfig() }
    if (event:attr("variable") && event:attr("regex_str") ) then noop()
    fired {
      ent:autoAcceptConfig := config.put([event:attr("variable")],config{event:attr("variable")}.defaultsTo([]).append([event:attr("regex_str")])); // possible to add the same regex_str multiple times.
    }
    else {
      raise wrangler event "autoAcceptConfigUpdate_failure" attributes event:attrs() // API event
    }
  }
}

ruleset io.picolabs.Tx_Rx {
  meta {
    name "Tx/Rx "
    description <<
      Tx/Rx ruleset for Manifold.
    >>
    author "Tedrub Modulas"
    use module io.picolabs.pico alias wrangler
    provides buses, klogtesting, __testing
    shares buses, klogtesting, __testing
    logging on
  }

 global{
    __testing = { "queries": [  { "name": "buses", "args":["collectBy","filterValue"] } ],
                  "events": [ { "domain": "wrangler", "type": "subscription",
                                "attrs": [ "name","Rx_role","Tx_role","common_Tx","channel_type"] },
                              { "domain": "wrangler", "type": "pending_subscription_approval",
                                "attrs": [ "name" ] },
                              { "domain": "wrangler", "type": "subscription_cancellation",
                                "attrs": [ "name" ] } ]}
/*
comunication bus structure.
{
  <name>: {
          "name":"Test",
          "common_Tx":"KwVBFpADrTCmDxoGVuU8Gn"}} //only in originating bus
          "Tx":"Wut7JLhAQmm3fwBB9JhaDF",
          "Rx":"PjE4Jy6b9B5CEqjyehJE3h",
          "Tx_role":"",
          "Rx_role":"",
          "status":"valid",
          "Tx_host": ""
} 
 */
// ********************************************************************************************
// ***                                                                                      ***
// ***                                      FUNCTIONS                                       ***
// ***                                                                                      ***
// ********************************************************************************************
    /*
      buses([collectBy[, filterValue]]) with no arguments returns the value of ent:subscriptions (the subscriptions map)
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
      subs = ent:subscriptions.defaultsTo({}, "no subscriptions");
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
        array = 1.range(5).map(function(n){
          random:word()
          }).klog("randomWords");
        names = array.filter(function(name){
          buses{"" + base + name}.isnull()
        });
        names.length() > 0 => names[0].klog("uniqueName") | randomName( base + "_")
    }
    checkName = function(name){
      buses = buses().klog("all of the buses in name check");
      (buses{name}.isnull().klog("name in buses?") && wrangler:channel(name).klog("channels for name check"){"channels"}.isnull().klog("name in channels?") )
    }
    standardOut = function(message) {
      msg = ">> " + message + " results: >>";
      msg
    }
    standardError = function(message) {
      error = ">> error: " + message + " >>";
      error
    } 
  }

  rule create_common_Rx{
    select when wrangler ruleset_added where rids >< meta:rid
    pre{}
    every {
      engine:newChannel(meta:picoId, "common_Rx", "Tx_Rx")
      //wrangler:createChannel(...)
    }
    fired{
      raise Tx_Rx event "common_Rx_created"
        attributes event:attrs();
    }
  }

  rule NameCheck {
    select when wrangler subscription
    pre {
      name   = event:attr("name") || randomName().klog("random name") 
    }
    if(checkName(name)) then noop()
    fired{
      raise wrangler event "checked_name_Tx_Rx"
       attributes  event:attrs()
    }
    else{
      raise wrangler event "duplicate_name_Tx_Rx_failure"
       attributes  event:attrs() // API event
    }
  }
  /*
comunication bus structure.
{
  <name>: {
          "name":"Test",
          "common_Tx":"KwVBFpADrTCmDxoGVuU8Gn"}} //only in originating bus
          "Tx":"Wut7JLhAQmm3fwBB9JhaDF",
          "Rx":"PjE4Jy6b9B5CEqjyehJE3h",
          "Tx_role":"master",
          "Rx_role":"slave",
          "status":"valid",
          "Tx_host": ""
} 
 */
  rule createMySubscription {
    select when wrangler checked_name_Tx_Rx
   pre {
      name          = event:attr("name")
      Rx_role       = event:attr("Rx_role").defaultsTo("peer", standardError("Rx_role"))
      Tx_host       = event:attr("Tx_host")
      Tx_role       = event:attr("Tx_role").defaultsTo("peer", standardError("Tx_role"))
      common_Tx     = event:attr("common_Tx").defaultsTo("no_Tx", standardError("common_Tx"))
      channel_type  = event:attr("channel_type").defaultsTo("subs", standardError("channel_type"))

      pending_entry = {
        "name"      : name,
        "Rx_role"   : Rx_role,
        "Tx_role"   : Tx_role,
        "common_Tx" : common_Tx, // this will remain after accepted
        "status"    : "outbound", 
        "Tx_host"   : Tx_host
      }.klog("pending entry")

    }
    if(common_Tx != "no_Tx") // check if we have someone to send a request too
    then every {
      engine:newChannel(wrangler:myself(){"id"}, name ,channel_type) setting(channel); // create Rx
      //wrangler:createChannel(wrangler:myself(){"id"}, name ,channel_type) setting(channel); // create Rx
    }
    fired {
      newBus = pending_entry.put(["Rx"],channel.id);
      ent:subscriptions := buses().put([newBus.name] , newBus);
      raise wrangler event "pending_subscription" attributes {
        "status" : pending_entry{"status"},
        "channel_type" : channel_type,
        "name" : pending_entry{"name"},
        "Rx_role" : pending_entry{"Rx_role"},
        "Tx_role" : pending_entry{"Tx_role"},
        "common_Tx"  : pending_entry{"common_Tx"},
        "Rx" : channel.id,
        "Tx_host"   : Tx_host
      }
    } 
    else {
      logs.klog(">> failed to create Rx request, no common_Tx provieded >>")
    }
  }
  
  rule sendSubscribersSubscribe {
    select when wrangler pending_subscription status re#outbound#
     pre {
        name         = event:attr("name")
        Tx_host      = event:attr("Tx_host")
        Rx_role      = event:attr("Rx_role")
        Tx_role      = event:attr("Tx_role")
        common_Tx    = event:attr("common_Tx").defaultsTo("no_Tx", standardError("common_Tx"))
        channel_type = event:attr("channel_type")
        Rx           = event:attr("Rx")
      }
      event:send({
          "eci"   : common_Tx, 
          "domain": "wrangler", "type": "pending_subscription",
          "attrs" : {
             "name"         : name,
             "Rx_role"      : Tx_role,
             "Tx_role"      : Rx_role,
             "Tx"           : Rx, 
             "status"       : "inbound",
             "channel_type" : channel_type,
             "Tx_host"      : subscriber_host.isnull() => null | meta:host
          }}, Tx_host);
    always {
      common_Tx.klog(">> sent subscription request to >>")
    } 
  }

 rule addOutboundPendingSubscription {
    select when wrangler pending_subscription status re#outbound#
    always { 
      raise wrangler event "outbound_pending_subscription_added" // API event
        attributes event:attrs().klog(standardOut("successful outgoing pending subscription >>"))
    } 
  }

  rule InboundNameCheck {
    select when wrangler pending_subscription status re#inbound#
    pre {
      name   = event:attr("name").klog("InboundNameCheck name")
      attrs = event:attrs()
    }
    if(checkName(name).klog("checkName results") == false ) then
        event:send({  "eci"    : event:attr("Tx"),
                      "domain" : "wrangler", "type": "outbound_subscription_cancellation",
                      "attrs"  : attrs.put({"failed_request":"not a unique comunication bus"})}, event:attr("subscriber_host"))
    fired{
        name.klog(">> could not accept request >>");
    }
    else{
      attrs.klog("InboundNameCheck attrs");
      raise wrangler event "checked_name_inbound"
       attributes attrs
    }
  }


  rule addInboundPendingSubscription { 
    select when wrangler checked_name_inbound
   pre {
      name          = event:attr("name")
      Rx_role       = event:attr("Rx_role").defaultsTo("peer", standardError("Rx_role"))
      Tx_host       = event:attr("Tx_host")
      Tx_role       = event:attr("Tx_role").defaultsTo("peer", standardError("Tx_role"))
      common_Tx     = event:attr("common_Tx").defaultsTo("no_Tx", standardError("common_Tx"))
      channel_type  = event:attr("channel_type").defaultsTo("subs", standardError("channel_type"))
      status        = event:attr("status").defaultsTo("", standardError("status"))
      Tx            = event:attr("Tx").defaultsTo("", standardError("Tx"))
      pending_entry = {
        "name"      : name,
        "Rx_role"   : Rx_role,
        "Tx_role"   : Tx_role,
        "Tx_host"   : Tx_host,
        "Tx"        : Tx,
        "status"    : status
      }.klog("pending entry")
    }
      engine:newChannel(wrangler:myself(){"id"}, name ,channel_type) setting(channel); // create Rx
      //wrangler:createChannel(wrangler:myself(){"id"}, name ,channel_type) setting(channel); // create Rx
    always { 
      newBus = pending_entry.put(["Rx"],channel.id);
      ent:subscriptions := buses().put( [newBus.name] , newBus );
      raise wrangler event "inbound_pending_subscription_added" // API event
          attributes event:attrs();
    } 
  }

rule approveInboundPendingSubscription { 
    select when wrangler pending_subscription_approval
    pre{ bus = buses(){event:attr("name")}.klog("bus") }
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
      ent:subscriptions := buses.put([updatedBus.name],updatedBus);
      raise wrangler event "subscription_added" attributes { // API event
        "bus" : bus
      }
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
      ent:subscriptions := buses.put([updatedBus.name],updatedBus);
      raise wrangler event "subscription_added" attributes {// API event
        "bus" : bus
      }
    }
  }


  rule cancelSubscription {
    select when wrangler subscription_cancellation
            or  wrangler inbound_subscription_rejection
            or  wrangler outbound_subscription_cancellation
    pre{
      name    = event:attr("name")
      buses   = buses()
      bus     = buses{name}
      Tx_host = bus{"Tx_host"}
      Tx      = bus{"common_Tx"}.defaultsTo(bus{"Tx"})
    }
    event:send({
          "eci"   : Tx,
          "domain": "wrangler", "type": "subscription_removal",
          "attrs" : { "name": name }
          }, subscriber_host)
    always {
      raise wrangler event "subscription_removal" attributes {
        "name" : name
      }
    }
  } 

  rule removeSubscription {
    select when wrangler subscription_removal
    pre{
      buses      = buses()
      bus        = buses{event:attr("name")}
      updatedBus = buses.delete(bus{"name"})
    }
    engine:removeChannel(bus{"Rx"})
    //wrangler:removeChannel ... 
    always {
      ent:subscriptions := updatedBus;
      raise wrangler event "subscription_removed" attributes {// API event
        "bus" : bus
      }
    } 
  } 

}

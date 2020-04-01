ruleset io.picolabs.community_thing {
  meta {
    use module io.picolabs.subscription alias subscription
    shares __testing, communities, actions, listeners
    provides actions, listeners
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      , { "name": "communities" }
      , { "name": "actions" }
      , { "name": "listeners" }
      ] , "events":
      [ // { "domain": "d1", "type": "t1" }
      // , { "domain": "d2", "type": "t2", "attrs": [ "a1", "a2" ] }
      ]
    }
    
    communities = function() {
      subscription:established().filter(function(x) {
        x{"Tx_role"} == "community"
      })
    }
    
    actions = function() {
      {
        "on": { 
          "domain": "lutron", 
          "type": "lights_on" 
        },
        "flash": {
          "domain": "lutron",
          "type": "flash",
          "attrs": [ "fade_time", "delay"] 
        },
        "off": {
          "domain": "lutron",
          "type": "lights_off"
        },
        "open": {
          "domain": "lutron",
          "type": "shades_open",
          "attrs": [ "level" ]
        },
        "close": {
          "domain": "lutron",
          "type": "shades_close"
        },
        "inform_community": {
          "domain": "community",
          "type": "info_received"
        }
      }
    }
    
    listeners = function() {
      {
         "on": { 
          "domain": "lutron", 
          "type": "lights_on" 
        },
        "off": {
          "domain": "lutron",
          "type": "lights_off"
        },
        "open": {
          "domain": "lutron",
          "type": "shades_open",
          "attrs": [ "level" ]
        },
        "close": {
          "domain": "lutron",
          "type": "shades_close"
        },
        "wovyn_violation": {
          "domain": "wovyn",
          "type": "temperature_violation",
          "attrs": [ "temperature" ]
        },
        "darksky_warning": {
          "domain": "darksky",
          "type": "weather_warning",
          "attrs": [ "temperature", "message" ]
        }
      }
    }
  }
  
  rule auto_accept {
    select when wrangler inbound_pending_subscription_added
    pre {
      attrs = event:attrs.klog("subscription: ");
    }
    if (attrs{"Rx_role"} == "community") then 
    noop()
    fired {
      raise wrangler event "pending_subscription_approval"
        attributes attrs;
      log info "auto accepted subscription."
    }
  }
  
  rule notify_community {
    select when any 1 (
      lutron lights_on, // your listener domains and types should be added here
      lutron lights_off,
      lutron set_brightness,
      wovyn temperature_violation,
      darksky weather_warning 
    )
    foreach communities() setting(com)
    pre {
      domain = event:domain.klog("event:domain")
      type = event:type.klog("event:type")
      attrs = event:attrs.klog("event:attrs")
    }
    event:send(
      {
        "eci": com{"Tx"}, "eid": "thing_to_community",
        "domain": "community", "type": "thing_event_occurred",
        "attrs": { "domain": domain, "type": type, "attrs": attrs }
      })
  }
  
  rule info_received {
    select when community info_received
    pre {
      info = event:attr("info").klog("thing received info")
      attrs = event:attrs.klog("thing received attrs")
    }
  }
}

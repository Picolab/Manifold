ruleset io.picolabs.weather {
  meta {
    shares __testing, getAPIKey, getLat, getLon, getCurrent
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      , { "name": "getCurrent" }
      , { "name": "getAPIKey" }
      , { "name": "getLat" }
      , { "name": "getLon" }
      //, { "name": "entry", "args": [ "key" ] }
      ] , "events":
      [ //{ "domain": "d1", "type": "t1" }
      { "domain": "weather", "type": "set_key", "attrs": [ "key" ] }
      , { "domain": "weather", "type": "set_coord", "attrs": [ "lat", "lon" ] }
      , { "domain": "weather", "type": "update_weather" }
      ]
    }

    app = {"name":"Weather","version":"0.0"/* img: , pre: , ..*/};
    bindings = function(){
      {
        //currently no bindings
      };
    }

    updateWeatherInfo = function() {
      http:get(<<https://api.darksky.net/forecast/#{ent:key}/#{ent:lat},#{ent:lon}>>){"content"}.decode()
    }

    getCurrent = function() {
      icon = ent:current.get(["icon"]).uc().replace(re#-#g,"_");
      ent:current.set(["icon"], icon)
    }

    getAPIKey = function() {
      ent:key
    }

    getLat = function() {
      ent:lat
    }

    getLon = function() {
      ent:lon
    }
  }

  rule discovery { select when manifold apps send_directive("app discovered...", {"app": app, "rid": meta:rid, "bindings": bindings(), "iconURL": "https://image.flaticon.com/icons/svg/1802/1802025.svg"} ); }

  rule set_key {
    select when weather set_key

    pre {
      key = event:attr("key");
    }

    if key then noop();

    fired {
      ent:key := key
    }
  }

  rule set_coord {
    select when weather set_coord

    pre {
      lat = event:attr("lat");
      lon = event:attr("lon");
    }

    if lat && lon then noop();

    fired {
      ent:lat := lat;
      ent:lon := lon;
    }
  }

  rule update_weather {
    select when weather update_weather

    pre {
      data = updateWeatherInfo();
      temperature = data.get(["currently", "temperature"]).klog("temperature");
      humidity = data.get(["currently", "humidity"]).klog("humidity");
      summary = data.get(["currently", "summary"]).klog("summary");
      icon = data.get(["currently", "icon"]).klog("icon");
      current = {
        "temperature" : temperature,
        "humidity" : humidity,
        "icon" : icon,
        "summary" : summary,
        "timestamp" : time:now()
      }
    }

    if data then noop();

    fired {
      ent:current := current;
      schedule weather event "update_weather" at time:add(time:now(), {"minutes": 5})
    }
  }

}

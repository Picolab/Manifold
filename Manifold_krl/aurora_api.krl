ruleset aurora_api {
  meta {
    shares __testing, getHost, getAuth, getInfo, isOn, brightness, hue, saturation, colorTemperature, colorMode, currentEffect, listEffects, requestEffect, requestAllEffects, orientation, layout, getAuroraEndpointUrl
    provides layout, isOn, brightness, hue, saturation, currentEffect, listEffects, getHost, getAuth, colorTemperature

  }

  global {
    endpoint = "/api/v1/"

    getHost = function() {
      ent:host;
    }

    getAuth = function() {
      ent:auth;
    }

    getInfo = function() {
      result = http:get(ent:host + endpoint + ent:auth);
      result["content"].decode();
    }

    isOn = function() {
      result = http:get(ent:host + endpoint + ent:auth + "/state/on");
      result["content"].decode();
    }

    brightness = function() {
      result = http:get(ent:host + endpoint + ent:auth + "/state/brightness");
      result["content"].decode();
    }

    hue = function() {
      result = http:get(ent:host + endpoint + ent:auth + "/state/hue");
      result["content"].decode();
    }

    saturation = function() {
      result = http:get(ent:host + endpoint + ent:auth + "/state/sat");
      result["content"].decode();
    }

    colorTemperature = function() {
      result = http:get(ent:host + endpoint + ent:auth + "/state/ct");
      result["content"].decode();
    }

    colorMode = function() {
      result = http:get(ent:host + endpoint + ent:auth + "/state/colorMode");
      result["content"].decode();
    }

    currentEffect = function() {
      result = http:get(ent:host + endpoint + ent:auth + "/effects/select");
      result["content"].decode();
    }

    listEffects = function() {
      result = http:get(ent:host + endpoint + ent:auth + "/effects/effectsList");
      result["content"].decode();
    }

    //http:put is an action, needs to be refactored as an action
    requestEffect = function(name) {
      result = http:put(ent:host + endpoint + ent:auth + "/effects", body = "{\"write\" : {\"command\" : \"request\", \"animName\" : \"" + name + "\"}}");
      result["content"].decode();
    }

    //http:put is an action, needs to be refactored as an action
    requestAllEffects = function() {
      result = http:put(ent:host + endpoint + ent:auth + "/effects", body = "{\"write\" : {\"command\" : \"requestAll\"}}");
      result["content"].decode();
    }

    orientation = function() {
      result = http:get(ent:host + endpoint + ent:auth + "/panelLayout/globalOrientation");
      result["content"].decode();
    }

    layout = function() {
      result = http:get(ent:host + endpoint + ent:auth + "/panelLayout/layout");
      result["content"].decode();
    }

    getAuroraEndpointUrl = function() {
      ent:host + endpoint + ent:auth + "/effects/effectsList"
    }





    addUser = defaction() {
      http:post(host + endpoint + "new") setting (result)
      returns result
    }

    deleteUser = defaction(auth) {
      http:delete(ent:host + endpoint + auth)
    }

    turnOn = defaction() {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"on\" : {\"value\":true}}")
    }

    turnOff = defaction() {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"on\" : {\"value\":false}}")
    }

    next = defaction() {
      every {
        http:get(ent:host + endpoint + ent:auth + "/effects/effectsList") setting (effects)
        http:get(ent:host + endpoint + ent:auth + "/effects/select") setting (current)
        selectEffect(effects["content"].decode()[(effects["content"].decode().index(current["content"].decode()) + 1) % effects["content"].decode().length()])// setting (next)
      }
      returns effects["content"].decode()[(effects["content"].decode().index(current["content"].decode()) + 1) % effects["content"].decode().length()]
    }

    previous = defaction() {
      every {
        http:get(ent:host + endpoint + ent:auth + "/effects/effectsList") setting (effects)
        http:get(ent:host + endpoint + ent:auth + "/effects/select") setting (current)
        selectEffect(effects["content"].decode()[(effects["content"].decode().index(current["content"].decode()) + effects["content"].decode().length() - 1) % effects["content"].decode().length()])// setting (previous)
      }
      returns effects["content"].decode()[(effects["content"].decode().index(current["content"].decode()) + effects["content"].decode().length() - 1) % effects["content"].decode().length()]
    }

    setPanel = defaction(id, r, g, b) {
      http:put(ent:host + endpoint + ent:auth + "/effects", body = "{\"write\" : {\"command\" : \"display\", \"animType\" : \"custom\", \"animData\" : \"1 " + id + " 1 " + r + " " + g + " " + b + " 0 1\", \"loop\" : false}}")
    }

    setBrightness = defaction(value) {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"brightness\" : {\"value\":" + value + "}}")
    }

    brighter = defaction(value) {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"brightness\" : {\"increment\":" + value + "}}")
    }

    darker = defaction(value) {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"brightness\" : {\"increment\":-" + value + "}}")
    }

    setHue = defaction(value) {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"hue\" : {\"value\":" + value + "}}")
    }

    increaseHue = defaction(value) {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"hue\" : {\"increment\":" + value + "}}")
    }

    decreaseHue = defaction(value) {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"hue\" : {\"increment\":-" + value + "}}")
    }

    setSaturation = defaction(value) {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"sat\" : {\"value\":" + value + "}}")
    }

    saturate = defaction(value) {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"sat\" : {\"increment\":" + value + "}}")
    }

    desaturate = defaction(value) {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"sat\" : {\"increment\":-" + value + "}}")
    }

    setColorTemp = defaction(value) {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"ct\" : {\"value\":" + value + "}}")
    }

    warmer = defaction(value) {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"ct\" : {\"increment\":" + value + "}}")
    }

    colder = defaction(value) {
      http:put(ent:host + endpoint + ent:auth + "/state", body = "{\"ct\" : {\"increment\":-" + value + "}}")
    }

    selectEffect = defaction(name) {
      http:put(ent:host + endpoint + ent:auth + "/effects", body = "{\"select\" : \"" + name + "\"}")
      returns name
    }

    selectTempEffect = defaction(name, duration) {
      http:put(ent:host + endpoint + ent:auth + "/effects", body = "{\"write\" : {\"command\" : \"displayTemp\", \"animName\" : \"" + name + "\", \"duration\" : " + duration + "}}")
    }

    addEffect = defaction(name, data, loop) {
      http:put(ent:host + endpoint + ent:auth + "/effects", body = "{\"write\" : {\"command\" : \"add\", \"animName\" : \"" + name + "\", \"animType\" : \"custom\", \"animData\" :\"" + data + "\", \"loop\" : " + loop + "}}")
    }

    displayEffect = defaction(data, loop) {
      http:put(ent:host + endpoint + ent:auth + "/effects", body = "{\"write\" : {\"command\" : \"display\", \"animType\" : \"custom\", \"animData\" : \"" + data + "\", \"loop\" : " + loop + "}}")
    }

    displayTempEffect = defaction(data, duration, loop) {
      http:put(ent:host + endpoint + ent:auth + "/effects", body = "{\"write\" : {\"command\" : \"displayTemp\", \"duration\" : " + duration + ", \"animType\" : \"custom\", \"animData\" : \"" + data + "\", \"loop\" : " + loop + "}}")
    }

    deleteEffect = defaction(name) {
      http:put(ent:host + endpoint + ent:auth + "/effects", body = "{\"write\" : {\"command\" : \"delete\", \"animName\" : \"" + name + "\"}}")
    }

    renameEffect = defaction(name, newName) {
      http:put(ent:host + endpoint + ent:auth + "/effects", body = "{\"write\" : {\"command\" : \"rename\", \"animName\" : \"" + name + "\", \"newName\" : \"" + newName + "\"}}")
    }





    __testing = { "queries": [ { "name": "getHost" },
                               { "name": "getAuth" },
                               { "name": "getInfo" },
                               { "name": "isOn" },
                               { "name": "brightness" },
                               { "name": "hue" },
                               { "name": "saturation" },
                               { "name": "colorTemperature" },
                               { "name": "colorMode" },
                               { "name": "currentEffect" },
                               { "name": "listEffects" },
                               { "name": "requestEffect", "args": [ "name" ] },
                               { "name": "requestAllEffects" },
                               { "name": "orientation" },
                               { "name": "layout" },
                               {"name":"getAuroraEndpointUrl"}
                  ],
                  "events": [ {"domain": "aurora", "type": "host",
                                "attrs": [ "host" ] },
                              {"domain": "aurora", "type": "auth",
                                "attrs": [ "auth" ] },
                              {"domain": "aurora", "type": "on",
                                "attrs": [] },
                              { "domain": "aurora", "type": "off",
                                "attrs": [] },
                              { "domain": "aurora", "type": "next",
                                "attrs": [] },
                              { "domain": "aurora", "type": "previous",
                                "attrs": [] },
                              {"domain": "aurora", "type": "setPanel",
                                "attrs": [ "id", "r", "g", "b" ] },
                              {"domain": "aurora", "type": "brightness",
                                "attrs": [ "value" ] },
                              {"domain": "aurora", "type": "brighter",
                                "attrs": [ "value" ] },
                              {"domain": "aurora", "type": "darker",
                                "attrs": [ "value" ] },
                              {"domain": "aurora", "type": "hue",
                                "attrs": [ "value" ] },
                              {"domain": "aurora", "type": "increaseHue",
                                "attrs": [ "value" ] },
                              {"domain": "aurora", "type": "decreaseHue",
                                "attrs": [ "value" ] },
                              {"domain": "aurora", "type": "saturation",
                                "attrs": [ "value" ] },
                              {"domain": "aurora", "type": "saturate",
                                "attrs": [ "value" ] },
                              {"domain": "aurora", "type": "desaturate",
                                "attrs": [ "value" ] },
                              {"domain": "aurora", "type": "temperature",
                                "attrs": [ "value" ] },
                              {"domain": "aurora", "type": "warmer",
                                "attrs": [ "value" ] },
                              {"domain": "aurora", "type": "colder",
                                "attrs": [ "value" ] },
                              {"domain": "aurora", "type": "effect",
                                "attrs": [ "name" ] },
                              {"domain": "aurora", "type": "tempEffect",
                                "attrs": [ "name", "duration" ] },
                              {"domain": "aurora", "type": "addEffect",
                                "attrs": [ "name", "data", "loop" ] },
                              {"domain": "aurora", "type": "display",
                                "attrs": [ "data", "loop" ] },
                              {"domain": "aurora", "type": "tempDisplay",
                                "attrs": [ "data", "duration", "loop" ] },
                              {"domain": "aurora", "type": "deleteEffect",
                                "attrs": [ "name" ] },
                              {"domain": "aurora", "type": "renameEffect",
                                "attrs": [ "name", "newName" ] }
    ] }
  }





  rule setHost {
    select when aurora host
    if (event:attr("host")) then
      send_directive("Host", {"body": "Host has been changed to " + event:attr("host")})
    fired { ent:host := event:attr("host").klog(">>>> HOST <<<<") }
  }

  rule setHost2 {
    select when aurora host
    if not (event:attr("host")) then
      send_directive("Host", {"body":ent:host})
  }

  rule setAuth {
    select when aurora auth
    if (event:attr("auth")) then
      send_directive("Auth", {"body":"Auth has been changed to " + event:attr("auth")})
    fired { ent:auth := event:attr("auth") }
  }

  rule setAuth2 {
    select when aurora auth
    if not (event:attr("auth")) then
      send_directive("Auth", {"body":ent:auth})
  }

  rule turnOn {
    select when aurora on
    every {
      turnOn()
      send_directive("Aurora is turned on")
    }
  }

  rule turnOff {
    select when aurora off
    every {
      turnOff()
      send_directive("Aurora is turned off")
    }
  }

  rule next {
    select when aurora next
    every {
      next() setting (next)
      send_directive("Switching to next effect: " + next, {"effect": next})
    }
  }

  rule previous {
    select when aurora previous
    every {
      previous() setting (previous)
      send_directive("Switching to previous effect: " + previous, {"effect": previous})
    }
  }

  rule setPanel {
    select when aurora setPanel
    pre {
      panel = event:attr("id")
      r = event:attr("r")
      g = event:attr("g")
      b = event:attr("b")
    }
    every {
      setPanel(panel, r, g, b)
      send_directive("Panel " + panel + " has been changed to {r:" + r + ", g:" + g + ", b:" + b + "}", {"panel_id": panel, "r": r, "g": g, "b": b})
    }
  }

  rule setBrightness {
    select when aurora brightness
    every {
      setBrightness(event:attr("value"))
      send_directive("Brightness value set to " + event:attr("value"), {"brightness": brightness()})
    }
  }

  rule brighter {
    select when aurora brighter
    every {
      brighter(event:attr("value"))
      send_directive("Brightness increased by " + event:attr("value"), {"brightness": brightness()})
    }
  }

  rule darker {
    select when aurora darker
    every {
      darker(event:attr("value"))
      send_directive("Brightness decreased by " + event:attr("value"), {"brightness": brightness()})
    }
  }

  rule setHue {
    select when aurora hue
    every {
      setHue(event:attr("value"))
      send_directive("Hue value set to " + event:attr("value"), {"hue": hue()})
    }
  }

  rule increaseHue {
    select when aurora increaseHue
    every {
      increaseHue(event:attr("value"))
      send_directive("Hue value increased by " + event:attr("value"), {"hue": hue()})
    }
  }

  rule decreaseHue {
    select when aurora decreaseHue
    every {
      decreaseHue(event:attr("value"))
      send_directive("Hue value decreased by " + event:attr("value"), {"hue": hue()})
    }
  }

  rule setSaturation {
    select when aurora saturation
    every {
      setSaturation(event:attr("value"))
      send_directive("Saturation set to " + event:attr("value"), {"saturation": saturation()})
    }
  }

  rule saturate {
    select when aurora saturate
    every {
      saturate(event:attr("value"))
      send_directive("Saturation increased by " + event:attr("value"), {"saturation": saturation()})
    }
  }

  rule desaturate {
    select when aurora desaturate
    every {
      desaturate(event:attr("value"))
      send_directive("Saturation decreased by " + event:attr("value"), {"saturation": saturation()})
    }
  }

  rule setColorTemp {
    select when aurora temperature
    every {
      setColorTemp(event:attr("value"))
      send_directive("Color temperature value set to " + event:attr("value"), {"colorTemperature": colorTemperature()})
    }
  }

  rule warmer {
    select when aurora warmer
    every {
      warmer(event:attr("value"))
      send_directive("Color temperature increased by " + event:attr("value"), {"colorTemperature": colorTemperature()})
    }
  }

  rule colder {
    select when aurora colder
    every {
      colder(event:attr("value"))
      send_directive("Color temperature decreased by " + event:attr("value"), {"colorTemperature": colorTemperature()})
    }
  }

  rule selectEffect {
    select when aurora effect
    every {
      selectEffect(event:attr("name")) setting (response)
      send_directive("Switching to " + event:attr("name") + " effect" + response, {"effect": event:attr("name")})
    }
  }

  rule selectTempEffect {
    select when aurora tempEffect
    every {
      selectTempEffect(event:attr("name"), event:attr("duration"))
      send_directive("Switching to effect " + event:attr("name") + " for " + event:attr("duration") + " seconds", {"effect": event:attr("name"), "duration": event:attr("duration")})
    }
  }

  rule addEffect {
    select when aurora addEffect
    every {
      addEffect(event:attr("name"), event:attr("data"), event:attr("loop")) setting(response)
      send_directive("Effect " + event:attr("name") + " has been saved in Aurora", {"effect": event:attr("name")})
    }
  }

  rule displayEffect {
    select when aurora display
    every {
      displayEffect(event:attr("data"), event:attr("loop"))
      send_directive("Displaying unsaved effect", {"effect_data": event:attr("data")})
    }
  }

  rule displayTempEffect {
    select when aurora tempDisplay
    every {
      displayTempEffect(event:attr("data"), event:attr("duration"), event:attr("loop"))
      send_directive("Displaying unsaved effect for " + event:attr("duration") + " seconds", {"effect_data": event:attr("data"), "duration": event:attr("duration")})
    }
  }

  rule deleteEffect {
    select when aurora deleteEffect
    every {
      deleteEffect(event:attr("name"))
      send_directive("Effect " + event:attr("name") + " has been deleted", {"effect": event:attr("name")})
    }
  }

  rule renameEffect {
    select when aurora renameEffect
    every {
      renameEffect(event:attr("name"), event:attr("newName"))
      send_directive("Effect " + event:attr("name") + " has been renamed to " + event:attr("newName"), {"old_effect": event:attr("name"), "effect": event:attr("newName")})
    }
  }
}

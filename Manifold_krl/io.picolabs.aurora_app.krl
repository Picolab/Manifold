ruleset io.picolabs.aurora_app {
  meta {
    shares __testing, isOn, getHue, getSaturation, getBrightness, connectionInfo, currentEffect, listEffects, getData
    use module aurora_api alias aurora
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      , { "name": "isOn" }
      , { "name": "getHue" }
      , { "name": "getSaturation" }
      , { "name": "getBrightness" }
      , { "name": "connectionInfo" }
      , { "name": "currentEffect" }
      , { "name": "listEffects" }
      , { "name": "getData" }
      //, { "name": "entry", "args": [ "key" ] }
      ] , "events":
      [ //{ "domain": "d1", "type": "t1" }
      //, { "domain": "d2", "type": "t2", "attrs": [ "a1", "a2" ] }
      { "domain": "aurora_app", "type": "set_brightness", "attrs": [ "value" ] }
      , { "domain": "aurora_app", "type": "set_hue", "attrs": [ "value" ] }
      , { "domain": "aurora_app", "type": "set_saturation", "attrs": [ "value" ] }
      , { "domain": "aurora_app", "type": "effect", "attrs": [ "effect" ] }
      , { "domain": "aurora_app", "type": "connection_info", "attrs": [ "auth", "host" ] }
      , { "domain": "aurora_app", "type": "turn_on" }
      , { "domain": "aurora_app", "type": "turn_off" }
      ]
    }

    app = {"name":"Aurora","version":"0.0"/* img: , pre: , ..*/};
    bindings = function(){
      {
        //currently no bindings
      };
    }

    getData = function() {
      {
        "isOn" : isOn(),
        "hue" : getHue(),
        "saturation" : getSaturation(),
        "brightness" : getBrightness(),
        "currentEffect" : currentEffect(),
        "allEffects" : listEffects()
      }
    }

    isOn = function() {
      aurora:isOn()
    }

    getHue = function() {
      aurora:hue()
    }

    getSaturation = function() {
      aurora:saturation();
    }

    getBrightness = function() {
      aurora:brightness()
    }

    connectionInfo = function() {
      { "host" : aurora:getHost(),
        "auth" : aurora:getAuth() }
    }

    currentEffect = function() {
      aurora:currentEffect();
    }

    listEffects = function() {
      aurora:listEffects();
    }
  }

  rule discovery { select when manifold apps send_directive("app discovered...", {"app": app, "rid": meta:rid, "bindings": bindings(), "iconURL": "https://image.flaticon.com/icons/svg/191/191035.svg"} ); }

  rule init {
    select when wrangler ruleset_added where rids >< meta:rid
    always {
      raise wrangler event "install_rulesets_requested"
      attributes { "rid" : "aurora_api" }
    }
  }

  rule set_brightness {
    select when aurora_app set_brightness

    pre {
      value = event:attr("value");
    }

    if value then noop();

    fired {
      raise aurora event "brightness"
        attributes { "value" : value }
    }
  }

  rule set_hue {
    select when aurora_app set_hue

    pre {
      value = event:attr("value");
    }

    if value then noop();

    fired {
      raise aurora event "hue"
        attributes { "value" : value }
    }
  }

  rule set_saturation {
    select when aurora_app set_saturation

    pre {
      value = event:attr("value");
    }

    if value then noop();

    fired {
      raise aurora event "saturation"
        attributes { "value" : value }
    }
  }

  rule set_connection_host {
    select when aurora_app connection_info

    pre {
      host = event:attr("host");
    }

    if host then noop();

    fired {
      raise aurora event "host"
      attributes { "host" : host }
    }
  }

  rule set_connection_auth {
    select when aurora_app connection_info

    pre {
      auth = event:attr("auth");
    }

    if auth then noop();

    fired {
      raise aurora event "auth"
      attributes { "auth" : auth }
    }
  }

  rule turn_on {
    select when aurora_app turn_on

    always {
      raise aurora event "on"
    }
  }

  rule turn_off {
    select when aurora_app turn_off

    always {
      raise aurora event "off"
    }
  }

  rule effect {
    select when aurora_app effect

    pre {
      effect = event:attr("effect");
      list = listEffects();
    }

    if effect && list >< effect then noop();

    fired {
      raise aurora event "effect"
        attributes { "name" : effect }
    }
  }
}

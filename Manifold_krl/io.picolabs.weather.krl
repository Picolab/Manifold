/* The Ruleset Identifier, or rid, is com.example.weather */
ruleset com.example.weather {

  /*
    The meta section stores information about a ruleset. Meta sections are
    optional and may be empty. You can find more information about what can be
    put in the meta block at
    https://picolabs.atlassian.net/wiki/spaces/docs/pages/1189908/Meta+Section
  */
  meta {
    /*
      Shared functions can be called outside of this ruleset. If a function is
      shared, it can be called from the testing tab, postman, a browser, or
      anything that makes http get requests.

      All events are shared and can be raised from anywhere, unless a policy is
      put on the channel.
    */
    shares __testing, getAPIKey, getLat, getLon, getCurrent
  }
  /*
    The global block is where all global functions and variables are defined.
    This includes the __testing object which is used by the testing tab. You can
    learn more about the testing tab and how to use it at
    https://picolabs.atlassian.net/wiki/spaces/docs/pages/685342721/Pico+Engine+UI+--+Testing+tab
  */
  global {
    /*
      This is for the testing tab, all events and queries in this object will
      appear in the testing tab as long as the __testing object is shared
    */
    __testing = { "queries":
      [ { "name": "__testing" }
      , { "name": "getCurrent" }
      , { "name": "getAPIKey" }
      , { "name": "getLat" }
      , { "name": "getLon" }
      ] , "events":
      [ { "domain": "weather", "type": "set_key", "attrs": [ "key" ] }
      , { "domain": "weather", "type": "set_coord", "attrs": [ "lat", "lon" ] }
      , { "domain": "weather", "type": "update_weather" }
      ]
    }

    /*
      The app variable and the bindings function are returned in the directives
      of the discovery rule, which is raised by manifold. The name and version
      you put here will appear in Manifold.
    */
    app = { "name" : "Weather", "version" : "0.0" };
    bindings = function(){
      {
        //currently no bindings
      };
    }

    /*
      updateWeatherInfo()-------------------------------------------------------

      This function uses the http get method request weather information from
      the darksky api.

      The http:get() function takes one argument: a url in the form of a string.

      A template string can be made using extended the quotes by writing the
      string between << and >>. Extended quotes support the beesting operator,
      making them simple templating systems. Inside an extended quote,
      expression values can be referenced using the #{<expr>} syntax

      The http:get() is a synchronous function, and will return an http
      response. The part of the response we are most interested in is the
      content, which holds the actual weather data from the darksky api.

      The .decode() function after the content will turn the json string object
      and convert it to an object that we can work with and grab data from.

      More information on the krl http library can be found at
      https://picolabs.atlassian.net/wiki/spaces/docs/pages/1189608/HTTP

      More information on beestings and extended strings in krl is found at
      https://picolabs.atlassian.net/wiki/spaces/docs/pages/1189871/Beestings

      More information on the decode() function and other string operators
      can be found at
      https://picolabs.atlassian.net/wiki/spaces/docs/pages/1189595/String+Operators
    */
    updateWeatherInfo = function() {
      http:get(<<https://api.darksky.net/forecast/#{ent:key}/#{ent:lat},#{ent:lon}>>){"content"}.decode()
    }

    /*
      getCurrent()--------------------------------------------------------------

      This function is the function is what actually gets called by your
      manifold app. instead of just returning the current entity variable as it
      is, we alter the icon value stored in it. The darksky api sends the icon
      value back lowercase with dashes in between the words. The skycon library
      we use to display our icons needs the icon values to be uppercase and
      separated by underscores. For example, darksky might send us the icon
      value "partly-cloudy-night." Skycon needs this value to be
      "PARTLY_CLOUDY_NIGHT." The code below gets the icon value and sets it to
      all uppercase with the uc() operator. Then it replaces all the - with _
      using the replace() operator.

      You can learn more about the uc() operator and the replace() operator here
      https://picolabs.atlassian.net/wiki/spaces/docs/pages/1189595/String+Operators
    */
    getCurrent = function() {
      icon = ent:current.get(["icon"]).uc().replace(re#-#g,"_");
      ent:current.set(["icon"], icon)
    }

    /*
      getAPIKey()---------------------------------------------------------------

      This function is a simple getter that returns the key entity variable. The
      key entity variable is set by the set_key rule. It holds your darksky api
      key.
    */
    getAPIKey = function() {
      ent:key
    }

    /*
      getLatKey()---------------------------------------------------------------

      This function is a simple getter that returns the lat entity variable. The
      lat entity variable is set by set_coord rule and holds the latitude of
      your current location.
    */
    getLat = function() {
      ent:lat
    }

    /*
      getLonKey()---------------------------------------------------------------

      This function is a simple getter that returns the lon entity variable. The
      lon entity variable is set by set_coord rule and holds the longitude of
      your current location.
    */
    getLon = function() {
      ent:lon
    }
  }

  /*
    dicovery rule---------------------------------------------------------------

    This rule is raised by manifold. It is needed for manifold to recognize your
    app. This rule will be the same in all manifold apps, the only thing that
    changes is the iconURL's value. This should be a link to the image you will
    use as an icon in Manifold. I chose the image at
    https://image.flaticon.com/icons/svg/1802/1802025.svg because it looks nice,
    but any image will do. Generally rounded icons look better than square ones,
    but it doesn't really matter.
  */
  rule discovery { select when manifold apps send_directive("app discovered...", {"app": app, "rid": meta:rid, "bindings": bindings(), "iconURL": "https://image.flaticon.com/icons/svg/1802/1802025.svg"} ); }

  /*
    set_key rule----------------------------------------------------------------

    This rule simply sets the key entity variable with a darksky api key. If you
    need an api key, you can get one by signing up at https://darksky.net/dev.
    You are allowed 1000 api calls per day with the free version. Our app won't
    need more than that.
  */
  rule set_key {
    /* The rule has a domain of weather and a type of set_key */
    select when weather set_key

    pre {
      /* We set the key variable to the event attribute "key" */
      key = event:attr("key");
    }

    /* The rule will only fire if key is true. The variable key will be true as
    long as it's not null. In other words, the rule will only fire if an event
    attribute "key" is supplied. This is to keep the key entity variable from
    being set to null. You can see this in the testing tab by trying to raise
    the set_key rule without typing anything in the "key" attribute. */
    if key then noop();

    /* Anything in the "fired" postlude will only execute if the if-then
    statement above is true */
    fired {
      /* Here we set the key entity variable to the key variable. Entity
      variables are set with the ':=' operator. You can learn more about
      persistent variables at
      https://picolabs.atlassian.net/wiki/spaces/docs/pages/1190011/Using+Persistent+Variables */
      ent:key := key
    }
  }

  /*
    set_coord rule--------------------------------------------------------------

    This rule simply sets the lat and lon entity variables with a latitude and
    longitude coordinate. The rule itself is very similar to the set_key rule.
    Reference the documentation above for set_key rule for a more detailed
    description of how this rule works.
  */
  rule set_coord {
    /* The rule has a domain of weather and a type of set_coord */
    select when weather set_coord

    pre {
      lat = event:attr("lat");
      lon = event:attr("lon");
    }

    /* This rule will only fire if both lat and lon attributes are supplied */
    if lat && lon then noop();

    fired {
      ent:lat := lat;
      ent:lon := lon;
    }
  }

  /*
    update_weather rule---------------------------------------------------------
  */
  rule update_weather {
    /* The rule has a domain of weather and a type of update_weather */
    select when weather update_weather

    pre {
      /* We set the data variable equal to what the updateWeatherInfo function
      returns. This will be current weather info. */
      data = updateWeatherInfo();
      /* Here we set the temperature, humidity, summary, and icon variables to
      the values we get from the data object. The get() operator will pull the
      values out of the data object at the hashpat. You can find out more about
      hashpaths and the get operator at
      https://picolabs.atlassian.net/wiki/spaces/docs/pages/1189585/Map+Operators */
      temperature = data.get(["currently", "temperature"]).klog("temperature");
      humidity = data.get(["currently", "humidity"]).klog("humidity");
      summary = data.get(["currently", "summary"]).klog("summary");
      icon = data.get(["currently", "icon"]).klog("icon");
      /* We set the current variable to be a map with all the data our manifold
      app will need. The time:now() function adds a timestamp of the time when
      event is processed. */
      current = {
        "temperature" : temperature,
        "humidity" : humidity,
        "icon" : icon,
        "summary" : summary,
        "timestamp" : time:now()
      }
    }

    /* if the updateWeatherInfo returns null, we don't change the current entity
     variable */
    if data then noop();

    fired {
      ent:current := current;
      /* We schedule the update_weather event to be raised again after 5
      minutes. Once this rule is raised once from the testing tab, it doesn't
      need to be raised again. It will raise itself. That way we only use the
      darksky api 288 times per day and never go over our limit. The weather
      will also be at most 5 minutes late.*/
      schedule weather event "update_weather" at time:add(time:now(), {"minutes": 5})
    }
  }

}

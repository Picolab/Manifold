ruleset io.picolabs.notifications {
  meta {
    shares __testing, getNotifications, getBadgeNumber
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      , { "name": "getNotifications" }
      , { "name": "getBadgeNumber" }
      //, { "name": "entry", "args": [ "key" ] }
      ] , "events":
      [
        { "domain": "manifold", "type": "add_notification", "attrs": ["did", "thing", "app", "message", "ruleset"]}
        , { "domain": "manifold", "type": "remove_notification", "attrs": ["notificationID"]}
        //{ "domain": "d1", "type": "t1" }
      //, { "domain": "d2", "type": "t2", "attrs": [ "a1", "a2" ] }
      ]
    }

    getNotifications = function () {
      ent:notifications.defaultsTo([]).reverse();
    }

    getBadgeNumber = function () {
      ent:notifications.length()
    }
  }

  rule addNotification {
    select when manifold add_notification

    pre {
      thing = event:attr("thing");
      did = event:attr("did");
      app = event:attr("app");
      message = event:attr("message");
      rs = event:attr("ruleset");

      notificationID = random:uuid();
      time_stamp = time:now();
      notification = event:attrs.put("id", notificationID).put("time", time_stamp);
    }

    if(thing && did && app && message && rs) then noop();

    fired {
      ent:notifications := ent:notifications.defaultsTo([]).append(notification);
    }
  }

  rule removeNotification {
    select when manifold remove_notification

    pre {
      id = event:attr("notificationID")
    }

    if id then noop();

    fired {
      ent:notifications := ent:notifications.defaultsTo([]).filter(function(x) {
        (x["id"] != id)
      });
    }
  }
}

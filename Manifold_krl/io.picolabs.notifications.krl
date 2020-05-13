ruleset io.picolabs.notifications {
  meta {
     use module io.picolabs.manifold_pico alias manifold_pico
     use module io.picolabs.wrangler alias wrangler
     use module io.picolabs.subscription alias subscription
    shares __testing, getNotifications, getBadgeNumber, getState, getID, getSettings
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      , { "name": "getNotifications" }
      , { "name": "getBadgeNumber" }
      , { "name" : "getState", "args": ["id"] }
      , { "name" : "getID", "args": ["id"]}
      //, { "name": "entry", "args": [ "key" ] }
      ] , "events":
      [
        { "domain": "manifold", "type": "add_notification", "attrs": ["picoId", "thing", "app", "message", "ruleset"]}
        , { "domain": "manifold", "type": "remove_notification", "attrs": ["notificationID"]}
        , { "domain": "manifold", "type": "update_app_list", "attrs": []}
        , { "domain": "manifold", "type": "set_notification_settings", "attrs": ["id"]}
        , { "domain": "manifold", "type": "change_notification_setting", "attrs": ["id", "app_name", "option"]}
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

    getState = function (id) {
      ent:notification_state{id};
    }

    updateAppList = function (id, apps) {
      appList = ent:app_list;
      (appList == null) => {}.put(id, apps) | (appList{id} == null) => appList.put(id, apps) | appList.set([id], apps);
    }

    getID = function(id) {
      picoID = manifold_pico:getThings().filter(function(x) {
        x{"subID"} == id
      });
      picoID.values()[0]{"picoID"};
    }

    setNotificationSettings = function(id, app_name) {
      notification_settings = ent:notification_settings;
      (notification_settings == null).klog("notification_settings == null") => {}.put(id, {}.put(app_name, {"Manifold": true, "Twilio": false, "Prowl": false, "Email": false, "Text": false})) |
        (notification_settings{id} == null) => notification_settings.put(id, {}.put(app_name, {"Manifold": true, "Twilio": false, "Prowl": false, "Email": false, "Text": false})) |
        (notification_settings{id}{app_name} == null) => notification_settings.put([id, app_name], {"Manifold": true, "Twilio": false, "Prowl": false, "Email": false, "Text": false}) |
        ent:notification_settings
    }

    getSettings = function(id, app_name) {
      ent:notification_settings{id}{app_name}
    }
  }

  rule updateManifoldAppList {
    select when manifold update_app_list or manifold update_version or manifold notify_manifold
      foreach subscription:established().filter(function(x){
        x{"Tx_role"} == "manifold_thing"
      }) setting (x,i)
    pre {
      eci = x{"Tx"}
      id = getID(x{"Id"})
      apps = http:get(<<#{meta:host.klog("host")}/sky/event/#{eci}/apps/manifold/apps>>, parseJSON=true)["content"]["directives"];
    }
    always {
      ent:app_list := updateAppList(id, apps);
      raise manifold event "set_notification_settings"
        attributes {"id": id}
    }
  }

  rule setDefaultNotificationSettings {
    select when manifold set_notification_settings
    foreach ent:app_list{event:attr("id")} setting(x)
    pre {
      id = event:attr("id");
      app_name = x{"options"}{"rid"}.klog("app_name")
    }

    always {
      ent:notification_settings := setNotificationSettings(id, app_name).klog("ent:notification_settings");
      raise twilio event "set_default_toPhone"
        attributes {"id": id, "rs": app_name};
      raise email event "set_default_recipient"
        attributes {"id": id, "rs": app_name};
      raise text_messenger event "set_default_toPhone"
        attributes {"id": id, "rs": app_name};
    }
  }

  rule changeNotificationSetting {
    select when manifold change_notification_setting
    pre {
      id = event:attr("id");
      app_name = event:attr("app_name");
      option = event:attr("option");
    }
      if ent:notification_settings{id}.klog("{id}"){app_name}.klog("{app_name}"){option}.klog("{option}") == true then noop()
    fired {
      ent:notification_settings := ent:notification_settings.set([id, app_name, option], false);
    }
    else {
      ent:notification_settings := ent:notification_settings.set([id, app_name, option], true);
    }
  }

  rule addNotification {
    select when manifold add_notification

    pre {
      thing = event:attr("thing");
      picoId = event:attr("picoId");
      app = event:attr("app");
      message = event:attr("message");
      rs = event:attr("ruleset");
      state = event:attr("state").defaultsTo({});

      notificationID = random:uuid();
      time_stamp = time:now();
      notification = event:attrs.put("id", notificationID).put("time", time_stamp);
    }

    if(thing && picoId && app && message && rs) then noop();

    fired {
      ent:notifications := ent:notifications.defaultsTo([]).append(notification)
        if (ent:notification_settings{picoId}{rs}{"Manifold"}) == true;
      ent:notification_state := ent:notification_state.defaultsTo({}).put(notificationID, state)
        if (ent:notification_settings{picoId}{rs}{"Manifold"}) == true;
      raise twilio event "notify_through_twilio"
        attributes {"Body": message, "rs": rs, "id": picoId }
      if (ent:notification_settings{picoId}{rs}{"Twilio"}) == true;
      raise prowl event "notify_through_prowl"
        attributes {"Body": message, "rs": rs, "id": picoId, "application": app }
      if (ent:notification_settings{picoId}{rs}{"Prowl"}) == true;
      raise email event "notification"
        attributes {"Body": message, "rs": rs, "id": picoId, "application": app, "thing": thing }
      if(ent:notification_settings{picoId}{rs}{"Email"}) == true;
      raise text_messenger event "text_notification"
        attributes {"Body": message, "rs": rs, "id": picoId, "application": app, "thing": thing }
      if(ent:notification_settings{picoId}{rs}{"Text"}) == true
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

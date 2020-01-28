ruleset io.picolabs.manifold.disk_space_monitor {
  meta {
    shares __testing, info, manifoldMonitor
    use module io.picolabs.wrangler alias Wrangler
    use module io.picolabs.subscription alias sub
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      , { "name": "info" }
      , { "name": "manifoldMonitor" }
      ] , "events":
      [ //{ "domain": "d1", "type": "t1" }
      //, { "domain": "d2", "type": "t2", "attrs": [ "a1", "a2" ] }
      ]
    }
    THRESHOLD = 90
    info = function() {
      ent:disk
    }
    manifoldMonitor = function() {
      sub:established().filter(function(x) {
        x{"Tx_role"} == "manifold_monitor"
      })
    }
  }
  rule init {
    select when wrangler ruleset_added where event:attr("rids") >< meta:rid
    fired {
      ent:disk := ent:disk.defaultsTo({});
      ent:threshold_violations := ent:threshold_violations.defaultsTo({})
    }
  }
  
  rule disk_space_update {
    select when disk_space update
    pre {
      mounted = event:attr("mounted").decode()
      usep = event:attr.decode()("usep").klog("usep")
      data = {
        "filesystem": event:attr("fs"),
        "size": event:attr("size"),
        "used": event:attr("used"),
        "avail": event:attr("avail"),
        "usep": usep,
        "mounted": mounted,
        "date": event:attr("date")
      }
    }
    fired {
      ent:disk{mounted} := data;
      raise disk_space event "threshold_violation" 
        attributes event:attrs.put("data", data) if usep > THRESHOLD
    }
  }
  
  rule disk_space_threshold_violation {
    select when disk_space threshold_violation
    foreach manifoldMonitor() setting(observer)
    pre {
      toSend = observer{"Tx"}
      picoId = meta:picoId;
      fs = event:attr("fs")
      usage = event:attr("usep")
      mounted = event:attr("mounted")
      date = event:attr("date")
      message = <<Running out of space "#{fs} (#{usage}%)" mounted on #{mounted} as of #{date}>>;
    }
    
    event:send({ 
      "eci" : toSend, 
      "domain" : "manifold_monitor", 
      "type" : "threshold_violation", 
      "attrs": {"message" : message}
    })
    fired {
      ent:threshold_violations{date} := event:attr("data");
    }
  }
}

ruleset io.picolabs.manifold.email_notifications {
  meta {
    shares __testing, getRecipient
    use module io.picolabs.wrangler alias wrangler
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" } ] 
      , "events":
      [ { "domain": "email", "type": "notification", "attrs": [ "recipient", "Body" ] }]
    }
    getRecipient = function(id, rs) {
      ent:recipient{id}{rs}
    }
    
    getDefaultRecipient = function(contacts) {
      default_recipient = contacts.filter(function(x) {
        (x{"email"} != null && x{"favorite"} == "true");
      });
      default_recipient.values()[0]{"email"}
    }
    
  }
  
  rule setDefaulRecipient {
    select when email set_default_recipient 
    pre {
      rs = event:attr("rs");
      id = event:attr("id");
      owner_eci = wrangler:parent_eci().klog("parentEci");
      contacts = wrangler:skyQuery(owner_eci, "io.picolabs.profile", "getOther").klog("contacts")
      default_recipient = getDefaultRecipient(contacts).klog("default_recipient")

    }
    if default_recipient then noop();
    fired {
      raise email event "set_recipient"
        attributes {"recipient": default_recipient, "ruleSet": rs, "id": id}
      if ent:recipient{id}{rs} == null
    }
  }
  
  rule setRecipient {
    select when email set_recipient
    pre {
      recipient = event:attr("recipient");
      rs = event:attr("ruleSet");
      id = event:attr("id");
    }
    always {
      ent:recipient := (ent:recipient == null) => {}.put(id, {}.put(rs, recipient)) |
                     (ent:recipient{id} == null) => ent:recipient.put(id, {}.put(rs, recipient)) |
                     (ent:recipient{id}{rs} == null) => ent:recipient.put([id, rs], recipient) |
                      ent:recipient.set([id,rs], recipient);
    }
  }
  
  rule send_notification {
    select when email notification
    pre {
      id = event:attr("id");
      rs = event:attr("rs");
    }
    event:send({
      "eci": "7jA58wCfVQEY7X56eqVeST", "eid": "email_notification",
      "domain": "email", "type": "notification",
      "attrs": { "recipient": ent:recipient{id}{rs}, "Body": event:attr("Body") }
    })
  }
}

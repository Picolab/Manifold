ruleset io.picolabs.twilio_notifications {
  meta {
    use module io.picolabs.wrangler alias wrangler
    shares __testing, getToPhone, getFromPhone, getToken, getSID
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      //, { "name": "entry", "args": [ "key" ] }
      ] , "events":
      [ //{ "domain": "d1", "type": "t1" }
      //, { "domain": "d2", "type": "t2", "attrs": [ "a1", "a2" ] }
      ]
    }

    getToken = function(id, rs) {
      ent:rs_toToken{id}{rs}
    }

    getSID = function(id, rs) {
      ent:rs_toSID{id}{rs}
    }
    
    getDefaultNumber = function(contacts) {
      default_num = contacts.filter(function(x) {
        (x{"phone"} != null && x{"favorite"} == "true");
      });
      number = default_num.values()[0]{"phone"};
      (number.isnull()) =>  contacts.filter(function(x) {
        ((x{"phone"}.isnull() == false) && x{"phone"}.length() > 1)
      }).values()[0]{"phone"}  | number
    }

    getToPhone = function(id, rs) {
      ent:toPhone{id}{rs}
    }

    getFromPhone = function(id, rs) {
      ent:fromPhone{id}{rs}
    }
  }

  rule setToken {
    select when twilio set_Token
    pre {
      token = event:attr("token");
      rs = event:attr("ruleSet");
      id = event:attr("id");
    }
    always {
      ent:rs_toToken := (ent:rs_toToken == null) => {}.put(id, {}.put(rs, token)) |
                           (ent:rs_toToken{id} == null) => ent:rs_toToken.put(id, {}.put(rs, token)) |
                           (ent:rs_toToken{id}{rs} == null) => ent:rs_toToken.put([id, rs], token) |
                            ent:rs_toToken.set([id,rs], token);
    }
  }

  rule setSID {
    select when twilio set_SID
    pre {
      sid = event:attr("sid");
      rs = event:attr("ruleSet");
      id = event:attr("id");
    }
    always {
      ent:rs_toSID := (ent:rs_toSID == null) => {}.put(id, {}.put(rs, sid)) |
                           (ent:rs_toSID{id} == null) => ent:rs_toSID.put(id, {}.put(rs, sid)) |
                           (ent:rs_toSID{id}{rs} == null) => ent:rs_toSID.put([id, rs], sid) |
                            ent:rs_toSID.set([id,rs], sid);
    }
  }

  rule setDefaultToPhone {
    select when twilio set_default_toPhone
    pre {
      rs = event:attr("rs");
      id = event:attr("id");
      owner_eci = wrangler:parent_eci().klog("parentEci");
      contacts = wrangler:skyQuery(owner_eci, "io.picolabs.profile", "getContacts").klog("contacts")
      default_number = getDefaultNumber(contacts).klog("default_num")

    }
    if default_number then noop();
    fired {
      raise twilio event "set_toPhone"
        attributes {"toPhone": default_number, "ruleSet": rs, "id": id}
      if ent:toPhone{id}{rs} == null
    }
  }

  rule setToPhone {
    select when twilio set_toPhone
    pre {
      phone = event:attr("toPhone");
      rs = event:attr("ruleSet");
      id = event:attr("id");
    }
    always {
      ent:toPhone := (ent:toPhone == null) => {}.put(id, {}.put(rs, phone)) |
                     (ent:toPhone{id} == null) => ent:toPhone.put(id, {}.put(rs, phone)) |
                     (ent:toPhone{id}{rs} == null) => ent:toPhone.put([id, rs], phone) |
                      ent:toPhone.set([id,rs], phone);
    }
  }

  rule setFromPhone {
    select when twilio set_fromPhone
    pre {
      phone = event:attr("fromPhone");
      rs = event:attr("ruleSet");
      id = event:attr("id");
    }
    always {
      ent:fromPhone := (ent:fromPhone == null) => {}.put(id, {}.put(rs, phone)) |
                       (ent:fromPhone{id} == null) => ent:fromPhone.put(id, {}.put(rs, phone)) |
                       (ent:fromPhone{id}{rs} == null) => ent:fromPhone.put([id, rs], phone) |
                       ent:fromPhone.set([id,rs], phone);
    }
  }

  rule notifyThrougTwilio {
    select when twilio notify_through_twilio
    pre {
      rs = event:attr("rs");
      id = event:attr("id");
      toPhone = (ent:toPhone{id}{rs}.isnull() || ent:toPhone{id}{rs} == "") => null | ent:toPhone{id}{rs}
      fromPhone = (ent:fromPhone{id}{rs}.isnull() || ent:fromPhone{id}{rs} == "") => null | ent:fromPhone{id}{rs}
      accountSID = ent:rs_toSID{id}{rs}
      authToken = ent:rs_toToken{id}{rs}
      body = event:attr("Body");
    }
    http:post(<<https://#{accountSID}:#{authToken}@api.twilio.com/2010-04-01/Accounts/#{accountSID}/Messages.json>>, form = {
      "From": fromPhone,
      "Body": body,
      "To": toPhone
    })
  }
}

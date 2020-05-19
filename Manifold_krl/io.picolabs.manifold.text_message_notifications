ruleset io.picolabs.manifold.text_message_notifications {
  meta {
    use module io.picolabs.wrangler alias wrangler
    shares __testing, getToPhone, isVerified
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
    
    isVerified = function(phone) {
      ent:verified >< phone
    }
    html = function(content) {
      <<<!DOCTYPE HTML>
        <html>
        <head>
          <title>Manifold Verification</title>
          <meta charset="UTF-8">
        </head>
        <style>
          body {
          	text-align: center;
          }
          .card {
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            transition: 0.3s;
            display: inline-block;
          }
          .card:hover {
            box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
          }
          .container {
            padding: 2px 16px;
          }
        </style>
        <body>
        #{content}
        </body>
        </html>
      >>
    }
    verifiedPage = function() {
      content = <<
        <div class="container">
          <div class="card">
          	<div class="container">
              <img src="https://manifold.picolabs.io/img/manifold_logo.png" />
            </div>
            <div class="container">
              <h1>Phone Verified!</h1>
              <p>Thank you for using Manifold. Your phone is now ready to receive text notifications through Manifold or any other service provided through Manifold.</p>
            </div>
          </div>
        </div>
      >>;
      html(content)
    };
  }

  rule setDefaultToPhone {
    select when text_messenger set_default_toPhone
    pre {
      rs = event:attr("rs");
      id = event:attr("id");
      owner_eci = wrangler:parent_eci().klog("parentEci");
      contacts = wrangler:skyQuery(owner_eci, "io.picolabs.profile", "getContacts").klog("contacts")
      default_number = getDefaultNumber(contacts).klog("default_num")

    }
    if default_number then noop();
    fired {
      raise text_messenger event "set_toPhone"
        attributes {"toPhone": default_number, "ruleSet": rs, "id": id}
      if ent:toPhone{id}{rs} == null
    }
  }

  rule setToPhone {
    select when text_messenger set_toPhone
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
      raise text_messenger event "start_verification" attributes ({ "phone": phone })
    }
  }
  
  rule startVerification {
    select when text_messenger start_verification
    pre {
      phone = event:attr("phone")
    }
    if not isVerified(phone) then
    event:send({
      "eci": "CqpUcKndBo8xeioWJFQM47", "eid": "email_verification",
      "domain": "text_messenger", "type": "send_verification",
      "attrs": { "toPhone": phone, "eci": meta:eci }
    })
  }
  
  rule receiveVerification {
    select when text_messenger verified
    pre {
      phone = event:attr("phone")
    }
    send_directive("_html", {"content": verifiedPage()})
    fired {
      ent:verified := ent:verified.defaultsTo([]).append(phone).klog("verified")
    }
  }

  rule send_notification {
    select when text_messenger text_notification
    pre {
      id = event:attr("id");
      rs = event:attr("rs");
      thing = event:attr("thing")
    }
    if isVerified(ent:toPhone{id}{rs}) then event:send({
      "eci": "CqpUcKndBo8xeioWJFQM47", "eid": "text_message_notification",
      "domain": "text_messenger", "type": "notification",
      "attrs": { "toPhone": ent:toPhone{id}{rs}, "Body": event:attr("Body"), "thing": thing }
    },  host="https://manifold.picolabs.io:9090")
  }
}

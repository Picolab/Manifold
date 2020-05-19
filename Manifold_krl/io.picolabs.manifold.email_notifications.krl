ruleset io.picolabs.manifold.email_notifications {
  meta {
    shares __testing, getRecipient, isVerified
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
      contacts.klog("contacts");
      default_recipient = contacts.filter(function(x) {
        (x{"email"} != null && x{"favorite"} == "true");
      });
      email = default_recipient.values()[0]{"email"};
      (email.isnull()) => 
      ((contacts{"google"}{"email"}.isnull()) => contacts.filter(function(x) {
        x{"email"} != null
      }).values()[0]{"email"} | contacts{"google"}{"email"}) 
      | email
    }
    
    isVerified = function(email) {
      ent:verified >< email
    }
    isFlagged = function(email) {
      ent:flagged >< email
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
              <h1>Email Verified!</h1>
              <p>Thank you for using Manifold. Your email is now ready to receive notifications through Manifold or any other service provided through Manifold.</p>
            </div>
          </div>
        </div>
      >>;
      html(content)
    };
    
    blockedPage = function() {
      content = <<
        <div class="container">
          <div class="card">
          	<div class="container">
              <img src="https://manifold.picolabs.io/img/manifold_logo.png" />
            </div>
            <div class="container">
              <h1>Email Unsubscribed!</h1>
              <p>Sorry for the inconvenience. You will no longer receive any emails from us</p>
            </div>
          </div>
        </div>
      >>;
      html(content)
    };
  }
  
  rule setDefaulRecipient {
    select when email set_default_recipient 
    pre {
      rs = event:attr("rs");
      id = event:attr("id");
      owner_eci = wrangler:parent_eci().klog("parentEci");
      contacts = wrangler:skyQuery(owner_eci, "io.picolabs.profile", "getContacts").klog("contacts")
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
      raise email event "start_verification" attributes ({"email": recipient})
    }
  }
  
  rule saveVerifiedEmail {
    select when email save_verified_email
    pre {
      email = event:attr("email")
    }
    if not isVerified(email) then noop() 
    fired {
      ent:verified := ent:verified.defaultsTo([]).append(email)
    }
  }
  
  rule startVerification {
    select when email start_verification
    pre {
      email = event:attr("email")
    }
    if not isFlagged(email) && not isVerified(email) then
    event:send({
      "eci": "7jA58wCfVQEY7X56eqVeST", "eid": "email_verification",
      "domain": "email", "type": "send_verification",
      "attrs": { "recipient": email, "eci": meta:eci }
    })
  }
  
  rule receiveVerification {
    select when email verified or email subscribed
    pre {
      email = event:attr("email")
      flagged = ent:flagged.defaultsTo([]).filter(function(x) { x != email });
    }
    send_directive("_html", {"content": verifiedPage()})
    fired {
      ent:flagged := flagged;
      ent:verified := ent:verified.defaultsTo([]).append(email) if not isVerified(email)
    }
  }
  
  rule blockEmail {
    select when email blocked
    pre {
      email = event:attr("email")
      verified = ent:verified.defaultsTo([]).filter(function(x) { x != email });
    }
    send_directive("_html", {"content": blockedPage()})
    fired {
      ent:flagged := ent:flagged.defaultsTo([]).append(email) if not isFlagged(email);
      ent:verified := verified
    }
  }
  
  rule send_notification {
    select when email notification
    pre {
      id = event:attr("id");
      rs = event:attr("rs");
      thing = event:attr("thing")
      recipient = ent:recipient{id}{rs};
    }
    if not isFlagged(recipient) && isVerified(recipient) then event:send({
      "eci": "7jA58wCfVQEY7X56eqVeST", "eid": "email_notification",
      "domain": "email", "type": "notification",
      "attrs": { "recipient": recipient, "Body": event:attr("Body"), "thing": thing }
    })
  }
}

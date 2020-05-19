ruleset io.picolabs.manifold.text_messenger {
  meta {
    shares __testing
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      //, { "name": "entry", "args": [ "key" ] }
      ] , "events":
      [ {"domain": "text_messenger", "type": "set_account_sid", "attrs":["sid"]}, 
        {"domain": "text_messenger", "type": "set_auth_token", "attrs":["token"]},
        {"domain": "text_messenger", "type": "set_twilio_number", "attrs":["number"]},
        {"domain": "text_messenger", "type": "notification", "attrs":["toPhone", "Body"]}
      //{ "domain": "d1", "type": "t1" }
      //, { "domain": "d2", "type": "t2", "attrs": [ "a1", "a2" ] }
      ]
    }
    
  }
  
  rule setTwilioAccountSID {
    select when text_messenger set_account_sid
    pre {
      sid = event:attr("sid")
    }
    always {
      ent:twilioSID := sid
    }
  }
  
  rule setTwilioAuthToken {
    select when text_messenger set_auth_token
    pre {
      token = event:attr("token")
    }
    always {
      ent:twilioAuthToken := token
    }
  }
  
  rule setTwilioNumber {
    select when text_messenger set_twilio_number
    pre {
      number = event:attr("number")
    }
    always {
      ent:twilioNumber := number
    }
  }
  
  rule send_verification {
    select when text_messenger send_verification
    pre {
      body =  <<To verify this number click on this link: #{meta:host}/sky/event/#{event:attr("eci")}/phone_verification/text_messenger/verified?phone=#{event:attr("toPhone")}>>
    }
    every {
      http:post(<<https://#{ent:twilioSID}:#{ent:twilioAuthToken}@api.twilio.com/2010-04-01/Accounts/#{ent:twilioSID}/Messages.json>>, form = {
        "From": ent:twilioNumber,
        "Body": body,
        "To": event:attr("toPhone")
      }) setting(resp)
      send_directive("phone_response", resp)
    }
  }
  
  rule notifyThrougTwilio {
    select when text_messenger notification
    pre {
      toPhone = event:attr("toPhone");
      body = event:attr("Body");
      header = (event:attr("thing")) => "Notification from " + event:attr("thing") + ": " | null
    }
    every {
      http:post(<<https://#{ent:twilioSID}:#{ent:twilioAuthToken}@api.twilio.com/2010-04-01/Accounts/#{ent:twilioSID}/Messages.json>>, form = {
        "From": ent:twilioNumber,
        "Body": header + body,
        "To": toPhone
      }) setting(resp)
      send_directive("resp", resp)
    }
  }
}

ruleset io.picolabs.manifold.pico_mailer {
  meta {
    shares __testing
    
    use module io.picolabs.gmail.credential alias google
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      //, { "name": "entry", "args": [ "key" ] }
      ] , "events":
      [ { "domain": "google", "type": "refresh_token" }
      , { "domain": "email", "type": "connect", "attrs": [ "username", "password" ]}
      , { "domain": "email", "type": "notification", "attrs": [ "recipient", "Body" ] }
      ]
    }
    url = "https://developers.google.com/oauthplayground/refreshAccessToken"
    token_uri = "https://www.googleapis.com/oauth2/v4/token"
    access_token = ent:access_token
  }
  rule refresh_token {
    select when google refresh_token
    every {
      http:post(url, json = {
        "client_id": keys:google{"client_id"},
        "client_secret": keys:google{"client_secret"},
        "refresh_token": keys:google{"refresh_token"},
        "token_uri": token_uri
      }) setting(response);
      send_directive("response", response{"content"}.decode())
    }
      
    fired {
      ent:access_token := response{"content"}.decode(){"access_token"} 
        if not response{"content"}.decode(){"error"}
    }
  }
  rule connect {
    select when email connect or system online
    pre {
      username = event:attr("username") || "picolabsbyu@gmail.com"
      password = event:attr("password")
      options = { "auth": {
        "type": "OAuth2",
        "user": username,
        "clientId": keys:google{"client_id"},
        "clientSecret": keys:google{"client_secret"},
        "refreshToken": keys:google{"refresh_token"},
        "accessToken": ent:accessToken,
      }}
    }
    every {
      email:connect(username, password, options) setting(resp)
      send_directive("response", resp)
    }
    fired {
      ent:isConnected := resp{"isConnected"}
    }
  }
  rule send_verification {
    select when email send_verification
    pre {
      content = <<
        <div style="text-align: center; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s; display: inline-block; color: black;">
          <div style="padding: 2px 16px;">
              <img src="https://manifold.picolabs.io/img/manifold_logo.png" />
          </div>
          <p>Thank you for using Manifold! Click on the button below to verify your email!</p>
          <div>
            <a style="display: inline-block; border-radius: 12px; background-color: #87cefa; border: none; color: #FFFFFF; text-align: center; font-size: 28px; padding: 10px; width: 150px; transition: all 0.5s; cursor: pointer; margin: 5px; text-decoration: none;" 
            href=#{meta:host}/sky/event/#{event:attr("eci")}/email_verification/email/verified?email=#{event:attr("recipient")}>
              Verify
            </a>
          </div>
          <br/>
          <p>If you did not initiate this verification email and wish to never receive emails from us click 
            <a href=#{meta:host}/sky/event/#{event:attr("eci")}/report_spam/email/blocked?email=#{event:attr("recipient")}>
              unsubscribe
            </a>
          </p>
          <p>If you previously unsubscribed but now wish to receive emails from us click 
            <a href=#{meta:host}/sky/event/#{event:attr("eci")}/subscribe/email/subscribed?email=#{event:attr("recipient")}>
              subscribe
            </a>
          </p>
        </div>
      >>
      message = {
        "from": "picolabsbyu@gmail.com",
        "to": event:attr("recipient"),
        "subject": "Manifold Email Verification",
        "html": content
      };
    }
    every {
      email:send(message) setting(resp)
      send_directive("email_response", resp)
    }
    fired {
      raise email event "refresh_and_reconnect" 
        attributes { "message": message }
        if resp{"rejected"}.length() > 0
    } else {
      raise email event "refresh_and_reconnect" 
        attributes { "message": message }
    }
  }
  rule check_connection {
    select when email notification
    if ent:isConnected then noop()
    fired {
      raise email event "send_notification" attributes(event:attrs)
    }
    else {
      raise email event "connect";
      raise email event "send_notification" attributes(event:attrs)
    }
  }
  rule send_notification {
    select when email send_notification
    pre {
      header = (event:attr("thing")) => "Notification from " + event:attr("thing") | null
      message = {
        "from": "picolabsbyu@gmail.com",
        "to": event:attr("recipient"),
        "subject": "Manifold Notification",
        "text": event:attr("Body"),
        "html": << 
          <div>
            <div style="padding: 2px 16px;">
                <img src="https://manifold.picolabs.io/img/manifold_logo.png" />
            </div>
            <p style="color: black;" >#{header}</p>
            <p style="color: black;" >#{event:attr("Body")}</p>
          </div>
          >>
      };
    }
    every {
      email:send(message) setting(resp)
      send_directive("email_response", resp)
    }
    fired {
      raise email event "refresh_and_reconnect" 
        attributes { "message": message }
        if resp{"rejected"}.length() > 0
    }
  }
  rule refresh_and_reconnect {
    select when email refresh_and_reconnect 
    fired {
      raise email event "refresh";
      raise email event "connect" attributes { "username": "picolabsbyu@gmail.com" };
      raise email event "resend" attributes { "message": event:attr("message") }
    }
  }
  rule resend {
    select when email resend
    every {
      email:send(event:attr("message")) setting(resp)
      send_directive("retry_response", resp)
    }
  }
}

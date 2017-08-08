ruleset io.picolabs.account_management {
  meta {
    shares __testing
    use module io.picolabs.wrangler alias wrangler
  }
  global {
    __testing = { "queries": [ { "name": "__testing" } ],
                  "events": [ { "domain": "owner", "type": "login",
                                "attrs": [ "name", "password" ] },
                              { "domain": "owner", "type": "creation",
                                "attrs": [ "name", "password" ] } ] }

    nameExists = function(ownername){
      ent:owners.defaultsTo({}) >< ownername
    }
    //returns true if credentials are valid
    loginAttempt = function(name, password){
      _password = ent:owners.defaultsTo({}){name}{"password"}; // this is where you could decrypt a stored encrypted password
      _password == password
    }
  }
//
//New owner account registration and management


  rule create_owner{
    select when owner creation
    pre{
      name = event:attr("name");
      password = event:attr("password");
      exists = nameExists(name);
    }
    if not exists then // may need to check pico name uniqueness
      send_directive("Creating owner", {"ownername":name});

    fired{
      raise wrangler event "new_child_request"
        attributes event:attrs().put({"event_type":"account","rids":"io.picolabs.child_login"});
    }
    else{
      raise owner event "creation_failure"
        attributes event:attrs();
    }
  }

  rule owner_name_taken{
    select when owner creation_failure
    pre{}
    send_directive("ownername taken",{"ownername": event:attr("name")});
  }

  rule owner_token{
    select when owner token_created event_type re#account#
    pre{
      a=event:attrs().klog("all attrs: ")
      rs_attrs = event:attr("rs_attrs"){"rs_attrs"};
      new_owner = {"password":rs_attrs{"password"},"token": event:attr("eci")}
    }
    fired{
      ent:owners := ent:owners.defaultsTo({}).put(rs_attrs{"name"}, new_owner);
    }
  }

//////// Login Rules
  rule login{
    select when owner login
    pre{
      name = event:attr("name").defaultsTo("");
      password = event:attr("password").defaultsTo("");
      validPass = loginAttempt(name,password);
    }
    if validPass then every{
      // create new eci
      send_directive("Obtained Token",{"Token": event:attr("name")});

    }
  }

  rule login_success{
    select when wrangler channel_created where rs_attrs{"event_type"} == "account"
      send_directive("Logged In",{"eci": event:attr("eci")});
  }
}

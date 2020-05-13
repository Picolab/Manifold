ruleset io.picolabs.profile {
  meta {
    shares __testing, getProfile, getOther, getSection, availableSection, unFavAll, getContacts
    use module io.picolabs.wrangler alias wrangler
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }, {"name": "unFavAll"}, {"name": "getContacts"}
      , { "name": "getOther" }
      ] , "events":
      [ {"domain": "profile", "type": "other_profile_save", "attrs": ["service", "contact"]}//{ "domain": "d1", "type": "t1" }
      //, { "domain": "d2", "type": "t2", "attrs": [ "a1", "a2" ] }
      ]
    }

    getProfile = function() {
      ent:profile
    }

    getOther = function() {
      ent:other
    }
    
    getContacts = function() {
      other = getOther();
      profile = getProfile();
      contacts = other.put(profile.keys()[0], profile{profile.keys()[0]});
      contacts
    }

    getSection = function(section) {
      ent:other{section.lc()}
    }

    availableSection = function(section) {
       (ent:other.isnull()) => true | (ent:other{section.lc()} != null) => false | true
    }

    unFavAll = function() {
      noFavs = ent:other.map(function(x) {
        x.set("favorite", "false")
      });
      noFavs
    }
    
    getManifoldPico = function() {
      wrangler:children().filter(function(x) {
        x{"name"} == "Manifold"
      })[0]
    }
    verifyEmail = defaction(email) {
      manifoldPico = getManifoldPico();
      event:send({
        "eci": manifoldPico{"eci"}, 
        "eid": "initialize_verification",
        "domain": "email",
        "type": "start_verification",
        "attrs": {"email": email}
      })
    }
    verifyPhone = defaction(phone) {
      manifoldPico = getManifoldPico();
      event:send({
        "eci": manifoldPico{"eci"}, 
        "eid": "initialize_verification",
        "domain": "text_messenger",
        "type": "start_verification",
        "attrs": {"phone": phone}
      })
    }
    verifyBoth = defaction(email, phone) {
      every {
        verifyEmail(email)
        verifyPhone(phone)
      }
    }
  }

  rule save_google_profile {
    select when profile google_profile_save
    pre {
      profile = event:attr("profile")
      googleProfile = {
        "displayName" : profile["ig"],
        "firstName" : profile["ofa"],
        "lastName" : profile["wea"],
        "profileImgURL" : profile["Paa"],
        "email" : profile["U3"],
      }
    }
    if event:attr("profile") then 
    event:send({
      "eci": getManifoldPico(){"eci"},
      "eid": "google_verified",
      "domain": "email",
      "type": "save_verified_email",
      "attrs": {"email": profile["U3"]}
    });
    fired {
      ent:profile := ent:profile.defaultsTo({}).put("google", googleProfile);
    }
  }

  rule set_google_favorite {
    select when profile google_set_fav
    always {
      ent:profile{["google","favorite"]} := ent:profile{["google","favorite"]}.defaultsTo("false")
      if not ent:profile{"google"}.isnull();
    }
  }


  rule save_github_profile {
    select when profile github_profile_save
    pre {
      profile = event:attrs{"profile"}
      githubProfile = {
        "displayName": profile["displayName"],
        "name": profile["name"],
        "profileImgURL": profile["profileImgURL"],
        "email": profile["email"]
      }
    }
    if event:attrs{"profile"} then 
    event:send({
      "eci": getManifoldPico(){"eci"},
      "eid": "github_verified",
      "domain": "email",
      "type": "save_verified_email",
      "attrs": {"email": profile["email"]}
    });
    fired {
      ent:profile := ent:profile.defaultsTo({}).put("github", githubProfile);
    }
  }
  
  rule set_github_favorite {
    select when profile github_set_fav
    always {
      ent:profile{["github","favorite"]} := ent:profile{["github","favorite"]}.defaultsTo("false")
      if not ent:profile{"github"}.isnull();
    }
  }

  rule save_other_profile {
    select when profile other_profile_save
    pre {
      section = event:attr("section").klog("section").lc()
      contacts = event:attrs.delete("section").decode().filter(function(v,k) {
        v != "" && v != "undefined"
      }).klog("contacts")
      action = (contacts{"email"} && contacts{"phone"}) => "both"
              | contacts{"email"} => "email"
              | contacts{"phone"} => "phone"
              | "none"
    }
    if section then choose action.klog("action") {
      both => verifyBoth(contacts{"email"}, contacts{"phone"})
      email => verifyEmail(contacts{"email"})
      phone => verifyPhone(contacts{"phone"})
      none => noop()
    }
    fired {
      ent:other := ent:other.defaultsTo({}).put(section, contacts);
    }
  }

  rule remove_other_profile {
    select when profile other_profile_remove
    pre {
      section = event:attr("section").lc()
    }
    if section then noop()
    fired {
      ent:other := ent:other.delete(section).klog("delete");
    }
  }

  rule change_favorite_other_profile {
    select when profile other_profile_change_favorite
    pre {
      section = event:attr("section").lc()
      value = event:attr("value")
    }
    if (ent:profile{section}.isnull()) then noop()
    fired {
      ent:other := unFavAll();
      ent:other := ent:other.set([section, "favorite"], value);
      ent:profile := ent:profile.set(["google", "favorite"], "false").klog("profile")
      if not ent:profile{"google"}.isnull();
      ent:profile := ent:profile.set(["github", "favorite"], "false").klog("profile")
      if not ent:profile{"github"}.isnull();
    }
    else {
      ent:other := (ent:other.isnull()) => {} | unFavAll();
      ent:profile := ent:profile.set(["google", "favorite"], value).klog("profile")
      if not ent:profile{"google"}.isnull();
      ent:profile := ent:profile.set(["github", "favorite"], value).klog("profile")
      if not ent:profile{"github"}.isnull();
    }
  }


}

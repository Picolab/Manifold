ruleset io.picolabs.profile {
  meta {
    shares __testing, getProfile, getOther, getSection, availableSection, unFavAll
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }, {"name": "unFavAll"}
      //, { "name": "entry", "args": [ "key" ] }
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
    
    getSection = function(section) {
      ent:other{section.lc()}
    }
    
    availableSection = function(section) {
      (ent:other{section.lc()} != null) => false | true
    }
    
    unFavAll = function() {
      noFavs = ent:other.map(function(x) {
        x.set("favorite", "false")
      });
      noFavs
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
        "favorite" : "true"
      }
    }
    if event:attr("profile") then noop();
    fired {
      ent:profile := ent:profile.defaultsTo({}).put("google", googleProfile);
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
    if event:attrs{"profile"} then noop()
    fired {
      ent:profile := ent:profile.defaultsTo({}).put("github", githubProfile);
    }
  }
  
  rule save_other_profile {
    select when profile other_profile_save
    pre {
      section = event:attr("section").klog("section").lc()
      service = event:attr("service").klog("service")
      contacts = event:attrs.delete("section")
    }
    if section then noop()
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
    if section != "google" then noop()
    fired {
      ent:other := unFavAll();
      ent:other := ent:other.set([section, "favorite"], value);
      ent:profile := ent:profile.set(["google", "favorite"], "false").klog("profile")
    }
    else {
      ent:other := unFavAll();
      ent:profile := ent:profile.set(["google", "favorite"], value).klog("profile")
    }
  }
  
  
}

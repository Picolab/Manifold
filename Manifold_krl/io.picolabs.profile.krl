ruleset io.picolabs.profile {
  meta {
    shares __testing, getProfile
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
    
    getProfile = function() {
      ent:profile
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
        "email" : profile["U3"]
      }
    }
    if event:attr("profile") then noop();
    fired {
      ent:profile := {}.put("google", googleProfile);
    }
  }
}

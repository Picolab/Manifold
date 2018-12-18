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
      ent:profile := ent:profile.defaultsTo({}).put("google", googleProfile);
    }
  }

  rule save_github_profile {
    select when profile github_profile_save
    pre {
      profile = event:attrs{"profile"}
      githubProfile = {
        "displayName": profile["login"],
        "name": profile["name"],
        "profileImgURL": profile["avatar_url"],
        "email": profile["email"]
      }
    }
    if event:attrs{"profile"} then noop()
    fired {
      ent:profile := ent:profile.defaultsTo({}).put("github", githubProfile);
    }
  }
}

ruleset io.github.picolab.manifold_disk {
  meta {
    shares __testing
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      ], "events":
      [ { "domain": "disk_space_recorder", "type": "new_url", "attrs": ["url"] }
      ]
    }
  }
  rule set_up_url {
    select when disk_space_recorder new_url url re#^(http.*)# setting(url)
    fired {
      ent:url := url;
      ent:urlInEffectSince := time:now()
    }
  }
  rule record_disk_space {
    select when disk_space:update
      fs re#^(/dev/xvda1)$#
      size re#^(\d+)$#
      used re#^(\d+)$#
      avail re#^(\d+)$#
      setting(fs,size,used,avail)
    pre {
      date = event:attr("date")
      data = {
        "date": date,
        "fs": fs,
        "size": size,
        "used": used,
        "avail": avail
      }
    }
    http:post(ent:url,qs=data) setting(response)
    fired {
      ent:lastData := data;
      ent:lastResponse := response;
      raise disk_space_recorder event "recorded_to_sheet" attributes data
    }
  }
}

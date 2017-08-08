ruleset io.picolabs.manifold_owner {
  meta {
    use module io.picolabs.wrangler alias wrangler
    shares __testing, getManifoldPico
  }
  global {
    __testing =
      { "queries": [ { "name": "__testing", "name":"getManifoldPico" } ],
        "events": [ { "domain": "manifold", "type": "channel_needed",
                      "attrs": [ "eci_to_manifold_child" ] } ,
                    { "domain": "wrangler", "type": "ruleset_added",
                      "attrs": [  ] }
                   ] }

    config={"pico_name" : "Manifold", "URI" : ["io.picolabs.manifold_pico.krl"], "rids": ["io.picolabs.manifold_pico"]};

    getManifoldPico = function(){
      child = wrangler:children(config{"pico_name"}){"children"};
      child.length() > 0 =>  child[0] | "No Manifold Pico"
    }

  }

  rule channel_needed {
    select when manifold channel_needed
    pre {
      child = getManifoldPico();
    }
    if child then every {
      engine:newChannel(child.id,config{"pico_name"},"App") // look up how to pass parameters
        setting(new_channel)
      send_directive("manifold new channel",{
        "eci": new_channel.id.klog("new eci created:")})
    }
  }

  rule initialization {
    select when wrangler ruleset_added where rids.klog("rids") >< meta:rid.klog("meta rid")
    pre {
      manifoldPico =  getManifoldPico()
    }
    if manifoldPico == "No Manifold Pico" then
      engine:registerRuleset(config{"URI"}[0].klog("URI used:"),meta:rulesetURI.klog("Path used"))
    fired {
      raise wrangler event "child_creation" // HEY HEY!!!! check event api
        attributes { "name": config{"pico_name"}, "color": "#7FFFD4", "rids": config{"rids"} } // check child creation api
    }
  }

}

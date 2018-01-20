ruleset io.picolabs.collection {
  meta {
    use module io.picolabs.wrangler alias wrangler
    shares __testing, getManifoldInfo
    //provides 
  }
  global {
    __testing =
      { "queries": [ { "name": "__testing", "name":"getManifoldPico" },
                     { "name": "__testing", "name":"getManifoldInfo" }],
        "events": [ { "domain": "manifold", "type": "create_thing",
                      "attrs": [ "name" ] } ] }

  }


  rule initialization {
    select when wrangler ruleset_added where rids.klog("rids") >< meta:rid.klog("meta rid")
    pre{}
    noop()
    fired{
    }
  }

  rule addThingToCollection {
    select when manifold thing_added_to_collection
    pre {}
    noop()
    fired{
      raise wrangler event "subscription" 
        attributes {"Rx_role"     : "manifold_master",
                    "Tx_role"     : "manifold_slave",
                    "wellKnown_Tx": event:attr("wellKnown_Tx");//wrangler:skyQuery( eci , "io.picolabs.subscription", "wellKnown_Rx"){"id"},
                    "channel_type": "Manifold_collection",
                    "Tx_Rx_Type"  : "Manifold" };//auto accepted
    }
  }

  // remove thing from collection


  rule installCollectionRulesets {
    select when manifold install_collection
    pre {}
    noop()
    fired{
      raise wrangler event "install_rulesets_requested"
        attributes event:attrs();
    }
  }
ruleset io.picolabs.manifold_pico {
  meta {
    use module io.picolabs.wrangler alias wrangler
    shares __testing
  }
  global {
    __testing =
      { "queries": [ { "name": "__testing", "name":"getManifoldPico" } ],
        "events": [ { "domain": "manifold", "type": "channel_needed",
                      "attrs": [ "eci_to_manifold_child" ] } ] }

  }

  rule createThing {
    select when manifold create_thing
    pre {}
    if true then every {
      noop()
    }
  }
}

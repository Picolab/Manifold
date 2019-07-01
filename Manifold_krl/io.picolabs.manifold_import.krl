ruleset io.picolabs.manifold_import {
  meta {
    use module io.picolabs.wrangler alias wrangler
    use module io.picolabs.manifold_pico alias manifold
    shares __testing, getRegistered, getNames, getThingsToTag
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      , { "name": "getRegistered", "args": [ "prefix" ] }
      , { "name": "getNames", "args": [ "prefix", "csv" ] }
      , { "name": "getThingsToTag", "args": [ "tag_prefix", "prefix", "csv" ] }
      ] , "events":
      [ { "domain": "d1", "type": "t1" }
      , { "domain": "import", "type": "new_csv_file", "attrs": [ "prefix", "csv" ] }
      ]
    }
    startsWith = function(s,p){
      s.length() >= p.length()
      && s.substr(0,p.length()) == p
    }
    getRegistered = function(prefix){
      allThings = manifold:getThings();
      prefix => allThings.filter(function(v,k){v{"name"}.startsWith(prefix)})
              | allThings
    }
    getNames = function(prefix,csv){
      newline = (13.chr() + "?" + 10.chr()).as("RegExp");
      parse = function(line){
        prefix + line.extract(re#^[^,]*,[^,]*,([^,]*)#)[0]
      };
      csv
        .split(newline)
        .tail()
        .filter(function(s){s})
        .map(parse)
    }
    nameAsTagID = function(name,tag_prefix,prefix){
      pattern = (prefix + "(..:..:..)$").as("RegExp");
      tag_prefix + name.extract(pattern).head().replace(re#:#g,"")
    };
    getTxs = function(prefix){
      getRegistered(prefix)
        .values()
        .collect(function(v){v{"name"}})
        .map(function(v){v.head(){"Tx"}});
    }
    getThingsToTag = function(tag_prefix,prefix,csv){
      Txs = getTxs(prefix);
      getTagIDs = function(name){
        wrangler:skyQuery(Txs{name},"io.picolabs.safeandmine","getTags")
      };
      getNames(prefix,csv)
        .collect(function(v){v})
        .filter(function(v,k){not (getTagIDs(k) >< k.nameAsTagID(tag_prefix,prefix))})
        .map(function(v,k){Txs{k}})
    }
  }
  rule check_import_parameters {
    select when import new_csv_file
    pre {
      prefix = event:attr("prefix")
      exist = getRegistered(prefix).values().map(function(v){v{"name"}})
      csv = event:attr("csv")
      names = getNames(prefix,csv).difference(exist)
    }
    send_directive("names",{"names":names, "csv": csv})
    fired {
      raise import event "given_names" attributes { "names": names }
    }
  }
  rule create_things_given_names {
    select when import given_names
    foreach event:attr("names") setting(v)
    fired {
      raise manifold event "create_thing" attributes {"name":v}
    }
  }
  rule check_tagging_parameters {
    select when import tags_needed
    pre {
      tag_prefix = event:attr("tag_prefix")
      prefix = event:attr("prefix")
      csv = event:attr("csv")
      thingsToTag = getThingsToTag(tag_prefix,prefix,csv)
    }
    send_directive("preparing to tag",{"thingsToTag": thingsToTag})
    fired {
      raise import event "ready_to_tag"
        attributes event:attrs.put({"thingsToTag": thingsToTag})
    }
  }
  rule proceed_to_tag {
    select when import ready_to_tag
    foreach event:attr("thingsToTag") setting(v,k)
    pre {
      tag_prefix = event:attr("tag_prefix")
      prefix = event:attr("prefix")
      tagID = nameAsTagID(k,tag_prefix,prefix)
    }
    every {
      send_directive("tagging",{"name":k,"tagID":tagID,"Tx":v})
      event:send({"eci": v, "domain": "safeandmine", "type": "new_tag",
        "attrs": {"tagID":tagID}
      })
    }
  }
  rule prepare_distribution {
    select when import distribution_request
    pre {
      prefix = event:attr("prefix")
      Txs = getTxs(prefix)
    }
    send_directive("preparing to distribute",{"Txs": Txs,"count":Txs.values().length()})
    fired {
      raise import event "ready_to_distribute"
        attributes event:attrs.put({"Txs": Txs})
    }
  }
  rule perform_distribution {
    select when import ready_to_distribute
    foreach event:attr("Txs") setting(v,k)
    every {
      send_directive("updating",{"name":k,"Tx":v})
      event:send({"eci": v, "domain": "safeandmine", "type": "update",
        "attrs": event:attrs
      })
    }
  }
}

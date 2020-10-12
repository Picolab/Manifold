ruleset io.picolabs.community {
  meta {
    use module io.picolabs.wrangler alias wrangler
    use module io.picolabs.subscription alias subscription
    shares __testing, getThings, getPublishedIntents, getCommunityMembers, removeDuplicates
  }
  global {
    __testing = { "queries":
      [ { "name": "getThings", "args": ["domain", "type"] },
        { "name": "getPublishedIntents" },
        { "name": "removeDuplicates" },
        { "name": "getCommunityMembers" }
      ] , "events":
      [ { "domain": "community", "type": "add_to_community", "attrs": [ "eci", "picoID" ] }
      , { "domain": "community", "type": "remove_from_community", "attrs": [ "picoID" ] }
      , { "domain": "community", "type": "request_promise", "attrs": [ "domain", "type" ] }
      ]
    }

    initiate_subscription = defaction(eci, channel_name, wellKnown, picoID, optionalHost = meta:host) {
      every{
        event:send({
          "eci": eci, "eid": "subscription",
          "domain": "wrangler", "type": "subscription",
          "attrs": {
                   "picoID"     : picoID,
                   "Rx_role"     : "Community_Thing",
                   "Tx_role"     : "Community_Community",
                   "Tx_Rx_Type"  : "Community_Invitation" , // auto_accept
                   "channel_type": "Community",
                   "wellKnown_Tx": wellKnown, //this should by best practice be the parent's or the pico being requested's wellknown eci
                   "Tx_host"     : meta:host } //allow cross engine subscriptions
        }, host = optionalHost)
      }
    }

    getPublishedIntents = function() {
      intents = ent:publishedIntents.defaultsTo({}).values().reduce(function(a,b){a.append(b)}).reduce(function(a,b) {
        (a >< b) => a | a.append(b);
      });
      (intents.typeof() == "Map") => [intents] | (intents.typeof() == "Array") => removeDuplicates(intents) | []
    }

    removeDuplicates = function(intents) {
      intents.map(function(x) {
        x.encode()
      }).reduce(function(a, b) {
        (a.typeof() == "Array" && not (a >< b)) => a.append(b) | b
      }).map(function(x) {
        x.decode()
      })
    }

    getThings = function(domain, type) {
      ent:publishedIntents.defaultsTo({}).filter(function(v, k){
        v.filter(function(x){
          x{"domain"} == domain && x{"type"} == type
        }).length() != 0
      }).keys()
    }

    getCommunityMembers = function() {
      eci = subscription:established().filter(function(x) {
        x{"Tx_role"} == "manifold_pico"
      }).head(){"Tx"};
      resp = http:get(<<#{meta:host}/sky/cloud/#{eci}/io.picolabs.manifold_pico/getManifoldInfo>>){"content"}.decode();
      all = resp{"things"}.put(resp{"communities"}).map(function(x) {
        {
          "name": x{"name"},
          "icon": x{"icon"},
          "picoID": x{"picoID"}
        }
      });
      ent:things.keys().map(function(x) {
        all.get(x)
      })
    }

    app = {"name":"communities","version":"0.0"/* img: , pre: , ..*/};
    bindings = function(){
      {
        //currently no bindings
      };
    }
  }

  rule discovery { select when manifold apps send_directive("app discovered...", {"app": app, "rid": meta:rid, "bindings": bindings(), "iconURL": "https://image.flaticon.com/icons/svg/977/977910.svg"} ); }

  rule accept_intent {
    select when community accept_intent

    pre {
      intent = event:attr("intents").klog("INTENT");
    }

    always {
      ent:publishedIntents := ent:publishedIntents.defaultsTo({}).put(intent)
    }

  }

  rule add_to_community {
    select when community add_to_community

    pre {
      eci = event:attr("eci");
      picoID = event:attr("picoID");
      host = event:attr("host").defaultsTo(meta:host);
    }

    if eci && picoID && ent:things.get([picoID]).isnull() then
    initiate_subscription(eci, event:attr("name"), subscription:wellKnown_Rx(){"id"}, picoID, host);
  }

  rule trackSubscription {
    select when wrangler subscription_added where Tx_role == "Community_Thing"
    pre {
      subID = event:attr("Id").klog("SUBID");
      picoID = event:attr("picoID").klog("PICOID");
      obj_structure = {
        "subID": subID,
        "picoID": picoID
      }
    }
    if subID && picoID && picoID != meta:picoId then
      send_directive("Tracking subscription", { "info": obj_structure })
    fired {
      ent:things := ent:things.defaultsTo({}).put(picoID, obj_structure);
    }
  }

  rule remove_from_community {
    select when community remove_from_community

    pre {
      picoID = event:attr("picoID");
      subID = ent:things.get([picoID, "subID"]);
    }

    if subID && picoID then noop();

    fired {
      raise wrangler event "subscription_cancellation"
        attributes {"Id": subID, "picoID": picoID, "event_type": "thing_deletion"}
    }
  }

  rule removed_from_community {
    select when wrangler subscription_removed where picoID

    always {
      clear ent:publishedIntents
      ent:things := ent:things.delete([ event:attr("picoID") ])
      raise community event "request_publish_intent"
    }
  }

  rule established_removal {
    select when wrangler established_removal where id

    always {
      clear ent:publishedIntents
      ent:things := ent:things.delete([ event:attr("id") ])
      raise community event "request_publish_intent"
    }
  }

  rule autoAccept {
    select when wrangler inbound_pending_subscription_added where Tx_Rx_Type == "Community_Invitation"

    always{
      raise wrangler event "pending_subscription_approval"
          attributes event:attrs
    }
  }

  rule request_promise_thing {
    select when community request_promise where event:attr("domain") && event:attr("type")

    foreach getThings(event:attr("domain"), event:attr("type")) setting (eci)
    pre {
      tid = event:attr("tid").defaultsTo(random:uuid())
    }
    if not (ent:tids >< tid) then
    event:send({"eci": eci, "domain": event:attr("domain"), "type": event:attr("type"), "attrs": event:attrs})

    fired {
      ent:tids := ent:tids.defaultsTo([]).append(tid)
    }

  }

  rule request_promise_community {
    select when community request_promise where event:attr("domain") && event:attr("type")

    foreach getThings(event:attr("domain"), event:attr("type")) setting (eci)
    pre {
      tid = event:attr("tid").defaultsTo(random:uuid())
    }
    if not (ent:tids >< tid) then
    event:send({"eci": eci, "domain": "community", "type": "request_promise", "attrs": event:attrs})
    fired {
      ent:tids := ent:tids.defaultsTo([]).append(tid)
    }

  }

  rule publish_intents {
    select when community publish_intent

    foreach subscription:established().filter(function(x){x{"Tx_role"} == "Community"}) setting (x)

     pre {
       toSend = {}.put(x{"Rx"},getPublishedIntents());
     }

     event:send({"eci": x{"Tx"}, "domain": "community", "type": "accept_intent", "attrs": { "intents" : toSend }})
  }

  rule request_publish_intents {
    select when community request_publish_intent

    foreach subscription:established().filter(function(x){x{"Tx_role"} == "Thing"}) setting (x)
      event:send({"eci": x{"Tx"}, "domain": "community", "type": "publish_intent"});
  }

  rule rs_added {
    select when wrangler ruleset_added

    always {
      raise community event "publish_intent"
    }
  }

}

ruleset io.picolabs.tag_registry {
  meta {
    name "Tag Registry" //tag meaning QR codes
    description <<
      This registry ruleset allows developers to register QR codes in a globally available location; this allows anyone who scans that tag to
      reach this pico and be redirected to a SPA (Single Page Application). This SPA is custom set when a tag is first registered and may be
      updated at any time. The SPA will handle all interesting things. This registry pico is therefore just a router from initial scan to the
      determined SPA.
    >>
    author "BYU Pico Labs"

    shares __testing, isTagRegistered, buildSpaRedirectURL, tagRegistry//tagRegistry is used for testing only... remove from production
  }
  global {
    __testing = { "queries":
      [
        { "name": "__testing" },
        { "name": "tagRegistry" },
        { "name": "buildSpaRedirectURL", "args": [ "tagID", "devDomain" ] },
        { "name": "isTagRegistered", "args": [ "tagID", "devDomain" ] }
      ] , "events":
      [
       { "domain": "registry", "type": "tag_scanned", "attrs": [ "devDomain", "tagID" ] },
       { "domain": "registry", "type": "new_tag", "attrs": [ "devDomain", "tagID", "spaHost", "spaPort", "DID", "appName", "hashRouter" ] },
       { "domain": "registry", "type": "unneeded_tag", "attrs": [ "devDomain", "tagID" ] },
       { "domain": "redirect", "type": "test", "attrs": [  ] }
      ]
    }

    /* REGISTRY_STRUCTURE ent:tagRegistry
    This map stores all data that a Single Page Application (SPA) like Manifold would need in order to query the tag's associated pico. When a QR code (tag)
    is scanned, this registry is consulted; its spaHost and spaPort are then used as the redirect location with the other information provided as url parameters
    {
      devDomain: {
        tagID: {
          tagID: <tagID::string>, ex. ABC123
          spaHost: <Single Page App host::string>, ex. "https://manifold.picolabs.io"
          spaPort: <SPA port #::string>, ex. "8080", or "" (empty string) when no port needs to be specified
          hashRouter: <whether or not the spa uses hash routing::bool>, ex: our manifold uses manifold.picolabs.io/#/<rest of url>
          DID: <pico's DID::string>,
          devDomain: <developer's domain name::string>, ex. "picolabs" useful for avoiding tagID conflicts between developers who both produce large amounts of tagID's,
          appName: <dev's user friendly app name::string> ex. "safeandmine"
        }
        ...
      }
      ...
    }
    */

    //this function assumes a tag is registered, and will have unpredictable results if it is not
    buildSpaRedirectURL = function(tagID, devDomain) {
      tagInfo = ent:tagRegistry.defaultsTo({}){[devDomain, tagID]};
      host = tagInfo{"spaHost"};
      portWithColon = tagInfo{"spaPort"} => (":" + tagInfo{"spaPort"}) | ""; //empty string means no port is needed in the url
      appName = tagInfo{"appName"};
      DID = tagInfo{"DID"};
      hashRouter = tagInfo{"hashRouter"} => "#/" | "";

      <<#{host}#{portWithColon}/#{hashRouter}#{devDomain}/#{appName}?tagID=#{tagID}&DID=#{DID}>>
    }

    isTagRegistered = function(tagID, devDomain) {
      ent:tagRegistry.defaultsTo({}){[devDomain, tagID]} => true | false
    }

    tagRegistry = function() {
      ent:tagRegistry.defaultsTo({})
    }

  }//end global

  rule redirectTest {
    select when redirect test
    send_directive("_redirect", { "url": "https://manifold.picolabs.io" })
  }

  rule handleScan {
    select when registry tag_scanned
    pre {
      devDomain = event:attr("devDomain") || false
      tagID = event:attr("tagID") || false


      //see if it is in the registry or not?
      isRegistered = isTagRegistered(tagID, devDomain)

      validScan = (devDomain && tagID)
    }
    if validScan && isRegistered then
      send_directive("_redirect", { "url": buildSpaRedirectURL(tagID, devDomain).klog("Redirect URL: ")}) //redirect whoever scanned the tag to the SPA
    fired {
      raise registry event "valid_scan"
        attributes event:attrs
    }else {
      raise registry event "invalid_scan"
        attributes event:attrs if (not validScan);

      raise registry event "unregistered_scan"
        attributes event:attrs if (validScan && not isRegistered) //perhaps do something interesting here, like redirect to a default place with an error message?
    }
  }

  rule invalidScan {
    select when registry invalid_scan
    send_directive("Failed to scan tag because of missing attributes")
  }

  rule unregisteredScan {
    select when registry unregistered_scan
    send_directive("This tag has not yet been registered. Please visit your favorite SPA and register the tag")
  }

  rule addTag {
    select when registry new_tag
    pre {
      tagID = event:attr("tagID")
      devDomain = event:attr("devDomain")
      spaHost = event:attr("spaHost") || "https://manifold.picolabs.io"
      spaPort = event:attr("spaPort") || ""
      DID = event:attr("DID")
      appName = event:attr("appName")
      hashRouter = event:attr("hashRouter")
      hashRouterBool = (hashRouter == "" || hashRouter.isnull() || hashRouter == "true") => true | false //default to using hashRouters, as they are commin in SPAs

      validTag = (tagID && devDomain && spaHost && DID && appName) => true | false
      isRegistered = isTagRegistered(tagID, devDomain)
    }
    if validTag && not isRegistered then
      send_directive(<<Adding tag #{tagID} to registry under domain #{devDomain}>>)
    fired {
      //update tagRegistry
      ent:tagRegistry{[devDomain, tagID]} := {
        "tagID": tagID,
        "devDomain": devDomain,
        "spaHost": spaHost,
        "spaPort": spaPort,
        "hashRouter": hashRouterBool,
        "DID": DID,
        "appName": appName
      }
    }else {
      raise registry event "new_tag_failure"
        attributes event:attrs if (not validTag);

      raise registry event "tag_already_taken"
        attributes event:attrs if (validTag).klog("valid tag: ") && isRegistered
    }
  }

  rule newTagFailed {
    select when registry new_tag_failure
    send_directive("Failed to create tag because of missing attributes")
  }

  rule tagTaken {
    select when registry tag_already_taken
    send_directive("Failed to create tag because this one is already registered")
  }

  rule removeTag {
    select when registry unneeded_tag
    pre {
      tagID = event:attr("tagID")
      devDomain = event:attr("devDomain")
      isRegistered = isTagRegistered(tagID, devDomain)

      //do some authentication so not just anyone can remove tags??
      isValid = (tagID && devDomain)
    }
    if isRegistered && isValid then
      send_directive(<<Removing tag #{tagID} under domain #{devDomain}>>)
    fired {
      clear ent:tagRegistry{[devDomain, tagID]}
    }else {
      raise registry event "invalid_removal"
        attributes event:attrs if (not isValid);

      raise registry event "removal_tag_not_found"
        attributes event:attrs if (isValid && not isRegistered)
    }
  }
}

/**
 * @fileOverview Wrangler javascript API.
 * @author <a href="mailto:picos@byu.edu">PicoLab</a>
 * @version 1.0.0
 * @since 1.0.0
 * @deprecated CloudOS.js has been improved and released as  The improvements include cleaner coding practices and removal of dead code.
 * @example <caption> example usage of Wrangler API.</caption>
 * showInstalledRulesets: function(callback, options)
 * {
 *   var parameters = {};
 *   callback = callback || function(){};
 *   post_function = function(json) {
 *       console.log("Displaying installed rulesets", json);
 *       callback(json);
 *   };
 *   return installedRulesetsWithDiscription(parameters, post_function, options);
 * }
 */
  defaultECI = "none";
  access_token = "none";

  /**
   * check_eci , returns a valid cid.......
   * @param  {String} cid, channel id.
   * @return {String} returns the cid, if no cid passed then check_eci returns defaultECI.
   */
  export function check_eci(cid) {
    var res = cid || defaultECI;
    if (res === "none") {
      throw "No wrangler event channel identifier (ECI) defined";
    }
    return res;
  };

  export function mkEsl(parts, host) {
    if (host === "none") { // I dont think this will ever be true.....
      throw "No wrangler host defined";
    }
    var Host = ""; //<---------------------==========================================================
    parts.unshift(host); // adds host to beginning of array
    var res = 'https://' + parts.join("/"); // returns a url structure string
    return res;
  };

  export function get_rid(name) {

    var rids = {
      "rulesets": {
        "prod": "v1_wrangler.prod",
        "dev": "v1_wrangler.dev"
      },
      "bootstrap": {
        "prod": "b507199x1.prod",
        "dev": "b507199x1.dev"
      }
    };

    return rids[name].dev;
  };

  // ------------------------------------------------------------------------
  // Raise Sky Event

  // use status return type to through javascript exception ...

  /**
   * raiseEvent, Raise event to the server specified in wrangler-config.js with the given attributes as well as a randomly created event id between 0 and 9999999.
   * @param {string} eventDomain, domain of event being raised.
   * @param  {string} eventType,  type of event being raised.
   * @param  {object} eventAttributes
   * @param  {Function} callback, function to be called on success.
   * @param  {object} options contain eci to be used, eci defaults to PicoNavigator.currentPico and then to defaultECI.
   * @return returns null.
   * @throws {"No wrangler host defined"} If host === "none"
   * @throws {"No wrangler event channel identifier (ECI) defined"} If no channel id is passed and no default event channel id is not found.
   * @interface raiseEvent is used by other functions to raise events.
   */
  export function raiseEvent(eventDomain, eventType, eventAttributes, callback, options) {
    try {

      options = options || {};
      //options.eci = options.eci || PicoNavigator.currentPico || defaultECI; //<-- is this vallid?
      options.eci = options.eci || defaultECI; //<-- is this vallid?
      callback = callback || function() {};

      var eci = check_eci(options.eci);
      var eid = Math.floor(Math.random() * 9999999);
      //url constructor
      var esl = mkEsl(
        //['sky/event',
        [options._path || eventPath,
          eci,
          eid,
          eventDomain,
          eventType
        ], options._host || host);

      console.log("raise ESL: ", esl);
      console.log("event attributes: ", eventAttributes);

      return $.ajax({
        type: 'POST',
        url: esl,
        data: $.param(eventAttributes),
        dataType: 'json',
        headers: {
          'Kobj-Session': eci
        }, // not sure needed since eci in URL
        success: callback,
        error: options.errorFunc || function(res) {
          console.error(res)
        }
      });
    } catch (error) {
      console.error("[raise]", error);
      return null;
    }
  };

  export function skyQuery(module, func_name, parameters, getSuccess, options) {
    //put options stuff here.
    try {
      options = options || {};
      //options.eci = options.eci || PicoNavigator.currentPico || defaultECI; //<-- is this vallid?
      options.eci = options.eci || defaultECI; //<-- is this vallid?
      parameters = parameters || {};
      var retries = 2;

      if (typeof options.repeats !== "undefined") {
        console.warn("This is a repeated request: ", options.repeats);
        if (options.repeats > retries) {
          throw "terminating repeating request due to consistent failure.";
        }
      }
      console.log("wranglerECI", defaultECI);
      console.log("manifoldAuthECI", manifoldAuth.defaultECI);
      var eci = check_eci(options.eci);
      //url constructor
      var esl = mkEsl(
        //['sky/cloud',
        [options._path || functionPath,
          module,
          func_name
        ], options._host || host);

      $.extend(parameters, {
        "_eci": eci
      });

      console.log("Attaching event parameters ", parameters);
      // should this go in mkEsl ? no, then you could not use it in raiseEvent
      esl = esl + "?" + $.param(parameters);

      var process_error = function(res) {
        console.error("skyQuery Server Error with esl ", esl, res);
        if (typeof options.errorFunc === "function") {
          options.errorFunc(res);
        }
      };

      var process_result = function(res) // whats this for???
      {
        console.log("Seeing res ", res, " for ", esl);
        var sky_cloud_error = typeof res === 'Object' && typeof res.skyQueryError !== 'undefined';
        if (!sky_cloud_error) {
          getSuccess(res);
        } else {
          console.error("skyQuery Error (", res.skyQueryError, "): ", res.skyQueryErrorMsg);
          if (!!res.httpStatus &&
            !!res.httpStatus.code &&
            (parseInt(res.httpStatus.code) === 400 || parseInt(res.httpStatus.code) === 500)) {
            console.error("The request failed due to an ECI error. Going to repeat the request.");
            var repeat_num = (typeof options.repeats !== "undefined") ? ++options.repeats : 0;
            options.repeats = repeat_num;
            // I don't think this will support promises; not sure how to fix
            skyQuery(module, func_name, parameters, getSuccess, options);
          }
        }
      };

      console.log("sky cloud call to ", module + ':' + func_name, " on ", esl, " with token ", eci);

      return $.ajax({
        type: 'GET',
        url: esl,
        dataType: 'json',
        // try this as an explicit argument
        //		headers: {'Kobj-Session' : eci},
        success: process_result
        // error: process_error
      });
    } catch (error) {
      console.error("[skyQuery]", error);
      if (typeof options.errorFunc === "function") {
        options.errorFunc();
      }
      return null;
    }
  };

  // ------------------------------------------------------------------------ installed Rulests
  // function(eventDomain, eventType, eventAttributes, postFunction, options) // <--- raiseEvent paramiters


  export function installedRulesets(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "rulesets", parameters, postFunction, options);
  };

  export function describeRulesets(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "rulesetsInfo", parameters, postFunction, options);
  };

  export function installedRulesetsWithDiscription(parameters, postFunction, options) {
    return installedRulesets({}, function(rids) {
      console.log("rids.rids", rids.rids);
      return skyQuery(get_rid("rulesets"), "rulesetsInfo", {
        'rids': rids.rids.join(';')
      }, postFunction, options);
    }, options);
  };

  export function installRulesets(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "install_rulesets_requested", eventAttributes, postFunction, options);
  };

  export function uninstallRuleset(eventAttributes, postFunction, options) {
    console.log("uninstalling ruleset: ", eventAttributes.eci);
    var results = raiseEvent("wrangler", "uninstall_rulesets_requested", eventAttributes, postFunction, options);
    console.log("uninstalled rulesets: ", eventAttributes.eci);
    return results;
  };

  // ------------------------------------------------------------------------ Channels
  export function channels(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "channels", parameters, postFunction, options);
  };
  export function channel(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "channel", parameters, postFunction, options);
  };
  export function channelAttributes(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "channelAttributes", parameters, postFunction, options);
  };
  export function channelPolicy(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "channelPolicy", parameters, postFunction, options);
  };
  export function channelType(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "channelType", parameters, postFunction, options);
  };

  export function updateChannelAttributes(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "update_channel_attributes_requested", eventAttributes, postFunction, options);
  };
  export function updateChannelPolicy(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "update_channel_policy_requested", eventAttributes, postFunction, options);
  };
  export function deleteChannel(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "channel_deletion_requested", eventAttributes, postFunction, options);
  };
  export function createChannel(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "channel_creation_requested", eventAttributes, postFunction, options);
  };

  // ------------------------------------------------------------------------ pico
  export function children(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "children", parameters, postFunction, options);
  };
  export function parent(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "parent", parameters, postFunction, options);
  };
  export function name(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "name", parameters, postFunction, options);
  };
  export function attributes(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "attributes", parameters, postFunction, options);
  };

  export function createChild(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "child_creation", eventAttributes, postFunction, options);
  };
  export function initializeChild(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "child_created", eventAttributes, postFunction, options);
  };
  export function setPicoAttributes(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "set_attributes_requested", eventAttributes, postFunction, options);
  };
  export function clearPicoAttributes(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "clear_attributes_requested", eventAttributes, postFunction, options);
  };
  export function deleteChild(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "child_deletion", eventAttributes, postFunction, options);
  };
  // ------------------------------------------------------------------------ subscription

  export function subscriptions(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "subscriptions", parameters, postFunction, options);
  };
  export function channelByName(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "channelByName", parameters, postFunction, options);
  };
  export function channelByEci(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "channelByEci", parameters, postFunction, options);
  };
  export function subscriptionsAttributesEci(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "subscriptionsAttributesEci", parameters, postFunction, options);
  };
  export function subscriptionsAttributesName(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "subscriptionsAttributesName", parameters, postFunction, options);
  };
  export function requestSubscription(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "subscription", eventAttributes, postFunction, options);
  };
  export function addPendingSubscription(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "pending_subscription", eventAttributes, postFunction, options);
  };
  export function approvePendingSubscription(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "pending_subscription_approval", eventAttributes, postFunction, options);
  };
  export function addSubscription(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "pending_subscription_approved", eventAttributes, postFunction, options);
  };

  export function cancelSubscription(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "subscription_cancellation", eventAttributes, postFunction, options);
  };
  export function rejectInBoundSubscription(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "inbound_subscription_rejection", eventAttributes, postFunction, options);
  };
  export function cancelOutBoundSubscription(eventAttributes, postFunction, options) {
    return raiseEvent("wrangler", "outbound_subscription_cancellation", eventAttributes, postFunction, options);
  };
  // ------------------------------------------------------------------------ other

  export function currentSession(parameters, postFunction, options) {
    return skyQuery(get_rid("rulesets"), "currentSession", parameters, postFunction, options);
  };
  export function bootstrapCheck(postFunction, options) {
    return skyQuery(get_rid("bootstrap"), "installedRulesets", {}, postFunction, options);
  };




  // ========================================================================
  // Profile Management

  export function getMyProfile(getSuccess) {
    return skyQuery("a169x676", "get_all_me", {}, function(res) {
      clean(res);
      if (typeof getSuccess !== "undefined") {
        getSuccess(res);
      }
    });
  };

  export function updateMyProfile(eventAttributes, postFunction) {
    var eventParameters = {
      "element": "profileUpdate.post"
    };
    return raiseEvent('web', 'submit', eventAttributes, postFunction);
  };

  export function getFriendProfile(friendToken, getSuccess) {
    var parameters = {
      "myToken": friendToken
    };
    return skyQuery("a169x727", "getFriendProfile", parameters, getSuccess);
  };

  // ========================================================================
  // PDS Management

  // ------------------------------------------------------------------------
  export function PDSAdd(namespace, pdsKey, pdsValue, postFunction) {
    var eventAttributes = {
      "namespace": namespace,
      "pdsKey": pdsKey,
      "pdsValue": JSON.stringify(pdsValue)
    };

    return raiseEvent('wrangler', 'api_pds_add', eventAttributes, {}, postFunction);
  };

  // ------------------------------------------------------------------------
  export function PDSDelete(namespace, pdsKey, postFunction) {
    var eventAttributes = {
      "namespace": namespace,
      "pdsKey": pdsKey
    };

    return raiseEvent('wrangler', 'api_pds_delete', eventAttributes, {}, postFunction);
  };

  // ------------------------------------------------------------------------
  export function PDSUpdate() {};

  // ------------------------------------------------------------------------
  export function PDSList(namespace, getSuccess) {
    var callParmeters = {
      "namespace": namespace
    };
    return skyQuery("pds", "get_items", callParmeters, getSuccess);
  };

  // ------------------------------------------------------------------------
  export function sendEmail(ename, email, subject, body, postFunction) {
    var eventAttributes = {
      "ename": ename,
      "email": email,
      "subject": subject,
      "body": body
    };
    return raiseEvent('wrangler', 'api_send_email', eventAttributes, {}, postFunction);
  };

  // ------------------------------------------------------------------------
  export function sendNotification(application, subject, body, priority, token, postFunction) {
    var eventAttributes = {
      "application": application,
      "subject": subject,
      "body": body,
      "priority": priority,
      "token": token
    };
    return raiseEvent('wrangler', 'api_send_notification', eventAttributes, {}, postFunction);
  };


  // ========================================================================
  // Login functions
  // ========================================================================
  export function login(username, password, success, failure) {


    var parameters = {
      "email": username,
      "pass": password
    };

    if (typeof anonECI === "undefined") {
      console.error("anonECI undefined. Configure js in wrangler-config.js; failing...");
      return null;
    }

    return skyQuery("wrangler",
      "cloudAuth",
      parameters,
      function(res) {
        // patch this up since it's not OAUTH
        if (res.status) {
          var tokens = {
            "access_token": "none",
            "OAUTH_ECI": res.token
          };
          saveSession(tokens);
          if (typeof success == "function") {
            success(tokens);
          }
        } else {
          console.log("Bad login ", res);
          if (typeof failure == "function") {
            failure(res);
          }
        }
      }, {
        eci: anonECI,
        errorFunc: failure
      }
    );


  };



  // ========================================================================
  // OAuth functions
  // ========================================================================

  // ------------------------------------------------------------------------
  export function getOAuthURL(fragment) {
    if (typeof login_server === "undefined") {
      login_server = host;
    }


    var client_state = Math.floor(Math.random() * 9999999);
    var current_client_state = window.localStorage.getItem("wrangler_CLIENT_STATE");
    if (!current_client_state) {
      window.localStorage.setItem("wrangler_CLIENT_STATE", client_state.toString());
    }
    var url = 'https://' + login_server +
      '/oauth/authorize?response_type=code' +
      '&redirect_uri=' + encodeURIComponent(callbackURL + (fragment || "")) +
      '&client_id=' + clientKey +
      '&state=' + client_state;

    return (url)
  };

  export function getOAuthNewAccountURL(fragment) {
    if (typeof login_server === "undefined") {
      login_server = host;
    }


    var client_state = Math.floor(Math.random() * 9999999);
    var current_client_state = window.localStorage.getItem("wrangler_CLIENT_STATE");
    if (!current_client_state) {
      window.localStorage.setItem("wrangler_CLIENT_STATE", client_state.toString());
    }
    var url = 'https://' + login_server +
      '/oauth/authorize/newuser?response_type=code' +
      '&redirect_uri=' + encodeURIComponent(callbackURL + (fragment || "")) +
      '&client_id=' + clientKey +
      '&state=' + client_state;

    return (url)
  };

  //https://kibdev.kobj.net/oauth/authorize/newuser?response_type=code&redirect_uri=http%3A%2F%2Fjoinfuse.com%2Fcode.html&client_id=D98022C6-C4F4-11E3-942D-E857D61CF0AC&state=6970625


  // ------------------------------------------------------------------------
  export function getOAuthAccessToken(code, callback, error_func) {
    var returned_state = parseInt(getQueryVariable("state"));
    var expected_state = parseInt(window.localStorage.getItem("wrangler_CLIENT_STATE"));
    if (returned_state !== expected_state) {
      console.warn("OAuth Security Warning. Client states do not match. (Expected %d but got %d)", client_state, returned_state);
    }
    console.log("getting access token with code: ", code);
    if (typeof(callback) !== 'function') {
      callback = function() {};
    }
    var url = 'https://' + login_server + '/oauth/access_token';
    var data = {
      "grant_type": "authorization_code",
      "redirect_uri": callbackURL,
      "client_id": clientKey,
      "code": code
    };

    return $.ajax({
      type: 'POST',
      url: url,
      data: data,
      dataType: 'json',
      success: function(json) {
        console.log("Recieved following authorization object from access token request: ", json);
        if (!json.OAUTH_ECI) {
          console.error("Received invalid OAUTH_ECI. Not saving session.");
          callback(json);
          return;
        };
        saveSession(json);
        window.localStorage.removeItem("wrangler_CLIENT_STATE");
        callback(json);
      },
      error: function(json) {
        console.log("Failed to retrieve access token " + json);
        error_func = error_func || function() {};
        error_func(json);
      }
    });
  };

  // ========================================================================
  // Session Management

  // ------------------------------------------------------------------------
  export function retrieveSession() {
    var SessionCookie = kookie_retrieve();

    console.log("Retrieving session ", SessionCookie);
    if (SessionCookie != "undefined") {
      defaultECI = SessionCookie;
    } else {
      defaultECI = "none";
    }
    return defaultECI;
  };

  // ------------------------------------------------------------------------
  export function saveSession(token_json) {
    var Session_ECI = token_json.OAUTH_ECI;
    var access_token = token_json.access_token;
    console.log("Saving session for ", Session_ECI);
    defaultECI = Session_ECI;
    access_token = access_token;
    kookie_create(Session_ECI);
  };
  // ------------------------------------------------------------------------
  export function removeSession(hard_reset) {
    console.log("Removing session ", defaultECI);
    if (hard_reset) {
      var cache_breaker = Math.floor(Math.random() * 9999999);
      var reset_url = 'https://' + login_server + "/login/logout?" + cache_breaker;
      $.ajax({
        type: 'POST',
        url: reset_url,
        headers: {
          'Kobj-Session': defaultECI
        },
        success: function(json) {
          console.log("Hard reset on " + login_server + " complete");
        }
      });
    }
    defaultECI = "none";
    kookie_delete();
  };

  // ------------------------------------------------------------------------
  export function authenticatedSession() {
    var authd = defaultECI != "none";
    if (authd) {
      console.log("Authenicated session");
    } else {
      console.log("No authenicated session");
    }
    return (authd);
  };

  // exchange OAuth code for token
  // updated this to not need a query to be passed as it wasnt used in the first place.
  export function retrieveOAuthCode() {
    var code = getQueryVariable("code");
    return (code) ? code : "NO_OAUTH_CODE";
  };

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    console.log('Query variable %s not found', variable);
    return false;
  };

  clean = function(obj) {
    delete obj._type;
    delete obj._domain;
    delete obj._async;

  };

  var SkyTokenName = '__SkySessionToken';
  var SkyTokenExpire = 7;

  // --------------------------------------------
  function kookie_create(SkySessionToken) {
    if (SkyTokenExpire) {
      // var date = new Date();
      // date.setTime(date.getTime() + (SkyTokenExpire * 24 * 60 * 60 * 1000));
      // var expires = "; expires=" + date.toGMTString();
      var expires = "";
    } else var expires = "";
    var kookie = SkyTokenName + "=" + SkySessionToken + expires + "; path=/";
    document.cookie = kookie;
    // console.debug('(create): ', kookie);
  }

  // --------------------------------------------
  function kookie_delete() {
    var kookie = SkyTokenName + "=foo; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/";
    document.cookie = kookie;
    // console.debug('(destroy): ', kookie);
  }

  // --------------------------------------------
  function kookie_retrieve() {
    var TokenValue = 'undefined';
    var TokenName = '__SkySessionToken';
    var allKookies = document.cookie.split('; ');
    for (var i = 0; i < allKookies.length; i++) {
      var kookiePair = allKookies[i].split('=');
      // console.debug("Kookie Name: ", kookiePair[0]);
      // console.debug("Token  Name: ", TokenName);
      if (kookiePair[0] == TokenName) {
        TokenValue = kookiePair[1];
      };
    }
    // console.debug("(retrieve) TokenValue: ", TokenValue);
    return TokenValue;
  }

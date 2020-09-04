import { combineReducers } from 'redux-immutable';
import manifoldInfoReducer from './reducer_manifold_info';
import identitiesReducer from './reducer_identities';
import notificationsReducer from './reducer_notifications';
import errorReducer from './reducer_error';
import { List, Map } from 'immutable';

const rootReducer = combineReducers({
  manifoldInfo: manifoldInfoReducer,
  identities: identitiesReducer,
  manifoldNotifications: notificationsReducer,
  errorModal: errorReducer
});

export default rootReducer;

/* The store structure (everything is an Immutable JS List or Map)
{
  manifoldInfo: {
    hasTutorial : <boolean>
    things: {
      <picoID>: {
        Rx_role: <Rx_role>,
        Tx_role: <Tx_role>,
        Tx_host: <host location of form "http://<host and port>">,
        Id: <subscription_id>,
        Tx: <Tx>,
        Rx: <Rx>,
        name: <pico's name>,
        picoID: <picoID>,
        color: <string of form "#ABCDEF">,
        pos: {
          x: <number>,
          y: <number>,
          w: <number>,
          h: <number>,
          maxw: <number>,
          maxh: <number>
        }
      },
      ...
    },
    communities: {
      <picoID>: {
        Rx_role: <Rx_role>,
        Tx_role: <Tx_role>,
        Tx_host: <host location of form "http://<host and port>">,
        Id: <subscription_id>,
        subID: <subscription_id>, //alias for Id. In krl, Id is used by the subscription ruleset, and subID is used by the manifold_pico ruleset
        Tx: <Tx>,
        Rx: <Rx>,
        name: <pico's name>,
        picoID: <picoID>,
        color: <string of form "#ABCDEF">,
        pos: {
          x: <number>,
          y: <number>,
          w: <number>,
          h: <number>,
          maxw: <number>,
          maxh: <number>
        }
      },
      ...
    }
  },
  identities: {
    <picoID>: {
      <rid>: {
        rid: <string of form "io.picolabs.safeandmine">,
        bindings: {
          //any props defined by the app ruleset
        },
        name: <string>,
        iconURL: <string>
      }
    }
    ...
  },
  form: {
    //redux-form manages this for us. We just need to provide its existence...
  }
}
*/

//manifoldInfo selectors

//returns an array of all Thing picoID's
export function getThingIdList(state) {
  const things = getThings(state);
  return things.keySeq().toArray(); //toArray is a shallow copy, which is fine for the keys, because they are just strings
}

export function getCommunitiesIdList(state) {
  const communities = getCommunities(state);
  return communities.keySeq().toArray(); //toArray is a shallow copy, which is fine for the keys, because they are just strings
}

//Given an array of picoID's, returns an array of position objects. If the picoID you are
//interested in is at position 0 when passed into this function, then the return value
//will have that pico's position also at index 0 in the returned position array. If the
//pico doesn't have any position yet, then an empty object will be placed at its index
//If an id doesn't exist in the state structure, then that id's spot will be null
export function getPositionArray(state, picoIDArray) {
  const things = getThings(state);
  const communities = getCommunities(state);
  let toReturn = List([]);
  picoIDArray.forEach((picoID) => {
    if(things.get(picoID)) {
      let pos = things.getIn([picoID, "pos"]) || Map({});
      toReturn = toReturn.push(pos);
    }else if(communities.get(picoID)) {
      let pos = communities.getIn([picoID, "pos"]) || Map({});
      toReturn = toReturn.push(pos);
    }
  });
  return toReturn.toJS();
}

export function getName(state, picoID) {
  const things = getThings(state);
  const communities = getCommunities(state);
  if(things.get(picoID)){
    return things.getIn([picoID, "name"]);
  } else if(communities.get(picoID)) {
    return communities.getIn([picoID, "name"]);
  } else{
    return null;
  }
}

export function getSubID(state, picoID) {
  const things = getThings(state);
  const communities = getCommunities(state);
  if(things.get(picoID)){
    return things.getIn([picoID, "subID"]);
  } else if(communities.get(picoID)) {
    return communities.getIn([picoID, "subID"]);
  } else{
    return null;
  }
}

export function getDID(state, picoID) {
  const things = getThings(state);
  const communities = getCommunities(state);
  if(things.get(picoID)){
    return things.getIn([picoID, "Tx"]);
  } else if(communities.get(picoID)) {
    return communities.getIn([picoID, "Tx"]);
  } else{
    return null;
  }
}

export function getColor(state, picoID) {
  const things = getThings(state);
  const communities = getCommunities(state);
  if(things.get(picoID)){
    return things.getIn([picoID, "color"]);
  } else if(communities.get(picoID)) {
    return communities.getIn([picoID, "color"]);
  } else{
    return null;
  }
}

//returns an immutable Map
export function getThings(state) {
  return state.getIn(["manifoldInfo", "things"]);
}

//returns an immutable Map
export function getCommunities(state) {
  return state.getIn(["manifoldInfo", "communities"]);
}

//identities selectors
export function getCardIdentity(state, picoID) {
  return state.getIn(["identities", picoID]);
}

//returns an array of apps
export function getInstalledApps(state, picoID) {
  const cardIdentity = getCardIdentity(state, picoID);
  if(!cardIdentity) { //We have no recordings for installed apps
    return null;
  }
  let toReturn = [];
  cardIdentity.forEach((value, key) => {
    toReturn.push(value.toJS());
  });
  return toReturn;
}


//returns how many notifications are unread
export function getNotificationsCount(state) {
  return state.getIn(["manifoldNotifications"]).count;
}
//returns an array of notifications
export function getNotifications(state) {
  return state.getIn(["manifoldNotifications"]).notifications;
}

//Displays a error modal if request is bad
export function errorModalToggle(state) {
  return state.getIn(["errorModal"]).errorModal
}

export function listErrors(state) {
  return state.getIn(["errorModal"]).errors
}

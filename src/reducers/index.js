import { combineReducers } from 'redux';
import manifoldInfoReducer from './reducer_manifold_info';
import identitiesReducer from './reducer_identities'
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  manifoldInfo: manifoldInfoReducer,
  identities: identitiesReducer,
  form: formReducer //this is used in the login process only.
});

export default rootReducer;

/* The store structure (everything is an Immutable JS List or Map)
{
  manifoldInfo: {
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
        name: <string>
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
export function getThingIdList(state) {
  const things = getThingsArray(state);
  return things.map((item) => {
    return item.picoID;
  });
}

export function getCommunitiesIdList(state) {
  const communities = getCommunitiesArray(state);
  return communities.map((item) => {
    return item.picoID;
  })
}

//Given an array of picoID's, returns an array of position objects. If the picoID you are
//interested in is at position 0 when passed into this function, then the return value
//will have that pico's position also at index 0 in the returned position array
export function getPositionArray(state, picoIDArray) {
  const thingsPosition = state.manifoldInfo.things.thingsPosition;
  const communitiesPosition = state.manifoldInfo.communities.communitiesPosition;
  return picoIDArray.map((picoID) => {
    let thingPos = thingsPosition[picoID];
    let commPos = communitiesPosition[picoID];
    if(thingPos) {
      return thingPos;
    }else if(commPos) {
      return commPos;
    }else {
      console.warn("There is no position recorded for this pico");
      return null;
    }
  })
}

export function getThingsArray(state) {
  if(state.manifoldInfo.things && state.manifoldInfo.things.things) {
    return state.manifoldInfo.things.things;
  }else{
    return [];
  }
}

export function getCommunitiesArray(state) {
  if(state.manifoldInfo.communities && state.manifoldInfo.communities.communities) {
    return state.manifoldInfo.communities.communities;
  }else {
    return [];
  }
}

export function getName(state, picoID) {
  const things = getThingsArray(state);
  const communities = getCommunitiesArray(state);
  const toLoop = things.concat(communities);
  for(let index in toLoop) {
    let obj = toLoop[index];
    if(obj.picoID === picoID) {
      return obj.name;
    }
  }
  return null;
}

export function getSubID(state, picoID) {
  const things = getThingsArray(state);
  const communities = getCommunitiesArray(state);
  const toLoop = things.concat(communities);
  for(let index in toLoop) {
    let obj = toLoop[index];
    if(obj.picoID === picoID) {
      return obj.Id;
    }
  }
  return null;
}

export function getDID(state, picoID) {
  const things = getThingsArray(state);
  const communities = getCommunitiesArray(state);
  const toLoop = things.concat(communities);
  for(let index in toLoop) {
    let obj = toLoop[index];
    if(obj.picoID === picoID) {
      return obj.Tx;
    }
  }
  return null;
}

export function getColor(state, picoID) {
  const things = getThingsArray(state);
  const communities = getCommunitiesArray(state);
  const toLoop = things.concat(communities);
  for(let index in toLoop) {
    let obj = toLoop[index];
    if(obj.picoID === picoID) {
      return obj.color;
    }
  }
  return null;
}

//identities selectors
export function getCardIdentity(state, picoID) {
  if(state.identities && state.identities[picoID]){
    return state.identities[picoID];
  }else{
    return [];
  }
}

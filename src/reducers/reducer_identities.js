import _ from 'lodash';

export default function(state = {}, action){
  switch (action.type) {
    case 'DISCOVERY_SUCCESS':
      console.log("action in discovery:",action);
      var newState = _.mapValues(state, function(o){ return o; })//make a copy of the original object
      const apps = action.payload.data.directives;
      newState[action.pico_id] = apps
      return newState;
    default:
      return state;
  }
}

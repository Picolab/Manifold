
export default function(state = {}, action){
  switch (action.type) {
    case 'DISCOVERY_SUCCESS':
      //console.log("action in discovery:",action);
      //var newState = _.mapValues(state, function(o){ return o; })//make a copy of the original object
      var newState = JSON.parse(JSON.stringify(state));
      const apps = action.payload.data.directives;
      newState[action.pico_id] = apps
      return newState;
    default:
      return state;
  }
}

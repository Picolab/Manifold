import { MANIFOLD_INFO } from '../actions';

export default function(state = {}, action){
  switch (action.type) {
    case 'DISCOVERY_SUCCESS':
      console.log("action in discovery:",action);
      return action;
    default:
      return state;
  }
}

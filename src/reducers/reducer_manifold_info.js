import { MANIFOLD_INFO } from '../actions';

export default function(state = {}, action){
  switch (action.type) {
    case MANIFOLD_INFO:
      console.log("action.payload.data in reducer_manifold_info:",action.result.data);
      return action.result.data;
    default:
      return state;
  }
}

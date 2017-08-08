import { MANIFOLD_INFO } from '../actions';
import { storeRootECI, getProtocol, getManifoldURL } from '../utils/AuthService';

export default function(state = {}, action){
  switch (action.type) {
    case MANIFOLD_INFO:
      console.log("action.payload.data in reducer_manifold_info:",action.payload.data);
      return action.payload.data;
    default:
      return state;
  }
}

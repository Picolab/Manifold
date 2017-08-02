import { ACCESS_TOKEN } from '../actions';
import { storeRootECI, getProtocol, getManifoldURL } from '../utils/AuthService';

export default function(state = {}, action){
  switch (action.type) {
    case ACCESS_TOKEN:
      console.log("action.payload.data in reducer_oauth:",action.payload.data);
      console.log("action.payload", action.payload);
      console.log("action", action);
      //storeRootECI(action.payload.eci);
      //return {...state, action.payload.data };
      const { access_token, token_type } = action.payload.data;
      if(!access_token){
        alert("Oauth request failed. Please try again.")
        return state;
      }
      storeRootECI(access_token);
      window.location.assign(getManifoldURL());
      return access_token;
    default:
      return state;
  }
}

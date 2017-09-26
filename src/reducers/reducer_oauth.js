import { ACCESS_TOKEN } from '../actions';
import { storeOwnerECI, getProtocol, getManifoldURL } from '../utils/AuthService';

export default function(state = "", action){
  console.log("The action at the start",action);
  switch (action.type) {
    case ACCESS_TOKEN:
      console.log("action.payload.data in reducer_oauth:",action.payload.data);
      console.log("action.payload", action.payload);
      console.log("action", action);
      //storeOwnerECI(action.payload.eci);
      //return {...state, action.payload.data };
      const { access_token, token_type } = action.payload.data;
      if(!access_token){
        alert("Oauth request failed. Please try again.")
        return state;
      }
      storeOwnerECI(access_token);
      window.location.assign(getManifoldURL());
      return access_token;
    default:
      return state;
  }
}

import { storeManifoldECI } from '../utils/AuthService';

export default function(state = "", action){
  switch (action.type) {
    case "FETCH_ECI_SUCCEEDED":
      const { payload } = action;
      console.log("action.payload in reducer_manifoldEci:",payload); //debugging code

      storeManifoldECI(payload);
      return payload;
    default:
      return state;
  }
}

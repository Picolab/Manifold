import { storeManifoldECI } from '../utils/AuthService';

export default function(state = "", action){
  switch (action.type) {
    case "FETCH_ECI_SUCCEEDED":
      console.log("action.payload.data in reducer_manifoldEci:",action.result);
      return action.payload.data;
    default:
      return state;
  }
}

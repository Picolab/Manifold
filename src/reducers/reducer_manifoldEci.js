import { storeManifoldECI } from '../utils/AuthService';

export default function(state = "", action){
  switch (action.type) {
    case "FETCH_ECI_SUCCEEDED":
      console.log("action.result.data in reducer_manifoldEci:",action.result);
      return action.result.data;
    default:
      return state;
  }
}

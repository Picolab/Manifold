import { storeManifoldECI } from '../utils/AuthService';

export default function(state = "", action){
  switch (action.type) {
    case "FETCH_ECI_SUCCEEDED":
      console.log("action.result.data in reducer_manifoldEci:",action.result);
      storeManifoldECI(action.result.data.directives[0].options.eci);
      return action.result.data.directives[0].options.eci;
    default:
      return state;
  }
}

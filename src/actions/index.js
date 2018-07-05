import axios from 'axios';
import { getCallbackURL,getHostname,getClientSecret,getProtocol,getClientId } from '../utils/AuthService';

export function discovery(eci, pico_id) {
  return {
    type: ActionTypes.DISCOVERY,
    eci,
    pico_id
  }
}

let ActionTypes = {
  MANIFOLD_INFO: 'MANIFOLD_INFO',
  COMMAND: 'COMMAND',
  COMMAND_FAILED: 'COMMAND_FAILED',
  MALFORMED_RESPONSE: 'MALFORMED_RESPONSE',
  FETCH_ECI_SUCCEEDED: 'FETCH_ECI_SUCCEEDED',
  MANIFOLD_INFO_RETRIEVED: 'MANIFOLD_INFO_RETRIEVED',
  FETCH_ECI: 'FETCH_ECI',
  FETCH_ECI_FAILED: 'FETCH_ECI_FAILED',
  DISCOVERY: 'DISCOVERY',
  DISCOVERY_SUCCESS: 'DISCOVERY_SUCCESS'
}

export default ActionTypes

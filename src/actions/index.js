export function discovery(DID, picoID) {
  return {
    type: ActionTypes.DISCOVERY,
    payload: {
      DID,
      picoID
    }
  }
}

export function discoverySuccess(result, picoID) {
  return {
    type: ActionTypes.DISCOVERY_SUCCESS,
    payload: result,
    meta: {
      picoID
    }
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

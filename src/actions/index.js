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

export function storeNotificationsCount(count) {
  return {
    type: ActionTypes.NOTIFICATIONS_COUNT,
    count: count
  }
}

export function storeNotifications(notifications) {
  return {
    type: ActionTypes.NOTIFICATIONS,
    notifications: notifications
  }
}

export function toggleErrorModal(val, message, status) {
  return {
    type: ActionTypes.ERROR,
    errorModal: val,
    errorMessage: message,
    errorStatusCode: status
  }
}

export function clearErrorModal() {
  return {
    type: ActionTypes.CLEARERRORS,
    errorModal: false,
    errors: {}
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
  DISCOVERY_SUCCESS: 'DISCOVERY_SUCCESS',
  NOTIFICATIONS_COUNT: 'NOTIFICATIONS_COUNT',
  NOTIFICATIONS: 'NOTIFICATIONS',
  ERROR: 'ERROR',
  CLEARERRORS: 'CLEARERRORS'
}

export default ActionTypes

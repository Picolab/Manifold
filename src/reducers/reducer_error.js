import ActionTypes from '../actions';

export const errorModal = {
  errorModal: false,
  errors: {}
};

export default function errorReducer(state = errorModal, action) {
  switch (action.type) {
    case ActionTypes.ERROR:
      let updatedErrors = errorModal.errors
      updatedErrors[action.errorMessage.concat(action.errorStatusCode)] = { "message": action.errorMessage, "status": action.errorStatusCode }
      return Object.assign({}, state, {
        errorModal: action.errorModal,
        errors: updatedErrors
      })
    case ActionTypes.CLEARERRORS:
      return Object.assign({}, state, {
        errorModal: action.errorModal,
        errors: action.errors
      })
    default:
      return state;
  }
}

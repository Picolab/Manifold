import ActionTypes from '../actions';

export default function(state = {}, action){
  switch (action.type) {
    case ActionTypes.MANIFOLD_INFO_RETRIEVED:
      return action.result.data;
    default:
      return state;
  }
}

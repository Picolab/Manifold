import ActionTypes from '../actions';
import { fromJS, Map } from 'immutable';

export default function(state = Map({}), action){
  switch (action.type) {
    case ActionTypes.MANIFOLD_INFO_RETRIEVED:
      return fromJS(action.result.data);
    default:
      return state;
  }
}

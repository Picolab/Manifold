import { ACCESS_TOKEN } from '../actions';

export default function(state = {}, action){
  switch (action.type) {
    case ACCESS_TOKEN:
      console.log("action.payload in reducer_oauth:",action.payload);
      return state;
    default:
      return state;
  }
}

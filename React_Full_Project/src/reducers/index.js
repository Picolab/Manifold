import { combineReducers } from 'redux';
import OauthReducer from './reducer_oauth';

const rootReducer = combineReducers({
  eci : OauthReducer
});

export default rootReducer;

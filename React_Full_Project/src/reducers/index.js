import { combineReducers } from 'redux';
import OauthReducer from './reducer_oauth';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  eci : OauthReducer,
  form: formReducer
});

export default rootReducer;

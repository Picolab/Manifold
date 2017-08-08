import { combineReducers } from 'redux';
import OauthReducer from './reducer_oauth';
import manifoldInfoReducer from './reducer_manifold_info'
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  rootEci : OauthReducer,
  manifoldInfo : manifoldInfoReducer,
  form: formReducer
});

export default rootReducer;

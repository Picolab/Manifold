import { combineReducers } from 'redux';
import OauthReducer from './reducer_oauth';
import manifoldInfoReducer from './reducer_manifold_info';
import manifoldEciReducer from './reducer_manifoldEci';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  ownerEci : OauthReducer,
  manifoldEci: manifoldEciReducer,
  manifoldInfo : manifoldInfoReducer,
  form: formReducer
});

export default rootReducer;

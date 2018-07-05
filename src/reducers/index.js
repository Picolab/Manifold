import { combineReducers } from 'redux';
import manifoldInfoReducer from './reducer_manifold_info';
import identitiesReducer from './reducer_identities'
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  manifoldInfo: manifoldInfoReducer,
  identities: identitiesReducer,
  form: formReducer
});

export default rootReducer;

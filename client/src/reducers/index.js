import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './auth_reducer';
import userReducer from './user_reducer';
import langReducer from './lang_reducer';
import walmartReducer from './walmart_reducer';

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  user: userReducer,
  lang: langReducer,
  walmart: walmartReducer
  
  
});

export default rootReducer;

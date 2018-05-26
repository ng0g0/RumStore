import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './auth_reducer';
import userReducer from './user_reducer';
import langReducer from './lang_reducer';
import walmartReducer from './walmart_reducer';
import dashboardReducer from './dashboard_reducer';
import walmartSReducer from './walmart_search';

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  user: userReducer,
  lang: langReducer,
  walmart: walmartReducer,
  dashboard: dashboardReducer,
  walmartSearch: walmartSReducer
});

export default rootReducer;

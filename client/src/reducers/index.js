import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './auth_reducer';
import userReducer from './user_reducer';
import langReducer from './lang_reducer';
import walmartReducer from './walmart_reducer';
import dashboardReducer from './dashboard_reducer';
import walmartSReducer from './walmart_search';
import walmartVReducer from './walmart_item_vars';
import walmartItemInfo from './walmart_additem';
//import walmartAReducer from './walmart_additem'

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  user: userReducer,
  lang: langReducer,
  walmart: walmartReducer,
  walmartItem: walmartItemInfo,
  dashboard: dashboardReducer,
  walmartSearch: walmartSReducer,
  walmartVars: walmartVReducer
});

export default rootReducer;

import { LANG_CHANGE } from '../actions/types';

const INITIAL_STATE = { lang: 'en' };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
	case LANG_CHANGE:
			return Object.assign({}, state, {
				lang: action.payload.lang
				});		
	default:
 	  return { ...state };   
  }
}

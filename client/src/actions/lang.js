import cookie from 'react-cookie';
import { LANG_CHANGE 
 } from './types';

//= ===============================
// Utility actions
//= ===============================

export function setLang(lang) {
	console.log('setLang');
	return function (dispatch) {
		cookie.save('i18n', lang);
		//dispatch({ type: LANG_CHANGE, payload: { lang: lang } 
		//});
	};
}

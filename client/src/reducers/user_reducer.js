import { 
    ERROR_RESPONSE, 
    REQ_USER_DATA, 
    RECV_USER_DATA 
    } from '../actions/types';

const INITIAL_STATE = { //profile: {}, 
            message: '', error: '', setupComplete: false };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
	case REQ_USER_DATA:
		return Object.assign({}, state, {
            setupComplete: false
			});
	case RECV_USER_DATA:
		return Object.assign({}, state, {
				data: action.data,
				setupComplete: true
			});
	case ERROR_RESPONSE:
			return Object.assign({}, state, {
				error: action.payload.error,
				setupComplete: true
				});		
	default:
 	  return { ...state };   
  }
}

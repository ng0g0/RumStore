import { 
	REQ_ITEM_UPDATE,
    RECV_ITEM_UPDATE,
} from '../actions/types';
//import dayjs from 'dayjs';

const INITIAL_STATE = { message: '', error: '', loadingSpinnerUpdate: true, updatedItems: [] };

export default function (state = INITIAL_STATE, action) {
  
  switch (action.type) {
	case REQ_ITEM_UPDATE:
		return Object.assign({}, state, {
		    loadingSpinnerUpdate: true
		});
	case RECV_ITEM_UPDATE:
			return Object.assign({}, state, {
				updatedItems: action.data.updatedItems,
				loadingSpinnerUpdate: false
			});
	default:
 	  return { ...state };   
  }
}

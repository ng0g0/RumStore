import { 
	REQ_ITEM_UPDATE,
    RECV_ITEM_UPDATE,
    RECV_WALMART_BEST,
    REQ_WALMART_BEST
} from '../actions/types';
//import dayjs from 'dayjs';

const INITIAL_STATE = { message: '', error: '', loadingSpinnerUpdate: true, updatedItems: [], loadingWalmartBest: true };

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
    case RECV_WALMART_BEST:
        return Object.assign({}, state, {
				walmartBest: action.data.items,
				loadingWalmartBest: false
			});
    case REQ_WALMART_BEST:
        return Object.assign({}, state, {
		    loadingWalmartBest: true
		});
	default:
 	  return { ...state };   
  }
}

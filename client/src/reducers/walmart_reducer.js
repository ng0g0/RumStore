import { 
	REQ_WALMART_LIST,
    RECV_WALMART_LIST,
    REQ_WALMART_INFO,
    RECV_WALMART_INFO
} from '../actions/types';

const INITIAL_STATE = { message: '', error: '', loadingSpinner: true };


function updateObject(oldObject, newValues) {
    return Object.assign({}, oldObject, newValues);
}

function updateItemInArray(array, itemId, updateItemCallback) {
    if (itemId) {
        console.log(itemId);
       const updatedItems = array.map(item => {
        var result = itemId.find(function(it) { return  it.itemId == item.itemid ;  });
        var obj = {};item;
        if(result) {
            obj = Object.assign(item, {
                    name: result.name,
                    thumbnailimage: result.thumbnailimage,
                    upc: result.upc,
                    salePrice: result.salePrice,
                    shortDescription: result.shortDescription,
                    message: result.message
            });

        } else {
            obj = item;
        }
        return obj;
    });
    return updatedItems; 
    } else {
       return array;
    }
    
}



export default function (state = INITIAL_STATE, action) {
  //console.log(action.data);
  switch (action.type) {
	case REQ_WALMART_LIST:
		return Object.assign({}, state, {
		    loadingSpinner: true
		});
	case RECV_WALMART_LIST:
			return Object.assign({}, state, {
				itemList: action.data.itemList,
                items: action.data.items,
				message: action.message,
				loadingSpinner: false
			});
			
	case REQ_WALMART_INFO:
			return Object.assign({}, state, {
			    loadingSpinnerInfo: true
			});
    
	case RECV_WALMART_INFO: {
            //
            const newItems =  updateItemInArray(state.itemList, action.data.items);
            return updateObject(state, {itemList : newItems, message: action.message});
            }
	default:
 	  return { ...state };   
  }
}

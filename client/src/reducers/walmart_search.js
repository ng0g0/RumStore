import { 
	REQ_WALMART_SEARCH,
    RECV_WALMART_SEARCH,
} from '../actions/types';

const INITIAL_STATE = { 
    error: '', 
    searchSpinner: false, 
    formSearch: {stype: 'itemId', search: ''},
    preformSearch: false   
};

function convertItemList(itemList) {
    let itemArray = [];
    if (itemList) {
        itemList.forEach(function(item) {
            let obj = {
               asib: item.asib || "N/A",
               itemid: item.itemid || item.itemId,
               name: item.name,
               noty: item.noty || [],
               thumbnailimage: item.thumbnailimage || item.thumbnailImage,
               salePrice: item.salePrice || "N/A",
               priceIndicator: 0,
               upc: item.upc,
               webstore: item.webstore || "walmart",
               itemdetails: [],
               stock: item.stock
               
            }
            itemArray.push(obj);   
       });
    }
    return itemArray;
}

export default function (state = INITIAL_STATE, action) {
  
  switch (action.type) {
	case REQ_WALMART_SEARCH:
		return Object.assign({}, state, {
			searchSpinner: true,
            formSearch: {
                stype: action.stype || 'itemId', 
                search: action.search || ''
            },
            preformSearch: true  
		});
    case RECV_WALMART_SEARCH:
 			return Object.assign({}, state, {
                searchSpinner: false,
                formSearch: {
                    stype: action.stype || 'itemId', 
                    search: action.search || ''
                },
				itemSearch: convertItemList(action.data.items),
			});        
	default:
 	  return { ...state };   
  }
}

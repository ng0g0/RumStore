import { 
	REQ_WALMART_SEARCH,
    RECV_WALMART_SEARCH,
} from '../actions/types';

const INITIAL_STATE = { 
    error: '', 
    searchSpinner: false, 
    formSearch: {stype: 'itemId', search: '', sort: 'title', itemPage: 10, pageNum: 1, totalItems: 0},
    preformSearch: false   
};

function attributeFilter(object) {
const allowed = ['color', 'size','clothingSize'];
  let attr = {};  
  if (_.isUndefined(object) || _.isNull(object)) {
      return attr;
  } else {
      
    attr =  Object.keys(object)
            .filter(key => allowed.includes(key))
            .reduce((obj, key) => {
                obj[key] = object[key];
                return obj;
            }, {});  
    return attr;
  }
}

function convertItemList(itemList) {
    let itemArray = [];
    if (itemList) {
        itemList.forEach(function(item) {
           // console.log(item);
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
               stock: item.stock,
               attributes: attributeFilter(item.attributes),
               variants: item.variants               
               
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
                search: action.search || '',
                sort: action.sort, 
                itemPage: action.itemPage, 
                pageNum: action.pageNum
            },
            preformSearch: true  
		});
    case RECV_WALMART_SEARCH:
            //console.log(action.data);
 			return Object.assign({}, state, {
                searchSpinner: false,
                formSearch: {
                    stype: action.stype || 'itemId', 
                    search: action.search || '',
                    sort: action.sort, 
                    itemPage: action.itemPage, 
                    pageNum: action.pageNum
                },
				itemSearch: convertItemList(action.data.items),
                totalItems: action.data.totalResults
            });        
	default:
 	  return { ...state };   
  }
}

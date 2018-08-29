import axios from 'axios';
import cookie from 'react-cookie';
import { showNotify } from './toast';
import {SUCCESS_NOTIF, ERROR_NOTIF} from '../consts';
//import jsonp from 'jsonp';

import {
    REQ_WALMART_LIST,
    RECV_WALMART_LIST,
    REQ_WALMART_INFO,
    RECV_WALMART_INFO,
    REQ_ITEM_INFO,
    RECV_ITEM_INFO,
    REQ_WALMART_SEARCH,
    RECV_WALMART_SEARCH,
    RECV_ITEM_2_FORM,
    REQ_ITEM_2_FORM,
    REQ_DB_2_FORM,
    RECV_DB_2_FORM,
    RECV_WALMART_BEST,
    REQ_WALMART_BEST,
    REQ_VAR_ITEMS,
    RECV_VAR_ITEMS,
    REQ_ITEM_PRICE_2_FORM,
    RECV_ITEM_PRICE_2_FORM,
 //CLEAR_BLOCK_INFO
 }
from './types';

import {API_URL, CLIENT_ROOT_URL, API_WALMART_URL, WALMART_API_KEY, WALMART_MAX_ITEMS} from './index';

//= ===============================
// Customer actions
//= ===============================

function requestItemVars() {
   return {type: REQ_VAR_ITEMS}
}

function receiveItemVars(json) {
	return{
		type: RECV_VAR_ITEMS,
		data: json
	}
};

function requestWalmartList() {
   return {type: REQ_WALMART_LIST}
}

function receiveWalmartList(json) {
	return{
		type: RECV_WALMART_LIST,
		data: json
	}
};

function requestWalmartAPI() {
   return {type: REQ_WALMART_INFO}
}
function requestWalmartBEST() {
   return {type: REQ_WALMART_BEST}
}


function receiveWalmartBest(json) {
	return{
		type: RECV_WALMART_BEST,
		data: json
	}
};

//function receiveWalmartAPI() {
//   return {type: RECV_WALMART_INFO}
//}
function requestItemInfo(stype, search, sort, itemPage, pageNum) {
    return {
        type: REQ_WALMART_SEARCH,
        stype: stype,
        search: search,
        sort: sort,
        itemPage: itemPage,
        pageNum: pageNum
    }
}

function receiveItemInfo(json, stype, search, sort, itemPage, pageNum ) {
	return{
		type: RECV_WALMART_SEARCH,
		data: json,
        stype: stype,
        search: search,
        sort: sort,
        itemPage: itemPage,
        pageNum: pageNum
	}
};

function receiveWalmartAPI(json) {
	return{
		type: RECV_WALMART_INFO,
		data: json
	}
};

function copyItemToForm(item) {
	return{
		type: RECV_ITEM_2_FORM,
		data: item
	}
};

function requestItem2Form() {
   return {type: REQ_ITEM_2_FORM}
}

function requestItemPrice2Form() {
     return {type: REQ_ITEM_PRICE_2_FORM}
}

function addItemPriceToForm(item) {
  return{
    type: RECV_ITEM_PRICE_2_FORM,
    data: item
  }
}

function requestDB2Form() {
   return {type: REQ_DB_2_FORM}
}

function copyDBToForm(item, terra) {
	return{
		type: RECV_DB_2_FORM,
		data: item,
    terra: terra
	}
};


//http://api.walmartlabs.com/v1/items?apiKey=upxrg7rpj4hjew5jbjwqhwkf&itemId=17201599,469836497

export function deleteWalmarItem(items) {
  //  console.log(`deleteWalmarItem:${items}`);
return function (dispatch) {
	dispatch(requestWalmartList());
	return axios({ url: `${API_URL}/walmart/${items}`,
			method: 'delete',
			headers: { Authorization: cookie.load('token') }
    })
    .then((response) => {
        dispatch(fetchWalmarUserList());
    })
    .catch((error) => {
		console.log(error)
        dispatch(fetchWalmarUserList());
	});
  };
}

export function saveItem(props) {
    return function (dispatch) {
    axios.post(`${API_URL}/walmart/item`, { props }
    ,{ headers: { Authorization: cookie.load('token') }})
    .then((response) => {
		//console.log(response);
        if (response.error) {
            showNotify(response.error, ERROR_NOTIF );
        } else {
            showNotify(response.data.message, SUCCESS_NOTIF );
            //dispatch(fetchBlockList());
            dispatch(fetchWalmarUserList());
        }
    })
    .catch((error) => {
		console.log(error);
        showNotify('Error during creation', ERROR_NOTIF );
    });
  };
}
export function bestItems() {
    return function (dispatch) {
        dispatch(requestWalmartBEST());
        return axios({ url: `${API_URL}/walmart/bestitem`,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
            })
        .then((response) => {
            dispatch(receiveWalmartBest(response.data));
        })
        .catch((error) => {
            console.log(error)
		});
    }
}


export function searchFunc(props) {
    //console.log(props);
    return function (dispatch) {
        dispatch(requestItemInfo(props.stype, props.search, props.sort, props.itemPage, props.pageNum));
        return axios({ url: `${API_URL}/walmart/item/search/${props.stype}/${props.search}/${props.pageNum}/${props.itemPage}/${props.sort}`,
			method: 'get'
      //,headers: { Authorization: cookie.load('token') }
            })
        .then((response) => {
            //console.log(response.data);
           //, sort, itemPage, pageNum
            dispatch(receiveItemInfo(response.data, props.stype, props.search, props.sort, props.itemPage, props.pageNum));
        })
        .catch((error) => {
            console.log(error)
		});
    }
}

export function fetchItemVarsAPI(items) {
    return function (dispatch) {
        dispatch(requestItemVars());
        return axios({ url: `${API_URL}/walmart/item/${items}`,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
            })
        .then((response) => {
            dispatch(receiveItemVars(response.data));
        })
        .catch((error) => {
            console.log(error)
		});
    };
}


export function fetchFromWalmarAPI(items) {
    return function (dispatch) {
        return axios({ url: `${API_URL}/walmart/item/${items}`,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
            })
        .then((response) => {
            dispatch(receiveWalmartAPI(response.data));
        })
        .catch((error) => {
            console.log(error)
		});
    };
}

export function itemPriceToAddForm(item) {
  return function (dispatch) {
    dispatch(requestItemPrice2Form());
    return axios({
        url: `${API_URL}/walmart/item/${item}`,
        method: 'get',
        headers: { Authorization: cookie.load('token') }
      }).then((response) => {
        console.log(response.data);
        dispatch(addItemPriceToForm(response.data));
      }).catch((error) => {
        console.log(error)
      });
    };

}

export function itemToAddForm(items) {
    //console.log(`itemToAddForm: ${items}`)
    return function (dispatch) {
        dispatch(requestItemPrice2Form());
        dispatch(requestItem2Form());
        return axios({
          url: `${API_URL}/walmart/itemterra/${items}`,
			    method: 'get',
			    headers: { Authorization: cookie.load('token') }
        })
        .then((response) => {
            //console.log(response.data);
            //product.productId.usItemId
            //dispatch(itemPriceToAddForm(response.data));
            dispatch(copyItemToForm(response.data));

        })
        .catch((error) => {
            console.log(error)
		});
    };
}

export function dbToAddForm(item) {
  //console.log(item);
    return function (dispatch) {
      dispatch(requestDB2Form());
      return axios({
        url: `${API_URL}/walmart/itemterra/${item.itemid}`,
        method: 'get',
        headers: { Authorization: cookie.load('token') }
      })
      .then((response) => {
          //console.log(response.data);
          dispatch(copyDBToForm(item, response.data));
      })
      .catch((error) => {
    		console.log(error)
    	});
    };
}

export function walmartDailyRefresh() {
    //console.log('walmartDailyRefresh');
    return function (dispatch) {
    return axios({ url: `${API_URL}/walmart/dailyRefresh`,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
    })
    .then((response) => {
        if (response.error) {
            showNotify(response.error, ERROR_NOTIF );
        } else {
            let message = 'Schedule started for Walmart Items Updated';
            showNotify(message, SUCCESS_NOTIF );
            dispatch(fetchWalmarUserList());
        }
    })
    .catch((error) => {
		console.log(error);
        showNotify('Error during creation', ERROR_NOTIF );
    });
  };
}

export function fetchWalmarUserList() {
  return function (dispatch) {
	dispatch(requestWalmartList());
	return axios({ url: `${API_URL}/user/walmartList`,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
    })
    .then((response) => {
       // console.log(response.data)
        dispatch(receiveWalmartList(response.data));
       // console.log(response.data);
        //dispatch(fetchFromWalmarAPI(response.data.items.list));
    })
    .catch((error) => {
		console.log(error)
		//dispatch(errorHandler(error));
	});
  };
}

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
    RECV_DB_2_FORM,
    RECV_WALMART_BEST,
    REQ_WALMART_BEST 
 //CLEAR_BLOCK_INFO
 } 
from './types';

import {API_URL, CLIENT_ROOT_URL, API_WALMART_URL, WALMART_API_KEY, WALMART_MAX_ITEMS} from './index'; 

//= ===============================
// Customer actions
//= ===============================

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
function requestItemInfo(stype, search) {
    return {
        type: REQ_WALMART_SEARCH,
        stype: stype,
        search: search
    } 
}

function receiveItemInfo(json, stype, search) {
	return{
		type: RECV_WALMART_SEARCH,
		data: json,
        stype: stype,
        search: search
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
function copyDBToForm(item) {
	return{
		type: RECV_DB_2_FORM,
		data: item
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
        dispatch(requestItemInfo(props.stype, props.search));
        return axios({ url: `${API_URL}/walmart/item/search/${props.stype}/${props.search}`,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
            })
        .then((response) => {
            //console.log(response.data);
            dispatch(receiveItemInfo(response.data, props.stype, props.search));
        })
        .catch((error) => {
            console.log(error)
		}); 
    }
}

export function fetchFromWalmarAPI(items) {
  //  console.log(`Items:${items}`);
    return function (dispatch) {
        var sentItems;
        var leftItems;
        var itemArray = [];
        if (Array.isArray(items) ) {
            itemArray = items.split(",");
        }
        var cnt = Math.ceil(itemArray.length/WALMART_MAX_ITEMS);
        if (cnt > 1) {
            sentItems =  itemArray.splice(0,WALMART_MAX_ITEMS).join();
            leftItems = items.split(",").splice(WALMART_MAX_ITEMS).join();
            setTimeout(function() { dispatch(fetchFromWalmarAPI(leftItems)); }, 500);
            
        } else {
            sentItems = items;
        }
     //   console.log(`Sent Items:${sentItems}`);
        return axios({ url: `${API_URL}/walmart/item/${sentItems}`,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
            })
        .then((response) => {
      //      console.log(response.data);
            dispatch(receiveWalmartAPI(response.data));
        })
        .catch((error) => {
            console.log(error)
		});
    };    
}
export function itemToAddForm(item) {
    return function (dispatch) {
       dispatch(copyItemToForm(item)); 
    };        
}

export function dbToAddForm(item) {
    return function (dispatch) {
       dispatch(copyDBToForm(item)); 
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
        dispatch(fetchFromWalmarAPI(response.data.items.list));
    })
    .catch((error) => {
		console.log(error)
		//dispatch(errorHandler(error));
	});
  };
}



    



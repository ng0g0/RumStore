import axios from 'axios';
import cookie from 'react-cookie';
//import { showNotify } from './toast';
import {SUCCESS_NOTIF, ERROR_NOTIF} from '../consts';
//import jsonp from 'jsonp';

import { 
 REQ_WALMART_LIST,
 RECV_WALMART_LIST,
 REQ_WALMART_INFO,
 RECV_WALMART_INFO
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

//function receiveWalmartAPI() {
//   return {type: RECV_WALMART_INFO}  
//}

function receiveWalmartAPI(json) {
	return{
		type: RECV_WALMART_INFO,
		data: json
	}
};

//http://api.walmartlabs.com/v1/items?apiKey=upxrg7rpj4hjew5jbjwqhwkf&itemId=17201599,469836497

export function deleteWalmarItem(items) {
    console.log(`deleteWalmarItem:${items}`);
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

export function fetchFromWalmarAPI(items) {
    console.log(`Items:${items}`);
    return function (dispatch) {
        var sentItems;
        var leftItems;
        var itemArray = items.split(",");
        var cnt = Math.ceil(itemArray.length/WALMART_MAX_ITEMS);
        console.log(`Pages:${cnt}`);
        if (cnt > 1) {
            sentItems =  itemArray.splice(0,WALMART_MAX_ITEMS).join();
            leftItems = items.split(",").splice(WALMART_MAX_ITEMS).join();
            setTimeout(function() { dispatch(fetchFromWalmarAPI(leftItems)); }, 500);
            
        } else {
            sentItems = items;
        }
        console.log(`Sent Items:${sentItems}`);
        return axios({ url: `${API_URL}/walmart/item/${sentItems}`,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
            })
        .then((response) => {
            console.log(response.data);
            dispatch(receiveWalmartAPI(response.data));
        })
        .catch((error) => {
            console.log(error)
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
        console.log(response.data)
        dispatch(receiveWalmartList(response.data));
        console.log(response.data);
        dispatch(fetchFromWalmarAPI(response.data.items.list));
    })
    .catch((error) => {
		console.log(error)
		//dispatch(errorHandler(error));
	});
  };
}



    



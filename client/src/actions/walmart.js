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

import {API_URL, CLIENT_ROOT_URL, API_WALMART_URL, WALMART_API_KEY} from './index'; 

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

export function fetchFromWalmarAPI(items) {
    console.log(`Items:${items}`);
    return function (dispatch) {
        dispatch(requestWalmartAPI());
        return axios({ url: `${API_URL}/walmart/item/${items}`,
			timeout: 2000,
			method: 'get',
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
			timeout: 2000,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
    })
    .then((response) => {
        console.log(response.data)
        dispatch(receiveWalmartList(response.data));
    })
    .catch((error) => {
		console.log(error)
		//dispatch(errorHandler(error));
	});
  };
}

export function fetchBlockInfo(bid) {
   console.log(bid); 
  return function (dispatch) {
	dispatch(requestBlockInfo());  
	return axios({ url: `${API_URL}/block/${bid}`,
			timeout: 2000,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
    })
    .then((response) => {
        console.log(response);
        dispatch(receiveBlockInfo(response.data));
    })
	.catch((error) => {
		console.log(error)
	});
  };  
}



    



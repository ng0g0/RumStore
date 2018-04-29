import axios from 'axios';
import cookie from 'react-cookie';
import { showNotify } from './toast';
import {SUCCESS_NOTIF, ERROR_NOTIF} from '../consts';

//import { getData, postData//, putData, deleteData 
//} from './index';
import { 
 FETCH_ENTRY,
 REQ_ENTRY_DATA,
 RECV_ENTRY_DATA,
 REQ_VIEW_DATA,
 RECV_VIEW_DATA,
 REQ_BLOCK_INFO,
 RECV_BLOCK_INFO
 } 
from './types';

import {API_URL, CLIENT_ROOT_URL} from './index'; 

//= ===============================
// Customer actions
//= ===============================

function requestListData() {
	return {type: REQ_ENTRY_DATA}
};

function receiveListData(json) {
	return{
		type: RECV_ENTRY_DATA,
		data: json
	}
};

function requestViewData() {
	return {type: REQ_VIEW_DATA}
};

function receiveViewData(json) {
	return{
		type: RECV_VIEW_DATA,
		data: json
	}
};

function errorHandler(error) {
	return{
		type: ERROR_RESPONSE,
		message: error
  };
}; 



function receiveBlockInfo(json) {
	return{
		type: RECV_BLOCK_INFO,
		data: json
	}
};


export function fetchEntryList() {
  return function (dispatch) {
	dispatch(requestListData());  
	return axios({ url: `${API_URL}/entry/list`,
			timeout: 2000,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
    })
    .then((response) => {
        dispatch(receiveListData(response.data));
    })
    .catch((error) => {
		console.log(error)
		//dispatch(errorHandler(error));
	});
  };
}

export function viewEntry(eid) {
  return function (dispatch) {
	dispatch(requestViewData());  
	return axios({ url: `${API_URL}/entry/${eid}`,
			timeout: 2000,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
    })
    .then((response) => {
        dispatch(receiveViewData(response.data));
    })
	.catch((error) => {
		console.log(error)
		//dispatch(errorHandler(error));
	});
    //.catch(response => dispatch(errorHandler(response.data.error)));
  };
}

export function fetchEntryInfo(eid) {
  return function (dispatch) {
	dispatch(requestViewData());  
	return axios({ url: `${API_URL}/entry/${eid}`,
			timeout: 2000,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
    })
    .then((response) => {
        dispatch(receiveViewData(response.data));
    })
	.catch((error) => {
		console.log(error)
		//dispatch(errorHandler(error));
	});
    //.catch(response => dispatch(errorHandler(response.data.error)));
  };  
}



/*
export function fetchBlockInfo(bid) {
  return function (dispatch) {
	dispatch(requestBlockInfo());  
	return axios({ url: `${API_URL}/block/${eid}`,
			timeout: 2000,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
    })
    .then((response) => {
        dispatch(receiveBlockInfo(response.data));
    })
	.catch((error) => {
		console.log(error)
	});
  };  
}
*/





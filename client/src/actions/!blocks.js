import axios from 'axios';
import cookie from 'react-cookie';
import { showNotify } from './toast';
import {SUCCESS_NOTIF, ERROR_NOTIF} from '../consts';
import {viewEntry} from './entry'

import { 
 REQ_BLOCK_LIST,
 RECV_BLOCK_LIST,
 REQ_BLOCK_INFO,
 RECV_BLOCK_INFO,
 CLEAR_BLOCK_INFO,
 REQ_APART_INFO,
 RECV_APART_INFO
 
 } 
from './types';

import {API_URL, CLIENT_ROOT_URL} from './index'; 

//= ===============================
// Customer actions
//= ===============================

function requestBlockList() {
   return {type: REQ_BLOCK_LIST} 
}

function receiveBlockList(json) {
	return{
		type: RECV_BLOCK_LIST,
		data: json
	}
};

function requestBlockInfo() {
   return {type: REQ_BLOCK_INFO} 
}

function requestApartmentInfo() {
   return {type: REQ_APART_INFO} 
}

function receiveApartmentInfo(json) {
	return{
		type: RECV_APART_INFO,
		data: json
	}
};

function clearBlockInfo() {
   return {type: CLEAR_BLOCK_INFO}  
}

function receiveBlockInfo(json) {
	return{
		type: RECV_BLOCK_INFO,
		data: json
	}
};

export function resetBlockInfo(){
    return function (dispatch) {
        dispatch(clearBlockInfo() );  
    }
}

export function fetchBlockList() {
  return function (dispatch) {
	
	return axios({ url: `${API_URL}/block/list`,
			timeout: 2000,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
    })
    .then((response) => {
        console.log(response);
        dispatch(receiveBlockList(response.data));
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


export function saveBlock({name, objid, city, country, distict, number, postCode, street}) {
    //console.log('saveBlock');
    //console.log(city);
    return function (dispatch) {
    axios.post(`${API_URL}/block/add`, { name, objid, city, country, distict, number, postCode, street }
    ,{ headers: { Authorization: cookie.load('token') }}) 
    .then((response) => {
		//console.log(response);
        if (response.error) {
            showNotify(response.error, ERROR_NOTIF );
        } else {
            showNotify(response.data.message, SUCCESS_NOTIF );
            dispatch(fetchBlockList());
        }
    })
    .catch((error) => {
		console.log(error);
        showNotify('Error during creation', ERROR_NOTIF );
    });
  };
}

export function deleteBlock(objid , type) {
   return function (dispatch) { 
    axios.delete(`${API_URL}/block/${objid}`,{ headers: { Authorization: cookie.load('token') }, data: {type: `${type}`}})
    .then((response) => {
        console.log(response);
        showNotify(response.data.message, SUCCESS_NOTIF );
        dispatch(fetchBlockList());
    })
	.catch((error) => {
        console.log(response);
        showNotify(response.message, SUCCESS_NOTIF );
	});
   }
}

export function saveEntry({name, objid, number}) {
    return function (dispatch) {
    axios.post(`${API_URL}/entry/add`, { name, objid, number }
    ,{ headers: { Authorization: cookie.load('token') }}) 
    .then((response) => {
		//console.log(response);
        if (response.error) {
            showNotify(response.error, ERROR_NOTIF );
        } else {
            showNotify(response.data.message, SUCCESS_NOTIF );
            dispatch(fetchBlockList());
        }
    })
    .catch((error) => {
		console.log(error);
        showNotify('Error during creation', ERROR_NOTIF );
    });
  };
}

export function saveFloor( props ) {
    var eid = 5;
    return function (dispatch) {
    axios.post(`${API_URL}/entry/${eid}/floor`, { props }
    ,{ headers: { Authorization: cookie.load('token') }}) 
    .then((response) => {
		//console.log(response);
        if (response.error) {
            showNotify(response.error, ERROR_NOTIF );
        } else {
            showNotify(response.data.message, SUCCESS_NOTIF );
            //dispatch(fetchBlockList());
            dispatch(viewEntry(props.objid));
        }
    })
    .catch((error) => {
		console.log(error);
        showNotify('Error during creation', ERROR_NOTIF );
    });
  };
}

export function saveApartmnet( props ) {
    var eid = 5;
    var aip = 6;
    return function (dispatch) {
    axios.post(`${API_URL}/entry/${eid}/${aip}`, { props }
    ,{ headers: { Authorization: cookie.load('token') }}) 
    .then((response) => {
		//console.log(response);
        if (response.error) {
            showNotify(response.error, ERROR_NOTIF );
        } else {
            showNotify(response.data.message, SUCCESS_NOTIF );
            dispatch(viewEntry(props.objid));
        }
    })
    .catch((error) => {
		console.log(error);
        showNotify('Error during creation', ERROR_NOTIF );
    });
  };
}

export function fetchApartmentInfo(eid, aid) {
   console.log(eid); 
   console.log(aid); 
  return function (dispatch) {
	dispatch(requestApartmentInfo());  
	return axios({ url: `${API_URL}/entry/${eid}/${aid}`,
			timeout: 2000,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
    })
    .then((response) => {
        console.log(response);
        dispatch(receiveApartmentInfo(response.data));
    })
	.catch((error) => {
		console.log(error)
	});
  };  
}


    



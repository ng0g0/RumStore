import axios from 'axios';
import cookie from 'react-cookie';
import { REQ_ITEM_UPDATE,  RECV_ITEM_UPDATE } from './types';
import {API_URL} from './index'; 

function requestItemUpdate() {
   return {type: REQ_ITEM_UPDATE} 
}

function receiveItemUpdate(json) {
	return{
		type: RECV_ITEM_UPDATE,
		data: json
	}
};

export function fetchItemUpdate() {
  return function (dispatch) {
	dispatch(requestItemUpdate());
	return axios({ url: `${API_URL}/user/walmartUpdate`,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
    })
    .then((response) => {
        dispatch(receiveItemUpdate(response.data));
    })
    .catch((error) => {
		console.log(error)
	});
  };
}



    



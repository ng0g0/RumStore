import axios from 'axios';
import cookie from 'react-cookie';
import { logoutUser } from './auth';
import { STATIC_ERROR
, SEND_CONTACT_FORM,
 REQ_USER_DATA, 
 RECV_USER_DATA, 
 ERROR_RESPONSE, 
 LANG_CHANGE 
 } from './types';

//= ===============================
// Utility actions
//= ===============================

function returnApiUrl() {
	if (process.env.NODE_ENV !== undefined)  {
		if (process.env.NODE_ENV === 'production') {
			return '/api';
		} else {
			return 'http://localhost:5000/api';
		}
	} else {
		return 'http://localhost:5000/api';
	}
}

function returnClientUrl() {
	if (process.env.NODE_ENV !== undefined)  {
		if (process.env.NODE_ENV === 'production') {
			return 'https://rumstore.herokuapp.com';
		} else {
			return 'http://localhost:5000';
		}
	} else {
		return 'http://localhost:5000';
	}
}

export const API_URL = returnApiUrl() ;
export const CLIENT_ROOT_URL = returnClientUrl();
export const API_WALMART_URL = 'http://api.walmartlabs.com';
export const WALMART_API_KEY = 'upxrg7rpj4hjew5jbjwqhwkf';
export const WALMART_MAX_ITEMS = 10;

export function setLang(lang) {
	cookie.save('i18n', lang);
	dispatch({ type: LANG_CHANGE, payload: { lang: lang } });
}


function requestData(type) {
	return {type: type}
}

function receiveData(type, json) {
	return{
		type: RECV_USER_DATA,
		data: json
	}
};

function requestUserData() {
	return {type: REQ_USER_DATA}
};

function receiveUserData(json) {
	return{
		type: RECV_USER_DATA,
		data: json
	}
};

export function fetchUser(uid) {
  return function (dispatch) {
	dispatch(requestUserData());  
	console.log(uid);
	return axios({ url: `${API_URL}/user/${uid}`,
			timeout: 2000,
			method: 'get',
			headers: { Authorization: cookie.load('token') }
    })
    .then((response) => {
		console.log(response);
        dispatch(receiveUserData(response.data.user));
    })
    .catch((response) => {
		console.log(response);
	dispatch(errorHandler(response.data.error)
	);});
  };
}

export function deleteUser(uid) {
	return function (dispatch) {
		axios.delete(`${API_URL}/user/${uid}`, { uid })
		.then((response) => {
			    let errorMessage = 'User deleted';  
				dispatch(logoutUser(errorMessage));
			})
    .catch((error) => {
		console.log(error);
		errorHandler(dispatch, error.response, ERROR_RESPONSE);
    });
	};
}

export function updateUser({ email, firstName, lastName, password, uid, refresh }) {
	return function (dispatch) {
    axios.post(`${API_URL}/user/${uid}`, { email, firstName, lastName, password, uid, refresh })
    .then((response) => {
		console.log(response);
		if (!response.data.error) {
			console.log('OK');
			dispatch(fetchUser(uid));
		} else {
			console.log('NOK');
			dispatch({
				type: ERROR_RESPONSE,
				payload: {
						error: response.data.error
				}
			});
		}
    })
    .catch((error) => {
		console.log(error);
		errorHandler(dispatch, error.response, ERROR_RESPONSE);
    });
  };
}

export function errorHandler(dispatch, error, type) {
  console.log('Error type: ', type);
  console.log(error);

  let errorMessage = error.response ? error.response.data : error;

   // NOT AUTHENTICATED ERROR
  if (error.status === 401 || error.response.status === 401) {
    errorMessage = 'You are not authorized to do this.';
    return dispatch(logoutUser(errorMessage));
  }

  dispatch({
    type,
    payload: errorMessage,
  });
}

// Post Request
export function postData(action, errorType, isAuthReq, url, dispatch, data) {
  const requestUrl = API_URL + url;
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: cookie.load('token') } };
  }

  axios.post(requestUrl, data, headers)
  .then((response) => {
    dispatch({
      type: action,
      payload: response.data,
    });
  })
  .catch((error) => {
    errorHandler(dispatch, error.response, errorType);
  });
}

// Get Request
export function getData(action, errorType, isAuthReq, url, dispatch) {
  const requestUrl = API_URL + url;
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: cookie.load('token') } };
  }

  axios.get(requestUrl, headers)
  .then((response) => {
    dispatch({
      type: action,
      payload: response.data,
    });
  })
  .catch((error) => {
    errorHandler(dispatch, error.response, errorType);
  });
}

// Put Request
export function putData(action, errorType, isAuthReq, url, dispatch, data) {
  const requestUrl = API_URL + url;
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: cookie.load('token') } };
  }

  axios.put(requestUrl, data, headers)
  .then((response) => {
    dispatch({
      type: action,
      payload: response.data,
    });
  })
  .catch((error) => {
    errorHandler(dispatch, error.response, errorType);
  });
}

// Delete Request
export function deleteData(action, errorType, isAuthReq, url, dispatch) {
  const requestUrl = API_URL + url;
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: cookie.load('token') } };
  }

  axios.delete(requestUrl, headers)
  .then((response) => {
    dispatch({
      type: action,
      payload: response.data,
    });
  })
  .catch((error) => {
    errorHandler(dispatch, error.response, errorType);
  });
}

//= ===============================
// Static Page actions
//= ===============================
export function sendContactForm({ name, emailAddress, message }) {
  return function (dispatch) {
    axios.post(`${API_URL}/communication/contact`, { name, emailAddress, message })
    .then((response) => {
      dispatch({
        type: SEND_CONTACT_FORM,
        payload: response.data.message,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, STATIC_ERROR);
    });
  };
}

import axios from 'axios';
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from './index';
import { LANG_CHANGE, AUTH_USER, AUTH_ERROR, UNAUTH_USER, FORGOT_PASSWORD_REQUEST, RESET_PASSWORD_REQUEST, PROTECTED_TEST } from './types';
import { showNotify } from './toast';
import {SUCCESS_NOTIF, ERROR_NOTIF} from '../consts';

//= ===============================
// Authentication actions
//= ===============================

export function setLanguage(lang) {
	return function (dispatch) {
		cookie.save('i18n', lang);
		dispatch({ type: LANG_CHANGE, payload: { lang: lang } 
		});
	};
}

// TO-DO: Add expiration to cookie
export function loginUser({ email, password }) {
  return function (dispatch) {
    axios.post(`${API_URL}/auth/login`, { email, password })
    .then((response) => {
      cookie.save('token', response.data.token, { path: '/' });
      cookie.save('user', response.data.user, { path: '/' });
      dispatch({ type: AUTH_USER });
      //console.log(`USEROD=${response.data.user.uid}`);
      window.location.href = `${CLIENT_ROOT_URL}/dashboard`;
    })
    .catch((error) => {
	  console.log(error.response); 	
      errorHandler(dispatch, error.response, AUTH_ERROR);
    });
  };
}

export function registerUser(props) {
 console.log(props)   
  return function (dispatch) {
    axios.post(`${API_URL}/auth/register`, { props }
    ,{ headers: { Authorization: cookie.load('token') }})   
    .then((response) => {
      //cookie.save('token', response.data.token, { path: '/' });
      //cookie.save('user', response.data.user, { path: '/' });
      //dispatch({ type: AUTH_USER });
      showNotify(response.message, SUCCESS_NOTIF);
      window.location.href = `${CLIENT_ROOT_URL}/profile`;
    })
    .catch((error) => {
	   console.log(error);	
       //errorHandler(dispatch, error, AUTH_ERROR);
    });
  };
}

export function logoutUser(error) {
  return function (dispatch) {
    dispatch({ type: UNAUTH_USER, payload: error || '' });
    cookie.remove('token', { path: '/' });
    cookie.remove('user', { path: '/' });

    window.location.href = `${CLIENT_ROOT_URL}/login`;
  };
}

export function getForgotPasswordToken({ email }) {
  return function (dispatch) {
    axios.post(`${API_URL}/auth/forgot-password`, { email })
    .then((response) => {
      dispatch({
        type: FORGOT_PASSWORD_REQUEST,
        payload: response.data.message,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR);
    });
	window.location.href = `${CLIENT_ROOT_URL}/login`;
  };
}

export function resetPassword(token, { password }) {
  return function (dispatch) {
    axios.post(`${API_URL}/auth/reset-password/${token}`, { password })
    .then((response) => {
      dispatch({
        type: RESET_PASSWORD_REQUEST,
        payload: response.data.message,
      });
      // Redirect to login page on successful password reset
		cookie.remove('token', { path: '/' });
		cookie.remove('user', { path: '/' });
		browserHistory.push('/login');
	  
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR);
    });
  };
}

export function protectedTest() {
  return function (dispatch) {
    axios.get(`${API_URL}/protected`, {
      headers: { Authorization: cookie.load('token') },
    })
    .then((response) => {
      dispatch({
        type: PROTECTED_TEST,
        payload: response.data.content,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR);
    });
  };
}

import {  toast } from 'react-toastify';
import {SUCCESS_NOTIF, ERROR_NOTIF} from '../consts';

export function showNotify(message, type) {
  switch(type) {
    case SUCCESS_NOTIF: 
        toast.success(message);
        break;
    case ERROR_NOTIF:
        toast.error(message);
        break;    
    default:
       toast(message);     
  }
}





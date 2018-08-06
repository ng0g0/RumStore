import {
    REQ_VAR_ITEMS,
    RECV_VAR_ITEMS,
    REQ_ITEM_2_FORM,
    RECV_DB_2_FORM
} from '../actions/types';
//import dayjs from 'dayjs';
import _ from 'lodash';

const INITIAL_STATE = {
    message: '',
    error: '',
    loadingSpinnerVar: false,
    itemVars: []
};

function attributeFilter(object) {
  //  console.log(object);
const allowed = ['color', 'size','clothingSize'];
  let attr = {};
  if (_.isUndefined(object) || _.isNull(object)) {
      return attr;
  } else {

    attr =  Object.keys(object)
            .filter(key => allowed.includes(key))
            .reduce((obj, key) => {
                obj[key] = object[key];
                return obj;
            }, {});
    return attr;
  }
}


function attribute2Array(object) {
    const allowed = ['color', 'size','clothingSize'];
    let attr = [];
    if (_.isUndefined(object) || _.isNull(object)) {
        return attr;
    } else {

        Object.keys(object)
            .filter(key => allowed.includes(key))
            .map((obj, key) => {
            attr.push({name: obj,value: object[obj]})
            });
        return attr;
    }
}


function convertItemList(itemList) {
    let itemArray = [];
    if (itemList) {
        itemList.forEach(function(item) {
            let obj = {
               asib: item.asib || "N/A",
               itemid: item.itemid || item.itemId,
               name: item.name,
               noty: item.noty || [],
               thumbnailimage: item.thumbnailimage || item.thumbnailImage,
               salePrice: item.salePrice || item.saleprice,
               priceIndicator: 0,
               upc: item.upc,
               webstore: item.webstore || "walmart",
               itemdetails: item.itemdetails || [],
               stock: item.stock,
               id: item.id || 0,
               attributes: attributeFilter(item.attributes),
               attrArray:  attribute2Array(item.attributes),
               variants: item.variants
            }
            itemArray.push(obj);
       });
    }
    return itemArray;
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case RECV_DB_2_FORM:
      //  console.log(action.data);
        return Object.assign({}, state, {
          loadingSpinnerVar: false,
          itemVars: [],
        });
    case REQ_ITEM_2_FORM:
        return Object.assign({}, state, {
            loadingSpinnerVar: false,
            itemVars: [],
        });
    case REQ_VAR_ITEMS:
        return Object.assign({}, state, {
            loadingSpinnerVar: true,
            itemVars: [],
        });
    case RECV_VAR_ITEMS:
        //console.log(action.data);
        return Object.assign({}, state, {
            itemVars: convertItemList(action.data.items),
            loadingSpinnerVar: false
        });
	default:
 	  return { ...state };
  }
}

import {
	REQ_WALMART_LIST,
  RECV_WALMART_LIST,
  RECV_WALMART_INFO,
} from '../actions/types';

import dayjs from 'dayjs';
import _ from 'lodash';

const INITIAL_STATE = {
    message: '',
    error: '',
    loadingSpinner: true,
    loadingSpinnerInfo: true,
    loadingSpinnerAdd: false,
    loadingSpinnerVar: true,
    addItem: false,
    performSearch: {stype: 'itemId', search: ''}
};


function updateObject(oldObject, newValues) {
    return Object.assign({}, oldObject, newValues);
}

function updateItemInfo(oldInfo, newInfo ) {
    return Object.assign(oldInfo, {
                    webid: newInfo.itemId,
                    webstore: 'walmart',
                    itemname: newInfo.name,
                    itemimgurl: newInfo.thumbnailImage,
                    itemupc: newInfo.upc,
                    itemPrice: newInfo.salePrice,
                    itemstock: newInfo.stock,
                    itemsAttributes: newInfo.attributes
            });
}

function convertItemDetail(itemDetails) {
    var result = _.chain(itemDetails).groupBy("dettype").toPairs()
            .map(function (currentItem) {
                var newObject = [];
                currentItem[1].forEach(function(it) {
                    var date = dayjs(it.detdate).format('DD-MMM-YY');
                    var value = Number.parseFloat(it.detvalue) || it.detvalue;
                    newObject.push(Object.assign({y:value, x:date}))
                });
                newObject.sort(function(a,b) {
                     a = new Date(a.x);
                     b = new Date(b.x);
                    return (a > b) ? 1 : ((b > a) ? -1 : 0);
                });
                var newArray = [currentItem[0],newObject];
                return _.zipObject(["dettype","items"], newArray);
            }).value();
    return result;
}

function updatePriceIndicator(itemDetails) {
    if (!itemDetails) {
        return 0;
    }
    const item = itemDetails.find( item => item.dettype === 'salePrice' );
    let result = 0;
    if (item.items) {
    if (item.items.length>0) {
            if (item.items.length>1) {
                let a = item.items[item.items.length -1];
                let b = item.items[item.items.length -2];
                if (a.y > b.y) {result = 1;}
                if (a.y < b.y) {result = -1;}
            }
        }
    }
    return result;
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

function attributeFilter(object) {
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
               priceIndicator: updatePriceIndicator(item.itemDetails),
               upc: item.upc,
               webstore: item.webstore || "walmart",
               itemdetails: convertItemDetail(item.itemdetails),
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

function updateItemDetails(itemDetails, noty, updateItem) {
    if (updateItem) {
        if (noty) {
            var outArray = [];
            noty.forEach(function(notification) {
                let elem = notification;
                let elemValue = updateItem[notification];
                if (elem ==="stock") {
                    elemValue = (elemValue === "Available")? 1: 0;
                }
                var curDate = dayjs().format('DD-MMM-YY');
                let x = {y: elemValue, x: curDate};
                itemDetails.forEach((element, index) => {
                    if(element.dettype === elem) {
                       itemDetails[index].items = itemDetails[index].items.concat(x);
                    }
                });
            });
            return    itemDetails;
        }
    }
    return itemDetails;
}

function updateItemInArray(itemList, updateItems) {
    let arrayList = [];
    if (updateItems) {
        const updatedItems = itemList.map(item => {
            var result = updateItems.find(function(it) { return  it.itemId == item.itemid ;  });
            var obj = {};
            if(result) {
                let itemDetails = updateItemDetails(item.itemdetails, item.noty, result);
                obj = Object.assign(item, {
                    thumbnailimage: result.thumbnailImage,
                    salePrice: result.salePrice,
                    priceIndicator: 0,
                    upc: result.upc,
                    itemdetails: itemDetails,
                    message: result.message,
                    stock: (result.stock === "Available") ? 1 :0,
                    attributes: attributeFilter(result.attributes),
                    attrArray:  attribute2Array(result.attributes),
                    noty: item.noty || []
                });

            } else {
                obj = item;
            }
            return obj;
        });
        return updatedItems;
    } else {
        return itemList;
    }
    return itemArray;
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
		case REQ_WALMART_LIST:
			return Object.assign({}, state, {
		    loadingSpinner: true
			});
		case RECV_WALMART_LIST:
			return Object.assign({}, state, {
				itemList: convertItemList(action.data.itemList),
        items: action.data.items,
				message: action.message,
				loadingSpinner: false
			});
    case RECV_WALMART_INFO: {
        const newItems =  updateItemInArray(state.itemList, action.data.items);
        return updateObject(state, {itemList : newItems, message: action.message});
        }
	 default:
 	  	return { ...state };
  }
}

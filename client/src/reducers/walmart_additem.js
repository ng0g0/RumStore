import {
	  //REQ_WALMART_LIST,
    //RECV_WALMART_LIST,
    //RECV_WALMART_INFO,
    RECV_ITEM_2_FORM,
    REQ_ITEM_2_FORM,
    RECV_DB_2_FORM,
		RECV_ITEM_PRICE_2_FORM,
		REQ_ITEM_PRICE_2_FORM,
} from '../actions/types';

import dayjs from 'dayjs';
import _ from 'lodash';

const INITIAL_STATE = {
    message: '',
    error: '',
//    loadingSpinner: true,
//    loadingSpinnerInfo: true,
    loadingSpinnerAdd: false,
    loadingSpinnerVar: true,
		loadingSpinnerPrice: true,
    addItem: false
//    performSearch: {stype: 'itemId', search: ''}
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

function terra2attribute(object) {
  var attr = [];
  console.log(object);
  if (_.isUndefined(object) || _.isNull(object)) {
		console.log('empty');
		return attr;
  } else {
	   let item = object.productId.productId;
	    console.log(item);
	    let variants = object.variantInformation.variantProducts
		  variants.filter((vars) => {
			     return vars.productId === item;
		  }).map((obj, key) => {
			  Object.keys(obj.variants).map((obj1, key) => {
				    console.log(obj.variants[obj1])
						attr.push({name: obj1,value: obj.variants[obj1].name})
					});
		  });
      return attr;
    }
}


function convertTerraItem(item) {
	let obj = {
		 asib: "N/A",
		 itemid: item.productId.usItemId,
		 name: item.productAttributes.productName,
	   noty: [],
		 thumbnailimage: item.productImages.imageAssets[0].assetSizeUrls.IMAGE_SIZE_60,
		 salePrice: 'N/A', //item.offers[0].pricesInfo.priceMap.CURRENT.price,
		 //priceIndicator: updatePriceIndicator(item.itemDetails),
		 upc: item.productAttributes.upc,
		 webstore: item.webstore || "walmart",
		 //itemdetails: convertItemDetail(item.itemdetails),
		 stock: item.offers[0].productAvailability.availabilityStatus,
		 id: item.id || 0,
		 attributes: {}, //attributeFilter(item.attributes),
		 attrArray:  terra2attribute(item), //attribute2Array(item.attributes),
		 variants: item.variantInformation.variantProducts
	}
	console.log(obj);
	return obj;
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case REQ_ITEM_2_FORM:
        return Object.assign({}, state, {
            loadingSpinnerAdd: true,
						loadingSpinnerPrice: true,
            addItem: true
        });
	case RECV_ITEM_2_FORM:
			console.log(action.data);
        let itemX = convertTerraItem(action.data.product);
        return Object.assign({}, state, {
            itemInfo: itemX,
            loadingSpinnerAdd: false,
						loadingSpinnerPrice: true,
            addItem: true
        });
    case RECV_DB_2_FORM:
      //  console.log(action.data);
        return Object.assign({}, state, {
            itemInfo: action.data,
            addItem: true
        });
		case RECV_ITEM_PRICE_2_FORM:
    //  let NewState =
			return Object.assign({}, state, {
				itemInfo: newState,
				loadingSpinnerPrice: false
				addItem: true
			});

    case RECV_WALMART_INFO: {
        const newItems =  updateItemInArray(state.itemList, action.data.items);
        return updateObject(state, {itemList : newItems, message: action.message});
        }
	default:
 	  return { ...state };
  }
}

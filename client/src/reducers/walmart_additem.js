import {
    RECV_ITEM_2_FORM,
    REQ_ITEM_2_FORM,
    RECV_DB_2_FORM,
    REQ_DB_2_FORM,
} from '../actions/types';

import _ from 'lodash';

const INITIAL_STATE = {
    message: '',
    error: '',
    loadingSpinnerAdd: false,
    loadingSpinnerVar: true,
		loadingSpinnerPrice: true,
    addItem: false,
    itemInfo : {id: 0},
    itemDB: {}
};

function terra2attribute(object) {
  var attr = [];
  //console.log(object);
  if (_.isUndefined(object) || _.isNull(object)) {
		//console.log('empty');
		return attr;
  } else {
	   let item = object.productId.productId;
	    //console.log(item);
	    let variants = object.variantInformation.variantProducts
      if (variants) {
  		  variants.filter((vars) => {
  			     return vars.productId === item;
  		  }).map((obj, key) => {
  			  Object.keys(obj.variants).map((obj1, key) => {
  				    //console.log(obj.variants[obj1])
  						attr.push({name: obj1,value: obj.variants[obj1].name})
  					});
  		  });
      }
      return attr;
    }
}

function convertTerraItem(item, dbitem, itemDB) {
	//console.log(itemDB);
  const itemid = item.productId.usItemId;
	const price = (item.offers) ? item.offers[0].pricesInfo.priceMap.CURRENT.price : 0;
	const stock = (item.offers) ? item.offers[0].productAvailability.availabilityStatus : "not available";
	const asib = (dbitem) ? dbitem.asib : "N/A";
	const noty = (dbitem) ? dbitem.noty : [];
	const id = (dbitem) ? dbitem.id : ((itemDB.itemid === itemid) ? itemDB.id : 0);
  //console.log(id);
	const attributes = (dbitem) ? dbitem.attributes : {};
	let obj = {
		 asib: asib,
		 itemid: itemid,
		 name: item.productAttributes.productName,
		 productId: item.productId.productId,
	   noty: noty,
		 thumbnailimage: item.productImages.imageAssets[0].assetSizeUrls.IMAGE_SIZE_100,
		 salePrice: price,
		 upc: item.productId.upc,
		 webstore: item.webstore || "walmart",
		 stock: stock,
		 id: id,
		 attributes: attributes,
		 attrArray:  terra2attribute(item), //attribute2Array(item.attributes),
		 variants: item.variantInformation.variantProducts
	}
	//console.log(obj);
	return obj;
}


export default function (state = INITIAL_STATE, action) {
  let { itemDB } = state;
  switch (action.type) {
  case REQ_ITEM_2_FORM:
        return Object.assign({}, state, {
            loadingSpinnerAdd: true,
						loadingSpinnerPrice: true,
            itemDB,
            addItem: true
        });
	case RECV_ITEM_2_FORM:

        let itemX = convertTerraItem(action.data.product, null, itemDB );
        return Object.assign({}, state, {
            itemInfo: itemX,
            loadingSpinnerAdd: false,
						loadingSpinnerPrice: true,
            addItem: true,
            itemDB
        });
    case REQ_DB_2_FORM:
    		return Object.assign({}, state, {
          loadingSpinnerAdd: true,
          loadingSpinnerPrice: true,
          itemDB,
    			addItem: true
    		});
    case RECV_DB_2_FORM:
				let itemTerra = convertTerraItem(action.terra.product, action.data, action.data );
        return Object.assign({}, state, {
					itemInfo: itemTerra,
          loadingSpinnerAdd: false,
					loadingSpinnerPrice: true,
          itemDB: action.data,
					addItem: true
        });
	default:
 	  return { ...state };
  }
}

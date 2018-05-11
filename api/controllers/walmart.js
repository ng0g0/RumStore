const pgp = require('pg-promise')(/*options*/);
const db = require('../connection/postgres');
var request = require('request');

var QRE = pgp.errors.QueryResultError;
var qrec = pgp.errors.queryResultErrorCode;
var walmar_key = 'upxrg7rpj4hjew5jbjwqhwkf';


exports.getWalmartSearchedItems = function (req, res, next) {
  console.log(req.params);
 // :sType/::itemId
  
  const searchType = req.params.sType;
  const itemId = req.params.itemId  || 0;
  if (itemId.length >0) {
    if (searchType === "upc") {
        return request({
                uri: `https://api.walmartlabs.com/v1/items?apiKey=${walmar_key}&upc=${itemId}`,
            }).pipe(res);    
        } else {
        return request({
                uri: `https://api.walmartlabs.com/v1/items?apiKey=${walmar_key}&itemId=${itemId}`,
            }).pipe(res);  
        }  
  } else {
      res.status(200).json({ message: 'NO_DATE_FOUND' });
  }
  
   
};    
exports.getWalmartItems = function (req, res, next) {
    console.log(req.params);
   const itemId = req.params.itemId;
   return request({
            uri: `https://api.walmartlabs.com/v1/items?apiKey=upxrg7rpj4hjew5jbjwqhwkf&itemId=${itemId}`,
        }).pipe(res);
    
};

exports.getWalmartItemRequest = function(itemId) {
    console.log(itemId);
   return request({
            uri: `https://api.walmartlabs.com/v1/items?apiKey=upxrg7rpj4hjew5jbjwqhwkf&itemId=${itemId}`,
        }).pipe(res);
} 

exports.WalmartNotification = function() {
    let selectItemSql = "select webid, u.usrid, username, itemid,array_to_string(notification,',')  from rs_items i, rbm_user u " + 
        " where notification is not null "+ 
        " and i.usrid = u.usrid ";
    var itemList = "";    
    db.many(selectItemSql) 
    .then(items=> {
		console.log(items);	
        itemList = itemList.concat(items.webid, ',');
	});
    itemList = itemList.slice(0, -1);
    var responce = [];
    var itemArray = itemList.split(",");
        var cnt = Math.ceil(itemArray.length/10);
        var i;
        for (i = 0; i < cnt; i++) { 
            sentItems =  itemArray.splice(0+i*10,10+i*10).join();
            console.log(`Page ${i} =${sentItems}`);	
            setTimeout(function() { responce.concat(getWalmartItemRequest(sentItems))}, 500);
        }
      console.log(responce);
      
    
}

exports.WalmartAddItems = function (req, res, next) {
  const usrId = req.user.uid;
  const storeName = req.body.props.webstore;
  const webid = req.body.props.webid;
  const name = req.body.props.itemname;
  const imgUrl = req.body.props.itemimgurl;
  const upc = req.body.props.itemupc;
  const asib = req.body.props.itemasib;
  const notification = req.body.props.notification;
  var details = [];
  if (notification.length > 0 )  {
      notification.forEach(function(elem) {
        if (elem === "stock") {
            var valStock = (req.body.props.itemstock === 'Available') ? 1 : 0;
            details.push({type: 'stock', val: valStock, not: `{${elem}}`})
        }
        if (elem === "salePrice") {
            details.push({type: 'salePrice', val: req.body.props.itemPrice, not: `{${elem}}`})    
        }
        
    });
  }
    
   const queries = [];
   var obj;
   db.tx(t => { // automatic BEGIN
        let addItemSql = "insert into rs_items(usrid, webstore,webid,itemname, itemimgurl, itemupc, 	itemasib ) "+
                          " values($1, $2 ,$3 ,$4, $5, $6, $7) RETURNING itemid";
        queries.push(
        t.one(addItemSql,[usrId, storeName, webid, name, imgUrl, upc, asib ])
        .then(data => {
            details.forEach((det) => {
                let addDetaild = "update rs_items set itemdetails = array_append(itemdetails, CAST(ROW($2,$3,now()) as rs_itemdetils)) "+
                    " , notification = array_cat(notification, $4) "+
                    " where itemid = $1";
                queries.push(t.none(addDetaild, [data.itemid, det.type, det.val, det.not]));
            });
        })
        );
        console.log(`ADDED ${webid} Item `);    
   return t.batch(queries);
   })
    .then(data => {
        console.log('OK');
        return res.status(200).json({ block: obj, message: `Item ${webid} added ` });
    })
    .catch(error => {
        console.log(error);
        return res.status(200).json({ block: obj, error: error});
    });
};  

exports.getUserItems = function (req, res, next) {
  console.log('req.user');
  console.log(req.user);	
  const usrId = req.user.uid;
  var obj;	
  let itemsSql = "select string_agg(z.itemid, ',') as list from rs_items z where z.usrid = $1";
  	db.one(itemsSql, [usrId])
	.then(items=> {
		//console.log(items);	
		return res.status(200).json({ items: items.list });
	})
	.catch(error=> {
	   if (error instanceof QRE && error.code === qrec.noData) {
			res.status(200).json({ entry: obj, message: 'NO_DATE_FOUND' });
			return next(error);
		} else {
			return next(error);
		}
	});
  
  
};

exports.deleteWalmartItems = function (req, res, next) {
  console.log(req.params);	
  console.log(req.user);
  var maxDelete = 20;
  const items = req.params.itemId; 
  console.log(`Items:${items}`);	
    var itemArray = items.split(",");
    var cnt = Math.ceil(itemArray.length/maxDelete);
    console.log(`Items pages:${cnt}`);	
    const queries = [];
    db.tx(t => { // automatic BEGIN
        let deleteWalmartSql = "DELETE FROM rs_items WHERE webid IN ($1:csv)";
        for (i = 0; i < cnt; i++) {
            console.log(`Deleting from page:${i+1}`);	
            var sentItems =  itemArray.slice(0+maxDelete*i,maxDelete+ maxDelete*i);
            console.log(`Items in page ${i+1}:${sentItems}`);	
            queries.push(t.none(deleteWalmartSql,[ sentItems ]));
            }
        return t.batch(queries);
    })
    .then(data => {
        return res.status(200).json({ message: 'Items Deleted' });
    })
    .catch(error => {
        console.log(error);	
        return res.status(200).json({ error: error});
    });
}

exports.getUserItemList = function (req, res, next) {
    console.log(req.params);
    console.log(req.user);  
   const usrId = req.user.uid;
  var obj;	
  //let itemListSql = "select asib,itemid from rs_items z where z.usrid = $1";
  let itemListSql = "select itemrefresh,webstore, webid as itemid, itemname as name, itemimgurl as thumbnailimage, itemupc as upc, itemasib as asib, "+
            " array_to_json(itemdetails) as itemdetails, array_to_json(notification) as noty  from rs_items z where z.usrid = $1 ";
  
  	db.many(itemListSql, [usrId])
	.then(itemList=> {
        console.log(itemList);
        let itemsSql = "select string_agg(z.webid, ',') as list from rs_items z where z.usrid = $1";
        db.one(itemsSql, [usrId])
        .then(items=> {
		//console.log(items);	
		return res.status(200).json({ itemList: itemList, items: items });
        })
	.catch(error=> {
	   if (error instanceof QRE && error.code === qrec.noData) {
			res.status(200).json({ entry: obj, message: 'NO_DATE_FOUND' });
			return next(error);
		} else {
			return next(error);
		}
	});
	})
	.catch(error=> {
	   if (error instanceof QRE && error.code === qrec.noData) {
			res.status(200).json({ entry: obj, message: 'NO_DATE_FOUND' });
			return next(error);
		} else {
			return next(error);
		}
	});
  
  
};


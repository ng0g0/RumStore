const pgp = require('pg-promise')(/*options*/);
const db = require('../connection/postgres');
var request = require('request');

var QRE = pgp.errors.QueryResultError;
var qrec = pgp.errors.queryResultErrorCode;

exports.getWalmartItems = function (req, res, next) {
    console.log(req.params);
   const itemId = req.params.itemId;
   return request({
            uri: `https://api.walmartlabs.com/v1/items?apiKey=upxrg7rpj4hjew5jbjwqhwkf&itemId=${itemId}`,
        }).pipe(res);
    
};



exports.getUserItems = function (req, res, next) {
  console.log('req.user');
  console.log(req.user);	
  const usrId = req.user.uid;
  var obj;	
  let itemsSql = "select string_agg(z.itemid, ',') as list from rbm_usr_items z where z.usrid = $1";
  	db.one(itemsSql, [usrId])
	.then(items=> {
		console.log(items);	
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

exports.getUserItemList = function (req, res, next) {
  console.log(req.params);	
   const usrId = req.user.uid;
  var obj;	
  let itemListSql = "select asib,itemid from rbm_usr_items z where z.usrid = $1";
  	db.many(itemListSql, [usrId])
	.then(itemList=> {
        console.log(itemList);
        let itemsSql = "select string_agg(z.itemid, ',') as list from rbm_usr_items z where z.usrid = $1";
        db.one(itemsSql, [usrId])
        .then(items=> {
		console.log(items);	
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


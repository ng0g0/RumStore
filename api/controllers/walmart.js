const pgp = require('pg-promise')(/*options*/);
const db = require('../connection/postgres');
var request = require('request');
const async = require('async');

var QRE = pgp.errors.QueryResultError;
var qrec = pgp.errors.queryResultErrorCode;
var walmar_key = 'upxrg7rpj4hjew5jbjwqhwkf';

const MailSender = require('./mail');

exports.getWalmartSearchedItems = function (req, res, next) {
    console.log(req.params);
    const searchType = req.params.sType;
    const itemId = req.params.itemId  || 0;
    if (itemId.length >0) {
        switch(searchType) {
            case "upc":
                return request({
                        uri: `https://api.walmartlabs.com/v1/items?apiKey=${walmar_key}&upc=${itemId}`,
                    }).pipe(res);
                break;
            case "name":
                return request({
                        uri: `https://api.walmartlabs.com/v1/search?apiKey=${walmar_key}&query=${itemId}`,
                    }).pipe(res); 
            break;
            case "itemId":
                return request({
                        uri: `https://api.walmartlabs.com/v1/items?apiKey=${walmar_key}&itemId=${itemId}`,
                    }).pipe(res); 
                break;
            default:
                return request({
                        uri: `https://api.walmartlabs.com/v1/items?apiKey=${walmar_key}&itemId=${itemId}`,
                    }).pipe(res);
        }  
    } else {
        res.status(200).json({ message: 'NO_DATE_FOUND' });
    }
};    
exports.getWalmartItems = function (req, res, next) {
   // console.log(req.params);
   const itemId = req.params.itemId;
   return request({
            uri: `https://api.walmartlabs.com/v1/items?apiKey=upxrg7rpj4hjew5jbjwqhwkf&itemId=${itemId}`,
        }).pipe(res);
    
};

exports.getUserUpdateItems = function (req, res, next) {
  //console.log(req.user);	
  const usrId = req.user.uid;
  var obj;	
  
  let itemsSql = "select itemid, webid, webstore,'['||string_agg( '{\"dettype\":\"'||dettype||'\",\"detvalue\":\"'||detvalue||'\",\"oldValue\":\"'||oldvalue||'\"}',',')||']' itemDet "+
                " from ( select itemid, webid, detdate, dettype, oldvalue, detvalue, webstore  "+
                "    from  (select lead(t.detvalue) OVER (PARTITION BY z.itemid, t.dettype ORDER BY t.detdate DESC) as oldvalue, t.dettype, t.detvalue, t.detdate, "+
                "              rank() OVER (PARTITION BY z.itemid, t.dettype ORDER BY t.detdate desc) as drang ,z.itemid,  z.webid, z.webstore "+ 
                "            from rs_items z,UNNEST(itemdetails) as t(dettype,detvalue,detdate), rbm_user u "+
                "            where u.usrid=z.usrid and u.active = 1 and u.usrid = $1 "+ 
                "            and array_length(z.notification , array_ndims(z.notification))>0 ) x "+  
                "    where oldvalue is not null and  drang = 1 ) y "+ 
                " GROUP BY itemid, webid, webstore "; 

  	db.many(itemsSql, [usrId])
	.then(items=> {
		return res.status(200).json({ updatedItems: items });
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

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};    

exports.WalmartNotification = function() {
    console.log('WalmartNotification');
        
    let walmartItemsSQL = "select '['||string_agg( '{\"dettype\":\"'||dettype||'\",\"detvalue\":\"'||detvalue|| '\"}',',')||']' itemDet, itemid, notification, webid, username "+
        " from ( select distinct dettype, detvalue,itemid , notification, webid, username  "+
        "   from ( select max(t.detdate) OVER (PARTITION BY itemid, dettype) maxdate ,z.itemid, t.* , z.notification , z.webid, u.username "+
        "     from rs_items z,UNNEST(itemdetails) as t(dettype,detvalue,detdate), rbm_user u "+
        "     where u.usrid=z.usrid and u.active = 1 and array_length(z.notification , array_ndims(z.notification))>$1 "+
        "   ) x where x.maxdate = x.detdate ) y GROUP BY itemid, notification, webid, username ";
        
    db.many(walmartItemsSQL, [0])
	.then(itemsList => {
        console.log(`Items Retreved = ${itemsList.length}`);
        //unique items send to walmart
        let items = itemsList.map(item => item.webid).filter((value, index, self) => self.indexOf(value) === index).join(',');        
        console.log(`Items = ${items}`);
        let walmartItems = items.split(',');
        console.log(`Total Items = ${walmartItems.length}`);
       

        async.waterfall([
            function( callbackfunc1) {
               let walmartResponce = [];
               var cnt = Math.ceil(walmartItems.length/10);
               console.log(`Total Pages = ${cnt}`);
               var i = 0;
               async.whilst(
                    function() { return i < cnt; },
                    function( callbackwh) {
                        let sentItems =  walmartItems.splice(0+i*10,10+i*10).join();
                        console.log(`Page ${i} =${sentItems}`);
                        setTimeout(function() { 
                            request.get(`https://api.walmartlabs.com/v1/items?apiKey=${walmar_key}&itemId=${sentItems}`, function (err, res, body) {
                                if (IsJsonString(body)) {
                                    let wItemRet = JSON.parse(body); //{items: []}; //
                                    console.log(`Items Retreved = ${wItemRet.items.length}`);
                                    walmartResponce = walmartResponce.concat(wItemRet.items);
                                } else {
                                    console.log('NOT JSON');
                                }
                            i++;
                            callbackwh(null, walmartResponce);
                            });
                        }, 1000);
                    },
                    function (err, result) {
                       console.log(`Items Retreved = ${result.length}`); 
                       callbackfunc1(null, result);
                    }
                );
            },
            function( walmartResponce, callbackfunc2) {
                console.log(`Total Items Retreved = ${walmartResponce.length}`);
                //console.log(walmartResponce);
                if (walmartResponce.length > 0) {
                    let updateArray =[];
                    walmartResponce.forEach(function(wItem) {
                        //console.log(wItem);
                        //console.log(itemsList);
                       const it = itemsList.find( item => { return Number(item.webid) === wItem.itemId;} );
                       console.log(it);
                       console.log(`Item Check = ${it.webid}`);
                       let itemDet=JSON.parse(it.itemdet);
                       itemDet.forEach(function(det) {
                           console.log(`Item Notification = ${det.dettype}`);
                           let wDet = wItem[det.dettype];
                           if (det.dettype === "stock") {
                               wDet = (wDet === "Available")? 1 : 0;
                           } 
                           let oldDet = det.detvalue;
                           console.log(`Walmart New Value = ${wDet} >>>> ${oldDet}`);
                           if(parseFloat(det.detvalue) !== parseFloat(wDet)) {
                               console.log(`DIFFERENT`);
                               updateArray.push({
                                   id: it.itemid, 
                                   email: it.username, 
                                   itemId: it.webid, 
                                   dettype: det.dettype, 
                                   detvalue: det.detvalue, 
                                   newValue: wDet
                                })
                           }
                       })
                    })
                    const queries = [];
                    console.log(`Total Notification Found = ${updateArray.length}`);
                    //console.log(`Notification: ${updateArray}`);
                    db.tx(t => { // automatic BEGIN
                        updateArray.forEach((det) => {
                        let addDetaild = "update rs_items set itemdetails = array_append(itemdetails, CAST(ROW($2,$3,now()) as rs_itemdetils)) "+
                            " where itemid = $1";
                            queries.push(t.none(addDetaild, [det.id, det.dettype, det.newValue]));
                        });
                        return t.batch(queries);
                    })
                    .then(data => {
                    //    //sendEmail
                         let users = updateArray.map(noty => noty.email).filter((value, index, self) => self.indexOf(value) === index);
                        console.log(`-------------------------------`);  
                        users.forEach((name) => {
                            let html = '';
                            let items= updateArray.filter(x => x.email === name);
                                html += `'<p>Hello ${name}</p>`;
                                console.log(`User ${name}`);    
                                html +=`<p>Following Items was updated</p><table> <tr> <td> Item </td><td> Detail </td><td> New Value </td><td> Old Value </td></tr>`;
                                
                                items.forEach((item) => {
                                    html += `<tr> <td> ${item.itemId} </td><td> ${item.dettype} </td><td> ${item.newValue} </td><td> ${item.detvalue}</td></tr>`
                                    console.log(`Item ${item.itemId} ${item.dettype} changed ${item.detvalue} to ${item.newValue}`); 
                                })
                                html +=`</table>`; 
                        console.log(`-------------------------------`); 
                        curDate = new Date().toISOString().slice(0, 10);
                        const  subject = `RumStore Notification Update ${curDate}`;
                        
                        MailSender.sendEmail(name, subject, html)
                        })
                    })
                    .catch(error => {
                            console.log(error);
                    });
                }
                callbackfunc2(null, 'done');
                
            }
        ], function (err, result) {
            console.log(result)
            // result now equals 'done'
        });

    });
    //return walmartItems;
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


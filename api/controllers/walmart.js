const pgp = require('pg-promise')(/*options*/);
const db = require('../connection/postgres');
var request = require('request');
const async = require('async');

var QRE = pgp.errors.QueryResultError;
var qrec = pgp.errors.queryResultErrorCode;
var walmar_key = 'upxrg7rpj4hjew5jbjwqhwkf';

const MailSender = require('./mail');

exports.getWalmartBestItems = function (req, res, next) {
   const itemId = req.params.itemId;
   return request({
            uri: `http://api.walmartlabs.com/v1/feeds/bestsellers?apikey=${walmar_key}`,
        }).pipe(res);
    
};

exports.getWalmartSearchedItems = function (req, res, next) {
    const searchType = req.params.sType;
    const itemId = req.params.itemId  || 0;
    let url = '';
    if (itemId.length >0) {
        switch(searchType) {
            case "upc":
                url = `https://api.walmartlabs.com/v1/items?apiKey=${walmar_key}&upc=${itemId}`;
                break;
            case "name":
               url = `https://api.walmartlabs.com/v1/search?apiKey=${walmar_key}&query=${itemId}`
            break;
            case "itemId":
                url = `https://api.walmartlabs.com/v1/items?apiKey=${walmar_key}&itemId=${itemId}`;
                break;
            default:
               url = `https://api.walmartlabs.com/v1/items?apiKey=${walmar_key}&itemId=${itemId}`
        }
        let options = { url: url };
        return request(options, function (error, response, body) {
            var obj = JSON.parse(body);
                if (obj.errors) {
                   res.status(200).json({ message: 'NO_DATE_FOUND' }); 
                } else {
                    res.status(200).json(obj);    
                }
            }).on('error', function(err) {
              console.log('ERROR');
              console.log(err)
              res.status(200).json({ message: err});
            });
        
    } else {
        res.status(200).json({ message: 'NO_DATE_FOUND' });
    }
};    
exports.getWalmartItems = function (req, res, next) {
    const itemId = req.params.itemId;
    let walmartItems = itemId.split(',');
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
                        console.log(`walmartItems =${walmartItems}`);
                        let bg = 0;//+i*10;
                        let ed = (walmartItems.length < 10 ) ? walmartItems.length :10;
                        console.log(`strar =${bg}, end = ${ed}`);
                        let sentItems =  walmartItems.splice(bg,ed).join();
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
                            console.log(`Left Items${walmartItems.join()}`);
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
                return res.status(200).json({ items: walmartResponce });
                callbackfunc2(null, 'done');
                
            }
        ], function (err, result) {
            console.log(result)
            // result now equals 'done'
        });
};

exports.getUserUpdateItems = function (req, res, next) {
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


exports.WalmartCleanUp = function() {
    console.log('WalmartCleanUp');
    let historyInterval = `'15 days'`; // `'1 minutes'`;
    let walmartCleanSQL =   "UPDATE rs_items itm "+ 
                            " SET itemdetails = case when array_ndims(subquery.itemdetails) = 1 and  subquery.itemdetails[1] is null then '{}' else "+
                            " array_cat(null, subquery.itemdetails) end "+
                            " FROM ( select array_agg(CAST(ROW(detvalue,detvalue,detdate) as rs_itemdetils)) as itemdetails, it.itemid "+
                            " from ( select t.*, z.itemid from rs_items z, UNNEST(itemdetails) as t(dettype,detvalue,detdate) "+
                            "	     where 1=1 and t.detdate > current_timestamp - interval $1 ) y right join rs_items it on (y.itemid = it.itemid) "+
                            "  	group by it.itemid ) AS subquery "+
                            " WHERE itm.itemid=subquery.itemid ";
     console.log(walmartCleanSQL);
    db.none(walmartCleanSQL, [historyInterval]);                      
}


exports.WalmartDailyUpdate = function() {
    console.log('WalmartDailyUpdate');
    let walmartDailySQL =   " select z.itemid, array_to_string(z.notification,',') as notification , z.webid  "+
                            " from rs_items z, rbm_user u "+
                            " where u.usrid=z.usrid and u.active = 1 and array_length(z.notification , array_ndims(z.notification))>0 ";
    db.many(walmartDailySQL, [])
    .then(items => {
        console.log(`Items Retreved = ${items.length}`);
        let itemsUn = items.map(item => item.webid).filter((value, index, self) => self.indexOf(value) === index).join(',');        
        let walmartItems = itemsUn.split(',');
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
                        console.log(`walmartItems =${walmartItems}`);
                        let bg = 0;//+i*10;
                        let ed = (walmartItems.length < 10 ) ? walmartItems.length :10;
                        console.log(`strar =${bg}, end = ${ed}`);
                        let sentItems =  walmartItems.splice(bg,ed).join();
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
                       const it = items.filter( item => { return Number(item.webid) === wItem.itemId;} );
                       //console.log(it.length);
                       it.forEach(function(itd) {
                           //console.log(`Item Check = ${itd.webid} and ${itd.itemid}`);
                            let itemDet=itd.notification.split(',');
                            itemDet.forEach(function(det) {
                                //console.log(`Item Notification = ${det}`);
                                let wDet = wItem[det];
                                if (det === "stock") {
                                    wDet = (wDet === "Available")? 1 : 0;
                                } 
                                updateArray.push({
                                        id: itd.itemid, 
                                        email: itd.username, 
                                        itemId: itd.webid, 
                                        dettype: det, 
                                        newValue: wDet
                                    })
                            })
                       })
                       
                    })
                    const queries = [];
                    db.tx(t => { // automatic BEGIN
                        updateArray.forEach((det) => {
                            console.log(` ID= ${det.id} Type=${det.dettype} Value = ${det.newValue}`)
                            let addDetaild = "update rs_items set itemdetails = array_append(itemdetails, CAST(ROW($2,$3,now()) as rs_itemdetils)) "+
                                            " where itemid = $1";
                            queries.push(t.none(addDetaild, [det.id, det.dettype, det.newValue]));
                        });
                        return t.batch(queries);
                    })
                    .then(data => {
                        curDate = new Date().toISOString().slice(0, 10);
                        console.log(` Daily Update Item DataUpdated (${curDate}) Updates: ${updateArray.length}`);
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
                        console.log(`walmartItems =${walmartItems}`);
                        let bg = 0;//+i*10;
                        let ed = (walmartItems.length < 10 ) ? walmartItems.length :10;
                        console.log(`strar =${bg}, end = ${ed}`);
                        let sentItems =  walmartItems.splice(bg,ed).join();
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
                        const it = itemsList.filter( item => { return Number(item.webid) === wItem.itemId;} );
                       //console.log(it);
                       //console.log(`Item Check = ${it.webid}`);
                        it.forEach(function(itd) {
                            let itemDet=JSON.parse(itd.itemdet);
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
                                           id: itd.itemid, 
                                           email: itd.username, 
                                           itemId: itd.webid, 
                                           dettype: det.dettype, 
                                           detvalue: det.detvalue, 
                                           newValue: wDet
                                        })
                                }
                            })
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
  let change  = 0;
  
  const usrId = req.user.uid;
  const storeName = req.body.props.webstore;
  const webid = req.body.props.itemid;
  const itemid = req.body.props.id || 0;
  const name = req.body.props.name;
  const imgUrl = req.body.props.thumbnailimage;
  const upc = req.body.props.upc;
  
  const asib = req.body.props.asib;
  const notification = req.body.props.notification || {};
  console.log(itemid);
  console.log(notification);
  let noty ='{';
  var details = [];
  Object.keys(notification).forEach(function (key) {
    let elem = notification[key];
    console.log(elem);
    if (notification[key] === "stock") {
            var valStock = (req.body.props.stock === 'Available') ? 1 : 0;
            details.push({type: 'stock', val: valStock, not: `{${elem}}`})
    }
    if (notification[key] === "salePrice") {
            details.push({type: 'salePrice', val: req.body.props.salePrice, not: `{${elem}}`})    
    }
    noty += `${elem},`;
  
  });
    if (noty.length > 1) {
        noty = noty.slice(0, -1);  
    }
    noty += '}';
   console.log(noty);
   const queries = [];
   var obj;
   db.tx(t => { // automatic BEGIN
        if (itemid == 0) {
            let addItemSql = "insert into rs_items(usrid, webstore,webid,itemname, itemimgurl, itemupc, itemasib ) "+
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
        }  else {
            let updateItemSql = "update rs_items set itemasib =$1, notification =$2 where itemid= $3";
            queries.push(t.none(updateItemSql,[asib, noty, itemid ]));
        }
   return t.batch(queries);
   })
    .then(data => {
        console.log('OK');
        if (itemid == 0) { 
            return res.status(200).json({ block: obj, message: `Item ${webid} added ` });
        } else {
            return res.status(200).json({ block: obj, message: `Item ${webid} Updated ` });
        }
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
  let itemListSql = "select itemrefresh,webstore, webid as itemid, itemname as name, itemimgurl as thumbnailimage, itemupc as upc, itemasib as asib,itemid as id, "+
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


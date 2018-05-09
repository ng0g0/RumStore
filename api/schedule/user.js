var schedule = require('node-schedule');

exports.runSchedure = function (req, res, next) {
    console.log(req.user);
    var job1 = new schedule.Job('cancelJob', function() {});
      job1.schedule({
        second: new schedule.Range(8, 22);	
      });
    
    var rule = new schedule.RecurrenceRule();
    rule.hour = 
    rule.minute = 0;
    var j = schedule.scheduleJob(scheduleId, rule, function(){
        console.log('Schedule started');
    });
    
    return res.status(200).json({ message: `Schedule started ` });
}

exports.stopSchedure = function (req, res, next) {
    console.log(req.user);	
    var j = schedule.scheduleJob(scheduleId, rule, function(){
        console.log('Schedule started');
    });
    j.cancel();
    return res.status(200).json({ message: `Schedule stopped ` });
} 



exports.WalmartAddItems = function (req, res, next) {
  console.log('req.user');
  console.log(req.user);	
  const usrId = req.user.uid;
  const storeName = req.body.props.webstore;
  const webid = req.body.props.webid;
  const name = req.body.props.itemname;
  const imgUrl = req.body.props.itemimgurl;
  const upc = req.body.props.itemupc;
  const asib = req.body.props.itemasib;
  const refresh = (req.body.props.itemrefresh) ? 1 :0;
  //var ItemChecks = req.body.props.checks;
   var details = [];
  console.log(req.body.props);
    if (req.body.props.itemPrice) {
        console.log('Adding Price');
        details.push({type: 'salePrice', val: req.body.props.itemPrice})    
    }
    if (req.body.props.itemstock) {
        console.log('Adding Stock');
        var valStock = (req.body.props.itemstock === 'Available') ? 1 : 0;
        details.push({type: 'stock', val: valStock})    
    }
   const queries = [];
   var obj;
   db.tx(t => { // automatic BEGIN
        let addItemSql = "insert into rs_items(usrid, itemrefresh, webstore,webid,itemname, itemimgurl, itemupc, 	itemasib ) "+
                          " values($1, $2 ,$3 ,$4, $5, $6, $7, $8) RETURNING itemid";
        queries.push(
        t.one(addItemSql,[usrId, refresh, storeName, webid, name, imgUrl, upc, asib ])
        .then(data => {
            details.forEach((det) => {
                let addDetaild = "update rs_items set itemdetails = array_append(itemdetails, CAST(ROW($2,$3,now()) as rs_itemdetils)) where itemid = $1";
                queries.push(t.none(addDetaild, [data.itemid, det.type, det.val]));
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
            " array_to_json(itemdetails) as itemdetails  from rs_items z where z.usrid = $1 ";
  
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


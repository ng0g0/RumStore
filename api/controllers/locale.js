//const pgp = require('pg-promise')(/*options*/);
//const db = require('../connection/postgres');
//const bcrypt = require('bcrypt-nodejs');

//var QRE = pgp.errors.QueryResultError;
//var qrec = pgp.errors.queryResultErrorCode;

const cookie require('react-cookie');


exports.setLang = function (req, res, next) {
  console.log(req.params);	
  const lang = req.params.lang;
	//res.cookie('i18n', lang);
	cookie.save('i18n', lang , { path: '/' });
    //res.redirect('/')
};


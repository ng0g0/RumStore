const pgp = require('pg-promise')(/*options*/);
const db = require('../connection/postgres');
const bcrypt = require('bcrypt-nodejs');

var QRE = pgp.errors.QueryResultError;
var qrec = pgp.errors.queryResultErrorCode;

exports.viewProfile = function (req, res, next) {
  console.log('viewProfile input:');
  console.log(req.params);	
  const userId = req.params.userId;
  let finUserSql = "select usrid,username as email, password, firstname, lastname, ursrefresh as refresh from rbm_user where usrid = $1 ";
	var obj;
	db.one(finUserSql, [userId])
	.then(user=> {
		console.log('viewProfile');
		console.log(user);
		if (req.user.email !== user.email) { 
			return res.status(401).json({ error: 'You are not authorized to view this user profile.' }); 
		} else {
			obj = {
				uid: user.usrid,
				email: user.email,
				password: null,
				firstName: user.firstname,
				lastName: user.lastname,
                refresh: user.refresh
			};
			return res.status(200).json({ user: obj });
		}
	})
	.catch(error=> {
		console.log(error);
	   if (error instanceof QRE && error.code === qrec.noData) {
			res.status(400).json({ error: 'No user could be found for this ID.' });
			return next(error);
		} else {
			return next(error);
		}
	});
};

exports.userDelete = function (req, res, next) {
	const email = req.body.email;
	const uid = req.body.uid;
	
	let deleteSql = "UPDATE rbm_user SET active = 0 WHERE usrid = $1";
	db.none(registerSql, [uid] )
		.then((user) => {
			console.log('Deleted');	
			const message = {
				subject: 'User Deleted',
				text: 'You are receiving this email because you deleted your user. \n\n' +
					  'If you did not request this change, please contact us immediately.'
				};
				console.log(message.text);
				return res.status(200).json({ message: 'User Deleted successfully.' });  	
		})
		.catch(error=> {
				console.log(error);
				return res.status(500).send({ error: error });
		});

}

exports.userUpdate = function (req, res, next) {

	const email = req.body.email;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const password = req.body.password;
    const refresh = req.body.refresh;
	const uid = req.body.uid;
	let hashPassword = '123';
	const SALT_FACTOR = 5;
	if (!email) {
		return res.status(422).send({ error: 'You must enter an email address.' });
	}
	// Return error if full name not provided
	if (!firstName || !lastName) {
		return res.status(422).send({ error: 'You must enter your full name.' });
	}

	// Return error if no password provided
	/*if (!password) {
		let registerSql = "UPDATE rbm_user SET username = $1, firstname=$2, lastname=$3 WHERE usrid = $4";
			db.none(registerSql, [email, firstName, lastName, uid] )
				.then((user) => {
					obj = {
						uid: uid,
						email: email,
						firstName: firstName,
						lastName: lastName
						};
					console.log(obj);	
					res.status(200).json({ user: obj });	
				})
				.catch(error=> {
					if (error.code === "23505") {
						return res.status(422).send({ error: 'That email address is already in use.' });	
					} else {
						//console.log(error);
						return res.status(500).send({ error: error });
					}
				});
			//});
		//return res.status(422).send({ error: 'You must enter a password.' });
	} else {
	*/	console.log('Password upate');
		bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
			if (err) return next(err);
			bcrypt.hash(password, salt, null, (err, hash) => {
			if (err) return next(err);
			hashPassword = hash;
			console.log('Validating password');
			
			let registerSql = "UPDATE rbm_user SET username = $1, password =$2, firstname=$3, lastname=$4, ursrefresh =$6 WHERE usrid = $5";
			db.none(registerSql, [email, hashPassword, firstName, lastName, uid, refresh] )
				.then((user) => {
					var obj = {
						uid: uid,
						email: email,
						firstName: firstName,
						lastName: lastName
						};
					console.log('Updated');	
					console.log(obj);	
					res.status(200).json({ user: obj });	
				})
				.catch(error=> {
						console.log(error);
					if (error.code === "23505") {
						return res.status(200).json({ user: {email: email } , error: `Email ${email} is already in use.` });	
					} else {
						//console.log(error);
						return res.status(500).send({ error: error });
					}
				});
			});
		});
	//}
	
};
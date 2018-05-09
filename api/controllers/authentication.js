const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../../config/main');

var pgp = require('pg-promise')(/*options*/);
var async = require('async');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');

const db = require('../connection/postgres');
var QRE = pgp.errors.QueryResultError;
var qrec = pgp.errors.queryResultErrorCode;


const smtpTransport = nodemailer.createTransport(
        {
            host: 'mail.kia-bg.com',
            port: 587,
            secure: false,
            auth: {
                user: 'dani@kia-bg.com',
                pass: 'Rumostore%80'
            },
            tls: {
                rejectUnauthorized:false
            }
        });    
    
    
    
// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800 // in seconds
  });
};

exports.findUser = function(userName, callback) {
	let finUserSql = "select usrid,username as email, password, firstname, lastname, usrrole as role" + 
	                 " from rbm_user where username = $1 and active = 1";
	var obj;
	
	db.one(finUserSql, [userName])
		.then(user=> {
		obj = {
			uid: user.usrid,
			email: user.email,
			password: user.password,
			firstName: user.firstname,
			lastName: user.lastname,
            role: user.role
		};
		callback(null, obj);
	})
	.catch(error=> {
	   if (error instanceof QRE && error.code === qrec.noData) {
			callback(null, null);
						
		} else {
			callback(error, null);
		}
	});
}

exports.comparePassword = function(pass, hash, callback) {
  bcrypt.compare(pass, hash, (err, isMatch) => {
    if (err) { 
		return callback(err); 
	}
    callback(null, isMatch);
  });
}; 
  

exports.login = function (req, res, next) {
  const userInfo  = { 
    uid: req.user.uid,
	email: req.user.email,
	firstName: req.user.firstName,
	lastName: req.user.lastName,
    role: req.user.role,
  };
  console.log('login');
  console.log(userInfo);
  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo
  });
};

exports.register = function (req, res, next) {
    console.log(req.body.props);
	const email = req.body.props.email;
	const firstName = req.body.props.firstName;
	const lastName = req.body.props.lastName;
	const password = req.body.props.password || '123';
    const role = (req.body.props.role)? 1 : 0 ;
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
	//if (!password) {
//		return res.status(422).send({ error: 'You must enter a password.' });
//	}
	//console.log('Validation ok');
	bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
		if (err) return next(err);
		bcrypt.hash(password, salt, null, (err, hash) => {
		if (err) return next(err);
		hashPassword = hash;
		//console.log('Validating password');
		let registerSql = "INSERT INTO rbm_user (username, password, firstname, lastname, active, usrrole) VALUES( $1, $2, $3, $4, 1, $5) RETURNING usrid";
		db.one(registerSql, [email, hashPassword, firstName, lastName, role] )
		.then((user) => {
			obj = {
				uid: user.usrid,
				email: email,
				firstName: firstName,
				lastName: lastName
				};
			//console.log(obj);	
            
            const message = {
                to: email,
                from: 'dani@kia-bg.com',
				subject: 'Welcome to RumStore',
				text: `Hi ${firstName}, Welcome to Rumstore.\n\n` +
					   ` User name: ${email} \n `+
                       ` password: ${password} \n `+
					   ` ${config.clientUrl}\n` 
				};
                
                smtpTransport.sendMail(message, function(err,info) {
                    if(err)
                        console.log(err)
                        else
                        console.log(info);
                  });
                
                
            return res.status(200).send({ message: 'User Added.' });    
			//res.status(201).json({
			//	token: `JWT ${generateToken(obj)}`,
                //		user: obj
            //		});	
		})
		.catch(error=> {
			if (error.code === "23505") {
				return res.status(422).send({ error: 'That email address is already in use.' });	
			} else {
				//console.log(error);
				return res.status(500).send({ error: error });
			}
		});
		});
	});
};

exports.forgotPassword = function (req, res, next) {
	const email = req.body.email;
	let findSql = "select usrid from rbm_user where username = $1";
	db.one(findSql, [email])
	.then(user=> {
		console.log(`USERID:${user.usrid}`);
		// Generate a token with Crypto
		crypto.randomBytes(48, (err, buffer) => {
		const resetToken = buffer.toString('hex');
		if (err) { return next(err); }
			let forgotSQL = "update rbm_user  set  " +
				" usertoken = $1, userexpires = NOW() + interval '24 hour' "  + 
				" where usrid = $2 ";
			db.none(forgotSQL, [resetToken,user.usrid])
			.then( () => {
				
				const message = {
                    to: email,
                    from: 'dani@kia-bg.com',
					subject: 'Reset Password',
					text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
						'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
						' '}${config.clientUrl}/reset-password/${resetToken}\n\n` +
						`If you did not request this, please ignore this email and your password will remain unchanged.\n`
				};
                
                smtpTransport.sendMail(message, function(err,info) {
                    if(err)
                        console.log(err)
                        else
                        console.log(info);
                  });
			  // Otherwise, send user email via Mailgun
			//mailgun.sendEmail(existingUser.email, message);
				console.log(message.text);
				return res.status(200).json({ message: 'Please check your email for the link to reset your password.' });
			})
			.catch(error=> {
				console.log(error);
				return next(err);
			});
		});
	})
	.catch(error=> {
	   if (error instanceof QRE && error.code === qrec.noData) {
		    console.log(error);
			res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' });
			return next(err);
		} else {
			console.log(error);
			res.status(422).json({ error: error });
			return next(err);
		}
	});
    
};
				
				
//= =======================================
// Reset Password Route
//= =======================================

exports.verifyToken = function (req, res, next) {
	const SALT_FACTOR = 5;
	let hashPassword = '123';
	const Token = req.params.token;
    let findTokenSql = "select username "+
	                   " FROM rbm_user where usertoken = $1 "+
					   " AND  userexpires > NOW()";
	db.one(findTokenSql, [Token])
		.then(user=> {
			const newPassword = req.body.password;
            const userName = user.username;
			bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
				if (err) return next(err);
				bcrypt.hash(newPassword, salt, null, (err, hash) => {
					if (err) return next(err);
					hashPassword = hash;
					//console.log('Validating password');
					let updatePassSQL = "update rbm_user  set  " +
						" password = $1, usertoken = NULL ,"+
						" userexpires = NULL, active = 1 "  + 
						" where username = $2";
					db.none(updatePassSQL, [hashPassword,userName])
					.then( () => {
					  const message = {
                        to: userName,
                        from: 'dani@kia-bg.com',
						subject: 'Password Changed',
						text: 'You are receiving this email because you changed your password. \n\n' +
							  'If you did not request this change, please contact us immediately.'
						};
						console.log(message.text);
						// Otherwise, send user email confirmation of password change via Mailgun
						//mailgun.sendEmail(resetUser.email, message);
                        smtpTransport.sendMail(message, function(err,info) {
                    if(err)
                        console.log(err)
                        else
                        console.log(info);
                  });
						return res.status(200).json({ message: 'Password changed successfully. Please login with your new password.' });  
					})
					.catch(error=> {
						return next(err);
					});
				});
			});		
		})
		.catch(error=> {
		   if (error instanceof QRE && error.code === qrec.noData) {
			   res.status(422).json({ error: 'Your token has expired. Please attempt to reset your password again.' });
			} else {
				return next(err);
			}
		});	
};

//======================================
//   View Profile
// =====================================


exports.viewProfile = function (req, res, next) {
  console.log('viewProfile');
  console.log(req.params);	
  const userId = req.params.userId;
  let finUserSql = "select usrid,username as email, password, firstname, lastname, usrrole as role " + 
					" from rbm_user where usrid = $1 ";
	var obj;
	db.one(finUserSql, [userId])
	.then(user=> {
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
                role: (user.role === 1 )? true : false
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


//=======================================
// Update User
//========================================

exports.userUpdate = function (req, res, next) {

	const email = req.body.email;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const password = req.body.password;
   // const refresh = req.body.refresh;
   const  role = (req.body.role) ? 1 : 0;
	const uid = req.body.uid;
	let hashPassword = '123';
	const SALT_FACTOR = 5;
	if (!email) {
		return res.status(422).send({ error: 'You must enter an email address.' });
	}
	if (!firstName || !lastName) {
		return res.status(422).send({ error: 'You must enter your full name.' });
	}
	if (!password) {
		return res.status(422).send({ error: 'You must enter an password address.' });
	}
	bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
		if (err) return next(err);
		bcrypt.hash(password, salt, null, (err, hash) => {
		if (err) return next(err);
		hashPassword = hash;
		let registerSql = "UPDATE rbm_user SET username = $1, password =$2, firstname=$3, lastname=$4,  usrrole=$6" + 
						  " WHERE usrid = $5";
		db.none(registerSql, [email, hashPassword, firstName, lastName, uid, role] )
			.then((user) => {
				obj = {
					uid: uid,
					email: email,
					firstName: firstName,
					lastName: lastName, 
                    role: role
					};
				res.status(200).json({ user: obj });	
			})
			.catch(error=> {
					console.log(error);
				if (error.code === "23505") {
					return res.status(200).json({ 
						user: {email: email } , 
						error: `Email ${email} is already in use.` 
					});	
				} else {
					return res.status(500).send({ error: error });
				}
			});
		});
	});
};

//=====================================
// Delete User
//=====================================

exports.userDelete = function (req, res, next) {
	const email = req.body.email;
	const uid = req.params.userId;
	console.log(req.params);
	let deleteSql = "UPDATE rbm_user SET active = 0 WHERE usrid = $1";
	db.none(deleteSql, [uid] )
		.then((user) => {
			console.log('Deleted');	
			const message = {
                to: email,
                from: 'dani@kia-bg.com',
				subject: 'User Deleted',
				text: 'You are receiving this email because you deleted your user. \n\n' +
					  'If you did not request this change, please contact us immediately.'
				};
				console.log(message.text);
                smtpTransport.sendMail(message, function(err,info) {
                    if(err)
                        console.log(err)
                        else
                        console.log(info);
                  });
				return res.status(200).json({ message: 'User Deleted successfully.' });  	
		})
		.catch(error=> {
			return res.status(500).send({ error: error });
		});

}



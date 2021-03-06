const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../../config/main');

const MailSender = require('./mail');

var pgp = require('pg-promise')(/*options*/);
var async = require('async');
const bcrypt = require('bcrypt-nodejs');
//const nodemailer = require('nodemailer');

const db = require('../connection/postgres');
var QRE = pgp.errors.QueryResultError;
var qrec = pgp.errors.queryResultErrorCode;
    
    
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
  //console.log(userInfo);
  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo
  });
};

exports.register = function (req, res, next) {
   // console.log(req.body.props);
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
	if (!firstName || !lastName) {
		return res.status(422).send({ error: 'You must enter your full name.' });
	}

	bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
		if (err) return next(err);
		bcrypt.hash(password, salt, null, (err, hash) => {
		if (err) return next(err);
		hashPassword = hash;
		let registerSql = "INSERT INTO rbm_user (username, password, firstname, lastname, active, usrrole) VALUES( $1, $2, $3, $4, 1, $5) RETURNING usrid";
		db.one(registerSql, [email, hashPassword, firstName, lastName, role] )
		.then((user) => {
			obj = {
				uid: user.usrid,
				email: email,
				firstName: firstName,
				lastName: lastName
				};
            const subject = 'Welcome to RumStore';
            const html = `Hi ${firstName}, <br> Welcome to Rumstore.<br><br>` +
					   ` User name: ${email} <br> `+
                       ` password: ${password} <br> `+
					   ` ${config.clientUrl}<br>` ;
            MailSender.sendEmail(email, subject, html);
            return res.status(200).send({ message: 'User Added.' });    
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
		//console.log(`USERID:${user.usrid}`);
		// Generate a token with Crypto
		crypto.randomBytes(48, (err, buffer) => {
		const resetToken = buffer.toString('hex');
		if (err) { return next(err); }
			let forgotSQL = "update rbm_user  set  " +
				" usertoken = $1, userexpires = NOW() + interval '24 hour' "  + 
				" where usrid = $2 ";
			db.none(forgotSQL, [resetToken,user.usrid])
			.then( () => {
                const subject = 'RumStore Reset Password';
                const html = `You are receiving this because you (or someone else) have requested the reset of the password for your account.<br><br>` +
						`Please click on the following link, or paste this into your browser to complete the process:<br><br>` +
                        ` ${config.clientUrl}reset-password/${resetToken}<br><br>` +
						`If you did not request this, please ignore this email and your password will remain unchanged.<br>`; 
                MailSender.sendEmail(email, subject, html);        
                //console.log(message.text);
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
                        const subject = 'RumStore Password Changed';
                        const html = `You are receiving this email because you changed your password.<br><br>` +
                                    `If you did not request this change, please contact us immediately.<br><br>`; 
                        MailSender.sendEmail(userName, subject, html);        
					  
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


exports.emailMaintenance = function () {
   let findUsers = "select username as email "+
	    " FROM rbm_user where active = 1";
    db.many(findUsers, [])
	.then(users=> {
        curDate = new Date().toISOString().slice(0, 19);
        const newDate = curDate.replace("T", " ");

        users.forEach((user) => {
            const subject = 'RumStore Maintenance ';
            let html = '';
            const name = user.email;
            html += `'<p>Hello ${name}</p>`;
            html += `'<p>Update Date:  ${newDate}</p>`;
            html += `You are receiving this email because you are subscribed to RumStore notifications.<br><br>`;
            html += `WebSite will be under Maintenance next hours <br>`;
            html += `Best Regards <br>`;
            html += `RumStore Admin <br>`;
            MailSender.sendEmail(name, subject, html);        
        });
        return 'OK';
    })
    .catch(error=> {
      console.log(error);
	  return 'NOK';
	});
                       
}
//======================================
//   View Profile
// =====================================



exports.viewProfile = function (req, res, next) {
  //console.log('viewProfile');
  //console.log(req.params);	
  const userId = req.params.userId;
  let finUserSql = "select usrid,username as email, password, firstname, lastname, usrrole as role " + 
					" from rbm_user where usrid = $1 ";
	var obj;
	db.one(finUserSql, [userId])
	.then(user=> {
		//console.log(user);
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
    //console.log(req.body.props);
    let change  = 0;
    let email = "email";
    let password = "password";
    let firstName = "Fname";
    let lastName = "Lname";
    let role = 3;
    let message = "User properties updates:";
    if (req.body.props.email) {
        email = req.body.props.email;
        change  += 1; 
        message.concat(" Email,");
    }
    if (req.body.props.password) {
        password = req.body.props.password;
        change  += 2; 
        message.concat(" Password,");
    }
    if (req.body.props.firstName) {
        firstName = req.body.props.firstName;
        change  += 4; 
        message.concat(" First Name,");
    }
    if (req.body.props.lastName) {
        lastName = req.body.props.lastName;
        change  += 8; 
        message.concat(" Last Name,");
    }
    //if (req.body.props.role) {
        role = (req.body.props.role) ? 1 : 0;
        change  += 16; 
        message.concat(" User Role");
    //}
	//const email = req.body.props.email;
	//const firstName = req.body.props.firstName;
	//const lastName = req.body.props.lastName;
	//const password = req.body.props.password;
   // const refresh = req.body.refresh;
   //const  role = (req.body.role) ? 1 : 0;
	const uid = req.body.props.uid;
	let hashPassword = '123';
	const SALT_FACTOR = 5;
	//if (!email) {
	//	return res.status(422).send({ error: 'You must enter an email address.' });
	//}
	//if (!firstName || !lastName) {
	//	return res.status(422).send({ error: 'You must enter your full name.' });
	//}
	//if (!password) {
	//	return res.status(422).send({ error: 'You must enter an password address.' });
	//}
    //console.log(`EMAIL=${email}, PASS=${hashPassword}, FN=${firstName}, LN=${lastName}, ROLE=${role} UPDATE=${change}`);
    
	bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
		if (err) return next(err);
		bcrypt.hash(password, salt, null, (err, hash) => {
		if (err) return next(err);
		hashPassword = hash;
        let registerSql = "UPDATE rbm_user SET " +
           " username  = (CASE WHEN (($7&1)>0) THEN $1 ELSE username END),  " +
           " password  = (CASE WHEN (($7&2)>0) THEN $2 ELSE password END),   " +
           " firstname = (CASE WHEN (($7&4)>0) THEN $3 ELSE firstname END), " +
           " lastname  = (CASE WHEN (($7&8)>0) THEN $4 ELSE lastname END), " +
           " usrrole   = (CASE WHEN (($7&16)>0) THEN $6 ELSE usrrole END) " +
        " WHERE usrid = $5";
		//let registerSql = "UPDATE rbm_user SET username = $1, password =$2, firstname=$3, lastname=$4,  usrrole=$6" + 
		//				  " WHERE usrid = $5";
		db.none(registerSql, [email, hashPassword, firstName, lastName, uid, role, change] )
			.then((user) => {
				obj = {
					uid: uid,
					email: email,
					firstName: firstName,
					lastName: lastName, 
                    role: role
					};
				res.status(200).json({ user: obj, message: message });	
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
	//console.log(req.params);
	let deleteSql = "UPDATE rbm_user SET active = 0 WHERE usrid = $1";
	db.none(deleteSql, [uid] )
		.then((user) => {
			//console.log('Deleted');	
            const subject = 'RumStore User Deleted';
            const html = `You are receiving this email because you deleted your user.<br><br>` +
                       `If you did not request this change, please contact us immediately.<br><br>`; 
            MailSender.sendEmail(email, subject, html);        
					  
			return res.status(200).json({ message: 'User Deleted successfully.' });  	
		})
		.catch(error=> {
			return res.status(500).send({ error: error });
		});

}



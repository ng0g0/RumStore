var pgp = require('pg-promise')(/*options*/);

 
var port = 5000;
var connectionString = (process.env.NODE_ENV === 'production') ? 
     'postgres://rrfcffhsalqnly:6b596e4fd06c6a808f1c99ddec492ff92320bc77b3b6d208125bfe1a3b0a555e@ec2-54-247-177-33.eu-west-1.compute.amazonaws.com:5432/d24mflhkuq27nd'
     :'postgres://elink:elink123@192.168.56.101/rbm';
console.log(`Postgress connection: ${connectionString}`);
var clientUrl = (process.env.NODE_ENV === 'production') ? 
     'https://runstore.herokuapp.com'
     :`http://localhost:${port}`; 
console.log(`Client Url: ${clientUrl}`);
	 //var db = pgp(connectionString);

module.exports = {
  // Secret key for JWT signing and encryption
  secret: 'super secret passphrase',
  // Database connection information
  //database: 'mongodb://localhost:27017',
  // Setting port for server
//  postgresdb: db,
  connectionString,
  // Configuring Mailgun API for sending transactional email
  //mailgun_priv_key: 'mailgun private key here',
  // Configuring Mailgun domain for sending transactional email
  //mailgun_domain: 'mailgun domain here',
  // Mailchimp API key
  //mailchimpApiKey: 'mailchimp api key here',
  // SendGrid API key
  //sendgridApiKey: 'sendgrid api key here',
  // Stripe API key
  //stripeApiKey: 'stripe api key goes here',
  // necessary in order to run tests in parallel of the main app
  clientUrl, 
  port,
  //test_db: 'mern-starter-test',
  test_env: 'test'
};

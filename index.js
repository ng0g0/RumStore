const UserController = require('./api/controllers/authentication');
const WalmartController = require('./api/controllers/walmart');
const WalmartScheduler = require('./api/schedule/walmart');

const express = require('express');
const passport = require('passport');
const path = require('path');
const passportService = require('./config/passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

const app = express();
const bodyParser = require('body-parser');
const config = require('./config/main');
const favicon  = require('serve-favicon');


app.use(express.static(path.join(__dirname, 'client/prod')));
app.use(favicon(path.join(__dirname,'/client/prod/favicon.ico')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router(),
    walmartRouter = express.Router();
	// Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);
  // Registration route
  authRoutes.post('/register', requireAuth, UserController.register);
  // Login route
  authRoutes.post('/login', requireLogin, UserController.login);
  // Password reset request route (generate/send token)
  authRoutes.post('/forgot-password', UserController.forgotPassword);

  // Password reset route (change password using token)
  authRoutes.post('/reset-password/:token', UserController.verifyToken);

  //= ========================
  // User Routes
  //= ========================

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes);

  // View user profile route
  userRoutes.get('/walmartList', requireAuth, WalmartController.getUserItemList);
  userRoutes.get('/walmartUpdate', requireAuth, WalmartController.getUserUpdateItems);
  userRoutes.get('/:userId', requireAuth, UserController.viewProfile);
  //userRoutes.get('/items/:userId', requireAuth, WalmartController.getUserItems);

  userRoutes.post('/:userId', requireAuth, UserController.userUpdate);
  userRoutes.delete('/:userId', requireAuth, UserController.userDelete);

    apiRoutes.use('/walmart', walmartRouter);
    walmartRouter.post('/item', requireAuth, WalmartController.WalmartAddItems);
    walmartRouter.get('/item/:itemId', requireAuth, WalmartController.getWalmartItems);
    walmartRouter.get('/itemterra/:itemId', requireAuth, WalmartController.getWalmartTerra);

	walmartRouter.get('/bestitem', requireAuth, WalmartController.getWalmartBestItems);
    walmartRouter.get('/dailyRefresh', requireAuth, WalmartController.getDailyUpdate);
    //walmartRouter.get('/item/search/:sType/:itemId/:page/:items/:sort', requireAuth, WalmartController.getWalmartSearchedItems);
    walmartRouter.get('/item/search/:sType/:itemId/:page/:items/:sort', WalmartController.getWalmartSearchedItems);

    walmartRouter.delete('/:itemId', requireAuth, WalmartController.deleteWalmartItems);


  // Test protected route
   apiRoutes.get('/protected', requireAuth, (req, res) => {
    res.send({ content: 'The protected test route is functional!' });
  });

app.use('/api', apiRoutes);



// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/prod/index.html'));
});

console.log(process.env.NODE_ENV);
const port = process.env.PORT || config.port;
app.listen(port);

const maintenance  = 0;
if (maintenance === 1) {
    UserController.emailMaintenance();
} else {
  WalmartScheduler.runSchedure();
WalmartScheduler.runCleanUp();
WalmartScheduler.runWalmartDailyUpdate();  
}


//WalmartController.WalmartCleanUp();
//WalmartController.WalmartDailyUpdate();
//WalmartController.WalmartNotification();

console.log(`API listening on ${port}`);

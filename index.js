const UserController = require('./api/controllers/authentication');
const WalmartController = require('./api/controllers/walmart');

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
    //blockRoutes = express.Router(),
	//entryRoutes = express.Router(),
    walmartRouter = express.Router();

	
	// Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  // Registration route
  authRoutes.post('/register', requireLogin, UserController.register);

  // Login route
  authRoutes.post('/login', requireLogin, UserController.login);

  // Password reset request route (generate/send token)
  authRoutes.post('/forgot-password', UserController.forgotPassword);

  // Password reset route (change password using token)
  authRoutes.post('/reset-password/:token', UserController.verifyToken);

  //==========================
  //  Entry
  // =========================
  //apiRoutes.use('/entry', entryRoutes);
  //entryRoutes.get('/list', requireAuth, EntryController.listEntry);
  //entryRoutes.post('/add', requireAuth, EntryController.entryAdd);
  //entryRoutes.post('/:entryId/floor', requireAuth, EntryController.updateFloor);
  //entryRoutes.post('/:entryId/appartment', requireAuth, EntryController.updateAppartment);
  // entryRoutes.post('/:entryId/:apartId', requireAuth, EntryController.apartmentInfo);
  //entryRoutes.get('/:entryId', requireAuth, EntryController.viewEntry);
  

  //---------------------
  //  Block 
  
  //apiRoutes.use('/block', blockRoutes);
  //blockRoutes.post('/add', requireAuth, BlockController.blockAdd);
  //blockRoutes.get('/list', requireAuth, BlockController.blockList);
  //blockRoutes.get('/:blockId', requireAuth, BlockController.blockInfo);
  //blockRoutes.delete('/:blockId', requireAuth, BlockController.blockDelete);
  
  //= ========================
  // User Routes
  //= ========================

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes);

  // View user profile route
  userRoutes.get('/walmartList', requireAuth, WalmartController.getUserItemList);
  userRoutes.get('/:userId', requireAuth, UserController.viewProfile);
  //userRoutes.get('/items/:userId', requireAuth, WalmartController.getUserItems);
  
  userRoutes.post('/:userId', UserController.userUpdate);
  userRoutes.delete('/:userId', UserController.userDelete);

    apiRoutes.use('/walmart', walmartRouter);
    walmartRouter.post('/item', requireAuth, WalmartController.WalmartAddItems);	
    walmartRouter.get('/item/:itemId', requireAuth, WalmartController.getWalmartItems);	
    walmartRouter.get('/item/search/:sType/:itemId', requireAuth, WalmartController.getWalmartSearchedItems);	
    
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

console.log(`API listening on ${port}`);

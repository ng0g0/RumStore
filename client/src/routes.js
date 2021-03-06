import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Import miscellaneous routes and other requirements
import App from './components/app';
import NotFoundPage from './components/pages/not-found-page';

// Import authentication related pages
import Register from './components/auth/register';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import ForgotPassword from './components/auth/forgot_password';
import ResetPassword from './components/auth/reset_password';

// Import dashboard pages
import Dashboard from './components/dashboard/dashboard';
//import BlockList from './components/blocks/block-list';
//import BlockView from './components/blocks/block-view';
import ViewProfile from './components/dashboard/profile/view-profile';

import TabItems from './components/walmart/tab-items';
//import Inbox from './components/dashboard/messaging/inbox';
//import Conversation from './components/dashboard/messaging/conversation';
//import ComposeMessage from './components/dashboard/messaging/compose-message';
//import BillingSettings from './components/billing/settings';

// Import billing pages
//import InitialCheckout from './components/billing/initial-checkout';

// Import admin pages
import AdminDashboard from './components/admin/dashboard';
import SearchItem from './components/walmart/search-item';

// Import higher order components
import RequireAuth from './components/auth/require_auth';

export default (
  <Route path="/" component={App}>
    //<IndexRoute component={RequireAuth(Dashboard)} />
    <IndexRoute component={SearchItem} />
    <Route path="search" component={SearchItem} />
    <Route path="register" component={Register} />
    <Route path="login" component={Login} />
    <Route path="logout" component={Logout} />
    <Route path="forgot-password" component={ForgotPassword} />
    <Route path="reset-password/:resetToken" component={ResetPassword} />
    <Route path="profile" component={RequireAuth(ViewProfile)} />
    <Route path="walmart" component={RequireAuth(TabItems)} />
    <Route path="dashboard">
      <IndexRoute component={RequireAuth(Dashboard)} />
    </Route>
    <Route path="*" component={NotFoundPage} />
  </Route>
);

//<Route path="blocks" component={RequireAuth(BlockList)} />
//	<Route path="blocks/:blockid" component={RequireAuth(BlockView)} />

//<Route path="contact-us" component={ContactPage} />
//<Route path="component-samples" component={RequireAuth(ComponentSamplesPage)} />
    //<Route path="checkout/:plan" component={RequireAuth(InitialCheckout)} />
    //<Route path="billing/settings" component={RequireAuth(BillingSettings)} />
	//<Route path="admin" component={RequireAuth(AdminDashboard)} />
    //  <Route path="inbox" component={RequireAuth(Inbox)} />
    //  <Route path="conversation/new" component={RequireAuth(ComposeMessage)} />
    //  <Route path="conversation/view/:conversationId" component={RequireAuth(Conversation)} />

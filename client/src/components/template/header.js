import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { Link } from 'react-router';
import Translation from '../locale/translate';
import { ToastContainer } from 'react-toastify';



class HeaderTemplate extends Component {
  
    renderLinks() {
        if (this.props.authenticated) {
            return ( <ul className="nav navbar-nav">
                <li key={`${1}header`}>
                    <Link to="dashboard"><Translation text="Dashboard" /></Link>
                </li>
                <li key={`${2}header`}>
                    <Link to="/walmart"><Translation text="Walmart" /></Link>
                </li>
                <li key={`${3}header`}>
                    <Link to="/reports"><Translation text="Reports" /></Link>
                </li>
            </ul>);
        } 
    }
/*
<li key={`${2}header`}>
                    <Link to="/blocks"><Translation text="Building" /></Link>
                </li>
*/

    renderAdminMenu() {
        const user = cookie.load('user');
        //console.log(user);
        if (user.role === 1) { 
            return(<li><Link to="register"><Translation text="AddUser" /></Link></li>)
        }
    }
    
	renderUserMenu() {

		if (this.props.authenticated) {
			return (<ul className="nav navbar-nav navbar-right">
				<li className="dropdown">
				 <a className="dropdown-toggle" data-toggle="dropdown" href="#">
				 <span className="caret"></span></a>
					<ul className="dropdown-menu">
						<li><Link to="profile"><Translation text="Profile" /></Link></li>
                        { this.renderAdminMenu()}
						<li><Link to="logout"><Translation text="Logout" /></Link></li>
                   </ul>
				</li>
			</ul>);
		} else {
			if (!this.props.form.login) {
				
				return (<ul className="nav navbar-nav navbar-right">
					<li> <Link className="glyphicon glyphicon-user" to="login">
					<span className="nav_menu">Login</span></Link></li>
				</ul>);
			}
	  }
	}
    render() {
        return (<nav className="navbar navbar-default">
			<div className="container">
                <ToastContainer autoClose={2000} />
				<div className="navbar-header">
					<button type="button" className="navbar-toggle" 
						data-toggle="collapse" data-target="#myNavbar">
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>                        
					</button>
					<img alt="Brand" src="/images/header.jpg"/>
					<Link className="navbar-brand" to="/">{this.props.logo}</Link>
				</div>
				<div className="collapse navbar-collapse" id="myNavbar">
					{this.renderLinks()}
					{this.renderUserMenu()}
				</div>
			</div>
		</nav>);
	}
}

function mapStateToProps(state) {
   // console.log(state);
    return {
        authenticated: state.auth.authenticated,
        form: state.form
    };
}

export default connect(mapStateToProps)(HeaderTemplate);

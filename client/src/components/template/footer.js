import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { setLanguage} from '../../actions/auth';
import locale from '../locale/locale';


class FooterTemplate extends Component {
	
  setLang(event) {
	this.props.setLanguage(event.target.value);
  }	
  renderLinks() {
    if (this.props.authenticated) {
      return [
        <li key={1}>
          <Link to="/">Home</Link>
        </li>,
        <li key={2}>
          <Link to="dashboard">Dashboard</Link>
        </li>,
        <li key={3}>
          <Link to="logout">Logout</Link>
        </li>,
      ];
    } else {
      return [
        // Unauthenticated navigation
        <li key={1}>
          <Link to="/">Home</Link>
        </li>,
        <li key={2}>
          <Link to="login">Login</Link>
        </li>,
        
      ];
    }
  }
  /*
  <li key={3}>
          <Link to="register">Register</Link>
        </li>,
  */
  
  renderOptions(lang) {
	  
     const options = {
		key: lang.locale,
		value : lang.locale
	 }
	  
	  return (
		<option {...options}>{lang.name}</option>
		);
  }

  render() {
    const d = new Date();
    const year = d.getFullYear();
    return (
      <footer>
        <div className="container">					
          <div className="row">
            <div className="col-lg-12">
              <p className="copyright">© {year}, Low Intellect Ltd. All Rights Reserved.</p>
            </div>
          </div>
		  <div className="row">
		  <select className="selectpicker" data-width="fit" onChange={this.setLang.bind(this)} value={this.props.locale}>
			 {locale.LANG_NAMES.map((lang) =>   this.renderOptions(lang)   )}
			</select>
		  </div>
        </div>
      </footer>
    );
  }
}


function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
	locale: state.lang.lang
  };
}

export default connect(mapStateToProps, { setLanguage })(FooterTemplate);

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
  
  renderAmazon() {
    return(<div class="alignleft">
     <script type="text/javascript">
       	amzn_assoc_ad_type = "banner";
	amzn_assoc_marketplace = "amazon";
	amzn_assoc_region = "US";
	amzn_assoc_placement = "assoc_banner_placement_default";
	amzn_assoc_campaigns = "bestsellingproducts";
	amzn_assoc_banner_type = "category";
	amzn_assoc_p = "288";
	amzn_assoc_isresponsive = "false";
	amzn_assoc_banner_id = "03JGEXJ8VWRFPFC6SYG2";
	amzn_assoc_width = "320";
	amzn_assoc_height = "50";
	amzn_assoc_tracking_id = "rumstoreporta-20";
	amzn_assoc_linkid = "179c4adc1d4b6435f7d0a305ae1eef86";
     </script>
     <script src="//z-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&Operation=GetScript&ID=OneJS&WS=1"></script>
    </div>);  
  }

  render() {
    const d = new Date();
    const year = d.getFullYear();
    return (
      <footer>
        <div className="container">
            <div className="row">
            {this.renderAmazon()}
            </div>
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

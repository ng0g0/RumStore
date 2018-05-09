import React, { Component } from 'react';
import cookie from 'react-cookie';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import {bindActionCreators} from 'redux';
import { fetchUser, updateUser, deleteUser} from '../../../actions/index';
import Translation from '../../locale/translate';
//import ToggleSwitch from '../../template/toggleSwitch';


const form = reduxForm({
  form: 'ViewProfile',
  validate,
});

const renderField = ({
  input,
  type,
  meta: { touched, error, warning },
}) => (
  <div>
    <input className="form-control" {...input} type={type} />
    {touched &&  error &&   <div className="error">  {error}  </div>}
  </div>
);

const emailValidate = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
  'Invalid email address' : undefined;

function validate(formProps) {
  const errors = {};
  
  if (!formProps.firstName) {
    errors.firstName = 'Please enter a first name';
  }

  if (!formProps.lastName) {
    errors.lastName = 'Please enter a last name';
  }

  if (!formProps.email) {
    errors.email = 'Please enter an email';
  }
  
  errors.email = emailValidate(formProps.email);

  if (!formProps.password) {
    errors.password = 'Please enter a password';
  }
  
   if (!formProps.passwordConfirm ) {
    errors.passwordConfirm = 'Please confirm new password';
  }
  
  if (formProps.password !== formProps.passwordConfirm) {
    errors.passwordConfirm = 'Passwords must match';
  }

  return errors;
}



class ViewProfile extends Component {
   handleFormSubmit(formProps) {
    this.props.updateUser(formProps);
	this.props.dispatch(this.props.reset('ViewProfile'));
  }	
  deleteUser() {
	this.props.deleteUser(this.props.data.uid);  
  }
  componentDidMount() {
   // console.log(this.props.data);
  // Fetch user data prior to component mounting
	if (!this.props.data) {
		const user = cookie.load('user');
		this.setState({setupComplete: false});
		this.props.dispatch(fetchUser(user.uid));
	}
  }
  
  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div>
          <span><strong>Error!</strong> {this.props.errorMessage}</span>
        </div>
      );
    }
  }

  render () {
	const { handleSubmit, load, pristine, reset, submitting } = this.props; 
	
	if ( this.props.setupComplete ) {
		return (
		  <div> <Translation text="UserInformation" />:	
		  <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
			{this.renderAlert()}
			<div className="row">
			  <div className="col-md-6">
				<label><Translation text="FirstName" /></label>
				<Field name="firstName" className="form-control" component={renderField} type="text" />
			  </div>
			  <div className="col-md-6">
				<label><Translation text="LastName" /></label>
				<Field name="lastName" className="form-control" component={renderField} type="text" />
			  </div>
			</div>
			<div className="row">
                <div className="col-md-12">
				<label><Translation text="Email" /></label>
				<Field name="email" className="form-control" component={renderField} type="text" />
                </div>
			</div>
            
			<div className="row">
			  <div className="col-md-12">
				<label><Translation text="Password" /></label>
				<Field name="password" className="form-control" component={renderField} type="password" />
			  </div>
			</div>
			<div className="row">
			  <div className="col-md-12">
				<label><Translation text="ConfirmPassword" /></label>
				<Field name="passwordConfirm" className="form-control" component={renderField} type="password" />
			  </div>
			</div>
            <div className="row">
			  <div className="col-md-12">
				<label><Translation text="Administrator" /></label>
				<Field name="role" className="form-control" id="role" component={renderField} type="checkbox" />
			  </div>
			</div>
			<button type="submit" className="btn btn-primary"><Translation text="Update" /></button>
			<button type="button" onClick={() => this.deleteUser(this)}><Translation text="Delete" /></button>
		  </form>
		  </div>
		);
		}
	else {
		return (<div className='loader'> <Translation text="Loading" />...</div> );
	}
  }
}

//  <ToggleSwitch text="AutoRefresh" checked={checked} onChange={this.handleScheduleItem()} /> 

            
            
function mapStateToProps(state) {
	//	console.log(state);
  return {
    data: state.user.data,
	setupComplete: state.user.setupComplete,
	initialValues: state.user.data,
	errorMessage: state.user.error,
	locale: state.lang.locale
  };
}

const mapDispatchToProps = (dispatch) =>   
  bindActionCreators({
    fetchUser,
	updateUser,
	deleteUser
}, dispatch);

  
  export default connect(mapStateToProps, mapDispatchToProps)(form(ViewProfile));



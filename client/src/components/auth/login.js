import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router';
import { loginUser, showToast } from '../../actions/auth';
import Translation from '../locale/translate';

const form = reduxForm({
  form: 'login',
});

class Login extends Component {
  handleFormSubmit(formProps) {
    this.props.loginUser(formProps);
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="errormsg">
          <span>{this.props.errorMessage}</span>
        </div>
      );
    }
  }
    

  render() {
    const { handleSubmit } = this.props;

    return (<div className="panel panel-default">
            <div className="panel-body">
              <div>
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                  {this.renderAlert()}
                  <div>
                    <label><Translation text="Email" /></label>
                    <Field name="email" className="form-control" component="input" type="text" />
                  </div>
                  <div>
                    <label><Translation text="Password" /></label>
                    <Field name="password" className="form-control" component="input" type="password" />
                  </div>
                  <button type="submit" className="btn btn-primary"><Translation text="Login" /></button>
                </form>
                <Link to="/forgot-password"><Translation text="ForgotPass" />?</Link>
                        </div>
            </div>
        </div>);
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    message: state.auth.message,
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, { loginUser, showToast })(form(Login));

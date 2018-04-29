import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { connect } from 'react-redux';
import {  Field, reduxForm, FieldArray  } from 'redux-form';
import Translation from '../locale/translate';
import { saveApartmnet, fetchApartmentInfo } from '../../actions/blocks';
import {bindActionCreators} from 'redux';
import { AddApartmentConst } from '../../consts';
import AccGroup from '../accordion/accordiongroup';

function validate(formProps) {
  const errors = {};

  return errors;
}

const renderField = ({
  input,
  type,
  meta: { touched, error, warning },
}) =>
  ( <div>
      <input className="form-control" {...input} type={type} />
	  {touched &&  error &&   <div className="error"><Translation text={error} /></div>}
    </div>
  );

const renderPerson= ({ fields, meta: { error, submitFailed } }) => (
    <div> 
        <div className="row">
            <div className="col-md-12 pull-right btnborder">
                <button type="button" onClick={() => fields.push()} className="btn">
                    <Translation text="AddPerson" /></button>
                {submitFailed && error && <span>{error}</span>}
            </div>
        </div>
        {
      fields.map((person, index) => (
      <div className="row" key={index}>
        <div className="col-sm-6"> 
            <label><Translation text="Name" /></label>
            <Field name={`${person}.name`}  className="form-control" component={renderField} type="text" />
        </div>
        <div className="col-md-4">
            <label><Translation text="type" /></label>
            <Field name={`${person}.type`} className="form-control" component="select">
                <option />
                <option value="ad"><Translation text="adult" /></option>
                <option value="ch"><Translation text="child" /></option>
                <option value="p"><Translation text="pet" /></option>
            </Field>
        </div>
        <div className="col-sm-2">
            <label><Translation text="???" /></label>
            <button type="button" className="btn" onClick={() => fields.remove(index)} >
                <Translation text="Delete" />
            </button>
        </div>
      </div>
    ))}
  </div>
);
  

class AddAppartment extends Component {
    constructor(props) {
		super(props);
	}
   
    render () {
        const { handleSubmit } = this.props;
        if  (this.props.loadingSpinner) {
		return (<div className='loader'><Translation text="Loading" />...</div>);
        } else {
            return(
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-2">
                        <label><Translation text="stnumber" /></label>
                        <Field name="number" className="form-control" component={renderField} type="text" />
                        <Field name="objid" style={{ height: 0 }} component="input" type="hidden" />
                    </div>
                    <div className="col-md-8">
                        <label><Translation text="title" /></label>
                        <Field name="name" className="form-control" component={renderField} type="text" />
                    </div>
                </div>
            <AccGroup title="Size" collapsed="N">   
                <div className="row">
                    <div className="col-md-8">
                        <label><Translation text="Size" /></label>
                        <Field name="size" className="form-control" component={renderField} type="text" />
                    </div>
                </div>
            </AccGroup>
            <AccGroup title="AddPerson" >   
            <div className="row">
                <Field name="count" style={{ height: 0 }} component="input" type="hidden" />
                <div className="col-md-12">
                    <FieldArray name="persons" component={renderPerson} />
                </div>
            </div>
            </AccGroup>
           
          </form>); 
        }
	
	}
}



	
function mapStateToProps(state) {
    console.log(state.form);
   return {
    apartment: state.block.apartment,
    setupComplete: state.block.loadingSpinnerInfo,
	errorMessage: state.block.error,
    initialValues: state.block.apartment,
  };
}
const mapDispatchToProps = (dispatch) =>   
  bindActionCreators({
    saveApartmnet,
    fetchApartmentInfo
}, dispatch);

function  handleFormSubmit(formProps, dispatch) {
    console.log('handleFormSubmit');
    console.log(formProps);
    return dispatch(saveApartmnet(formProps.floors));
}

const form = reduxForm({
  form: AddApartmentConst,
  validate,
  enableReinitialize: true,
  onSubmit: handleFormSubmit 
});


export default connect(mapStateToProps, mapDispatchToProps)(form(AddAppartment));



import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Translation from '../locale/translate';
import { saveBlock, fetchBlockInfo } from '../../actions/blocks';
import {bindActionCreators} from 'redux';
import AccGroup from '../accordion/accordiongroup';
import {required} from '../../consts/validation';


function validate(formProps) {
  const errors = {};
  
   errors.name = required(formProps.name);
          
  return errors;
}

const renderField = ({
  input,
  type,
  meta: { touched, error, warning },
}) =>
  ( <div>
      <input className="form-control" {...input} type={type} />
	  {touched &&  error &&   <div className="error">  {error}  </div>}
    </div>
  );
  

class AddBlock extends Component {
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
               <div className="col-md-12">
                <label><Translation text="title" /></label>
                <Field name="name" className="form-control" component={renderField} type="text" />
                <Field name="objid" style={{ height: 0 }} component="input" type="hidden" />
              </div>
               </div>
            <AccGroup title="addBlockAddress" >   
            <div className="row">
                <div className="col-md-12">
                    <label><Translation text="country" /></label>
                    <Field name="country" className="form-control" component={renderField} type="text" />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <label><Translation text="city" /></label>
                    <Field name="city" className="form-control" component={renderField} type="text" />
                </div>
                <div className="col-md-6">
                    <label><Translation text="postCode" /></label>
                    <Field name="postCode" className="form-control" component={renderField} type="text" />
                </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <label><Translation text="distrtict" /></label>
                <Field name="distict" className="form-control" component={renderField} type="text" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <label><Translation text="street" /></label>
                <Field name="street" className="form-control" component={renderField} type="text" />
              </div>
            </div>
            </AccGroup>
            <AccGroup title="addBlockNumber" collapsed="Y" >
                <div className="row">
                  <div className="col-md-12">
                    <label><Translation text="stnumber" /></label>
                    <Field name="number" className="form-control" component={renderField} type="text" />
                  </div>
                </div>
            </AccGroup>
           
          </form>); 
        }
	
	}
}
	
function mapStateToProps(state) {
 // console.log(state);  
  return {
    block: state.block.blockInfo,
	setupComplete: state.block.loadingSpinnerInfo,
	initialValues: state.block.blockInfo,
	errorMessage: state.block.error
  };
}
const mapDispatchToProps = (dispatch) =>   
  bindActionCreators({
    saveBlock,
    fetchBlockInfo
}, dispatch);

function  handleFormSubmit(formProps, dispatch) {
    return dispatch(saveBlock(formProps));
}

const form = reduxForm({
  form: 'addBlock',
  validate,
  enableReinitialize: true,
  onSubmit: handleFormSubmit 
});


export default connect(mapStateToProps, mapDispatchToProps)(form(AddBlock));



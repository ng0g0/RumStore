import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Translation from '../locale/translate';
import { searchFunc } from '../../actions/walmart';
import {bindActionCreators} from 'redux';
import { searchWalmart } from '../../consts';
import AccGroup from '../accordion/accordiongroup';
//import {required, maxLength15, minLength2} from '../../consts/validation';

/*
function validate(formProps) {
  const errors = {};
  
  errors.search = required(formProps.search);
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
 */ 

class SearchItem extends Component {
    constructor(props) {
		super(props);
	}
   
    render () {
        console.log(searchWalmart);
        const { handleSubmit } = this.props;
        return(
            <AccGroup title="WALMAR_ITEM_SEARCH" key="searchArea" item="searchArea" > 
            <form onSubmit={handleSubmit}>
            <div className="row">
            <div className="col-md-6">
                <label>Search by:</label>
                <div>
                    <label><Field name="stype" component="input" type="radio" value="itemId"/> ItemId</label>
                    <label><Field name="stype" component="input" type="radio" value="upc"/> UPC</label>
                </div>
            </div>
            <div className="col-md-6">
                <Field name="search" component="input" type="text"/>
            </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <button type="submit"><Translation text="WALMAR_ITEM_SEARCH" /></button>
                </div>
            </div>
            
          </form>
          </AccGroup>); 
    }
	
}
	
function mapStateToProps(state) {
    console.log(state.form);
   return {
	//errorMessage: state.block.error,
    loadingSpinnerInfo: state.walmart.itemInfo,
    itemInfo: state.walmart.itemInfo
  };
}
const mapDispatchToProps = (dispatch) =>   
  bindActionCreators({
    searchFunc
}, dispatch);

function  handleFormSubmit(formProps, dispatch) {
    return dispatch(searchFunc(formProps));
}

const form = reduxForm({
  form: searchWalmart,
 // validate,
 // enableReinitialize: true,
  onSubmit: handleFormSubmit, 
   initialValues: { stype: 'itemid' }
});


export default connect(mapStateToProps, mapDispatchToProps)(form(SearchItem));



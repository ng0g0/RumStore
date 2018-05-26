import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Translation from '../locale/translate';
import { searchFunc } from '../../actions/walmart';
import {bindActionCreators} from 'redux';
import { searchWalmart } from '../../consts';
import AccGroup from '../accordion/accordiongroup';
import ListItems from './list-items';
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
        const { handleSubmit, itemInfo } = this.props;
        //console.log(itemInfo);
        return (<div className="panel panel-default">
                    <div className="panel-body">
                        <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="row">
                                    <div className="col-md-6"><label>Search by:</label></div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <label><Field name="stype" component="input" type="radio" value="itemId"/> 
                                                ItemId
                                            </label>        
                                        </div>
                                        <div className="row">
                                            <label><Field name="stype" component="input" type="radio" value="upc"/>
                                                UPC
                                                </label>
                                        </div>
                                        <div className="row">
                                            <label><Field name="stype" component="input" type="radio" value="name"/>
                                                name
                                                </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <Field name="search" component="input" type="text"/>
                            </div>
                            <div className="col-md-3">
                                <button type="submit"><Translation text="WALMAR_ITEM_SEARCH" /></button>
                            </div>
                        </div>
                        </form>
                        <ListItems />
                    </div>
                </div>);
    }
	
}
	
function mapStateToProps(state) {
    //console.log(state.form);
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
  initialValues: { stype: 'itemId' }
});


export default connect(mapStateToProps, mapDispatchToProps)(form(SearchItem));



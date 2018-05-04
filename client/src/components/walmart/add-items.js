import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import Translation from '../locale/translate';
import { searchFunc, saveItem} from '../../actions/walmart';
import {bindActionCreators} from 'redux';
import { WalmartItem } from '../../consts';
//import {required, maxLength15, minLength2} from '../../consts/validation';
import SearchItem from './search-item';


function validate(formProps) {
  const errors = {};
  
  //errors.name = required(formProps.name);
  return errors;
}
/*
const renderMuiltiSelect = ({
input,
  type,
  meta: { touched, error, warning },
}) =>
  ( <div>
      <input className="form-control" {...input} type={type} />
      <select ref={name} value={value} onChange={this.onChange} multiple>
      { emptyValue }
      {(optionList) && optionList.map(current => (
        <option key={current.value} value={current.value}>{current.name}</option>))
      }
</select>
    </div>
  );
*/  
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
  

class AddItem extends Component {
    constructor(props) {
		super(props);
	}
    
    render () {
        const { handleSubmit ,itemURL} = this.props;
        console.log(this.props.loadingSpinnerInfo);

        var itemImage = itemURL || "/images/nopic.jpg" //value || ;
        if  (this.props.loadingSpinnerInfo) {
		return (<div>
                <SearchItem />
                <div className='loader'><Translation text="Loading" />...</div>
            </div>);
        } else {
            return(<div>
            <SearchItem />
            <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6">
                    <label><Translation text="WALMAR_ITEM_ID" /></label>
                    <Field name="webid" className="form-control" component={renderField} type="text"/>
                    <Field name="itemid" style={{ height: 0 }} component="input" type="hidden" />
                </div>
                <div className="col-md-6">
                    <label><Translation text="WALMART_STORE" /></label>
                    <Field name="webstore" className="form-control" component="select">
                    <option />
                    <option value="walmart">Walmart</option>
                    </Field>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <label><Translation text="WALMAR_ITEM_NAME" /></label>
                    <Field name="itemname" className="form-control" component={renderField} type="text"/>
                </div>
            </div> 
            <div className="row">
                <div className="col-md-4">
                <img alt='image' src ={itemImage} />    
                </div>
                <div className="col-md-8">
                    <label><Translation text="WALMAR_ITEM_URL" /></label>
                    <Field name="itemimgurl" className="form-control" component={renderField} type="text"/>
                 </div>
            </div> 
            <div className="row">
                <div className="col-md-12">
                    <label><Translation text="WALMAR_ITEM_UPC" /></label>
                    <Field name="itemupc" className="form-control" component={renderField} type="text"/>
                </div>
            </div> 
            <div className="row">
                <div className="col-md-12">
                    <label><Translation text="WALMAR_ITEM_ASIN" /></label>
                    <Field name="itemasib" className="form-control" component={renderField} type="text"/>
                </div>
            </div> 
            <div className="row">
                <div className="col-md-12">
                    <label><Translation text="WALMAR_ITEM_REFRESH" /></label>
                    <Field name="itemrefresh" id="itemrefresh" component="input" type="checkbox" />
                </div>
            </div>
            <div className="row">
             <div className="col-md-12">
                <button type="submit">
                    Submit
                </button>
            </div>
            </div>
          </form></div>); 
        }
	
	}
}
//<FieldArray name="" component={renderItemProps} /> 
/*
const renderItemProps = ({ fields, meta: { error, submitFailed } }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push({})}> Add Props  </button>
      {submitFailed && error && <span>{error}</span>}
    </li>
    {fields.map((member, index) => (
      <li key={index}> 
        <button type="button" title="Remove Prop" onClick={() => fields.remove(index)} />
        <h4>Prop #{index + 1}</h4> 
         <Field name="webstore" className="form-control" component={renderMuiltiSelect}>
        <>
      </li>
    ))}
  </ul>
)
*/
	
function mapStateToProps(state) {
    console.log(state.walmart);
    const selector = formValueSelector(WalmartItem)
    const itemURL = selector(state, 'itemimgurl')
   return {
	errorMessage: state.walmart.error,
    initialValues: state.walmart.itemInfo,
    loadingSpinnerInfo: state.walmart.loadingSpinnerInfo,
    itemInfo: state.walmart.itemInfo,
    itemURL: itemURL
  };
}
const mapDispatchToProps = (dispatch) =>   
  bindActionCreators({
    searchFunc, saveItem

}, dispatch);

function  handleFormSubmit(formProps, dispatch) {
    return dispatch(saveItem(formProps));
}

const form = reduxForm({
  form: WalmartItem,
  validate,
  enableReinitialize: true,
  onSubmit: handleFormSubmit 
});


export default connect(mapStateToProps, mapDispatchToProps)(form(AddItem));



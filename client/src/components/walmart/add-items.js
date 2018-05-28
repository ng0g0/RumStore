import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, FieldArray, change   } from 'redux-form';
import Translation from '../locale/translate';
import { searchFunc, saveItem} from '../../actions/walmart';
import {bindActionCreators} from 'redux';
import { WalmartItem } from '../../consts';
import SearchItem from './search-item';
import AccGroup from '../accordion/accordiongroup';
import Multiselect from 'react-widgets/lib/Multiselect'

function validate(formProps) {
  const errors = {};
  //errors.name = required(formProps.name);
  return errors;
}


const renderMultiselect = ({ input, ...rest }) => (
  <Multiselect {...input}
    onBlur={() => input.onBlur()}
     onChange={input.onChange} 
    value={input.value || []} // requires value to be an array
    {...rest}/>)

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
        this.state = {
            result: ['salePrice', 'stock']
        }
        this.handleMultiChange = this.handleMultiChange.bind(this);
	}
    
    handleMultiChange(val) {
        this.props.dispatch(change(WalmartItem, 'notification', val));
    }
    
    render () {
        const { handleSubmit ,itemURL} = this.props;
        //console.log(this.props.loadingSpinnerInfo);
        var itemImage = itemURL || "/images/nopic.jpg";
        if  (this.props.loadingSpinnerInfo) {
		return (<div>
                <SearchItem />
                <div className='loader'><Translation text="Loading" />...</div>
            </div>);
        } else {
            return(<div>
            <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6">
                    <label><Translation text="WALMAR_ITEM_ID" /></label>
                    <Field name="itemid" className="form-control" component={renderField} type="text"/>
                    <Field name="id" style={{ height: 0 }} component="input" type="hidden" />
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
                    <Field name="name" className="form-control" component={renderField} type="text"/>
                </div>
            </div> 
            <div className="row">
                <div className="col-md-12">
                    <img alt='image' src ={itemImage} />    
                    <Field name="thumbnailimage" style={{ height: 0 }}  component={renderField} type="text"/>
                 </div>
            </div> 
            <div className="row">
                <div className="col-md-12">
                    <label><Translation text="WALMAR_ITEM_UPC" /></label>
                    <Field name="upc" className="form-control" component={renderField} type="text"/>
                </div>
            </div> 
            <div className="row">
                <div className="col-md-6">
                    <label><Translation text="WALMAR_ITEM_PRICE" /></label>
                    <Field name="salePrice" className="form-control" component={renderField} type="text"/>
                </div>
                <div className="col-md-6">
                    <label><Translation text="WALMAR_ITEM_ONSTOCK" /></label>
                    <Field name="stock" className="form-control" component="select">
                    <option value="Available">Available</option>
                    <option value="Not available">Not available</option>
                    </Field>
                </div>
            </div> 
            <div className="row">
                <div className="col-md-12">
                    <label><Translation text="WALMAR_ITEM_ASIN" /></label>
                    <Field name="asib" className="form-control" component="input" type="text"/>
                </div>
            </div> 
            <AccGroup title="WALMAR_ITEM_NOTIFICATION" key="notificationArea" item="notificationArea" > 
            <div className="row">
                <div className="col-md-12">
                <Field
                    name="noty"
                    component={renderMultiselect}
                    data={this.state.result}
                    onChange={(e) => this.handleMultiChange(e)}
                    />
                </div>
            </div>
            </AccGroup>
          </form>
          </div>); 
        }
	
	}
}
	
function mapStateToProps(state) {
   // console.log(state);
    const selector = formValueSelector(WalmartItem)
    const itemURL = selector(state, 'thumbnailimage')
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



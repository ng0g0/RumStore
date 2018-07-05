import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Translation from '../locale/translate';
import { searchFunc } from '../../actions/walmart';
import {bindActionCreators} from 'redux';
import { searchWalmart } from '../../consts';
import ListItems from './list-items';


class SearchItem extends Component {
    constructor(props) {
		super(props);
	}
   
    render () {
        const { handleSubmit, itemInfo } = this.props;
        return (<div className="panel panel-default">
                    <div className="panel-body">
                        <div className="panel panel-primary">
                            <div className="panel-heading"> 
                                <Translation text="WALMAR_ITEM_SEARCH" />
                            </div>
                        <div className="panel-body">
                     <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-2"><label>Search:</label></div>
                            <div className="col-md-10"><Field name="search" component="input" type="text"/></div>
                        </div>
                        <div className="row">
                            <div className="col-md-2"><label>Search by:</label></div>
                            <div className="col-md-10"><Field name="stype" component="select">
                                        <option value="itemId">ItemId</option>
                                        <option value="upc">UPC</option>
                                        <option value="name">name</option>
                                        <option value="search">FreeSearch</option> 
                                    </Field></div>
                        </div>
                        <div className="row">    
                            <div className="col-md-2"><label>sort by:</label></div>
                            <div className="col-md-10"><Field name="sort" component="select">
                                        <option value="relevance">relevance</option>
                                        <option value="price">price</option>
                                        <option value="title">title</option>
                                        <option value="bestseller">bestseller</option>
                                        <option value="customerRating">customerRating</option>
                                        <option value="new">new</option>
                                    </Field></div>    
                        </div>
                        <div className="row">  
                            <div className="col-md-2"><label>Items per Page:</label></div>
                            <div className="col-md-10"><Field name="itemPage" component="select">
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                    </Field>
                                    <Field name="pageNum" component="input" style={{ height: 0 }} type="hidden" />
                                </div>
                        </div>
                        <div className="row">  
                            <div className="col-md-12">
                               <button type="submit"><Translation text="WALMAR_ITEM_SEARCH" /></button>
                            </div>
                        </div>
                        </form>
                        </div>
                        </div>
                        <ListItems {...this.props} />
                    </div>
                </div>);
    }
    
	 //relevance, price, title, bestseller, customerRating, new
}
	
function mapStateToProps(state) {
    return {
        initialValues: state.walmartSearch.formSearch,
    };
}
const mapDispatchToProps = (dispatch) =>   
  bindActionCreators({
    searchFunc
}, dispatch);

function  handleFormSubmit(formProps, dispatch) {
   //console.log(formProps);
    return dispatch(searchFunc(formProps));
}

//let timeout = null; 

const form = reduxForm({
  form: searchWalmart,
  enableReinitialize: true,
//  onChange: (values, dispatch, props, previousValues) => {
//      let value = values;
//      console.log(value);
//      clearTimeout(timeout);
//        timeout = setTimeout(() => { 
        //props.submit()
            //console.log(props);
            //console.log(dispatch);
//          console.log(values);
            //console.log(previousValues);
//            console.log(values);
// /       }, 1500);
//    },
  onSubmit: handleFormSubmit, 
});




export default connect(mapStateToProps, mapDispatchToProps)(form(SearchItem));



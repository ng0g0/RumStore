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
                            <div className="col-md-2">
                                <div className="row">
                                    <label>Search by:</label>
                                    <Field name="stype" component="select">
                                        <option value="itemId">ItemId</option>
                                        <option value="upc">UPC</option>
                                        <option value="name">name</option>
                                    </Field>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <Field name="search" component="input" type="text"/>
                            </div>
                            <div className="col-md-3">
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
    return dispatch(searchFunc(formProps));
}

const form = reduxForm({
  form: searchWalmart,
  enableReinitialize: true,
  onSubmit: handleFormSubmit, 
});


export default connect(mapStateToProps, mapDispatchToProps)(form(SearchItem));



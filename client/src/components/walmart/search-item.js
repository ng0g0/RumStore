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
    this.state = {isToggleOn: true};
    this.toggleClick = this.toggleClick.bind(this);
	}

  toggleClick() {
		this.setState(prevState => ({
			isToggleOn: !prevState.isToggleOn
		}));
	}

    render () {
        const { handleSubmit, itemInfo } = this.props;
        return (
<div className="panel panel-default">
  <div className="panel-body">
    <form onSubmit={handleSubmit}>
      <div className="panel panel-primary">
        <div className="panel-heading centerText">
          <Translation text="WALMAR_ITEM_SEARCH" />
          <Field name="search" component="input" type="text"/>
          <button type="submit"><Translation text="WALMAR_SEARCH" /></button>
          <div className="btn-group pull-right">
            <a className="nounderline black" href={`#panel-col-search`}
               data-toggle="collapse" onClick={() => this.toggleClick()}>
              {this.state.isToggleOn ?
                  <span className="glyphicon glyphicon-chevron-right"></span> :
                 <span className="glyphicon glyphicon-chevron-down"></span> }
            </a>
          </div>
        </div>
        <div className="panel-body">
          <div id="panel-col-search" className="collapse">
            <div className="row">
              <div className="col-md-2"><label>Search by:</label></div>
              <div className="col-md-6">
                <Field name="stype" component="select">
                  <option value="search">FreeSearch</option>
                  <option value="itemId">ItemId</option>
                  <option value="upc">UPC</option>
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2"><label>sort by:</label></div>
              <div className="col-md-6">
                <Field name="sort" component="select">
                  <option value="relevance">relevance</option>
                  <option value="price">price</option>
                  <option value="title">title</option>
                  <option value="bestseller">bestseller</option>
                  <option value="customerRating">customerRating</option>
                  <option value="new">new</option>
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2"><label>Items per Page:</label></div>
              <div className="col-md-6">
                <Field name="itemPage" component="select">
                  <option value="10">10</option>
                  <option value="25">25</option>
                </Field>
                <Field name="pageNum" component="input" style={{ height: 0 }} type="hidden" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <ListItems {...this.props} />
  </div>
</div>
              );
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
   //console.log(formProps);
    return dispatch(searchFunc(formProps));
}

//let timeout = null;

const form = reduxForm({
  form: searchWalmart,
  enableReinitialize: true,
  onSubmit: handleFormSubmit,
});




export default connect(mapStateToProps, mapDispatchToProps)(form(SearchItem));

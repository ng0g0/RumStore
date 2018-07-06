import React, { Component } from 'react';
//import { connect } from 'react-redux';
//import { Link } from 'react-router';
import { fetchWalmarUserList, fetchFromWalmarAPI, deleteWalmarItem } from '../../actions/walmart';
//import { itemToAddForm } from '../../actions/walmart';
//import {bindActionCreators} from 'redux';
//import AccGroup from '../accordion/accordiongroup';
//import Translation from '../locale/translate';
//import LayerMask from '../layerMask/layermask';
//import DeleteItem from './delete-items'
//import PropTypes from 'prop-types'; // ES6
//import AddItem from './add-items';
//import { WalmartItem, searchWalmart } from '../../consts';
//import { submit, change } from 'redux-form';
//import _ from 'lodash';

class ViewItems extends Component {
	constructor(props) {
		super(props);
    //    this.handleAddItem = this.handleAddItem.bind(this);
    //    this.handleAddForm = this.handleAddForm.bind(this);
    //this.handleFetchAll = this.handleFetchAll.bind(this);
	}
    
    //handleFetchAll() {
    //    this.props.dispatch(getWalmartItems('49435484'));
    //}
    //handleAddItem(item) {
    //      this.props.dispatch(submit(WalmartItem));
   // }
   // handleAddForm(item) {
        //console.log(item);
   //      this.props.dispatch(itemToAddForm(item));
   // }
    
    //handleCancelClick(item) {
    //    console.log('Cancel'); 
    //}
  
   // renderMessage(msg) {
   //     if (msg) {
   //         return (<div className="row"> 
   //             <div className="col-sm-6">{msg} </div>  
   //         </div>);
   //     } else {
   //         return(<div></div>);
   //     }
   // }
    componentDidMount() {
        //console.log(this.props);
		//if (!this.props.item) {
		//	 this.handleFetchAll();//,
            //this.handleRefreshItem(this.props.items);             
		//} 
        
       //this.interval = setInterval(
       //    this.handleRefreshItem(this.props.items), 
       //    10000
       //);
	}
    
    
   /*
    renderCellContent(item) {
        var itemImage = item.thumbnailimage || "/images/nopic.jpg";
        return(<div>
            <div className="row">
                { this.renderMessage(item.message) }
               <div className="col-sm-2">
                    <img alt={item.itemid} src ={itemImage} />
                </div>   
                <div className="col-sm-2"> 
                    ItemID: {item.itemid}
                </div> 
                <div className="col-sm-4"> 
                    <div className="row">
                        <div className="col">
                            <Translation text="Name" />:<b>{item.name}</b>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Translation text="WALMAR_ITEM_UPC" />:{item.upc}
                        </div>
                    </div>
                </div>
                <div className="col-sm-2"> 
                    <Translation text="Stock" />:<b>{item.stock}</b>
                </div>
                <div className="col-sm-2"> 
                    <Translation text="WALMAR_ITEM_PRICE" />:{item.salePrice}
                </div>    
            </div>
        </div>);
    }
    
	renderListContent(items) {
        if (!items) {
            return(<div> </div>);
        }
		if (items.length > 0) {
            let userItems = this.props.items.list.split(",");
			return (<div>
            {items.map((item) => {
                const findItem = userItems.find(function(element) {
                    return element == item.itemid;});
                const actionButton = (_.isUndefined(findItem)) ?  (
                        <Link className="btn-sm btn-default" data-toggle="modal" data-target="#addItem"
                            onClick={()=> this.handleAddForm(item) } >
                            <Translation text="ADD_ITEM" />
                        </Link>
                    ) : (<div className="green"> <Translation text="WALMAR_ALREADY" /></div> );
                return(<div className="panel panel-default blockche" key={item.itemid}>
                        <div className="panel-body">
                            <div className="row" >
                                <div className="col-sm-10">
                                {this.renderCellContent(item)}
                                </div>
                                <div className="col-sm-1">
                                    {actionButton}
                                </div> 
                            </div> 
                        </div>
                </div>)
            })}
            </div>);	
		}
		else {
            if (this.props.preformSearch) {
                return(<div className="panel panel-default">
                <div className="panel-body">
                    <Translation text="NO_DATE_FOUND" />
                </div>
            </div>);
            } else {
                return(<div> </div>);
            }
			;
		}
	}
    
    rentderFoundItems() {
        //console.log(this.props);
        const {totalItems, preformSearch, loadingSpinner } = this.props;
        let maxPage = Math.ceil( totalItems /this.props.formSearch.itemPage);
        if (preformSearch && !loadingSpinner) {
            return (<div className="row">
                <div className="col-sm-4"> Total Items: {totalItems} </div>
                <div className="col-sm-4"> <a href="#" onClick={()=> this.handleChangePage(maxPage, "FIRST") } ><span className="glyphicon glyphicon-step-backward"></span></a>
                    &nbsp;<a href="#" onClick={()=> this.handleChangePage(maxPage, "PRIOR") }><span className="glyphicon glyphicon-backward"></span></a> 
                    &nbsp;<Translation text="WALMAR_PAGE" />:{this.props.formSearch.pageNum} /{maxPage}
                    &nbsp;<a href="#" onClick={()=> this.handleChangePage(maxPage, "NEXT") }><span className="glyphicon glyphicon-forward"></span></a>
                    &nbsp;<a href="#" onClick={()=> this.handleChangePage(maxPage, "LAST") }><span className="glyphicon glyphicon-step-forward"></span></a> 
                </div>
            </div>);
        }
        return(<div></div>);
    }
    */
    
    render() {
        const { loadingSpinner } = this.props;
        if (loadingSpinner) {
            return (<div className='loader'><Translation text="Loading" />...</div>);
        } else {
            return (<div className="panel panel-default">
                <div className="panel-body">
                    {//this.renderAddItemLayer()}
                    {//this.rentderFoundItems()}
                    {//this.renderListContent(itemSearch)}
                </div>
            </div>);	
        }
    }
}


function mapStateToProps(state) {
  return {
    loadingSpinner: state.walmartSearch.searchSpinner,
//    itemSearch: state.walmartSearch.itemSearch,
//    items: state.walmart.items,  
//    preformSearch: state.walmartSearch.preformSearch,
//    formSearch: state.walmartSearch.formSearch,
//    totalItems: state.walmartSearch.totalItems,
  };
}

const mapDispatchToProps = (dispatch) =>   
    bindActionCreators({
          //  itemToAddForm
        }, 
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ListItems);




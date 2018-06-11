import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchWalmarUserList, fetchFromWalmarAPI, deleteWalmarItem, dbToAddForm } from '../../actions/walmart';
import {bindActionCreators} from 'redux';
import AccGroup from '../accordion/accordiongroup';
import Translation from '../locale/translate';
import LayerMask from '../layerMask/layermask';
import DeleteItem from './delete-items'
import PropTypes from 'prop-types'; // ES6
import ItemChart from './chart-items'; 
import AddItem from './add-items';
import { WalmartItem } from '../../consts';
import { submit } from 'redux-form'
import TabItems from './tab-items'; 
import _ from 'lodash';

class UserWalmartList extends Component {
	static contextTypes = {
		router: PropTypes.object,
	}
	
	constructor(props) {
		super(props);
        this.handleRefreshItem = this.handleRefreshItem.bind(this);
        this.handleCheckBoxItem = this.handleCheckBoxItem.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleFetchAll = this.handleFetchAll.bind(this);
        this.handleAddForm = this.handleAddForm.bind(this);
        this.handleNextPage = this.handleNextPage.bind(this);
        this.handlePrevPage = this.handlePrevPage.bind(this);
        this.handleMovePage = this.handleMovePage.bind(this);

        
        this.state = {
            allChecked: false,
            checkedCount: 2,
            currentValues: [],
            clickedItem: '',
            filter: '',
            sort: '',
            page: 1,
            itemPage: 20,
        }
	}
    
    handleMovePage(page) {
       this.setState({
            page : page
            }) 
    }
    handleNextPage() {
        let page = this.state.page;
        let itemcount = (this.props.itemList) ? this.props.itemList.length : 0; 
        let maxPage = Math.ceil( itemcount /this.state.itemPage);
        let newPage = (page < maxPage)? page + 1: page;
        this.setState({
            page : newPage
            })
    }
    handlePrevPage() {
        let page = this.state.page;
        let newPage = (this.state.page > 1) ? page - 1: page;
        this.setState({
            page : newPage
            })
        
    }
    
    
  
	componentDidMount() {
        //console.log(this.props);
		if (!this.props.items) {
			 this.handleFetchAll();//,
            //this.handleRefreshItem(this.props.items);             
		} 
        
       this.interval = setInterval(
           this.handleRefreshItem(this.props.items), 
           10000
       );
	}
    
    handleAddForm(item) {
        //console.log(item);
         this.props.dispatch(dbToAddForm(item));
    }
    
    handleFetchAll() {
        this.props.dispatch(fetchWalmarUserList());
    }
    
    handleCheckBoxItem(event) {
        var item = event.target.value;
        //console.log(item);
        if (item === "all") {
            if (this.state.allChecked) {
                this.setState({
                    allChecked : false,
                    checkedCount: 0,
                    currentValues: []
                });    
            }  else {
                this.setState({
                    allChecked : true,
                    checkedCount: this.props.itemList.length,
                    currentValues: this.props.items.list.split(",")
                }); 
            }
            
        } else {
            if (this.state.currentValues.indexOf(item) == -1 ) {
                var newX = this.state.currentValues;
                var selAll = false;
                 newX.push(item);
                 if (this.props.itemList.length === newX.length) {
                     selAll = true;
                 }
                 this.setState({
                    allChecked : selAll,
                    checkedCount: newX.length,
                    currentValues: newX
                });

            } else {
                var newX = this.state.currentValues;
                var index  = this.state.currentValues.indexOf(item); 
                if (index > -1) {
                    newX.splice(index, 1);
                    this.setState({
                    allChecked : false,
                    checkedCount: newX.length,
                    currentValues: newX
                });
                }
                
            }
        }
        //console.log(this.state.currentValues);
    }
    
    handleCancelClick(item) {
        this.setState({clickedItem: ''},() => { 
            console.log('new state', this.state); 
        });
    }
    
    handleDeleteClick(item) {
        this.setState({clickedItem: item},() => { 
            console.log('new state', this.state); 
        });
    }        
    
    handleDeleteItem() {
        var newX = this.state.currentValues;
        var selAll = false;
        if (this.state.clickedItem.length > 0 ) {
            this.props.dispatch(deleteWalmarItem(this.state.clickedItem)); 
                newX = newX.filter(function(e) { 
                return e !== this.state.clickedItem; 
                });
        } else {
            this.props.dispatch(deleteWalmarItem(this.state.currentValues.join())); 
            newX = newX.filter(function(e) { 
                return !newX.some(function(s) { 
                    return s === e; 
                });
            }); 
           
        }
        this.setState({
            allChecked : (this.props.itemList.length === newX.length)? true : false,
            checkedCount: newX.length,
            currentValues: newX
        });
    }
	
    handleRefreshItem(items) {
        if (items) {
            this.props.dispatch(fetchFromWalmarAPI(items)); 
        } //else {
        //    console.log('Items not found');
        //}
            
        
    }
    

    renderDeleteLayer() {
        let layerid = 'deleteItem'
        let label = 'DELETE_QUESTION';
      	return (<LayerMask layerid={layerid} header={label} key={layerid} 
                    onOkClick={this.handleDeleteItem.bind(this)} 
                    onCancelClick={this.handleCancelClick.bind(this)}
                    actionbtn="Delete" >
                    <DeleteItem deleteItems={this.state.clickedItem || this.state.currentValues.join()} />    
               </LayerMask>);
   }
   
   handleAddItem({ dispatch }) {
       this.props.dispatch(submit(WalmartItem));
        //console.log('Add Items');
    }
   
    renderAddItemLayer() {
        let layerid = 'addItem'
        let label = 'ADD_ITEM';
		return (<LayerMask layerid={layerid} header={label} key={layerid}
                    onOkClick={this.handleAddItem.bind(this)}
                    onCancelClick={this.handleCancelClick.bind(this)}                    
                    actionbtn="Save">
                    <AddItem /> 
                </LayerMask>);
   }  
   /**/
    renderMessage(msg) {
        if (msg) {
            return (<div className="row"> 
                <div className="col-sm-6">{msg} </div>  
            </div>);
        } else {
            return(<div></div>);
        }
    }
    
    onChangeHandler(e){
        this.setState({
            filter: e.target.value,
            page: 1
            })
    }
    renderPriceIndicator(value) {
        switch(value) {
        case -1:
            return(<span className="glyphicon glyphicon-arrow-down red"></span>)
        case 1:
            return(<span className="glyphicon glyphicon-arrow-up green"></span>)
        default:
            return(<span className="glyphicon glyphicon-minus"></span>)
        } 
    }
    renderCellContent(item) {
        const { currentValues } = this.state;
        var itemImage = item.thumbnailimage || "/images/nopic.jpg";
        return(<div>
            <div className="row">
                { this.renderMessage(item.message) }
               <div className="col-sm-2">
                    <img alt={item.itemid} src ={itemImage} className="img-responsive"/>
                </div>   
                <div className="col-sm-2"> 
                    ItemID: {item.itemid}
                </div> 
                <div className="col-sm-4"> 
                    <div className="row"><div className="col"><Translation text="Name" />: <b>{item.name}</b></div></div>
                    <div className="row"><div className="col"><Translation text="WALMAR_ITEM_UPC" />: {item.upc}</div></div>
                </div>
                <div className="col-sm-2">   
                    <Translation text="WALMAR_ITEM_ASIN" />: {item.asib}
                </div>
                <div className="col-sm-2"> 
                    <Translation text="WALMAR_ITEM_PRICE" />: {item.salePrice}
                    {this.renderPriceIndicator(item.priceIndicator)}
                </div>    
            </div>
            <div className="row">
                <AccGroup title="WALMAR_ITEM_HISTORY" key={item.itemid} collapsed="Y" item={item.itemid} >  
                    <ItemChart itemDetails={item.itemdetails} key={item.itemid} />    
                 </AccGroup> 
            </div>
        </div>);
    }
    
   
    
	renderListContent(items) {
        
        const { currentValues, filter } = this.state
		if (items) {
            var filtered= _.filter(items, function(item) {
                if (filter.length > 0) {
                    if (item.itemid.toUpperCase().indexOf(filter.toUpperCase())== -1){
                        if (item.name.toUpperCase().indexOf(filter.toUpperCase()) == -1){ 
                            //if (item.upc.toUpperCase().indexOf(filter.toUpperCase()) == -1){ 
                                if (item.asib.toUpperCase().indexOf(filter.toUpperCase()) == -1){ 
                                    return false; 
                                //}
                            }
                        }
                    }                    
                        
                }
                return true;
            });
            let pageItems = this.state.page*this.state.itemPage;
            let totaItems = filtered.length;
            let maxPage = Math.ceil( totaItems /this.state.itemPage);
            let start = 0+((this.state.page-1)*(this.state.itemPage));
            let end = ( pageItems > totaItems) ? totaItems : pageItems;
            console.log(`start = ${start}`);
            console.log(`end = ${end}`);
			return (<div>
                <div className="row">
                    <div className="col-sm-2">
                   <input type="checkbox" className="form-check-input  allcheck" name="all"  
                              checked={this.state.allChecked} value="all"  
                              onClick={(event )=> this.handleCheckBoxItem(event) }/> 
                    </div>
                    <div className="col-sm-10">
                    <Translation text="WALMAR_ITEM_SEARCH"  />
                    <input value={filter} type="text" onChange={this.onChangeHandler.bind(this)}/>
                    </div>
                </div>
            {filtered.slice(start, end).map((item) => {
                return(<div className="panel panel-default blockche" key={item.itemid}>
                        <div className="panel-body">
                    <div className="row" >
                    <div className="col-sm-1">
                        <input type="checkbox" className="form-check-input" name={item.itemid} key={item.itemid} 
                        checked={currentValues.indexOf(item.itemid) !== -1}
                        value={item.itemid} onClick={(event )=> this.handleCheckBoxItem(event) }/>
                    </div>
                    <div className="col-sm-10">
                        {this.renderCellContent(item)}
                    </div>
                    <div className="col-sm-1">
                        <div className="row">
                            <div className="col">
                                <a className="btn-sm btn-default" href="#" role="button" onClick={()=> this.handleRefreshItem(item.itemid) }>
                                    <Translation text="WalmartRefresh"  />
                                </a>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <a className="btn-sm btn-default" href="#" role="button" data-toggle="modal" data-target="#deleteItem"
                                    onClick={()=> this.handleDeleteClick(item.itemid) }>
                                    <Translation text="Delete" />
                                </a>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <a className="btn-sm btn-default" href="#" role="button" data-toggle="modal" data-target="#addItem"
                                    onClick={()=> this.handleAddForm(item) }
                                    >
                                    <Translation text="WalmartInfo" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div> </div>
                </div>)
            })}
            <div className="row">
                <div className="col-sm-4"> Total Items: {totaItems} </div>
                <div className="col-sm-4"> <a href="#" onClick={()=> this.handleMovePage(1) }><span className="glyphicon glyphicon-step-backward"></span></a>
                    &nbsp;<a href="#" onClick={()=> this.handlePrevPage() }><span className="glyphicon glyphicon-backward"></span></a> 
                    &nbsp;<Translation text="WALMAR_PAGE" />:{this.state.page} /{maxPage}
                    &nbsp;<a href="#" onClick={()=> this.handleNextPage() }><span className="glyphicon glyphicon-forward"></span></a>
                    &nbsp;<a href="#" onClick={()=> this.handleMovePage(maxPage) }><span className="glyphicon glyphicon-step-forward"></span></a> 
                </div>
            </div>
        
            </div>);	
		}
		else {
			return(<div className="panel panel-default">
                <div className="panel-body"><Translation text="NO_DATE_FOUND" /></div>
            </div>);
		}
	}
    
    renderItemMenuBar(items) {
        return(<div className="row">
            <div className="col-sm-12">
                <div className="btn-group pull-right">
                    <a className="btn dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown">
                        <Translation text="WalmarItemAction" />
                    </a>
                    <ul className="dropdown-menu">
                        <li key="Selected">
                            <Link  className="dropdown-item" onClick={()=> this.handleRefreshItem(this.state.currentValues.join()) }> 
                                <Translation text="RefreshSelected" />
                            </Link>
                        </li>
                        <li key="del">
                            <Link  className="dropdown-item" data-toggle="modal" data-target="#deleteItem">
                                <Translation text="DeleteSeleected" />
                            </Link>
                        </li>
                    </ul>            
                </div>
            </div>
        </div>);
    } 
   
    render() {
        if ( this.props.loadingSpinner ) {
            return (<div className='loader'><Translation text="Loading" />...</div>);
        } else {
            const { itemList, items} = this.props;
            return (<div className="panel panel-default">
                <div className="panel-body">
                    {this.renderAddItemLayer()}
                    {this.renderDeleteLayer() }
                    {this.renderItemMenuBar(items)}
                    {this.renderListContent(itemList)}
                </div>
            </div>);	
	}
    
  }
}

function mapStateToProps(state) {
  return {
    items: state.walmart.items,  
    itemList: state.walmart.itemList,
	errorMessage: state.walmart.error,
	loadingSpinner: state.walmart.loadingSpinner
  };
}

const mapDispatchToProps = (dispatch) =>   
    bindActionCreators({
            fetchFromWalmarAPI,
            deleteWalmarItem,
            dbToAddForm
        }, 
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(UserWalmartList);



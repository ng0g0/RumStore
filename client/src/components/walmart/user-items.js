import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
	fetchWalmarUserList,
	fetchFromWalmarAPI,
	deleteWalmarItem,
	dbToAddForm,
	walmartDailyRefresh
} from '../../actions/walmart';
import {bindActionCreators} from 'redux';
import AccGroup from '../accordion/accordiongroup';
import Translation from '../locale/translate';
import LayerMask from '../layerMask/layermask';
import DeleteItem from './delete-items'
import PropTypes from 'prop-types'; // ES6
import ItemChart from './chart-items';
import AddItem from './add-items';
import { WalmartItem } from '../../consts';
import { submit, change } from 'redux-form';
import TabItems from './tab-items';
import PriceIndicator from '../template/price-indicator';

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
    this.handleSort = this.handleSort.bind(this);
    this.handlePage = this.handlePage.bind(this);
    this.handleFetchAll = this.handleFetchAll.bind(this);
    this.handleAddForm = this.handleAddForm.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.handleMovePage = this.handleMovePage.bind(this);
    this.handleDailyRefresh = this.handleDailyRefresh.bind(this);
    this.state = {
      allChecked: false,
      checkedCount: 2,
      currentValues: [],
      clickedItem: '',
      filter: '',
      sort: '',
    	page: 1,
      itemPage: 20,
			addItemClick: false,
			deleteItemClick: false
    }
	}

  handleMovePage(page) {
   this.setState({ page : page })
  }

	handleNextPage() {
    let page = this.state.page;
    let itemcount = (this.props.itemList) ? this.props.itemList.length : 0;
    let maxPage = Math.ceil( itemcount /this.state.itemPage);
    let newPage = (page < maxPage)? page + 1: page;
    this.setState({ page : newPage })
    }

  handlePrevPage() {
  	let page = this.state.page;
    let newPage = (this.state.page > 1) ? page - 1: page;
    this.setState({ page : newPage })
  }

	componentDidMount() {
		if (!this.props.items) {
			 this.handleFetchAll();//,
		}
	}

  handleDailyRefresh() {
    this.props.dispatch(walmartDailyRefresh());
  }

  handleAddForm(item) {
		this.setState({ addItemClick: true},() => {
    	this.props.dispatch(dbToAddForm(item));
    });
  }

  handleFetchAll() {
  	this.props.dispatch(fetchWalmarUserList());
  }

  handleCheckBoxItem(event) {
    var item = event.target.value;
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
        this.setState({
					clickedItem: '',
					addItemClick: false,
					deleteItemClick: false
				},() => {
            console.log('new state', this.state);
        });
    }

    handleDeleteClick(item) {
        this.setState({
					clickedItem: item,
					deleteItemClick: true
				},() => {
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
            currentValues: newX,
						deleteItemClick: false
        });
    }

    handleRefreshItem(items) {
        if (items) {
            this.props.dispatch(fetchFromWalmarAPI(items));
        }
    }


    renderDeleteLayer() {
        let layerid = 'deleteItem'
        let label = 'DELETE_QUESTION';
				const Deleteform = (this.state.deleteItemClick) ?
								<DeleteItem deleteItems={this.state.clickedItem || this.state.currentValues.join()} />
								: <div></div>;
      	return (<LayerMask layerid={layerid} header={label} key={layerid}
                    onOkClick={this.handleDeleteItem.bind(this)}
                    onCancelClick={this.handleCancelClick.bind(this)}
                    actionbtn="Delete" >
                    {Deleteform}
               </LayerMask>);
   }

   handleAddItem({ dispatch }) {
       this.props.dispatch(submit(WalmartItem));
        //console.log('Add Items');

    }

    renderAddItemLayer() {
        let layerid = 'addItem'
				let label = 'ADD_ITEM';
				if (this.props.itemList && this.state.addItemClick) {
					let itemExist = this.props.itemList.find(e => e.itemid === this.props.itemId);
				  if (itemExist) {
						label = 'SAVE_ITEM';
							//this.props.dispatch(change(WalmartItem, 'id', itemExist.id));
					} else {
						label = "ADD_ITEM";
					}
				}
				const additemForm = (this.state.addItemClick) ? <AddItem /> : <div></div>;

				return (<LayerMask layerid={layerid} header={label} key={layerid}
                    onOkClick={this.handleAddItem.bind(this)}
                    onCancelClick={this.handleCancelClick.bind(this)}
                    actionbtn={label}>
                    {additemForm}
                </LayerMask>);
   }
    renderMessage(msg) {
        if (msg) {
            return (<div className="row">
                <div className="col-sm-6">{msg} </div>
            </div>);
        } else {
            return(<div></div>);
        }
    }

    handlePage(pageItems) {
       this.setState({itemPage: pageItems},() => {
            console.log('new itemPage ', pageItems);
        });
    }
    handleSort(sort) {
        this.setState({sort: sort},() => {
            console.log('new sort ', sort);
        });
    }
    onChangeHandler(e){
        //console.log(e);
        switch(e.target.name) {
            case "filter":
                this.setState({
                    filter: e.target.value,
                    page: 1
                });
                break;
            default:
              console.log(e);
        }
    }

    renderAttributes(att) {
        //console.log(att);
        if (_.isUndefined(att))
            return(<div className="col-sm-12"> No Attributes -> click refesh btn</div>)
        let size = Object.keys(att).length;
        if (size === 0) {
            return(<div className="col-sm-12"> No Attributes </div>)
        } else {
           // let classcl = `col-sm-${(12/size)}`;
            let classcl = `col-sm-1`;
            var out = Object.keys(att).map(function(key) {
                return( <div className={classcl} key={key}>
                            <div className="row"><b>{key}</b></div>
                            <div className="row">{att[key]}</div>
                        </div>);
            });
            return(out);
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
                <div className="col-sm-10">
                    <div className="row">
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
                            <div className="row">
                            <Translation text="WALMAR_ITEM_PRICE" />: {item.salePrice}
														<PriceIndicator indicator={item.priceIndicator} />
                            </div>
                            <div className="row">
                            <Translation text="Stock" />: {(item.stock == 1) ? 'Available': 'Unavailable' }
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {this.renderAttributes(item.attributes)}
                    </div>
                </div>
            </div>
            <div className="row">
                <AccGroup title="WALMAR_ITEM_HISTORY" key={item.itemid} collapsed="Y" item={item.itemid} >
                    <ItemChart itemDetails={item.itemdetails} key={item.itemid} />
                 </AccGroup>
            </div>
        </div>);
    }

    renderItemPerPage() {
        let pageArray = [10,20,30];
        let pageSize = this.state.itemPage;
        return(<div className="btn-group">
                <button type="button" className="btn btn dropdown-toggle" data-toggle="dropdown">
                        <Translation text="WALMAR_PAGE_SIZE" />:{pageSize}&nbsp;<span className="caret"></span>
                </button>
                <ul className="dropdown-menu" role="menu">
                {pageArray.map((sp, index) => {
                    return( <li key={sp}>
                                <a href="#" onClick={()=> this.handlePage(sp) }>{sp}</a>
                            </li>);
                })}
                </ul>
            </div>);
    }
    renderSortButton() {
        let sortArray = [
                {lable: 'ASIBDESC', key: '-asib'},
                {lable: 'ASIBASC', key: '+asib'},
                {lable: 'UPCDESC', key: '-upc'},
                {lable: 'UPCASC', key: '+upc'},
                {lable: 'NameDESC', key: '-name'},
                {lable: 'NameASC', key: '+name'},
                {lable: 'ItemIdDESC', key: '-itemid'},
                {lable: 'ItemIdASC', key: '+itemid'},
                {lable: 'PriceDESC', key: '-salePrice'},
                {lable: 'PriceASC', key: '+salePrice'},
                {lable: 'Clear', key: ''},
            ];

        let sortLabel = this.state.sort.length > 0 && this.state.sort.substring(1);
        let arrowicon = this.state.sort.length > 0 && ((this.state.sort[0] === "-") ? <span className="glyphicon glyphicon-arrow-down"></span>:<span className="glyphicon glyphicon-arrow-up"></span>);
        return(<div className="btn-group">
                <button type="button" className="btn btn dropdown-toggle" data-toggle="dropdown">
                        <Translation text="WALMAR_ITEM_SORT" />:{sortLabel}&nbsp;{arrowicon} &nbsp; <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" role="menu">
                {sortArray.map((sp, index) => {
                    return( <li key={sp.key}>
                                <a href="#" onClick={()=> this.handleSort(sp.key) }>
                                    <Translation text={sp.lable}/>
                                </a>
                            </li>);
                })}
                </ul>
            </div>);
    }

	renderListContent(items) {
        function dynamicSort(property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }

        const { currentValues, filter, itemPage, sort } = this.state
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
            if (this.state.sort.length > 0) {
                filtered.sort(dynamicSort(this.state.sort));
            }
//            console.log(filtered);

            let pageItems = this.state.page*this.state.itemPage;
            let totaItems = filtered.length;
            let maxPage = Math.ceil( totaItems /this.state.itemPage);
            let start = 0+((this.state.page-1)*(this.state.itemPage));
            let end = ( pageItems > totaItems) ? totaItems : pageItems;
			return (<div>
                <div className="row">
                    <div className="col-sm-2">
                        <input type="checkbox" className="form-check-input  allcheck" name="all"
                              checked={this.state.allChecked} value="all"
                              onClick={(event )=> this.handleCheckBoxItem(event) }/>
                    </div>
                    <div className="col-sm-4">
                    <Translation text="WALMAR_ITEM_SEARCH" />:
                        <input value={filter} type="text" name="filter" onChange={this.onChangeHandler.bind(this)}/>
                    </div>

                    <div className="col-sm-2">
                    {this.renderItemPerPage()}
                    </div>
                    <div className="col-sm-2">
                    {this.renderSortButton()}
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
                        <li key="Daily">
                            <Link  className="dropdown-item" onClick={()=> this.handleDailyRefresh() }>
                                <Translation text="WALMAR_ITEM_REFRESH" />
                            </Link>
                        </li>
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
						//console.log(addItem);
            return (<div className="panel panel-default">
                <div className="panel-body">
                    {this.renderAddItemLayer()}
                    {this.renderDeleteLayer()}
                    {this.renderItemMenuBar(items)}
                    {this.renderListContent(itemList)}
                </div>
            </div>);
	}

  }
}

function mapStateToProps(state) {
	//console.log(state.walmartItem.itemInfo);
  return {
    items: state.walmart.items,
    itemList: state.walmart.itemList,
		itemId: state.walmartItem.itemInfo.itemid,
		errorMessage: state.walmart.error,
		loadingSpinner: state.walmart.loadingSpinner
  };
}

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({
            fetchFromWalmarAPI,
            deleteWalmarItem,
            dbToAddForm,
            walmartDailyRefresh
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(UserWalmartList);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
//import { fetchWalmarUserList, fetchFromWalmarAPI, deleteWalmarItem } from '../../actions/walmart';
import { itemToAddForm } from '../../actions/walmart';
import {bindActionCreators} from 'redux';
import AccGroup from '../accordion/accordiongroup';
import Translation from '../locale/translate';
import LayerMask from '../layerMask/layermask';
import DeleteItem from './delete-items'
import PropTypes from 'prop-types'; // ES6
import AddItem from './add-items';
import { WalmartItem, searchWalmart } from '../../consts';
import { submit, change } from 'redux-form';
import _ from 'lodash';

class ListItems extends Component {
	constructor(props) {
		super(props);
        this.handleAddItem = this.handleAddItem.bind(this);
        this.handleAddForm = this.handleAddForm.bind(this);
				this.openInNewTab = this.openInNewTab.bind(this);
	}
    handleAddItem(item) {
          this.props.dispatch(submit(WalmartItem));
    }
    handleAddForm(item) {
        //console.log(item);
         this.props.dispatch(itemToAddForm(item));
    }

    handleCancelClick(item) {
        console.log('Cancel');
    }
    handleChangePage(maxPage, type) {
        let minPage = 1;
        let newValue = -1;
        //console.log(type);
        switch(type) {
            case "FIRST":
                newValue =  1;
                break;
            case "NEXT":
                if (maxPage >= this.props.formSearch.pageNum) {
                   newValue =   this.props.formSearch.pageNum + 1;
                }
                break;
            case "PRIOR":
                if (minPage < this.props.formSearch.pageNum) {
                    newValue =   this.props.formSearch.pageNum - 1;
                }
                break;
            default:
                newValue =  maxPage;

            }

            if (newValue != -1) {
                this.props.dispatch(change(searchWalmart, 'pageNum', newValue));
                setTimeout(() => {
                    //console.log(this.props.formSearch);
                    this.props.dispatch(submit(searchWalmart));
               }, 2500);
            }

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

    renderAttributes(att) {
        //console.log(att);
        if (_.isUndefined(att))
            return(<div className="col-sm-12"></div>)
        let size = Object.keys(att).length;
        if (size === 0) {
            return(<div className="col-sm-12"></div>)
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

		openInNewTab(url) {
  		var win = window.open(url, '_blank');
  		win.focus();
		}

    renderCellContent(item) {
        var itemImage = item.thumbnailimage || "/images/nopic.jpg";
        return(<div>
            <div className="row">
                { this.renderMessage(item.message) }
              <div className="col-sm-2">
                    <img alt={item.itemid} src ={itemImage} />
            	</div>
              <div className="col-sm-10">
              	<div className="row">
                  <div className="col-sm-12">
										<div className="row">
                    	<a href={`${item.productUrl}`} onClick={()=> this.openInNewTab(item.productUrl) }>{item.name}</a>
										</div>
										<div className="row">
											<div className="col-sm-6"><Translation text="WALMAR_ITEM_UPC" />:{item.upc}</div>
											<div className="col-sm-6">Walmart# {item.itemid}</div>
										</div>
									</div>
								</div>
								<div className="row">
	              	<div className="col-sm-4"><Translation text="Stock" />:<b>{item.stock}</b></div>
	                <div className="col-sm-4"><Translation text="WALMAR_ITEM_PRICE" />:{item.salePrice}</div>
								</div>
                <div className="row">
                	{this.renderAttributes(item.attributes)}
                </div>
              </div>
						</div>
        </div>);
    }

	renderListContent(items) {
		const { authenticated } = this.props;
		console.log(authenticated);
        if (!items) {
            return(<div> </div>);
        }
		if (items.length > 0) {
					//console.log(this.props.items);
					let userItems = [];
						if (this.props.items) {
							userItems = this.props.items.list.split(",");
						}

			return (<div>
            {items.map((item) => {
                const findItem = userItems.find(function(element) {
                    return element == item.itemid;});
                const actionButton = (_.isUndefined(findItem)) ?  (
                        <Link className="btn-sm btn-default" data-toggle="modal" data-target="#addItem"
                            onClick={()=> this.handleAddForm(item.itemid) } >
                            <Translation text="ADD_ITEM" />
                        </Link>
                    ) : (<Link className="btn-sm btn-default" data-toggle="modal" data-target="#addItem"
                            onClick={()=> this.handleAddForm(item.itemid) } >
                            <Translation text="WALMAR_ALREADY" />
                        </Link>);
                return(<div className="panel panel-default blockche" key={item.itemid}>
                        <div className="panel-body">
                            <div className="row" >
                                <div className="col-sm-10">
                                {this.renderCellContent(item)}
                                </div>
                                <div className="col-sm-1">
                                    {authenticated && actionButton }
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
    render() {
        const {itemSearch, preformSearch, loadingSpinner } = this.props;
        if ( loadingSpinner &&  preformSearch) {
            return (<div className='loader'><Translation text="Loading" />...</div>);
        } else {
            console.log(itemSearch);
            return (<div className="panel panel-default">
                <div className="panel-body">
                    {this.renderAddItemLayer()}
                    {this.rentderFoundItems()}
                    {this.renderListContent(itemSearch)}
                </div>
            </div>);
        }
    }
}

function mapStateToProps(state) {
  return {
    loadingSpinner: state.walmartSearch.searchSpinner,
    itemSearch: state.walmartSearch.itemSearch,
    items: state.walmart.items,
    preformSearch: state.walmartSearch.preformSearch,
    formSearch: state.walmartSearch.formSearch,
    totalItems: state.walmartSearch.totalItems,
		authenticated: state.auth.authenticated
  };
}

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({
            itemToAddForm
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ListItems);

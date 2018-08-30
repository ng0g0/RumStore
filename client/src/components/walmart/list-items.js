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
import PageNavigator from '../template/page-navigator';
import { WalmartItem, searchWalmart } from '../../consts';
import { submit, change } from 'redux-form';
import _ from 'lodash';

class ListItems extends Component {
	constructor(props) {
		super(props);
        this.handleAddItem = this.handleAddItem.bind(this);
        this.handleAddForm = this.handleAddForm.bind(this);
				this.openInNewTab = this.openInNewTab.bind(this);
				this.navChangePage = this.navChangePage.bind(this);
				this.state = {
					addItemClick: false
				}
	}
    handleAddItem(item) {
          this.props.dispatch(submit(WalmartItem));
    }
    handleAddForm(item) {
        this.setState({addItemClick: true});
         this.props.dispatch(itemToAddForm(item));
    }

    handleCancelClick(item) {
        console.log('Cancel');
				this.setState({addItemClick: false});
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
				if (this.props.itemList && this.state.addItemClick) {
					let itemExist = this.props.itemList.find(e => e.itemid === this.props.itemId);
				  if (itemExist) {
						label = 'SAVE_ITEM';
					} else {
						label = "ADD_ITEM";
					}

				}
				const renderForm = (this.state.addItemClick) ? <AddItem /> : <div></div>;
		return (<LayerMask layerid={layerid} header={label} key={layerid}
										onOkClick={this.handleAddItem.bind(this)}
                    onCancelClick={this.handleCancelClick.bind(this)}
                    actionbtn={label}>
                    {renderForm}
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
            let classcl = `col-sm-2`;
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
              <div className="col-sm-3">
                    <img alt={item.itemid} src ={itemImage} />
            	</div>
              <div className="col-sm-9">
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
    if (!items) {
      return(<div> </div>);
    }
		if (items.length > 0) {
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
                            <Translation text="VIEW_ITEM" />
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

		navChangePage = ( newPage ) => {
			this.props.dispatch(change(searchWalmart, 'pageNum', newPage));
			setTimeout(() => { this.props.dispatch(submit(searchWalmart)); }, 2500);
		}
		renderPageNavigator() {
			const {pageNum, itemPage } = this.props.formSearch;
			const {preformSearch, loadingSpinner, totalItems,  } = this.props;
			if (preformSearch && !loadingSpinner) {
				return (<PageNavigator totalItems={totalItems} pageNumber={pageNum} itemsPerPage={itemPage} ChangePage={this.navChangePage} />);
			} else {
				return (<div></div>);
			}
		}

    render() {
        const {itemSearch, preformSearch, loadingSpinner, addItem, totalItems,  } = this.props;

        if ( loadingSpinner &&  preformSearch) {
            return (<div className='loader'><Translation text="Loading" />...</div>);
        } else {
            //console.log(itemSearch);
            return (<div className="panel panel-default">
                <div className="panel-body">
                    {this.renderAddItemLayer()}
										{this.renderPageNavigator()}
                    {this.renderListContent(itemSearch)}
                </div>
            </div>);
        }
    }
}
//{this.rentderFoundItems()}
function mapStateToProps(state) {
  return {
    loadingSpinner: state.walmartSearch.searchSpinner,
    itemSearch: state.walmartSearch.itemSearch,
		itemId: state.walmartItem.itemInfo.itemid,
		itemList: state.walmart.itemList,
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

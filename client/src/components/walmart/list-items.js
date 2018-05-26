import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
//import { fetchWalmarUserList, fetchFromWalmarAPI, deleteWalmarItem } from '../../actions/walmart';
import {bindActionCreators} from 'redux';
import AccGroup from '../accordion/accordiongroup';
import Translation from '../locale/translate';
import LayerMask from '../layerMask/layermask';
import DeleteItem from './delete-items'
import PropTypes from 'prop-types'; // ES6


class ListItems extends Component {
	//static contextTypes = {
	//	router: PropTypes.object,
	//}
	
	constructor(props) {
		super(props);
        //this.handleDeleteItem = this.handleDeleteItem.bind(this);
        //this.handleDeleteClick = this.handleDeleteClick.bind(this);
	}
  

   /*    
    handleCancelClick(item) {
        this.setState({clickedItem: ''},() => { 
            console.log('new state', this.state); 
        });
    }
 */ 
    renderMessage(msg) {
        if (msg) {
            return (<div className="row"> 
                <div className="col-sm-6">{msg} </div>  
            </div>);
        } else {
            return(<div></div>);
        }
    }
   
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
		if (items) {
			return (<div>
            {items.map((item) => {
                return(<div className="panel panel-default blockche" key={item.itemid}>
                        <div className="panel-body">
                            <div className="row" >
                                <div className="col-sm-12">
                                {this.renderCellContent(item)}
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
                <div> </div>
            }
			;
		}
	}
    
   
    render() {
        const {itemSearch, preformSearch, loadingSpinner } = this.props;
        if ( loadingSpinner &&  preformSearch) {
            return (<div className='loader'><Translation text="Loading" />...</div>);
        } else {
            return (<div className="panel panel-default">
                <div className="panel-body">
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
    preformSearch: state.walmartSearch.preformSearch
  };
}

const mapDispatchToProps = (dispatch) =>   
    bindActionCreators({
            //fetchFromWalmarAPI,
            //deleteWalmarItem
        }, 
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ListItems);



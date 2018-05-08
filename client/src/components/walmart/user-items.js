import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchWalmarUserList, fetchFromWalmarAPI, deleteWalmarItem } from '../../actions/walmart';
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
        
        this.state = {
            allChecked: false,
            checkedCount: 2,
            currentValues: [],
            clickedItem: ''
        }
	}
  
	componentDidMount() {
		if (!this.props.items) {
			this.props.dispatch(fetchWalmarUserList());
		} 
        setInterval(
            this.handleRefreshItem(this.props.items), 
            300000
        );
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
        } else {
            console.log('Items not found');
        }
            
        
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
        console.log('Add Items');
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
        const { currentValues } = this.state;
        var itemImage = item.thumbnailimage || "/images/nopic.jpg";
        return(<div>
            <div className="col-sm-4"> 
                <div className="row"> 
                    <div className="col-sm-12"><img alt={item.itemid} src ={itemImage} />  </div>
                </div>
            </div>
            <div className="col-sm-8"> 
                { this.renderMessage(item.message) }
                <div className="row">  
                    <div className="col-sm-12">ItemID: {item.itemid} </div>
                </div>    
                <div className="row">     
                    <div className="col-sm-12">Name: <b>{item.name}</b> </div>
                </div>
                <div className="row"> 
                    <div className="col-sm-6">UPC: {item.upc} </div>
                    <div className="col-sm-12">AMAZON: {item.asib}  </div>
                 </div>
                <div className="row"> 
                    <div className="col-sm-6">Price: {item.salePrice} </div>  
                </div>
            </div>  
            <div className="col-sm-12">             
                <AccGroup title="WALMAR_ITEM_HISTORY" key={item.itemid} collapsed="Y" item={item.itemid} >  
                <ItemChart itemDetails={item.itemdetails} />
                 </AccGroup>        
            </div>  
            
        </div>);
    }
    
	renderListContent(items) {
        const { currentValues } = this.state
		if (items) {
			return (<tbody>
            {items.map((item) => {
                return(<tr key={item.itemid}>
                <th scope="row">
                    <input type="checkbox" className="form-check-input" name={item.itemid} key={item.itemid} 
                        checked={currentValues.indexOf(item.itemid) !== -1}
                        value={item.itemid} onClick={(event )=> this.handleCheckBoxItem(event) }/>
                </th>
                <td> {this.renderCellContent(item)} </td>
                <td><a className="btn-sm btn-default" href="#" role="button" 
                        onClick={()=> this.handleRefreshItem(item.itemid) }>
                        <Translation text="WalmartRefresh"  />
                    </a> 
                    <a className="btn-sm btn-default" href="#" role="button" data-toggle="modal" 
                        data-target="#deleteItem"
                        onClick={()=> this.handleDeleteClick(item.itemid) }>
                        <Translation text="Delete" />
                    </a>                      
                    <a className="btn-sm btn-default" href="#" role="button" data-toggle="modal" 
                        data-target="#viewItem">
                        <Translation text="WalmartInfo" />
                    </a>
                </td>
                </tr>)
            })} 
             </tbody>);	
		}
		else {
			return(<tbody><tr><td colspan="3"><Translation text="NO_DATE_FOUND" /></td></tr></tbody>);
		}
	}
    
    renderItemMenuBar(items) {
       // var checked = true;
        return(<div className="btn-group pull-right">
            <a className="btn dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown">
				<Translation text="WalmarItemAction" />
			</a>
            
            <ul className="dropdown-menu">
                <li key="add"> 
                    <Link className="dropdown-item" data-toggle="modal" data-target="#addItem"> <Translation text="ADD_ITEM" /></Link>
                </li>
                <li key="Selected">
                    <Link  className="dropdown-item" onClick={()=> this.handleRefreshItem(this.state.currentValues.join()) }> 
                        <Translation text="RefreshSelected" /></Link>
                </li>
                <li key="del">
                    <Link  className="dropdown-item" data-toggle="modal" data-target="#deleteItem"><Translation text="DeleteSeleected" /></Link>
                </li>
            </ul>            
        </div>);
        
    } 
    
    render() {
        //console.log(this.state);
        if ( this.props.loadingSpinner ) {
            return (<div className='loader'><Translation text="Loading" />...</div>);
        } else {
            const { itemList, items} = this.props;
            return (<div>{this.renderItemMenuBar(items)}
                    {this.renderAddItemLayer()}
                    {this.renderDeleteLayer()}
                    <table className="table">
                    <thead className="thead-dark">
                        <tr>
                        <th scope="col"> 
                            <input type="checkbox" className="form-check-input" name="all"  
                              checked={this.state.allChecked} value="all"  
                              onClick={(event )=> this.handleCheckBoxItem(event) }/>
                        </th>
                        <th scope="col"><Translation text="WalmartItems" /></th>
                        <th scope="col"><Translation text="WalmartAction" /></th>
                        </tr>
                    </thead>
                    {this.renderListContent(itemList)}
                </table>
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
            deleteWalmarItem
        }, 
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(UserWalmartList);



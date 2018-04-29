import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchWalmarUserList, fetchFromWalmarAPI } from '../../actions/walmart';
//import { viewEntry } from '../../actions/entry';
import {bindActionCreators} from 'redux';
import AccGroup from '../accordion/accordiongroup';
import Translation from '../locale/translate';
//import {Redirect} from 'react-router';
//import ButtonPanel from '../template/btnpanel';
//import LayerMask from '../layerMask/layermask';
//import AccordionPanel from '../accordion';
import PropTypes from 'prop-types'; // ES6
//import { change } from 'redux-form';
//import { 
//    blocksTarget,
//    viewInfoConst,
//    DeleteConst,
//    addBlockConst,
//    AddEntranceConst 
//} from '../../consts';


class UserWalmartList extends Component {
	static contextTypes = {
		router: PropTypes.object,
	}
	
	constructor(props) {
		super(props);
        this.handleRefreshItem = this.handleRefreshItem.bind(this);
        this.handleCheckBoxItem = this.handleCheckBoxItem.bind(this);
        this.handleScheduleItem = this.handleScheduleItem.bind(this);
        
        this.state = {
            allChecked: false,
            checkedCount: 0,
            currentValues: []
        }
	}
  
  
  
	componentDidMount() {
		if (!this.props.items) {
			this.props.dispatch(fetchWalmarUserList());
		}
	}
    
    handleScheduleItem() {
        var item = event.target.value;
          console.log(`checked -> ${item}`);
    }
    
    handleCheckBoxItem(event) {
        var item = event.target.value;
//        console.log(this.props.items.list);
        if (item === "all") {
            if (this.state.allChecked) {
 //               console.log("None");
                this.setState({
                    allChecked : false,
                    checkedCount: 0,
                    currentValues: []
                });    
            }  else {
  //              console.log("select All");
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
    }
	
    handleRefreshItem(items) {
   //     console.log(items);
      this.props.dispatch(fetchFromWalmarAPI(items)); 
    }

	renderBlockItems( block) {
        if (block.items) {
            return (<div className="panel-body">
            {block.items.map((it) => {
                var buttons = it.actionx.split(",");
                var details = JSON.parse(it.details);
                //console.log(buttons);
                return (<div key={it.objid.toString()} className="panel panel-default">
                        <div className="panel-body"> 
                        {Object.entries(details).map(([key,value])=>{
                            return ( <div key={key}><b><Translation text={key} /></b>:{value.toString()}</div> );
                            }) }
                        <ButtonPanel buttons={buttons} objid={it.objid} target="blocks" type={it.typename} 
                        onViewEntry={this.handleViewClick} 
                        />
                        </div>
                    </div>);
            })}
            </div>);
        }
		else {
			return(<div className="panel-body"><Translation text="NO_DATE_FOUND" /></div>);
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

    
	//isChecked={currentValues.indexOf(item.itemid) > -1}
    renderCellContent(item) {
        const { currentValues } = this.state;
        var itemImage = item.thumbnailImage || "/images/nopic.jpg";
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
                    <div className="col-sm-12">Name: {item.name} </div>
                </div>
                <div className="row"> 
                    <div className="col-sm-6">UPC: {item.upc} </div>
                    <div className="col-sm-12">AMAZON: {item.asib}  </div>
                 </div>
                <div className="row"> 
                    <div className="col-sm-6">Price: {item.salePrice} </div>  
                </div>
                <AccGroup title="WalmartDescription" key={item.itemid} collapsed="Y">  
                    {item.shortDescription}
                 </AccGroup>
            </div>     
        </div>);
    }
    
	renderListContent(items) {
        const { currentValues } = this.state
		if (items) {
			return (<tbody>
            {items.map((item) => {
                return(<tr>
                    <th scope="row">
                    <input type="checkbox" className="form-check-input" name={item.itemid} key={item.itemid} 
                        checked={currentValues.indexOf(item.itemid) !== -1}
                        value={item.itemid} onClick={(event )=> this.handleCheckBoxItem(event) }/></th>
                <td> {this.renderCellContent(item)}
                
                </td>
                <td><button type="button" className="btn" onClick={()=> this.handleRefreshItem(item.itemid) }>
                    <Translation text="WalmartRefresh" /></button> </td>
                </tr>)
            })} 
             </tbody>);	
		}
		else {
			return(<tbody><tr><td colspan="3"><Translation text="NO_DATE_FOUND" /></td></tr></tbody>);
		}
	}
 //<input type="checkbox" data-toggle="toggle" onClick={(event )=> this.handleScheduleItem(event) } />
    renderRefreshAll(items) {
        //console.log(items);
        return(<div className="btn-group pull-right">
        
        <a className="btn dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown">
				<Translation text="WalmarItemAction" />
			</a>
            <ul className="dropdown-menu">
            <li key="Selected"><Link  className="dropdown-item" 
            onClick={()=> this.handleRefreshItem(this.state.currentValues) }> <Translation text="selectedItems" /></Link></li>
            <li key="all"><Link  className="dropdown-item" 
                onClick={()=> this.handleRefreshItem(this.props.items.list) }> <Translation text="AllItems" /></Link></li>
            </ul>            
        </div>);
        
    } 
    
    
  render() {
      //console.log(this.state);
	  if ( this.props.loadingSpinner ) {
		return (<div className='loader'><Translation text="Loading" />...</div>);
	} else {
		 const { itemList, items} = this.props;
		return (<div>{this.renderRefreshAll(items)}
                    <table className="table">
                    <thead className="thead-dark">
                        <tr>
                        <th scope="col"> #</th>
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

//<input type="checkbox" className="form-check-input" name="all"  checked={this.state.allChecked} value="all"  onClick={(event )=> this.handleCheckBoxItem(event) }/>

function mapStateToProps(state) {
    console.log(state);
  return {
    items: state.walmart.items,  
    itemList: state.walmart.itemList,
	//errorMessage: state.block.error,
	loadingSpinner: state.walmart.loadingSpinner
  };
}

const mapDispatchToProps = (dispatch) =>   
  bindActionCreators({
    fetchFromWalmarAPI,
//	viewEntry,
    //fetchBlockInfo,
    //deleteBlock
  }, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(UserWalmartList);


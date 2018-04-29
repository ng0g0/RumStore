import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Translation from '../locale/translate';
import PropTypes from 'prop-types'; // ES6
import { submit } from 'redux-form'
import { addBlockConst,  viewInfoConst, DeleteConst, AddEntranceConst,AddFloorConst } from '../../consts';
//import { deleteBlock } from '../../actions/blocks';

class LayerMask extends Component {
   
    /*handleSaveNewBlockClick({ dispatch }) {
        this.props.dispatch(submit(addBlockConst));
    }
    
    handleSaveNewEntranceClick({ dispatch }) {
        this.props.dispatch(submit(AddEntranceConst));
    }
    
    handleSaveFloorsClick({ dispatch }) {
        this.props.dispatch(submit(AddFloorConst));
    }
    
    
  
    handleDeleteBlockClick({ dispatch }) {
        console.log(this.props.objid);
        this.props.dispatch(deleteBlock(this.props.objid, this.props.type));
    }	
  */
  
  renderOKButtons(header, btnName) {
    /*if (header === addBlockConst)  {
        return(<button type="button" className="btn btn-primary" data-dismiss="modal"  
                onClick={this.handleSaveNewBlockClick.bind(this)} > Save </button>)      
    } 
    if (header === viewInfoConst)  {
        return(<button type="button" className="btn btn-primary" data-dismiss="modal"  
                onClick={this.handleSaveNewBlockClick.bind(this)} > Update </button>)      
    } 
    
    if (header === DeleteConst)  {
        return(<button type="button" className="btn btn-primary" data-dismiss="modal"  
                onClick={this.handleDeleteBlockClick.bind(this)} > Delete </button>)      
    }

    if (header === AddEntranceConst) {
         return(<button type="button" className="btn btn-primary" data-dismiss="modal"  
                onClick={this.handleSaveNewEntranceClick.bind(this)} > Save </button>) 
    }
    if (header == AddFloorConst) {
         return(<button type="button" className="btn btn-primary" data-dismiss="modal"  
                onClick={this.handleSaveFloorsClick.bind(this)} > Save Floor </button>) 
    }*/
    
    return(<button type="button" className="btn btn-primary" data-dismiss="modal"> OK </button>)
  }
   
  render() {
    const { layerid, header } = this.props
    return (
      <div className="modal fade" id={layerid} role="dialog">
		<div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal">&times;</button>
          <h4 className="modal-title">
            <Translation text={header} />
		  </h4>
        </div>
        <div className="modal-body">
		{this.props.children}
        </div>
        <div className="modal-footer">
            {this.renderOKButtons(header)}
            <button type="button" className="btn btn-danger" data-dismiss="modal"> <Translation text="Close" /></button>
         </div>
      </div>
    </div>
  </div>
    );
  }
}


export default connect()(LayerMask);

import React, { Component } from 'react';
import Translation from '../locale/translate';
import PropTypes from 'prop-types'; // ES6

class LayerMask extends Component {
   constructor(props) {
    super(props);
  }
  

  render() {
    const { layerid, header } = this.props
    return (
      <div className="modal fade" id={layerid} role="dialog" data-keyboard="false" data-backdrop="static">
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
            <button type="button" className="btn btn-primary" data-dismiss="modal"
                onClick={this.props.onOkClick} ><Translation text={this.props.actionbtn} />
            </button>
            <button type="button" className="btn btn-danger" data-dismiss="modal"
            onClick={this.props.onCancelClick}> 
            
                <Translation text="Close" />
            </button>
         </div>
      </div>
    </div>
  </div>
    );
  }
}
export default LayerMask;

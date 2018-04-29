import React, { Component } from 'react';
import { icons } from '../../consts';
import PropTypes from 'prop-types'; // ES6
import LayerMask from './layermask';


//import BlockLayer from '../blocks/blocklayer';
class LayerMaskControl extends Component {

    
    render() {
        return(<div> 
        {this.props.items.map((btn) =>{
			var butname = icons.find(function(e) {
				return e.name === btn;
			});
			if (butname.target.startsWith("#")) {
                let layerid = `${butname.target.substring(1)}-${this.props.id}`;
				return (<LayerMask layerid={layerid} header={butname.label} key={butname.label} objid={this.props.id} type={this.props.type}>
                           
                        </LayerMask>);
			} 	
		})
        } </div>);
    }
}

// <BlockLayer layercalled={butname.label} objid={this.props.id} type={this.props.type}/>

LayerMaskControl.PropTypes = {
	items: PropTypes.array,
    id: PropTypes.number
};

const props = {
  items: ['1','2','3'], // is valid
  id: 1, // not valid
};

PropTypes.checkPropTypes(LayerMaskControl.PropTypes, props, 'prop', 'LayerMaskControl');
	
export default LayerMaskControl;

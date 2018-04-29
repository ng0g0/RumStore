import React, { Component } from 'react';
import { Link } from 'react-router';
import {icons, viewInfo} from '../../consts';
import Translation from '../locale/translate';
import {Redirect, browserHistory} from 'react-router';
import PropTypes from 'prop-types'; // ES6
import LayerMaskControl from '../layerMask/layerMaskControl';

class ButtonPanel extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		const { buttons, target, objid, type } = this.props;
		return(<div className="btn-group pull-right">
			<a className="btn-sm btn dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown">
				<span className="glyphicon glyphicon-plus"></span>
			</a>
			<ul className="dropdown-menu">
			{buttons.map((btn) =>{
				var butname = icons.find(function(e) {
					return e.name === btn;
				});
                //console.log(btn);
				let icon = (butname.icon) ? butname.icon : 'glyphicon glyphicon-fire';
				let layerid = `${butname.target}-${this.props.objid}`;
				if (butname.target.startsWith("#")) {
                    return (<li key={btn}> 
						<a href="#" className="dropdown-item" data-toggle="modal" data-target={layerid}
                        onClick={()=> this.props.onViewEntry(butname.target, objid, butname.label) }> 
                        <span className={icon}></span>&nbsp;<Translation text={butname.label} />
						</a>
						</li>);
				} else {
                    return (<li key={btn}><Link  className="dropdown-item"  
								onClick={()=> this.props.onViewEntry(butname.target, objid, butname.label) }>
						<span className={icon}></span>&nbsp;
							<Translation text={butname.label} /></Link>
						</li>);
				}		
			})}
			</ul>
            <LayerMaskControl items={buttons} id={objid} type={type}/>    
		</div>);
	} 
}

ButtonPanel.PropTypes = {
		onViewEntry: PropTypes.func,
		buttons: PropTypes.array,
		target: PropTypes.string,
		objid: PropTypes.number,
	};

  
export default ButtonPanel;  
  
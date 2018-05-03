import React, { Component } from 'react';
import Translation from '../locale/translate';

class AccGroup extends Component {
	constructor(props) {
		super(props);
		this.state = {
            isToggleOn: (this.props.collapsed) ? true : false
        };
		this.handleClick = this.handleClick.bind(this);
	}
  
	handleClick() {
		this.setState(prevState => ({
			isToggleOn: !prevState.isToggleOn
		}));
	}
	render() {
		const { title, collapsed, item } = this.props;
		let panel = `col-col${item}`;
        let coltype = (collapsed) ? "collapse" : "collapse in";
		return(<div className="linche">
                <div className="btn-group pull-right">
					<a className="grouplink" href={`#col-col${item}`} data-toggle="collapse" 
					onClick={() => this.handleClick()}><b>
                        <Translation text={title} /></b>
						{this.state.isToggleOn ? 
							<span className="glyphicon sm glyphicon-chevron-right "></span> 
							: <span className="glyphicon sm glyphicon-chevron-down"></span> }
					</a>
                </div>
			
			<div id={panel} className={coltype}>
				{this.props.children}
			</div></div>);
	}  
}

  
export default AccGroup; 
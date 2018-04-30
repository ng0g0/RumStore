import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6

class ToggleSwitch extends Component {
	
	render() {
        var checkVal = this.props.checked ? 'checked':'';
		return(<div className="sliderWrapper">
            <div>{this.props.text}</div>
            <label className="switch">
                <input type="checkbox" defaultChecked={checkVal}  onChange={this.props.onChange} />
                <div className="slider round"></div>
            </label> 
            </div>);
	} 
}

ToggleSwitch.PropTypes = {
		onChange: PropTypes.func,
		checked: PropTypes.bool,
		text: PropTypes.string
	};

  
export default ToggleSwitch;  
  
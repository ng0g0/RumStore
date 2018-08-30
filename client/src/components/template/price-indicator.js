import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PriceIndicator extends Component {
  render () {
    switch(this.props.indicator) {
    case -1:
        return(<span className="glyphicon glyphicon-arrow-down red"></span>)
    case 1:
        return(<span className="glyphicon glyphicon-arrow-up green"></span>)
    default:
        return(<span className="glyphicon glyphicon-minus"></span>)
    }
  }
}

PriceIndicator.PropTypes = {
  indicator: PropTypes.number.isRequire
};

export default PriceIndicator;

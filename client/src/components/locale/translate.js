import React, { Component } from 'react';
import cookie from 'react-cookie';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import  * as lang2 from './locale';

class Translation extends Component {

  render() {
		//console.log(this.props.text);
    var str = lang2.default.TRANSLATIONS[this.props.locale][this.props.text];
    var res = str;
    if (this.props.items) {
        if (Array.isArray(this.props.items)) {
            this.props.items.forEach(function(it, index) {
            console.log(it);
            var srch = `$${index}`;
            console.log(srch);
            res = res.replace(srch, it);
        });
        } else {
            res = res.replace('$1', this.props.items);
        }
    }
    return (<span>{res}</span>);
  }
}

function mapStateToProps(state) {
  return {
    locale: state.lang.lang
  };
}

const props = {
  text: 'hello', // is valid
  locale: 'bg', // not valid
};

Translation.propTypes = {
  text: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired
};

PropTypes.checkPropTypes(Translation.propTypes, props, 'prop', 'Translation');

export default connect(mapStateToProps, null)(Translation);

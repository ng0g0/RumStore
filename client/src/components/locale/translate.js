import React, { Component } from 'react';
import cookie from 'react-cookie';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import  * as lang2 from './locale';

class Translation extends Component {
	
  render() {
    return (<span>{lang2.default.TRANSLATIONS[this.props.locale][this.props.text]}</span>);
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




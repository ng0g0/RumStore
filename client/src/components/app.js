import React, { Component } from 'react';
import HeaderTemplate from './template/header';
import FooterTemplate from './template/footer';

class App extends Component {
  render() {
    return (
      <div>
        <HeaderTemplate logo="Rum Store Panel" />
        <div className="container">
          {this.props.children}
        </div>
        <FooterTemplate />
      </div>
    );
  }
}

export default App;

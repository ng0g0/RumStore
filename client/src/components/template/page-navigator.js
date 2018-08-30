import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Translation from '../locale/translate';

class PageNavigator extends Component {
  constructor(props) {
		super(props);
    this.handleChangePage = this.handleChangePage.bind(this);
  }

  handleChangePage(maxPage, type) {
    const { pageNumber } = this.props;
    let minPage = 1;
    let newValue = -1;
    switch(type) {
      case "FIRST":
        newValue =  1;
        break;
      case "NEXT":
        if (maxPage >= pageNumber) {
           newValue =   pageNumber + 1;
        }
        break;
      case "PRIOR":
        if (minPage < pageNumber) {
          newValue =   pageNumber - 1;
        }
        break;
      default:
        newValue =  maxPage;
    }
    if (newValue != -1) {
      this.props.ChangePage(newValue);
    }
  }

  render () {
    const { pageNumber, totalItems, itemsPerPage} = this.props;
    let maxPage = Math.ceil( totalItems / itemsPerPage);
    return (<div className="row item">
        <div className="col-sm-4"> Total Items: {totalItems} </div>
        <div className="col-sm-4">
            <a href="#" onClick={()=> this.handleChangePage(maxPage, "FIRST") } ><span className="glyphicon glyphicon-step-backward"></span></a>
            &nbsp;<a href="#" onClick={()=> this.handleChangePage(maxPage, "PRIOR") }><span className="glyphicon glyphicon-backward"></span></a>
            &nbsp;<Translation text="WALMAR_PAGE" />:{pageNumber} /{maxPage}
            &nbsp;<a href="#" onClick={()=> this.handleChangePage(maxPage, "NEXT") }><span className="glyphicon glyphicon-forward"></span></a>
            &nbsp;<a href="#" onClick={()=> this.handleChangePage(maxPage, "LAST") }><span className="glyphicon glyphicon-step-forward"></span></a>
        </div>
    </div>);
  }
}

PageNavigator.PropTypes = {
  totalItems: PropTypes.number.isRequire,
  pageNumber: PropTypes.number.isRequire,
  itemsPerPage: PropTypes.number.isRequire,
  ChangePage: PropTypes.func,

};

export default PageNavigator;

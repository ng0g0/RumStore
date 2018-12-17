import React, { Component } from 'react';
import Translation from '../locale/translate';
import { connect } from 'react-redux';
import { fetchItemUpdate } from '../../actions/dashboard';
import { bestItems } from '../../actions/walmart';
import {bindActionCreators} from 'redux';
import DataGrid from '../template/data-grid';
import PriceIndicator from '../template/price-indicator';
import dayjs from 'dayjs';

class Dashboard extends Component {
    constructor(props) {
    super(props);
  }

    componentDidMount() {
        //this.interval = setInterval(
        this.props.dispatch(fetchItemUpdate());
        //, 50000);
        //this.interval = setInterval(
        this.props.dispatch(bestItems());
        //, 50000);
    }



    render() {
        const columGrid = [
            {name: "thumbnailImage", type: "image", size: 4 },
            {name: "itemId", type: "int", size: 2 },
            {name: "name", type: "string", size: 4 },
            {name: "salePrice", type: "float", size: 2 }];

		return ( <div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Latest Updates</div>
                        <div className="panel-body">
                        {this.renderUpdateItems()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Top Revenue Items</div>
                        <div className="panel-body">
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Top Walmart Items</div>
                        <div className="panel-body">
                        </div>
                    </div>
                </div>
            </div>
		</div>);
    }
    
                  /*<div className="col-sm-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Top 5 Selling Items</div>
                        <div className="panel-body">
                            <DataGrid data={this.props.walmartBest} 
                            spinner= {this.props.loadingWalmartBest }
                            columns = {columGrid}
                            />
                        </div>
                    </div>
                </div>*/ 

    renderWalmartBest() {
      if ( this.props.loadingWalmartBest ) {
            return (<div className='loader'><Translation text="Loading" />...</div>);
        } else {
            const { walmartBest} = this.props;
            return (<div> </div>);
        }
    }

    renderUpdateDetails(details) {
         let detLength = 12/details.length;
        return(<div className="row">
            {details.map((det, index) => {
                let upDate = dayjs(det.detdate).format('YYYY-MM-DD HH:mm:ss');
                let value = (det.dettype === "stock") ? (det.detvalue === "1")? "In-Stock": "Out-Stock" : det.detvalue;
                let indicator  = (Number.parseFloat(det.detvalue)  >  Number.parseFloat(det.oldValue) ) ? 1 : 0 ;
              return (<div className="col-sm-6" key={index}>
                <div className="panel panel-info blockche">
                  <div className="panel-heading">Date: {upDate}</div>
                  <div className="panel-body">
                    <div className="col-sm-5">{det.dettype}</div>
                    <div className="col-sm-5">{value}</div>
                    <div className="col-sm-2"><PriceIndicator indicator={indicator} /></div>
                 </div>
                </div>
              </div>);
            })}
        </div>);
    }
    renderUpdateItems() {
        console.log(this.props);
        if ( this.props.loadingSpinnerUpdate ) {
            return (<div className='loader'><Translation text="Loading" />...</div>);
        } else {
            const { updatedItems} = this.props;
            if (updatedItems) {
                console.log(updatedItems);
                return (<div>
                {updatedItems.map((item, index) => {
                    var details = JSON.parse(item.itemdet);
                    console.log(details);
                   return( <div className="row" key={index}>
                        <div className="col-sm-2">{item.webstore}</div>
                        <div className="col-sm-2">{item.webid}</div>
                        <div className="col-sm-2 itemNames">{item.itemname}</div>
                        <div className="col-sm-6">{this.renderUpdateDetails(details)}</div>
                   </div>
                   );
                })}
                </div>);
            } else {
                <div><Translation text="NO_UPDATE_FOUND"/></div>
            }
        }
  }

}

function mapStateToProps(state) {
    //console.log(state);
  return {
    updatedItems: state.dashboard.updatedItems,
    walmartBest: state.dashboard.walmartBest,
	loadingSpinnerUpdate: state.dashboard.loadingSpinnerUpdate,
    loadingWalmartBest: state.dashboard.loadingWalmartBest
  };
}

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({ fetchItemUpdate }, dispatch );

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

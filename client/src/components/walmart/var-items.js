import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { Link } from 'react-router';
import { fetchItemVarsAPI } from '../../actions/walmart';
//import { itemToAddForm } from '../../actions/walmart';
import {bindActionCreators} from 'redux';
//import AccGroup from '../accordion/accordiongroup';
import Translation from '../locale/translate';
//import LayerMask from '../layerMask/layermask';
//import DeleteItem from './delete-items'
//import PropTypes from 'prop-types'; // ES6
//import AddItem from './add-items';
//import { WalmartItem, searchWalmart } from '../../consts';
import { initialize } from 'redux-form';
//import _ from 'lodash';

import { WalmartItem } from '../../consts';

class VariantItems extends Component {
	constructor(props) {
		super(props);
        //this.handleClickItem = this.handleClickItem.bind(this);
        this.handleLoadVars = this.handleLoadVars.bind(this);
        //    this.handleAddItem = this.handleAddItem.bind(this);
    //    this.handleAddForm = this.handleAddForm.bind(this);
    //this.handleFetchAll = this.handleFetchAll.bind(this);
	}

   handleClickItem( item) {
       //console.log(item);
        this.props.dispatch(initialize(WalmartItem, item))
   }


        handleLoadVars(items) {
            this.props.dispatch(fetchItemVarsAPI(items));

        }

    componentDidMount() {
		if (this.props.vars) {
		    this.handleLoadVars(this.props.vars);
		} else {
			console.log('undef');
			this.handleLoadVars('');
		}
	}

    renderCarouselNavigationRight(carName) {
        var caranc = `#${carName}`;
        return(<a className="right carousel-control" href={caranc} data-slide="next">
                    <span className="glyphicon glyphicon-chevron-right"></span>
                    <span className="sr-only">Next</span>
                </a>)
    }

    renderCarouselNavigationLeft(carName) {
        var caranc = `#${carName}`;
        return(<a className="left carousel-control" href={caranc} data-slide="prev">
                    <span className="glyphicon glyphicon-chevron-left"></span>
                    <span className="sr-only">Previous</span>
                </a>)
    }

    renderAttributes(att) {
        //console.log(att);
        if (_.isUndefined(att))
            return(<div className="col-sm-12"> No Attributes -> click refesh btn</div>)
        let size = Object.keys(att).length;
        if (size === 0) {
            return(<div className="col-sm-12"> No Attributes </div>)
        } else {
           // let classcl = `col-sm-${(12/size)}`;
            let classcl = `col-md-2`;
            const allowed = ['color', 'size','clothingSize'];
            var out = Object.keys(att)
            .filter(key => allowed.includes(key))
            .map(function(key) {
                return( <div className={classcl} key={key}>
                            <div className="row"><b><Translation text={key} /></b></div>
                            <div className="row">{att[key]}</div>
                        </div>);
            });
            return(out);
        }
    }

    renderCarouselItems(vars) {
        return(<div className="carousel-inner">
            {vars.map((va, index) => {
                let active = (index == 0) ? 'item active' : 'item';
                var itemImage = va.thumbnailimage || "/images/nopic.jpg";
                return(
                    <div className={active} key={va.itemid}>
                        <div className="panel panel-primary blockche">
                            <div className="panel-body">
                                <div className="col-md-2"><Translation text="WalmartItems" />:{va.itemid} </div>
                                <div className="col-md-3">
                                    <img alt='image' src ={itemImage} />
                                    <button type="button" className="btn btn-primary"
                                            onClick={this.handleClickItem.bind(this, va)}
                                            ><Translation text="Load" /></button>
                                </div>
                                <div className="col-md-5">
                                    <div className="row"> Name: {va.name} </div>
                                    <div className="row"> UPS: {va.upc} </div>
                                    <div className="row">
                                        {this.renderAttributes(va.attributes)}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>);

            })}
        </div>);
    }
    renderCarouselMenu(vars, carName){
        var caranc = `#${carName}`;
        return(<ol className="carousel-indicators">
        {vars.map((va, index) => {
            let active = (index == 0) ? `active` : ``;
            return(
                <li data-target={caranc} data-slide-to={va.itemid} className={active} key={va.itemid}></li>);
        })}
        </ol>
        )
    }
   // 49435484, 49435476,
   // 49435478, 49435492, 49435470,
   // 55456028, 169092406, 49435469, 49435487, 49435482, 52036829, 167974334, 143538560,
   // 52036826, 49435475, 55456025, 52036824
    render() {
        console.log(this.props.vars);
        const { loadingSpinner, name, itemVars } = this.props;
        if (loadingSpinner) {
            return (<div className='loader'><Translation text="Loading" />...</div>);
        } else {
            //console.log(itemVars);
            if (itemVars) {
                if (itemVars.length > 0) {
                return (<div id={name} className="carousel slide" data-ride="carousel" data-interval="0">
                    {this.renderCarouselMenu(itemVars, name)}
                    {this.renderCarouselItems(itemVars)}
                    {this.renderCarouselNavigationLeft(name)}
                    {this.renderCarouselNavigationRight(name)}

                </div>);
                } else {
                   return(<div> No Variants</div>);
                }

            } else {
               return(<div> No Variants</div>);
            }
        }
    }
}

function mapStateToProps(state) {
  return {
    loadingSpinner: state.walmartVars.loadingSpinnerVar,
    itemVars: state.walmartVars.itemVars,
  };
}

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({
            fetchItemVarsAPI
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(VariantItems);

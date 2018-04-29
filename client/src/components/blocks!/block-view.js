import React, { Component } from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { viewEntry } from '../../actions/entry';
import Translation from '../locale/translate';
import { isUndefined } from 'underscore';
import ButtonPanel from '../template/btnpanel';
import LayerMask from '../layerMask/layermask';
import PropTypes from 'prop-types'; // ES6
import { AddFloorConst, AddApartmentConst } from '../../consts';
import { change } from 'redux-form';


class BlockView extends Component {
    static contextTypes = {
		router: PropTypes.object,
	}  
	constructor(props) {
        super(props);
        this.handleViewClick = this.handleViewClick.bind(this);
    }
  
    componentDidMount() {
        console.log('componentDidMount');
        console.log(this.props);
        if (!this.props.entry) {
            this.props.dispatch(viewEntry(this.props.params.blockid));
        }
    }
  
    handleViewClick(target, objid, label ) {
        
        function retFloors( ent) {
            function compare(a,b) {
                if (parseInt(a.NUMBER) < parseInt(b.NUMBER))  return 1;
                if (parseInt(a.NUMBER) > parseInt(b.NUMBER))  return -1;
                return 0;
            }
            let floor = []; 
            
            if (ent) {
                if (ent[0].items) {
                    console.log(ent);
                    let x = ent[0].items;
                    x.forEach(function(item) {
                        //console.log(item);
                        var details = JSON.parse(item.details); 
                        floor.push({ NUMBER: details.NUMBER})
                    });
                }
            }
            floor.sort(compare);
            return floor;
        }
        console.log(label);
        console.log(objid);
        //console.log(this.props.entry);
        switch(label) {
            case AddFloorConst:
                var floors = retFloors(this.props.entry);
                console.log(floors);
                this.props.dispatch(change(AddFloorConst, 'floors', floors));
                this.props.dispatch(change(AddFloorConst, 'objid', objid));
            break;
            case AddApartmentConst:
                console.log(label);
              break;
            default:
                console.log(label);
        }
    }

  
  renderApps(app) {
	  
	function setAll(cnt, items) {
		let colItems = 12 / items;
		let classAl;
		switch (cnt) {
			case items: classAl = ( items > 1) ? "pull-right" : "center-block"; break;
			case 1: classAl = "pull-left"; break;
			default: classAl = "center-block";
        }		
		return ` ${classAl}`;
	}
	
	if (app.items) {
        let cnt = 1;
        let classNum;
        let colItems = 12 / app.items.length;
        return(<div className="row">
            {app.items.map((ap) => {
                classNum = setAll(cnt,app.items.length);
                cnt ++;
                console.log(ap);
                var buttons = ap.actionx.split(",");
                var details = JSON.parse(ap.details); 
                console.log(details);
                return (<div className={`col-xs-${colItems}`} key={ap.objid}>
                        <div className="panel panel-default blockcolor">
                            <div className="panel-body">
                            <div>
                            <ButtonPanel buttons={buttons} objid={ap.objid} target="modal" type={ap.typename} 
                                    onViewEntry={this.handleViewClick} />
                            </div>	
                                <img className={classNum} src="../images/apartment.jpg" alt="entry" height="80px"/>
                            </div>
                        </div>
                        </div>);})	
            }
        </div>);
	}		
  }
  
  
  renderEntry( entry , floor) {
	//console.log(floor);	
    if (floor === "0") {
        var buttons = entry.actionx.split(",");
	return (<div className="panel panel-default entryfloor blockcolor">
				<div className="panel-body">
				<div className="row">
					<div className="col-xs-12">
                        <ButtonPanel buttons={buttons} target="modal" objid={entry.objid} type={entry.typename} onViewEntry={this.handleViewClick} />
                        <img className="center-block" src="../images/entrance.jpg" alt="entry" height="80px"/>
                    </div>
                </div>
				</div>
			</div>);    
    }
	
  }
  //
  

  renderFloors( entry ) {
	function compare(a,b) {
        var ad = JSON.parse(a.details);
        var bd = JSON.parse(b.details);
		if (parseInt(ad.NUMBER) < parseInt(bd.NUMBER))  return 1;
		if (parseInt(ad.NUMBER) > parseInt(bd.NUMBER))  return -1;
		return 0;
	}
    if (!isUndefined(entry.items)) {
		entry.items.sort(compare);
        //console.log(entry);
        return(<div >
          {entry.items.map((it) => {
              var buttons = it.actionx.split(",");
              var details = JSON.parse(it.details); 
              //console.log(details);
              return (<div key={details.NUMBER} className="panel panel-default blockche" >
                        <div className="panel-body blockcolor">
                        <div className="row">  
                        <div className="col-sm-1"><Translation text="FLOOR" />: {details.NUMBER} 
                                <ButtonPanel buttons={buttons} target="modal" objid={it.objid} type={it.typename} 
                                onViewEntry={this.handleViewClick} />	                        
                        </div>
                        <div className="col-sm-11">
                            { this.renderEntry(entry, details.NUMBER)}
                            { this.renderApps(it)}
                        </div>
                        </div>
                        
                        </div>
                    </div>)
          })}
		</div>
	  );  
	  }	
  }
  
  
  
  
  render () {
	// console.log(this.props);
	if ( this.props.loadingSpinner) {
		return (<div className="panel panel-default">
			<div className='loader'> <Translation text="Loading" />...</div> 
		</div>);
		
		}
	else {
		const { entry }  = this.props;
        if (!entry) {
            var redirect = '/blocks';
            this.context.router.push(redirect); 
            return(<div>NOT FOUND</div>);
        }
		if (entry.length > 0) {
			let entryNum = entry[0];
            console.log(entryNum);
			return ( <div className="panel panel-default"> 
					<div className="panel-heading">ADDRESS</div>
					<div className="panel-body blockcolor">
						{this.renderFloors( entryNum )}	
					</div>
				</div>);	
		} else {
			return(<div className="panel panel-default"> 
					<div className="panel-heading">ADDRESS</div>
					<div className="panel-body">
					</div>
				</div>);
		}
	}
  }
}

	
function mapStateToProps(state) {
  return {
	entry: state.entry.block,	
	locale: state.lang.locale,
	errorMessage: state.entry.error,
	loadingSpinner: state.entry.loadingSpinner
  };
}

const mapDispatchToProps = (dispatch) =>   
  bindActionCreators({
    viewEntry
}, dispatch);

  
  export default connect(mapStateToProps, mapDispatchToProps)(BlockView);



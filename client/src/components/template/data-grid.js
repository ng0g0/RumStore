import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import Translation from '../locale/translate';

class DataGrid extends Component {
	constructor(props) {
        super(props);
        this.handleShowNextFive = this.handleShowNextFive.bind(this);
        this.handleShowPrevFive = this.handleShowPrevFive.bind(this);
        this.state = {
           start: 0 ,
           end: 5
        }
    }

    handleShowNextFive() {
        let newStart = this.state.end;
        let newEnd = this.state.end + 5;
        this.setState({
            start : newStart,
            end : newEnd
            })
    }
    handleShowPrevFive() {
        if (this.state.start > 0) {
            let newStart = this.state.end;
            let newEnd = this.state.end - 5;
            this.setState({
                start : newStart,
                end : newEnd
            })
        }

    }
    renderHeader(columns) {
        return(<div className="row" >
            {columns.map((col) => {
                let classcl = `col-sm-${col.size || 2}`;
                const colValue = col.name;
                return(<div className={classcl} key={colValue}>
                    {colValue}
                    </div>)
            })}
        </div> );
    }
    renderTable(items) {
        const {columns } = this.props;
        if (!items) {
            return(<div> </div>);
        }
        if (!columns) {
            console.log('No Columns defined');
            return(<div> </div>);
        }

        if (items.length > 0) {
           return (<div>
           {this.renderHeader(columns)}
           {items.slice(this.state.start, this.state.end).map((item, index) => {
               var itemImage = item.thumbnailImage || "/images/nopic.jpg";
                return(<div className="panel panel-default blockche" key={item.itemId}>
                        <div className="panel-body">
                            <div className="row" >
                            {columns.map((col) => {
                                let classcl = `col-sm-${col.size || 2}`;
                                const colValue = col.type === "image" ?
                                    (<img alt={item["itemId"]} src ={item[col.name]} className="img-responsive"/>) :
                                    (<span>{item[col.name]}</span>);
                                return(<div className={classcl} key={colValue}>
                                    {colValue}
                                    </div>)
                            })}
                            {/*<div className="col-sm-4">
                                    <img alt={item.itemId} src ={itemImage} />
                                </div>
                                <div className="col-sm-8">
                                    <div className="row" ><b>ItemID</b>: {item.itemId}</div>
                                    <div className="row" >Name:{item.name}</div>
                                    <div className="row" ><Translation text="WALMAR_ITEM_PRICE" />:{item.salePrice}</div>
                            </div>*/}
                            </div>
                        </div>
                </div>)
           })}
            <a href="#" onClick={()=> this.handleShowPrevFive() }><span className="glyphicon glyphicon-backward"></span></a>&nbsp;
            <a href="#" onClick={()=> this.handleShowNextFive() }><span className="glyphicon glyphicon-forward"></span></a>
            </div>)
        } else {
            return (<div> <Translation text="NO_DATE_FOUND" /> </div>);
        }
    }
	render() {
        const {data, spinner } = this.props;
        if ( spinner) {
            return (<div className='loader'><Translation text="Loading" />...</div>);
        } else {
            return (<div className="panel panel-default">
                <div className="panel-body">
                    {this.renderTable(data)}
                </div>
            </div>);
        }
	}
}

DataGrid.PropTypes = {
		data: PropTypes.array,
        columns: PropTypes.array,
        spinner: PropTypes.bool,

	};


export default DataGrid;

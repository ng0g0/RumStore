import React, { Component } from 'react';
import Translation from '../locale/translate';
import {LineChart, BarChart } from 'react-easy-chart';
import _ from 'lodash';
import dayjs from 'dayjs';

class ItemChart extends Component {
    constructor(props) {
		super(props);
        this.state = {
            options: [ { name:'test'},{ name:'test1'}],
            selectedItem: '-1'
        };
        this.handleChange = this.handleChange.bind(this);
	}
    
    handleChange(event) {
        this.setState({selectedItem: event.target.value});
    }
    renderItems(aaa) {
        return (<tbody>
                {aaa.items.map((item, index) => {
                    return(<tr key={index}><td>{item.y}</td><td>{item.x}</td></tr>)
                })}
        </tbody>);
    }
    
    renderEasy(aaa, yAxis) {
        var yType = 'numeric';
        var maxDate = dayjs().add(1, 'day').format('DD-MMM-YY');
        var minDate = dayjs().subtract(5, 'day').format('DD-MMM-YY');
        
        if (Number.isNaN(Number.parseFloat(aaa.items[0].y))) {
             yType='text'; 
        } else {
            
        }
        if (yType==='numeric') {
            var minValue = _.minBy(aaa.items, 'y');
            var maxValue = _.minBy(aaa.items, 'y');
            return(<LineChart     
                axisLabels={{x: 'Time', y: `${yAxis}`}}
                xType={'time'}
                xDomainRange={[`${minDate}`, `${maxDate}`]}
                yDomainRange={[`${(minValue.y)-2}`, `${(maxValue.y)+2}`]}
                y-axis-config='{"tickFormat": ".2s"}'
                axes
                width={750}
                height={250}
                data={[aaa.items]}
            />) 
        } else {
            return(<LineChart     
                xType={'time'}
                axisLabels={{x: 'Time', y: `${yAxis}`}}
                xDomainRange={[`${minDate}`, `${maxDate}`]}
                y-axis-config='{"tickFormat": ".2s"}'
                yType={'text'}
                interpolate={'linear'}
                axes
                width={750}
                height={250}
                data={[aaa.items]}
            />)
        }
    }
    
    renderGraph(detIitems) {
        if (detIitems) {
            if (Array.isArray(detIitems)) {
                return(<div>
                {detIitems.map((det, index) => {
                    return(<div key={index}>
                        {this.renderEasy(det, det.dettype)}
                        </div>) 
                })}
                </div>);
            } else {
                return(<div></div>);
            }
            
        } else {
            return(<div></div>);
        }
    }
    
    
    
    renderTable(detIitems) {
        if (detIitems) {
            if (Array.isArray(detIitems)) {
                return(<div>
                    {detIitems.map((det, index) => {
                        return(<table className="table" key={index}>
                            <thead className="thead-dark">
                                <tr><td>Date</td><td>Value</td></tr>
                            </thead>            
                            {this.renderItems(det)}
                        </table>) 
                    })}
                </div>);
            } else {
                return(<div></div>);
            }
            
        } else {
            return(<div></div>);
        }
    }
   
    
    
    renderChart(itdetail) {
        const { selectedItem } = this.state;
        let dataArray = itdetail.filter(function (el) {
            return el.dettype ===  selectedItem;
        });
        return (<div>
            {this.renderTable(dataArray)}
            {this.renderGraph(dataArray)}
        </div>)  
    }
    
    render () {
        const { itemDetails } = this.props;
        const { selectedItem } = this.state;
        let optionItems = itemDetails.map((op, index) => {
                    return(<option key={op.dettype} value={op.dettype}>{op.dettype}</option>)
        });
        optionItems.unshift(<option key="default" defaultValue="default" disabled> Select</option> );
        if (itemDetails) {
           return(<div>
            <div className="col-sm-12"> 
                <label>
                <Translation text="WALMAR_ITEM_DETAIL" />:
                    <select value={selectedItem} onChange={this.handleChange} >
                        {optionItems}
                    </select>
                </label>
            </div>
            {this.renderChart(itemDetails)}
           </div>);
        } else {
            return(<Translation text="NO_DATE_FOUND" />);
        }
	}
}
export default ItemChart;



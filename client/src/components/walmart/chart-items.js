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
            selectedItem: '-1',
            width: 600
        };
        this.handleChange = this.handleChange.bind(this);
	}
    
    handleChange(event) {
        this.setState({selectedItem: event.target.value});
    }
    renderItems(aaa) {
        return (<tbody>
                {aaa.items.map((item, index) => {
                    return(<tr key={index}><td>{item.x}</td><td>{item.y}</td></tr>)
                })}
        </tbody>);
    }
    
    //componentDidMount() {
        //const width = document.getElementById('chart').clientWidth;
        //console.log(width);
    //    this.setState({ width: width });
    //}
    
    renderEasy(aaa, yAxis) {
        var yType = 'numeric';
        var maxDate = dayjs().add(1, 'day').format('DD-MMM-YY');
        var minDate = dayjs().subtract(5, 'day').format('DD-MMM-YY');
        var minValue = _.minBy(aaa.items, 'y');
        var maxValue = _.minBy(aaa.items, 'y');
        var yMinVaue = 0;
        var yMaxVaue = 1;
        
        if (yAxis === 'salePrice') {
            yMinVaue = minValue.y  -1;
            yMaxVaue = maxValue.y  +1;
        }
       // if (Number.isNaN(Number.parseFloat(aaa.items[0].y))) {
       //      yType='text'; 
       // } else {
            
       // }
       // if (yType==='numeric') {
            
            return(<LineChart    
                axisLabels={{x: 'Time', y: `${yAxis}`}}
                width={this.state.width}
                height={this.state.width/2}
                xType={'time'}
                xDomainRange={[`${minDate}`, `${maxDate}`]}
                yDomainRange={[`${yMinVaue}`, `${yMaxVaue}`]}
                y-axis-config='{"tickFormat": ".2s"}'
                axes
                lineColors={['#ff6600']}
                data={[aaa.items]}
            />) 
    }
    
    renderGraph(detIitems) {
        if (detIitems) {
            if (Array.isArray(detIitems)) {
                return(<div id="chart">
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
                                <tr><td><Translation text="date" /></td>
                                    <td><Translation text="value" /></td></tr>
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





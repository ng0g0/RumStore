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
                {aaa.items.map((item) => {
                    return(<tr key={item.y}><td>{item.y}</td><td>{item.x}</td></tr>)
                })}
        </tbody>);
    }
    
    renderEasy(aaa, yAxis) {
        var yType = 'numeric';
        var maxDate = dayjs().add(1, 'day').format('DD-MMM-YY');
        var minDate = dayjs().subtract(5, 'day').format('DD-MMM-YY');
        
        if (Number.isNaN(Number.parseFloat(aaa.items[0].y))) {
             yType='text'; 
             //console.log('text');
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
                axes
                width={750}
                height={250}
                data={[aaa.items]}
            />) 
        } else {
            //console.log('TEXT');
            return(<LineChart     
                xType={'time'}
                axisLabels={{x: 'Time', y: `${yAxis}`}}
                xDomainRange={[`${minDate}`, `${maxDate}`]}
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
                {detIitems.map((det) => {
                    return(<div key={det.dettype}>
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
                    {detIitems.map((det) => {
                        return(<table className="table" key={det.dettype}>
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
        var result = _.chain(itdetail).groupBy("dettype").toPairs()
            .map(function (currentItem) {
                var newObject = [];
                currentItem[1].forEach(function(it) {
                    var date = dayjs(it.detdate).format('DD-MMM-YY');
                    var value = Number.parseFloat(it.detvalue) || it.detvalue;
                    //console.log(date)
                    newObject.push(Object.assign({y:value, x:date}))
                }); 
                newObject.sort(function(a,b) {
                    return (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0);
                }); 
                var newArray = [currentItem[0],newObject];
                return _.zipObject(["dettype","items"], newArray);
            }).value();
        console.log(result);
        var curDate = dayjs().format('DD-MMM-YY');
        result.unshift({dettype:'', items: [ {y: 0, x: curDate} ]});    
        let optionItems = result.map((op) =>
            <option key={op.dettype}>{op.dettype}</option>
        );
        let dataArray = result.filter(function (el) {
               return el.dettype ===  selectedItem;
            });
        if (dataArray.dettype === "") {
            return(<div></div>)  
        }   else {
            return (<div>
            <div className="col-sm-12"> 
                <label>
                <Translation text="WALMAR_ITEM_DETAIL" />:
                    <select value={selectedItem} onChange={this.handleChange} >
                        {optionItems}
                    </select>
                </label>
            </div>
            <div className="col-sm-12">
            {this.renderTable(dataArray)}
            {this.renderGraph(dataArray)}
            </div>
        </div>)  
            
        } 
        
    }

    render () {
        const { itemDetails } = this.props;
        if (itemDetails) {
           return(<div>
           {this.renderChart(itemDetails)}
           </div>);
        } else {
            return(<Translation text="NO_DATE_FOUND" />);
        }
	}
}
export default ItemChart;



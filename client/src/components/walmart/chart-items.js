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
            selectedItem: ''
        };
        this.handleChange = this.handleChange.bind(this);
	}
    
    handleChange(event) {
        this.setState({selectedItem: event.target.value});
    }
    renderItems(aaa) {
        //console.log('renderItems');
        //console.log(aaa);
        return (<tbody>
                        {aaa.items.map((item) => {
                           // console.log(item);
                            return(<tr key={item.y}>
                                    <td>{item.y}</td>
                                    <td>{item.x}</td>
                                  </tr>)
                    })}
                    </tbody>);
    }
    
    renderEasy(aaa, yAxis) {
        var yType = 'numeric';
        if (Number.isNaN(Number.parseFloat(aaa.items[0].y))) {
             yType='text'; 
        }
        
        //console.log(yType);
        if (yType==='numeric') {
          return(<LineChart     
            axisLabels={{x: 'Time', y: `${yAxis}`}}
            xType={'time'}
            xDomainRange={['30-Apr-18', '05-May-18']}
            axes
            interpolate={'cardinal'}
            width={750}
            height={250}
            data={[aaa.items]}
        />)
        
        } else {
            return(<LineChart     
            xType={'time'}
            axisLabels={{x: 'Time', y: `${yAxis}`}}
            xDomainRange={['30-Apr-18', '05-May-18']}
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
        //console.log(detIitems);
        if (detIitems) {
            if (Array.isArray(detIitems)) {
                return(<div>
                {detIitems.map((det) => {
                    //console.log(det);
                    return(
                        <div key={det.dettype}>
                            {this.renderEasy(det, det.dettype)}
                        </div>
                    ) 
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
        //console.log(detIitems);
        if (detIitems) {
            if (Array.isArray(detIitems)) {
                return(<div>
                {detIitems.map((det) => {
                    //console.log(det);
                    return(
                        <table className="table" key={det.dettype}>
                        <thead className="thead-dark">
                            <tr><td>Date</td><td>Value</td></tr>
                        </thead>            
                    {this.renderItems(det)}
                    </table>
                    ) 
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
                        //console.log(value);
                        console.log(date)
                        newObject.push(Object.assign({y:value, x:date}))
                    }); 
                    newObject.sort(function(a,b) {
                        return (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0);
                    }); 
                    var newArray = [currentItem[0],newObject];
                    return _.zipObject(["dettype","items"], newArray);
                }).value();
            //console.log(result);
            
            let optionItems = result.map((op) =>
                <option key={op.dettype}>{op.dettype}</option>
            );
            let dataArray = result.filter(function (el) {
                   return el.dettype ===  selectedItem;
                });
            return (<div>
                <div className="col-sm-12"> 
                <label>
                    <Translation text="WALMAR_ITEM_DETAIL" />:
                        <select defaultValue='' value={selectedItem} onChange={this.handleChange}>
                            <option disabled value></option>
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

    render () {
        const { itemDetails } = this.props;
        //console.log(itemDetails);
        //console.log(this.state);
        if (itemDetails) {
           return(<div>
           {this.renderChart(itemDetails)}
           </div>);
        } else {
            return(<Translation text="NO_DATE_FOUND" />);
        }
	}
// 
/*
function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

function isoFormatDMY(d) {  
  function pad(n) {return (n<10? '0' :  '') + n}
  return pad(d.getUTCDate()) + '/' + pad(d.getUTCMonth() + 1) + '/' + d.getUTCFullYear()
     + ' ' + pad(d.getUTCHours())+ ':' + pad(d.getUTCMinutes())+ ':' + pad(d.getUTCSeconds())
}
*/


}
export default ItemChart;



import React, { Component } from 'react';
import Translation from '../locale/translate';
import UserWalmartList from './user-items';
import SearchItem from './search-item';


class TabItems extends Component {
    constructor(props) {
        super(props);
        this.handleTabChange = this.handleTabChange.bind(this);
       this.state = {
           tabName: 'USER_LISTITEMS'
       }           
     }
    
    handleTabChange(value) {
        //console.log(value);
        this.setState({
            tabName : value
            })
    }    
     
    render () {
        const content = this.state.tabName === "USER_LISTITEMS" ?  (
            <div id="USER_LISTITEMS" className="tab-pane fade in active">
                <UserWalmartList {...this.props} />
            </div>
            ) : (
            <div id="WALMAR_ITEM_SEARCH" className="tab-pane fade in active">
                <SearchItem {...this.props} />
            </div>
            );
        return(<div>
            <ul className="nav nav-tabs">
            <li className="active">
                <a data-toggle="tab" href="#USER_LISTITEMS"
                    onClick={()=> this.handleTabChange("USER_LISTITEMS") }>
                    <Translation text="USER_LISTITEMS"  />
                </a>
            </li>
            <li>
                <a data-toggle="tab" href="#WALMAR_ITEM_SEARCH"
                onClick={()=> this.handleTabChange("WALMAR_ITEM_SEARCH") }>
                    <Translation text="WALMAR_ITEM_SEARCH"  />
                </a>
            </li>
        </ul>
        <div className="tab-content">
            {content}
        </div>    
        </div>);
	}
}
export default TabItems;



import React, { Component } from 'react';
import Translation from '../locale/translate';
import UserWalmartList from './user-items';
import SearchItem from './search-item';


class TabItems extends Component {
    
    render () {
        return(<div>
            <ul className="nav nav-tabs">
            <li className="active">
                <a data-toggle="tab" href="#USER_LISTITEMS"><Translation text="USER_LISTITEMS"  /></a>
            </li>
            <li>
                <a data-toggle="tab" href="#WALMAR_ITEM_SEARCH"><Translation text="WALMAR_ITEM_SEARCH"  /></a>
            </li>
        </ul>
        <div className="tab-content">
          <div id="USER_LISTITEMS" className="tab-pane fade in active">
            <UserWalmartList {...this.props} />
          </div>
          <div id="WALMAR_ITEM_SEARCH" className="tab-pane fade">
            <SearchItem {...this.props} />
          </div>
        </div>    
        </div>);
	}
}
export default TabItems;

//<ListItems {...this.props} />



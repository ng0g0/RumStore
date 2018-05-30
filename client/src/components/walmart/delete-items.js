import React, { Component } from 'react';
import Translation from '../locale/translate';

class DeleteItem extends Component {
    constructor(props) {
		super(props);
	}
    render () {
        const { deleteItems } = this.props;
        //console.log(deleteItems);
        return(<div className="row">
            <div className="col-md-12">
                <label><Translation text="DELETE_ANSWER" items={deleteItems}/></label>
            </div>
         </div>);    
	}
}
export default DeleteItem;



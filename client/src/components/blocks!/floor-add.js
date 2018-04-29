import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { connect } from 'react-redux';
import { Field, reduxForm, FieldArray,change  } from 'redux-form';
import Translation from '../locale/translate';
import { saveFloor } from '../../actions/blocks';
import {bindActionCreators} from 'redux';
import { AddFloorConst } from '../../consts';




function validate(formProps) {
  const errors = {};

  return errors;
}

const renderField = ({
  input,
  type,
  meta: { touched, error, warning },
}) =>
  ( <div>
      <input className="slider" {...input} type={type} />
	  {touched &&  error &&   <div className="error"><Translation text={error} /></div>}
    </div>
  );

const renderFloors= ({ fields, meta: { error, submitFailed } }) => (
    <div className="panel panel-default">
    <div className="panel-heading">
        <button type="button" onClick={() => 
        fields.unshift({ NUMBER: `${Number(fields.get(0).NUMBER) +1}`})
        } className="btn"> Add Floor </button>
      {submitFailed && error && <span>{error}</span>}
    </div>
    <div className="panel-body">
    {
       fields.map((floors, index) => (
      <div className="row" key={index}>
        <div className="col-sm-10"> Floor: {fields.get(index).NUMBER} </div>
        <Field name={`${floors}.NUMBER`} type="hidden" component={renderField} label="Floor Number" />
        <div className="col-sm-2"><button disabled={fields.get(index).NUMBER ==="0"} type="button" className="btn" title="Remove Floor" onClick={() => fields.remove(index)}   > Delete </button></div>
      </div>
    ))}
    </div>
    <div className="panel-footer">
        <button type="button" onClick={( ) => fields.push({ NUMBER: `${Number(fields.get(fields.length-1).NUMBER) -1}`})
        
        } className="btn"> Add UndreFloor </button>
    </div>
  </div>
);

  //`${fields.reduce((min, p) => p.NUMBER < min ? p.NUMBER : min, fields[0].NUMBER)}-1`})
 //            `${fields.reduce((max, p) => p.NUMBER < max ? p.NUMBER : max, fields[0].NUMBER)}+1`})
class AddFloor extends Component {
    constructor(props) {
		super(props);
       // this.handleBtnClick = this.handleBtnClick.bind(this);
	}
    /*
    handleBtnClick(e) {
        console.log(this.props.addForm.values);
        var val = e.target.id;
        let value = (val.startsWith("under")) ? this.props.addForm.values.underfloors : this.props.addForm.values.overfloors; 
        if (value => 0)  { 
                value = (val.endsWith("Plus") ) ? value +1 : ((value == 0)? 0 : value - 1 )
            };
        
        if (val.startsWith("under")) {
            this.setState( {underfloors: value});
            this.props.dispatch(change(AddFloorConst, 'underfloors', value));
        } else {
            this.setState( {overfloors: value});
            this.props.dispatch(change(AddFloorConst, 'overfloors', value));
        }
	}
    */
    
   
    render () {
        const { handleSubmit } = this.props;
        console.log(this.props);
        if  (this.props.loadingSpinner) {
		return (<div className='loader'><Translation text="Loading" />...</div>);
        } else {
            return(
            <form onSubmit={handleSubmit}>
            <div className="row">
               <div className="col-md-12">
               <FieldArray name="floors" component={renderFloors} />
                </div>
            </div>
           <div className="row">
           <Field name="objid"  component="input" type="input" />
           </div>
          </form>); 
        }
	
	}
}



	
function mapStateToProps(state) {
    console.log(state.form);
   return {
    block: state.block.block,
	errorMessage: state.block.error,
    addForm: state.form.AddFloor
  };
}
const mapDispatchToProps = (dispatch) =>   
  bindActionCreators({
    saveFloor
}, dispatch);

function  handleFormSubmit(formProps, dispatch) {
    console.log('handleFormSubmit');
    console.log(formProps);
    return dispatch(saveFloor(formProps));
}

const form = reduxForm({
  form: AddFloorConst,
  validate,
  enableReinitialize: true,
  onSubmit: handleFormSubmit 
});


export default connect(mapStateToProps, mapDispatchToProps)(form(AddFloor));



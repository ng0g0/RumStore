import React from 'react';

export const Select = props => {
  const renderSelectOptions = (key, index) => {
    return (
      <option
        key={`${index}-${key}`}
        value={key}
      >
        {props.options[key]}
      </option>
    );
  }

  if (props && props.options) {
    return (
      <div>
        <div>{props.label}</div>
        <select {...props.input}>
          <option value="salePrice"><Translation text="WALMAR_ITEM_PRICE" /></option>
           <option value="stock">WALMAR_ITEM_ONSTOCK</option>
        </select>
      </div>
    )
  }
  return <div></div>
}

//{Object.keys(props.options).map(renderSelectOptions)}

export default Select;


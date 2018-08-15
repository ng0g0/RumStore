import React, { Component } from 'react';
import Translation from '../locale/translate';

class VariantItems extends Component {
	//constructor(props) {
	//	super(props);
  //  this.handleLoadVars = this.handleLoadVars.bind(this);
  //   }
  handleClickItem( item) {
      //console.log(item);
      this.props.onUpdate(item);
      // this.props.dispatch(initialize(WalmartItem, item))
  }

    render() {
      //console.log(this.props.vars);
      const { vars, currentProduct } = this.props;
      if (!vars) {
          return(<div> </div>);
      }
      return (<div>
            <label><Translation text="WALMAR_VARIATIONS" /></label><br/>
            {vars.map((variant,index) => {
              //console.log(variant);
              let btnLabel  = "";
              const v  = Object.keys(variant.variants);
              //console.log(v);
              v.forEach(function(vk, index) {
                 const vk_name = variant.variants[vk].name
                 //const vk_title = ;
                 console.log(`${vk}: ${vk_name}` );
                 if (index > 0 ) {
                   btnLabel += "\n";
                 }
                 //console.log(vk);
                  const btnLbl = (vk === 'number_of_pieces') ? ` ${vk_name} ct` : `${vk_name}`;
                  btnLabel += btnLbl;
               })
              const btnclass =  (currentProduct === variant.productId) ?
                                "btn btn-default varButtonActive"
                              : "btn btn-default varButton"

              return(<button type="button" className={btnclass} key={index}
                        onClick={this.handleClickItem.bind(this, variant.productId)}
                        >
                        {btnLabel}
                        </button>
              )
            })}
            </div>);


    }
}

export default VariantItems;
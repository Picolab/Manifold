import React, { Component } from 'react';
import CustomComponentMap from '../Templates/customComponentMap';
import PropTypes from 'prop-types';
import ManifoldApp from '../Apps/ManifoldApp'

export class CardBody extends Component {

  render() {
    let appInfo = this.props.appInfo;
    let options = appInfo.options;
    if(options){
      if(!options.bindings){
        return (<div>Missing bindings from the pico!</div>)
      }
      const CustomComponent = CustomComponentMap[options.rid];
      if(CustomComponent){
        return (
          <div>
            <ManifoldApp developer_component={CustomComponent} bindings={options.bindings} eci={this.props.eci} pico_id={this.props.pico_id} />
          </div>
        )
      }else{
        return (
          <div>
            Error loading the custom component!
          </div>
        )
      }
    }else{
      return (
        <div>
          Error! Missing options in appInfo
        </div>
      )
    }
  }
}

CardBody.propTypes = {
  appInfo: PropTypes.object.isRequired,
  eci: PropTypes.string.isRequired,
  pico_id: PropTypes.string.isRequired
}

export default CardBody;

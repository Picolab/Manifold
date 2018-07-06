import React, { Component } from 'react';
import CustomComponentMap from '../Templates/customComponentMap';
import PropTypes from 'prop-types';
import ManifoldApp from '../Apps/ManifoldApp'

export class CardBody extends Component {

  render() {
    let appInfo = this.props.appInfo;
    if(!appInfo.bindings){
      return (<div>Missing bindings from the pico!</div>)
    }
    const CustomComponent = CustomComponentMap[appInfo.rid];
    if(CustomComponent){
      return (
        <div>
          <ManifoldApp developer_component={CustomComponent} bindings={appInfo.bindings} picoID={this.props.picoID} />
        </div>
      )
    }else{
      return (
        <div>
          Error loading the custom component!
        </div>
      )
    }
  }
}

CardBody.propTypes = {
  appInfo: PropTypes.object.isRequired,
  picoID: PropTypes.string.isRequired
}

export default CardBody;

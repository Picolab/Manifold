import React, { Component } from 'react';
import CustomComponentMap from '../Templates/customComponentMap';
import PropTypes from 'prop-types';

export class ThingBody extends Component {
  render() {
    let appInfo = this.props.appInfo;
    let options = appInfo.options;
    if(options){
      var bindings;
      if(options.bindings){
        bindings = options.bindings;
        bindings.eci = this.props.eci;
        bindings.id = this.props.id;
      }else{
        return (<div>Missing bindings from the pico!</div>)
      }
      const CustomComponent = CustomComponentMap[options.rid];
      if(CustomComponent){
        return (
          <div>
            <CustomComponent {...bindings} />
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

ThingBody.propTypes = {
  appInfo: PropTypes.object.isRequired,
  eci: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
}

export default ThingBody

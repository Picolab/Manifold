import React, { Component } from 'react'
import AppMap from '../Apps/AppMap'
import PropTypes from 'prop-types'
import ManifoldApp from '../Apps/ManifoldApp'

export class CardBody extends Component {

  render() {
    let appInfo = this.props.appInfo;
    if(!appInfo.bindings){
      appInfo.bindings = {}; //default to an empty object
    }
    const CustomComponent = AppMap[appInfo.rid];
    if(CustomComponent){
      return (
        <div>
          <ManifoldApp developerComponent={CustomComponent} bindings={appInfo.bindings} picoID={this.props.picoID} />
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

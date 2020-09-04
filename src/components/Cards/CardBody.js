import React, { Component } from 'react'
import CardMap from '../Apps/CardMap'
import PropTypes from 'prop-types'
import ManifoldApp from '../Apps/ManifoldApp'

export class CardBody extends Component {

  render() {
    let appInfo = this.props.appInfo;
    if(!appInfo.bindings){
      appInfo.bindings = {}; //default to an empty object
    }
    const CustomComponent = CardMap[appInfo.rid];
    if(CustomComponent){
      return (
        <div>
          <ManifoldApp developerComponent={CustomComponent} bindings={appInfo.bindings} picoID={this.props.picoID} />
        </div>
      )
    }else{
      return (
        <div>
          Error loading the app! This could be due to the app being depricated.
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

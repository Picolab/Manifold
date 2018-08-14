import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sky_event } from '../../utils/manifoldSDK';

class ThingTemplate extends Component {
  constructor(props){
    super(props);

    this.state = {
      url: sky_event(this.props.DID)
    }
  }

  render(){
    return (
      <div>
        <h4>General Information</h4>
        <p>Thing Id: {this.props.picoID}</p>
        <p>Thing DID: {this.props.DID}</p>
      </div>
    );
  }
}

ThingTemplate.propTypes = {
  picoID: PropTypes.string.isRequired,
  DID: PropTypes.string.isRequired
}

export default ThingTemplate;

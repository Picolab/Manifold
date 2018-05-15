import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sky_event } from '../../utils/manifoldSDK';

class ThingTemplate extends Component {
  constructor(props){
    super(props);

    this.state = {
      url: sky_event(this.props.eci)
    }
  }

  render(){
    return (
      <div>
        <h4>General Information</h4>
        <p>Thing Id: {this.props.pico_id}</p>
        <p>Thing eci: {this.props.eci}</p>
        <p>URL to your Thing: {this.state.url}</p>
      </div>
    );
  }
}

ThingTemplate.propTypes = {
  pico_id: PropTypes.string.isRequired,
  eci: PropTypes.string.isRequired
}

export default ThingTemplate;

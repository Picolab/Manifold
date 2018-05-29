import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sky_event } from '../../utils/manifoldSDK';

class NeighborhoodTemps extends Component {
  constructor(props){
    super(props);

    this.state = {
      url: sky_event(this.props.eci)
    }
  }

  render(){
    return (
      <div>
        Temperature gossip app!
      </div>
    );
  }
}

NeighborhoodTemps.propTypes = {
  pico_id: PropTypes.string.isRequired,
  eci: PropTypes.string.isRequired
}

export default NeighborhoodTemps;

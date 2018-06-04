import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sky_event } from '../../utils/manifoldSDK';
import { connect } from 'react-redux';
import { commandAction } from '../../actions/command';

class NeighborhoodTemps extends Component {
  constructor(props){
    super(props);

    this.state = {
      url: sky_event(this.props.eci)
    }


  }

  retrieveData() {
    
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

/*
CreateThingModal.propTypes = {
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired,
  createThing: PropTypes.func.isRequired
}
*/

const mapDispatchToProps = (dispatch) => {
  return {
    createThing: (name) => {
      //dispatch(commandAction(createThing, [name]))
    }
  }
}

//connect to redux store so we can get access to dispatch in the props
export default connect(null, mapDispatchToProps)(NeighborhoodTemps);

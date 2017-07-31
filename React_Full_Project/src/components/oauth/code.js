import React, { Component } from 'react';
import { browserHistory } from 'react-router-dom';
import { CLIENT_STATE_KEY } from '../../utils/config';
import { connect } from 'react-redux';
import { getAccessToken } from '../../actions';

class Code extends Component {
  handleCodeRoute(){
    //get the state and code
    const { state, code } = this.props.match.params;
    const expectedState = localStorage.getItem(CLIENT_STATE_KEY);
    if (state !== expectedState) {
      console.warn("OAuth Security Warning. Client states do not match. (Expected %d but got %d)", expectedState, state);
    }
    console.log("getting access token with code: ", code);
    this.props.getAccessToken(code);
  }

  componentDidMount(){
    this.handleCodeRoute();
  }

  render(){
    return null;
  }
}

export default connect(null, {getAccessToken})(Code);

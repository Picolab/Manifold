import { Component } from 'react';
import { getCallbackURL, getHostname, getClientSecret, getProtocol, getClientId, getState, storeOwnerECI, getManifoldURL } from '../../utils/AuthService';
import queryString from 'query-string';
import axios from 'axios';

const requestToken = (code) => {
  const body = {
    "grant_type": "authorization_code",
    "redirect_uri": getCallbackURL(),
    "client_id": getClientId(),
    "code": code,
    "client_secret": getClientSecret()
  };
  return axios.post(`${getProtocol()}${getHostname()}/token`,body);
}

class Code extends Component {


  handleCodeRoute() {
    //first make sure the state matches what we expect
    const unparsedQuery = this.props.location.search;
    const { code, state } = queryString.parse(unparsedQuery);
    const expectedState = getState();
    if(state !== expectedState) {
      console.warn("OAuth Security Warning. Client states do not match. (Expected %d but got %d)", expectedState, state);
      return;
    }

    //request the access token
    const tokenPromise = requestToken(code);
    tokenPromise.then((response) => {
      const { access_token } = response.data;
      //token_type is also provided in the response data
      if(!access_token){
        alert("Oauth request failed. Please try again.");
        return;
      }
      storeOwnerECI(access_token);
      window.location.assign(getManifoldURL());
    }).catch((e) => {
      console.error(e);
    });
  }

  componentDidMount() {
    this.handleCodeRoute();
  }

  render() {
    return null;
  }
}

export default Code;

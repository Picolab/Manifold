import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';
import { retrieveOwnerDID } from '../../../utils/manifoldSDK';
import { storeOwnerECI, getManifoldURL } from '../../../utils/AuthService';

/* global gapi */

//searches an array of directives for one with the name we want. Returns -1 if not found, otherwise the index of the directive we want.
const getOwnerDirectiveIndex = (directives) => {
  for(let i = 0; i < directives.length; i++) {
    if(directives[i].name === "Returning google_signin DID") {
      return i;
    }
  }
  return -1;
}

export class ManifoldLogin extends Component {
  constructor(props) {
    super(props);

    this.onSignIn = this.onSignIn.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  pollForOwnerDID(id_token, attemptNum) {
    if(attemptNum > 2) {
      console.error("Last attempt to retrieve owner DID failed 😭");
      return;
    }
    //exponential backoff... wait for a calculated number of milliseconds depending on which attempt this is.
    setTimeout(() => {
      const ownerDIDPromise = retrieveOwnerDID({
        id_token
      });
      ownerDIDPromise.then((resp) => {
        const { directives } = resp.data;
        console.log("ownerDID directives:", directives);
        let index = getOwnerDirectiveIndex(directives);
        if(index >= 0) {
          //we are in business
          console.log("Retrieved owner DID? Hopefully! 😉");
          //assign the owner DID to local storage, then redirect the window to the dashboard
          const ownerDID = directives[index].options.DID;
          if(ownerDID) {
            storeOwnerECI(ownerDID);
            window.location.assign(getManifoldURL());
          }else{
            console.error("Uh oh! Something went wrong! 😭");
          }
        }else {
          //we need to try again
          this.pollForOwnerDID(id_token, attemptNum + 1);
        }
      }).catch((e) => {
        console.error(e);
      });
    }, attemptNum * 1000);
  }

  onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    let id_token = googleUser.getAuthResponse().id_token;
    console.log('ID Token: ' + id_token);
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    this.pollForOwnerDID(id_token, 0);
  }

  onFailure(e) {
    console.error(e);
  }

  componentDidMount() {
    const attachSignInButton = () => {
      gapi.signin2.render('g-signin2', {
        'width': 240,
        'height': 50,
        'longtitle': true,
        'onsuccess': this.onSignIn,
        'onfailure': this.onFailure
      });
    }
    if(!window.gapi) {
      setTimeout(() => {
        attachSignInButton();
      }, 1000);
    }else {
      attachSignInButton();
    }
  }

  render() {
    return(
      <Card className="centered-card">
        <CardBody>
          <div id="g-signin2"></div>
        </CardBody>
      </Card>
    )
  }
}

ManifoldLogin.propTypes = {
}

export default ManifoldLogin;

import React, { Component } from 'react';
import { retrieveGithubOwnerDID } from '../../../../utils/manifoldSDK';
import { storeOwnerECI, getManifoldURL } from '../../../../utils/AuthService';

//searches an array of directives for one with the name we want. Returns -1 if not found, otherwise the index of the directive we want.
const getOwnerDirectiveIndex = (directives) => {
  for(let i = 0; i < directives.length; i++) {
    if(directives[i].name === "Returning github_signin DID") {
      return i;
    }
  }
  return -1;
}

class GithubAuthSuccess extends Component {
  pollForOwnerDID(attemptNum, uuid) {
    if(attemptNum > 2) {
      console.error("Last attempt to retrieve owner DID failed 😭");
      return;
    }
    //exponential backoff... wait for a calculated number of milliseconds depending on which attempt this is.
    setTimeout(() => {

      const ownerDIDPromise = retrieveGithubOwnerDID({ uuid });
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
          this.pollForOwnerDID(attemptNum + 1, uuid);
        }
      }).catch((e) => {
        console.error(e);
      });
    }, attemptNum * 1000);
  }

  componentDidMount() {
    const { uuid } = this.props.match.params;
    this.pollForOwnerDID(0, uuid);
  }

  render() {
    return (
      <div>Signing you in...</div>
    )
  }
}

export default GithubAuthSuccess;

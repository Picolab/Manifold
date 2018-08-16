import React, { Component } from 'react';
import { retrieveOwnerProfile } from '../../../src/utils/manifoldSDK'

//const brandPrimary =  '#20a8d8';
//const brandSuccess =  '#4dbd74';
//const brandInfo =     '#63c2de';
//const brandDanger =   '#f86c6b';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: {
      }
    }

    this.getProfileInfo = this.getProfileInfo.bind(this);
    this.renderService = this.renderService.bind(this);
    this.renderProfileRow = this.renderProfileRow.bind(this);
  }

  componentWillMount() {
    this.getProfileInfo();
  }

  getProfileInfo() {
    const profileGetPromise = retrieveOwnerProfile();
    profileGetPromise.then((resp) => {
      const profile = resp.data;
      if (profile.google) {
        this.setState({
          profile: {
            "google":profile.google
          }
        })
      }
    }).catch((e) => {
      console.error(e);
    });
  }

  renderService(service) {
    if (!service)
      return;
    let serviceName = "Google" //service.charAt(0).toUpperCase() + service.substr(1);
    let avatarImg = service.profileImgURL
    let displayName = service.displayName
    let firstName = service.firstName
    let lastName = service.lastName
    let email = service.email
    
    return (
      <div>
        <h2> {serviceName} </h2>
        {this.renderProfileRow("Display Name: ", displayName, false)}
      </div>
    )
  }

  renderProfileRow(descriptor, content, image) {
    if (image === true) {
      content = <img src={content} className="img-avatar" alt="Avatar Image"/>
    } else {
      content = <p style={{"fontSize":"large"}}> {content} </p>
    }
    return (
      <div className="profileRow">
        <h3> {descriptor}: </h3>
        {content}
      </div>
    )
  }


  render(){
    return (
      <div style={{"maxWidth":"550px"}}>
        <h1> Profile</h1>
        <hr className="my-2" style={{"paddingBottom":"5px"}}/>
        {this.renderService(this.state.profile.google)}
      </div>
    );
  }
}

export default Profile;

import React, { Component } from 'react';
import {Table} from 'reactstrap';
import { retrieveOwnerProfile } from '../../../src/utils/manifoldSDK';
import './Profile.css';

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
    this.renderServices = this.renderServices.bind(this);
  }

  componentWillMount() {
    this.getProfileInfo();
  }

  getProfileInfo() {
    const profileGetPromise = retrieveOwnerProfile();
    profileGetPromise.then((resp) => {
      const profile = resp.data;
      if (profile) {
        this.setState({
          profile
        })
      }
    }).catch((e) => {
      console.error(e);
    });
  }

  renderService(service, serviceName) {
    if (!service)
      return;
    let formattedServiceName = serviceName.charAt(0).toUpperCase() + serviceName.substr(1);
    let avatarImg = service.profileImgURL
    let displayName = service.displayName
    let firstName = service.firstName
    let lastName = service.lastName
    let email = service.email
    
    return (
      <div key={serviceName} className="profileServiceSection">
        <h2 className="serviceHeader"> {formattedServiceName} </h2>
        <Table>
          <tbody>
            {this.renderProfileRow("Avatar", avatarImg, true)}
            {this.renderProfileRow("Display Name", displayName)}
            {this.renderProfileRow("First Name", firstName)}
            {this.renderProfileRow("Last Name", lastName)}
            {this.renderProfileRow("Email", email)}
          </tbody>
        </Table>
      </div>
    )
  }

  renderProfileRow(descriptor, content, image) {
    if (image === true) {
      content = <img src={content} className="avatarImg" alt="Avatar"/>
    }
    if (!content)
      return;
    return (
      <tr className="profileRowText">
        <td> {descriptor} </td><td> {content} </td>
      </tr>
    )
  }

  renderServices() {
    let services = [];
    Object.getOwnPropertyNames(this.state.profile).forEach(element => {
      services.push(this.renderService(this.state.profile[element], element))
    })
    return services;
  }


  render(){
    return (
      <div style={{"maxWidth":"550px"}}>
        <h1> Profile</h1>
        <hr className="my-2" style={{"paddingBottom":"5px"}}/>
          {this.renderServices()}
        </div>
    );
  }
}

export default Profile;

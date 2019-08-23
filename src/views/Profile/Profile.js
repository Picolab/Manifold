import React, { Component } from 'react';
import {Table} from 'reactstrap';
import SectionModal from './SectionModal';
import EditModal from './EditModal';
import { retrieveOwnerProfile } from '../../../src/utils/manifoldSDK';
import { getOwnerECI } from '../../../src/utils/AuthService';
import { customQuery, customEvent } from '../../../src/utils/manifoldSDK';
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
      },
      other: {

      }
    }

    this.getProfileInfo = this.getProfileInfo.bind(this);
    this.getOtherInfo = this.getOtherInfo.bind(this);
    this.renderService = this.renderService.bind(this);
    this.renderProfileRow = this.renderProfileRow.bind(this);
    this.renderServices = this.renderServices.bind(this);
  }

  componentWillMount() {
    this.setGoogleFav();
  }

  setGoogleFav() {
    let googleFavPromise = customEvent( getOwnerECI(), "profile", "google_set_fav", {});
    googleFavPromise.then((resp) => {
      this.setGithubFav();
    })
  }

  setGoogleFav() {
    let githubFavPromise = customEvent( getOwnerECI(), "profile", "github_set_fav", {});
    githubFavPromise.then((resp) => {
      this.getProfileInfo()
      this.getOtherInfo()
    })
  }

  getProfileInfo() {
    const profileGetPromise = retrieveOwnerProfile();
    profileGetPromise.then((resp) => {
      const profile = resp.data
      if (profile) {
        this.setState({
          profile
        })
      }
    }).catch((e) => {
      console.error(e);
    });
  }

  getOtherInfo() {
    const otherGetPromise = customQuery(getOwnerECI(),"io.picolabs.profile", "getOther");
    otherGetPromise.then((resp) => {
      const other = resp.data
      if (other) {
        this.setState({
          other
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
    let phone = service.phone
    let street = service.street
    let city = service.city
    let state = service.state
    let postalcode = service.postalcode
    let favorite = service.favorite

    return (
      <div key={serviceName} className="profileServiceSection">
        <h2 className="serviceHeader">
          {formattedServiceName}{' '}
          {(formattedServiceName !== "Google") &&
          <EditModal
            sectionTitle={formattedServiceName}
            getOtherInfo = {this.getOtherInfo}
            favorite = {favorite}/>}
          {favorite === "true" && <i className="fa fa-star full-star" id={formattedServiceName} aria-hidden="true" onClick={(e) => {this.changeFavorite(e, "false")}}></i>}
          {favorite === "false" && <i className="fa fa-star-o empty-star" id={formattedServiceName} aria-hidden="true" onClick={(e) => {this.changeFavorite(e, "true")}}></i>}
        </h2>
        <Table>
          <tbody>
            {(avatarImg !== undefined) && this.renderProfileRow("Avatar", avatarImg, true)}
            {this.renderProfileRow("Display Name", displayName)}
            {this.renderProfileRow("First Name", firstName)}
            {this.renderProfileRow("Last Name", lastName)}
            {this.renderProfileRow("Email", email)}
            {this.renderProfileRow("Phone", phone)}
            {(street || city || state || postalcode) && this.renderProfileRow("Address", this.formatAddress(street, city, state, postalcode))}
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
    Object.getOwnPropertyNames(this.state.other).forEach(element => {
      services.push(this.renderService(this.state.other[element], element))
    })
    return services;
  }

  formatAddress(street, city, state, postalcode) {
    return (
      <Table>
        <tbody>
          {this.renderAddressRow("Street", street)}
          {this.renderAddressRow("City", city)}
          {this.renderAddressRow("State", state)}
          {this.renderAddressRow("Postal Code", postalcode)}
        </tbody>
      </Table>
    );
  }

  renderAddressRow(descriptor, content) {
    if (!content)
      return;
    return (
      <tr>
        <td> {descriptor} </td><td> {content} </td>
      </tr>
    )
  }

  changeFavorite(e, value) {
    let changeFavoritePromise = customEvent( getOwnerECI(), "profile", "other_profile_change_favorite", {"section": e.target.id, "value": value}, "change_favorite");
    changeFavoritePromise.then((resp) => {
      this.getProfileInfo()
      this.getOtherInfo()
    })
  }

  render(){
    return (
      <div>
        <div style={{"float": "right"}}>
          <SectionModal
            getOtherInfo = {this.getOtherInfo}
          />
        </div>
        <div style={{"maxWidth":"500px"}}>
          <h1> Profile</h1>
          <hr className="my-2" style={{"paddingBottom":"5px"}}/>
            {this.renderServices()}
        </div>
      </div>
    );
  }
}

export default Profile;

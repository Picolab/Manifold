import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import { Card, CardText, CardBody, CardTitle, CardLink } from 'reactstrap';
import { isLoggedIn } from '../../utils/AuthService';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { customQuery } from '../../utils/manifoldSDK';
import axios from 'axios';
import './SafeAndMine.css';

const registryEvent = "http://localhost:8080/sky/event/7N5QYptWtQAfnUU8CDAUi9/eid/registry/tag_scanned";

//directives is an array of directives, dirName will attempt to exactly match with the directive name. If none are found to be exactly equal, null is returned. Otherwise the first found directive is returned
const searchDirectives = function(directives, dirName) {
  for(var i = 0; i < directives.length; i++) {
    if(directives[i].name == dirName) {
      return directives[i];
    }
  }
  return null;
}

export class SafeAndMine extends Component {
  constructor(props) {
    super(props);

    //tagID is part of the route url
    const tagID = props.match.params.tagID;
    this.state = {
      loading: true,
      tagID,
      DID: "",
      name: "",
      email: "",
      phone: "",
      message: "",
      engineLoc: ""
    }
    this.retrieveTagInfo = this.retrieveTagInfo.bind(this)
  }
  resolveTagDID() {
    const promise = axios.get(`${registryEvent}?tagID=${this.state.tagID}&devDomain=picolabs`);
    promise.then((resp) => {
      const dir = searchDirectives(resp.data.directives, "Returning tagInfo");
      if(dir) {
        const { DID, engineLoc } = dir.options;
        this.retrieveTagInfo(DID, engineLoc);
      } else {
        //unregistered tag
        this.setState({
          loading: false
        })
      }
    }).catch((e) => {
      console.error(e);
    });
  }
  retrieveTagInfo(DID, engineLoc) {
    const promise = axios.get(`${engineLoc}/sky/cloud/${DID}/io.picolabs.safeandmine/getInformation`)
    promise.then((resp) => {
      const { name = "", email = "", phone = "", message = "", shareName = false, shareEmail = false, sharePhone = false} =  resp.data;
      this.setState({
        loading: false,
        DID,
        engineLoc,
        name,
        email,
        phone,
        message,
        shareName,
        shareEmail,
        sharePhone
      });
    }).catch((e) => {
      console.error(e);
    });
  }
  componentDidMount() {
    this.resolveTagDID();
  }
  displayCard() {
    const { name, phone, email, message, shareName, sharePhone, shareEmail } = this.state;
    const loggedIn = isLoggedIn();
    const noPublicInfo = (!shareName && !sharePhone && !shareEmail && !message);
    if(!this.state.loading) {
      if(this.state.DID) {
        return(
          <div>
            {noPublicInfo && <CardText>The owner of this tag has not provided any public information...</CardText>}
            {shareName && name && <CardText><b>Owner:</b> {name}</CardText>}
            {sharePhone && phone && <CardText><b>Phone Number:</b> {phone}</CardText>}
            {shareEmail && email && <CardText><b>Email:</b> {email}</CardText>}
            {message && <CardText><b>Owner's Public Message:</b> {message}</CardText>}
            {loggedIn && <CardLink tag={Link} to="/">Return home</CardLink>}
            {!loggedIn && <CardLink tag={Link} to="/login">Sign up</CardLink>}
          </div>
        );
      }else {
        return (
          <div>
            <CardText>This tag has not yet been registered! Register this tag to see a message.</CardText>
            {loggedIn && <CardLink tag={Link} to="/">Return home</CardLink>}
            {!loggedIn && <CardLink tag={Link} to="/login">Sign up</CardLink>}
          </div>
        );
      }
    } else {
      return (
        <div>
          <CardText>Looking up tag...</CardText>
            {loggedIn && <CardLink tag={Link} to="/">Return home</CardLink>}
            {!loggedIn && <CardLink tag={Link} to="/login">Sign up</CardLink>}
        </div>
      )
    }

  }
  render() {
    return(
      <Card className="centered-card">
        <CardBody>
          <CardTitle>Safe and Mine</CardTitle>
          <CardText>Thanks for scanning tag id: {this.state.tagID}!</CardText>
          {this.displayCard()}
        </CardBody>
      </Card>
    )
  }
}

SafeAndMine.propTypes = {
}

export default SafeAndMine;

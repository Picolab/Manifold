import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import { Card, CardText, CardBody, CardTitle, CardLink } from 'reactstrap';
import { isLoggedIn } from '../../utils/AuthService';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { customQuery, customEvent } from '../../utils/manifoldSDK';
import './SafeAndMine.css';

export class SafeAndMine extends Component {
  constructor(props) {
    super(props);

    let params = (window.location.href.indexOf('?') !== -1) ? window.location.href.slice(window.location.href.indexOf('?')) : "";

    //location is passed down from the Route component
    const { tagID, DID, domain } = queryString.parse(props.location.search);
    this.state = {
      tagID,
      DID,
      domain,
      params,
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  }
  componentDidMount() {
    console.log("TAGID", this.state.tagID);
    const promise = customQuery(this.state.DID, "io.picolabs.safeandmine", "getInformation");
    promise.then((resp) => {
      const { name = "", email = "", phone = "", message = "", shareName = false, shareEmail = false, sharePhone = false} =  resp.data;
      this.setState({
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
    this.notify();
  }

  notify() {
    const promise = customEvent(this.state.DID, "safeandmine", "notify", { tagID: this.state.tagID });
    promise.then((resp) => {
      console.log("notified");
    })
  }

  displayCard() {
    const { name, phone, email, message, shareName, sharePhone, shareEmail } = this.state;
    const loggedIn = isLoggedIn();
    const noPublicInfo = (!shareName && !sharePhone && !shareEmail && !message);
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
    } else {
      return (
        <div>
          <CardText>This tag has not yet been registered! Register this tag to see a message.</CardText>
          {loggedIn && <CardLink tag={Link} to={"/mythings" + this.state.params}>Return home</CardLink>}
          {!loggedIn && <CardLink tag={Link} to={"/login" + this.state.params}>Sign up</CardLink>}
        </div>
      );
    }

  }
  render() {
    return(
      <Card className="centered-card">
        <CardBody>
          <CardTitle>Safe and Mine</CardTitle>
          <CardText>Thanks for scanning tag id: {this.state.tagID} ({this.state.domain})!</CardText>
          {this.displayCard()}
        </CardBody>
      </Card>
    )
  }
}

SafeAndMine.propTypes = {
}

export default SafeAndMine;

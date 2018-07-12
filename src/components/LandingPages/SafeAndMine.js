import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import { Card, CardText, CardBody, CardTitle, CardLink } from 'reactstrap';
import { isLoggedIn } from '../../utils/AuthService';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { customQuery } from '../../utils/manifoldSDK';
import './SafeAndMine.css';

export class SafeAndMine extends Component {
  constructor(props) {
    super(props);

    //location is passed down from the Route component
    const { tagID, DID } = queryString.parse(props.location.search);
    this.state = {
      tagID,
      DID,
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  }
  componentDidMount() {
    const promise = customQuery(this.state.DID, "io.picolabs.safeandmine", "getInformation");
    promise.then((resp) => {
      const { name = "", email = "", phone = "", message = "" } =  resp.data;
      this.setState({
        name,
        email,
        phone,
        message
      });
    }).catch((e) => {
      console.error(e);
    });
  }
  displayCard() {
    const { name, phone, email, message } = this.state;
    const loggedIn = isLoggedIn();
    const noPublicInfo = (!name && !phone && !email && !message);
    if(this.state.DID) {
      return(
        <div>
          {noPublicInfo && <CardText>The owner of this tag has not provided any public information...</CardText>}
          {name && <CardText><b>Owner:</b> {name}</CardText>}
          {phone && <CardText><b>Phone Number:</b> {phone}</CardText>}
          {email && <CardText><b>Email:</b> {email}</CardText>}
          {message && <CardText><b>Owner's Public Message:</b> {message}</CardText>}
          {loggedIn && <CardLink tag={Link} to="/">Return home</CardLink>}
          {!loggedIn && <CardLink tag={Link} to="/login">Sign up</CardLink>}
        </div>
      );
    } else {
      return (
        <div>
          <CardText>This tag has not yet been registered! Register this tag to see a message.</CardText>
        </div>
      );
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

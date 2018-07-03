import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardText, CardBody, CardTitle, CardSubtitle, CardLink } from 'reactstrap';
import { isLoggedIn } from '../../utils/AuthService';
import { Link } from 'react-router-dom';
import './SafeAndMine.css';

export class SafeAndMine extends Component {
  render() {
    //location is passed down from the Route component
    const tagID = this.props.location.pathname.split("/")[3];
    const loggedIn = isLoggedIn();
    return(
      <Card className="centered-card">
        <CardBody>
          <CardTitle>Safe and Mine</CardTitle>
          <CardText>Thanks for scanning tag id: {tagID}! This tag belongs to Frodo Baggins.</CardText>
          <CardText>Phone: 1-800-fake-number</CardText>
          <CardText>Email: frodoswaggins@gmail.com</CardText>
          <CardText>Owner's public message: Hey! I lost my backpack. There is a $10 reward for finding it. Please let me know!</CardText>
          {loggedIn && <CardLink tag={Link} to="/">Return home</CardLink>}
          {!loggedIn && <CardLink tag={Link} to="/login">Sign up</CardLink>}
        </CardBody>
      </Card>
    )
  }
}

SafeAndMine.propTypes = {
}

export default SafeAndMine;

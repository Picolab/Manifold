import React, { Component } from 'react';
import {Container, Row, Col, ListGroup} from 'reactstrap';
import IconInfo from './IconInfo';
import GoogleSignIn from './GoogleSignIn';
import MeetTheTeam from './MeetTheTeam';

class LoginBody extends Component {
  render() {
    return (
      <Container className="loginContainer">
        <Row className="centerRow">
          <Col className="iconContainer">
            <ListGroup>
              <IconInfo
                faIcon="fa-feed"
                msg="Manifold is a platform that allows you to connect and interact with your things"/>
              <IconInfo
                faIcon="fa-cogs"
                msg="From car keys to smarthome devices, Manifold offers control"/>
              <IconInfo
                faIcon="fa-compass"
                msg="Discover new ways to make your things smart"/>
            </ListGroup>
          </Col>
        </Row>
        <Row className="centerRow">
          <p className="loginDevInfo">Manifold is currently under heavy development. Many apps and features are still forthcoming.</p>
          <hr style={{width: "100%", marginTop: "0.5rem"}}/>
        </Row>
        <MeetTheTeam />
        <Row className="centerRow">
          <hr style={{width: "100%"}}/>
          <p>In order for Google sign in to work, you <b>MUST</b> enable popups on your browser</p>
        </Row>
        <Row className="centerRow">
          <GoogleSignIn />
        </Row>
      </Container>
    )
  }
}

export default LoginBody;

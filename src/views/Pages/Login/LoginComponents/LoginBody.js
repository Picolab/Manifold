import React, { Component } from 'react';
import {Container, Row, Col, ListGroup} from 'reactstrap';
import IconInfo from './IconInfo';
import GoogleSignIn from './GoogleSignIn';
import MeetTheTeam from './MeetTheTeam';
import '../loginStyles.css';

class LoginBody extends Component {
  render() {
    return (
      <Container className="loginContainer">
        <Row className="centerRow">
          <Col className="iconContainer">
            <ListGroup>

              <div>
                <Row>
                  <Col xs="3">
                    <IconInfo faIcon="fa-feed" />
                  </Col>
                  <Col xs="9">
                    <p className="iconSpacing">Manifold is a platform that allows you to connect and interact with your things</p>
                  </Col>
                </Row>
              </div>

              <div>
                <Row>
                  <Col xs="3">
                    <IconInfo faIcon="fa-cogs" />
                  </Col>
                  <Col xs="9">
                    <p className="iconSpacing">From car keys to smarthome devices, Manifold offers control</p>
                  </Col>
                </Row>
              </div>

              <div>
                <Row>
                  <Col xs="3">
                    <IconInfo faIcon="fa-compass" />
                  </Col>
                  <Col xs="9">
                    <p className="iconSpacing">Discover new ways to make your things smart</p>
                  </Col>
                </Row>
              </div>

            </ListGroup>
          </Col>
        </Row>
        <Row className="centerRow" style={{ paddingTop: "10px" }}>
          <GoogleSignIn />
        </Row>
        <Row className="centerRow">
          <p className="popUpWarning">In order for Google sign in to work, you <b>MUST</b> enable popups on your browser</p>
        </Row>
        <Row className="centerRow">
          <p className="loginDevInfo">Manifold is currently under heavy development. Many apps and features are still forthcoming.</p>
          <hr style={{width: "100%", marginTop: "0.5rem"}}/>
        </Row>
        <MeetTheTeam />
      </Container>
    )
  }
}

export default LoginBody;

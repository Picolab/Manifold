import React, { Component } from 'react';
import {Container, Row, Col, ListGroup} from 'reactstrap';
import IconInfo from './IconInfo';
import GoogleSignIn from './GoogleSignIn';
//import MeetTheTeam from './MeetTheTeam';
import GithubButton from './GithubButton';
import { GITHUB_DEFINED } from '../../../../utils/config';
import '../loginStyles.css';

//Error Modal
import ErrorModal from '../../../../components/Modals/ErrorModal/ErrorModal'

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
          {GITHUB_DEFINED && <div style={{width: "10px"}}></div>}
          {GITHUB_DEFINED && <GithubButton />}
        </Row>
        <Row className="centerRow">
          <p className="popUpWarning">Not working? Try enabling popups on your browser</p>
        </Row>
        <Row className="centerRow">
          <p className="loginDevInfo">Manifold is currently under heavy development. Many apps and features are still forthcoming</p>
          <hr style={{width: "100%", marginTop: "0.5rem"}}/>
        </Row>
        {/*<MeetTheTeam />*/}
        <ErrorModal/>
      </Container>
    )
  }
}

export default LoginBody;

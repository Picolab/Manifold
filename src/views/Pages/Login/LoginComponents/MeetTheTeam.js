import React, { Component } from 'react';
import { Row, Col, Media } from 'reactstrap';
import theTeam from '../../../../images/theTeam.jpg';
import TeamMember from './TeamMember';

class MeetTheTeam extends Component {
  render() {
    return (
      <div>
        <Row className="centerRow">
          <h3>Meet the Team!</h3>
        </Row>
        <Row className="centerRow">
          <p className="teamDescr">Everyone here at Pico Labs is dedicated to preserving your personal freedom. Our goal is to give complete control of all your things back to you. To do that, we need your help. Once you sign in with Google, you can submit feedback to report bugs, offer suggestions, or request help. Or email us at picolabsbyu@gmail.com.</p>
        </Row>
        <Row>
          <Col sm="5">
            <Media className="teamMemberPic" object src={theTeam} alt="The Picolabs Team"/>
          </Col>
          <Col sm="7" style={{ margin: "auto" }}>
            <div className="teamMemberContainer">
              <TeamMember name="Connor Grimm" title="Lead Manifold Developer" bio="Enjoys movies, the occasional anime, and casual volleyball."/>
              <TeamMember name="Jace Kandare" title="Marketing Manager" bio="No bio"/>
              <TeamMember name="Thomas Lewis" title="Co-Lead Manifold Developer" bio="No bio"/>
              <TeamMember name="Brandon B." title="Assistant to the Marketing Manager" bio="No bio"/>
              <TeamMember name="Bruce Conrad" title="Lead KRL developer" bio="No bio"/>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default MeetTheTeam;

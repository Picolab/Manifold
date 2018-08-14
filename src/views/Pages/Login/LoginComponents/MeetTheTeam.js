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
          <Col>
            <Media className="teamMemberPic" object src={theTeam} alt="The Picolabs Team"/>
              <div className="teamMemberContainer">
                <TeamMember name="Bruce Conrad" title="Lead KRL developer" bio="Writes code to prove concepts"/>
                <TeamMember name="Thomas Lewis" title="Co-Lead Manifold Developer" bio="Kale mid"/>
                <TeamMember name="Connor Grimm" title="Lead Manifold Developer" bio="Enjoys movies, the occasional anime, and casual volleyball"/>
                <TeamMember name="Jace Kandare" title="Marketing Manager and Lead Safe And Mine Developer" bio="No bio"/>
                <TeamMember name="Brandon Bingham" title="Assistant to the Marketing Manager" bio="No bio"/>
              </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default MeetTheTeam;

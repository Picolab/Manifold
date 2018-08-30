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
                <TeamMember name="Bruce Conrad" title="Lead KRL developer" bio="I've driven this herd of programmers for miles"/>
                <TeamMember name="Thomas Lewis" title="Co-Lead Manifold Developer" bio="I play video games and work on creative projects"/>
                <TeamMember name="Connor Grimm" title="Lead Manifold Developer" bio="I enjoy movies, the occasional anime, and casual volleyball"/>
                <TeamMember name="Jace Kandare" title="Marketing Manager and Lead Safe And Mine Developer" bio="Unlike some people, I like programming"/>
                <TeamMember name="Brandon Bingham" title="Assistant to the Lead KRL developer" bio="Likes: robotics, blacksmithing, Iaido, swimming, running, cooking, painting, etc. Dislikes: Programming."/>
              </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default MeetTheTeam;

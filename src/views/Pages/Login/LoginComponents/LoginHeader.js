import React, { Component } from 'react';
import { Jumbotron, Media } from 'reactstrap';
import manifoldImg from '../../../../images/manifold_logo.png';

class LoginHeader extends Component {
  render() {
    return (
      <Jumbotron fluid className="loginJumbo">
        <Media object src={manifoldImg} alt="Manifold Image" className="loginLogo"/>
      </Jumbotron>
    )
  }
}

export default LoginHeader;

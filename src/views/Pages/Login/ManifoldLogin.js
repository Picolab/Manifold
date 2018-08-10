import React, { Component } from 'react';
import LoginHeader from './LoginComponents/LoginHeader';
import LoginBody from './LoginComponents/LoginBody';
import './loginStyles.css';

export class ManifoldLogin extends Component {

  render() {
    return(
      <div>
        <LoginHeader />
        <LoginBody />
      </div>
    )
  }
}

ManifoldLogin.propTypes = {
}

export default ManifoldLogin;

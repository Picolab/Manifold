import React, { Component } from 'react'

const githubOauthURL = "https://github.com/login/oauth/authorize?client_id=cbd2a7be284251f4f295"

class GithubButton extends Component {
  constructor(props) {
    super(props);

    this.startOauth = this.startOauth.bind(this);
  }

  startOauth() {
    window.location.assign(githubOauthURL);
  }

  render() {
    return (
      <div className="githubBtn" onClick={this.startOauth}>
        <i className="fa fa-github fa-lg githubIcon"></i>
        <div className="githubText">Sign in with Github</div>
      </div>
    )
  }
}

export default GithubButton;

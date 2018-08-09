import React, { Component } from 'react';
import { getOauthURI } from '../../../utils/AuthService';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hostname: "",
      clientID: "",
      clientSecret: ""
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault()
    const { hostname, clientSecret, clientID } = this.state;
    console.log("client_id", clientID);
    console.log("state", this.state);
    console.log("hostname", hostname);
    console.log("URL", getOauthURI(hostname, clientSecret));
    window.location.assign(getOauthURI(hostname, clientSecret, clientID));
  }

  onChange(stateKey) {
    return (event) => {
      this.setState({
        [stateKey]: event.target.value
      })
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card-group mb-0">

                <div className="card p-4">
                  <form className="card-block" onSubmit={this.onSubmit}>
                    <h1>Authorize</h1>
                    <p className="text-muted">Enter your servers information</p>
                    <div className="input-group mb-3">
                      <span className="input-group-addon"><i className="icon-globe"></i></span>
                      <input type="text" className="form-control" placeholder="Hostname" name="hostname" value={this.state.hostname} onChange={this.onChange('hostname')}/>
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-addon"><i className="icon-user"></i></span>
                      <input type="text" className="form-control" placeholder="Client ID" name="clientID" value={this.state.clientID} onChange={this.onChange('clientID')}/>
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-addon"><i className="icon-key"></i></span>
                      <input type="password" className="form-control" placeholder="Client Secret" name="clientSecret" value={this.state.clientSecret} onChange={this.onChange('clientSecret')}/>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <button type="submit" className="btn btn-primary px-4">Authorize</button>
                      </div>
                      <div className="col-6 text-right">
                        <button type="button" className="btn btn-link px-0">Forgot password?</button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="card card-inverse card-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <div className="card-block text-center">
                    <div>
                      <h2>PicoLabs Engine</h2>
                      <p>Use PicoLabs cloud service!</p>
                      <button
                        type="button"
                        className="btn btn-primary active mt-3"
                        onClick = {()=>{window.location.assign(getOauthURI())}}
                        >
                        Authorize</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

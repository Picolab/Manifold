import React, { Component } from 'react';
import {Field, reduxForm} from 'redux-form';
import { connect } from 'react-redux';
import { getOauthURI } from '../../../utils/AuthService';

class Login extends Component {
  onSubmit(values) {
    const { hostname, client_secret,client_id } = values;
    console.log("client_id", client_id);
    console.log("values", values);
    console.log("hostname", hostname);
    console.log("URL", getOauthURI(hostname, client_secret));
    window.location.assign(getOauthURI(hostname, client_secret, client_id));
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card-group mb-0">
                <div className="card p-4">
                  <form className="card-block" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                    <h1>Authorize</h1>
                    <p className="text-muted">Enter your server's information</p>
                    <div className="input-group mb-3">
                      <span className="input-group-addon"><i className="icon-globe"></i></span>
                      <Field type="text" className="form-control" placeholder="Hostname" name="hostname" component="input"/>
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-addon"><i className="icon-user"></i></span>
                      <Field type="text" className="form-control" placeholder="Client ID" name="client_id" component="input"/>
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-addon"><i className="icon-key"></i></span>
                      <Field type="password" className="form-control" placeholder="Client Secret" name="client_secret" component="input"/>
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

export default reduxForm({
  form: "login"
})(Login);

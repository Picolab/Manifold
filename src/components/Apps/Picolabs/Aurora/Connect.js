import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

export default class Connect extends Component {

  constructor(props) {
    super(props);

    this.state = {
      auth: "",
      host: ""
    }
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      this.setState({
        [stateKey]: value
      })
    }
  }

  connect() {
    return (event) => {
      this.props.connect(this.state.host, this.state.auth);
    }
  }

  render() {
    return(
      <Form>
        <p><b>Connect to the Aurora:</b></p>
        <FormGroup>
          <Label>Host:</Label>
          <Input type="text" name="host" id="host" value={this.state.host} onChange={this.onChange('host')} />
        </FormGroup>
        <FormGroup>
          <Label>Auth Token:</Label>
          <Input type="text" name="auth" id="auth" value={this.state.auth} onChange={this.onChange('auth')} />
        </FormGroup>
        <Button onClick={this.connect()} color="primary" >Connect</Button>
      </Form>
    );
  }

}

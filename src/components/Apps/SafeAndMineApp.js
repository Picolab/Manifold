import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

export class SafeAndMineApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      phone: "",
      message: "",
      savedName: "",
      savedEmail: "",
      savedPhone: "",
      savedMessage: ""
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.retrieveInformation = this.retrieveInformation.bind(this);
  }

  componentDidMount() {
    this.retrieveInformation();
  }

  retrieveInformation() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.safeandmine",
      funcName: "getInformation"
    });

    promise.then((resp) => {
      const { name = "", email = "", phone = "", message = ""} = resp.data;
      this.setState({
        savedName: name,
        savedEmail: email,
        savedPhone: phone,
        savedMessage: message
      })
    }).catch((e) => {
      console.error("Error loading safeandmine information", e);
    })
  }

  onSubmit(e) {
    e.preventDefault();
    const state = this.state;
    let attrs = {};
    for(var key in state) {
      const value = state[key];
      if(value) {//and any other checks
        attrs[key] = value;
      }
    }
    const promise = this.props.signalEvent({
      domain: "safeandmine",
      type: "update",
      attrs
    });
    promise.then(() => {
      this.retrieveInformation();
    }).catch((e) => {
      console.error(e);
    })
  }

  onChange(stateKey) {
    return (event) => {
      this.setState({
        [stateKey]: event.target.value
      })
    }
  }

  render() {
    return(
      <div>
        <h1>Safe and Mine</h1>
        <p>Use safe and mine to help find lost things! Attach a tag to anything you want to keep safe. If you lose that item and someone scans the tag, they will see a custom message just from you. Below is a preview of what your message looks like. You can modify this message below.</p>

        <h3>Current Settings:</h3>
        <p>Name: {this.state.savedName}</p>
        <p>Email: {this.state.savedEmail}</p>
        <p>Phone: {this.state.savedPhone}</p>
        <p>Message: {this.state.savedMessage}</p>

        <h3>Update Settings:</h3>
        <Form onSubmit={this.onSubmit} >
          <FormGroup>
            <Label for="Name">Your Name</Label>
            <Input type="text" name="name" id="Name" placeholder="Brigham Young" value={this.state.name} onChange={this.onChange('name')} />
          </FormGroup>
          <FormGroup>
            <Label for="Email">Email</Label>
            <Input type="text" name="email" id="Email" placeholder="brigham.young@byu.edu" value={this.state.email} onChange={this.onChange('email')} />
          </FormGroup>
          <FormGroup>
            <Label for="Phone">Phone</Label>
            <Input type="text" name="phone" id="Phone" placeholder="801-123-4567" value={this.state.phone} onChange={this.onChange('phone')} />
          </FormGroup>
          <FormGroup>
            <Label for="Message">Your Message</Label>
            <Input type="text" name="message" id="Message" placeholder="Hey! I just lost my backpack...$4,000,000,000 reward!" value={this.state.message} onChange={this.onChange('message')} />
          </FormGroup>
          <Button>Save</Button>
        </Form>
      </div>
    )
  }
}

SafeAndMineApp.propTypes = {
}

export default SafeAndMineApp;

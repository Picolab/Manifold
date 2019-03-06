import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
import { getCookie } from '../../../utils/manifoldSDK';

class RegistryModal extends Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.submitRegister = this.submitRegister.bind(this);

    this.state = {
      open: getCookie("scoreTracker") ? false : true,
      first: '',
      last: '',
      phoneNum: '',
      recoveryCode: ''
    }
  }

  toggle() {
    this.setState({
      open: !this.state.open
    })
  }

  onChange(name) {
    return (e) => {
      this.setState({
        [name]: e.target.value
      })
    }
  }

  submitRegister() {
    if(!this.state.first || !this.state.last || !this.state.phoneNum) {
      return; //missing attributes...
    }
  }

  isValid(name) {
    if(this.state[name]) {
      return true;
    }
    return false;
  }

  register() {
    return (
      <Modal isOpen={this.state.open} >
      <ModalHeader>Sign Up to Participate</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
          <Label for="first">First Name</Label>
          <Input type="text" name="firstName" id="first" placeholder="ex. John" onChange={this.onChange('first')}/>
        </FormGroup>
        <FormGroup>
          <Label for="last">Last Name</Label>
          <Input type="text" name="lastName" id="last" placeholder="ex. Smith" onChange={this.onChange('last')}/>
        </FormGroup>
        <FormGroup>
          <Label for="phone">Phone Number</Label>
          <Input type="text" name="phone" id="phone" placeholder="ex. 555-555-5555" onChange={this.onChange('phoneNum')}/>
        </FormGroup>
      </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={this.submitRegister}>Register</Button>
      </ModalFooter>
    </Modal>
    );
  }

  recover() {
    return (
      <Modal isOpen={this.state.open} >
      <ModalHeader>Sign Up to Participate</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="recoveryCode">Recovery Code</Label>
            <Input type="text" name="recoveryCode" id="recoveryCode" placeholder="xxxx-xxxxx-xxxxx" onChange={this.onChange('recoveryCode')}/>
          </FormGroup>
        </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.submitRegister}>Register</Button>
        </ModalFooter>
      </Modal>
      );
  }

  render() {
    return(
      <div>


              {this.recover()}


      </div>
    );
  }
}

export default RegistryModal;

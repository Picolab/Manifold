import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
//import { SCORE_WRAPPER_DID } from '../../../utils/config.js';

function getTracker() {
  let stored = localStorage.getItem("scoreTracker");
  console.log(stored);
  return stored;
}

class RegistryModal extends Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.submitRegister = this.submitRegister.bind(this);
    this.submitRecover = this.submitRecover.bind(this);
    this.switchViews = this.switchViews.bind(this);

    this.state = {
      registerView: true,
      open: (getTracker()) ? false : true,
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
    //var promise = customEvent(SCORE_WRAPPER_DID, "score_wrapper", "new_participant", {first: this.state.first, last: this.state.last, phoneNum: this.state.phoneNum}, "register")

    /*promise.then((resp) => {
      let cookie = resp.data.directives[0].options.cookie;
      window.localStorage.setItem("scoreTracker", cookie.split(";")[0].split("=")[1]);
      this.setState({open : (getTracker()) ? false : true});
      this.props.getStanding();
    });*/
  }

  submitRecover() {
    if(!this.state.recoveryCode) {
      return; //missing attributes...
    }
    //var promise = customEvent(SCORE_WRAPPER_DID, "score_wrapper", "recovery_needed", {first: this.state.first, last: this.state.last, recoveryCode: this.state.recoveryCode}, "recover")

    /*promise.then((resp) => {
      let cookie = resp.data.directives[0].options.cookie;
      window.localStorage.setItem("scoreTracker", cookie.split(";")[0].split("=")[1]);
      this.setState({open : (getTracker()) ? false : true});
    });*/

  }

  switchViews() {
    this.setState({
      registerView: !this.state.registerView
    });
  }

  isValid(name) {
    if(this.state[name]) {
      return true;
    }
    return false;
  }

  modal() {
    if(this.state.registerView) return this.register();
    else return this.recover();
  }

  register() {
    return (
      <div>
      <ModalHeader>Sign Up to Participate</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
          <Label for="first">First Name</Label>
          <Input type="text" name="firstName" id="first" placeholder="ex. John" onChange={this.onChange('first')} value={this.state.first}/>
        </FormGroup>
        <FormGroup>
          <Label for="last">Last Name</Label>
          <Input type="text" name="lastName" id="last" placeholder="ex. Smith" onChange={this.onChange('last')} value={this.state.last}/>
        </FormGroup>
        <FormGroup>
          <Label for="phone">Phone Number</Label>
          <Input type="text" name="phone" id="phone" placeholder="ex. 555-555-5555" onChange={this.onChange('phoneNum')} value={this.state.phoneNum}/>
        </FormGroup>
      </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={this.switchViews}>Recover Points</Button>
        <Button color="primary" onClick={this.submitRegister}>Register</Button>
      </ModalFooter>
      </div>
    );
  }

  recover() {
    return (
      <div>
      <ModalHeader>Recover Your Points</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="first">First Name</Label>
            <Input type="text" name="firstName" id="first" placeholder="ex. John" onChange={this.onChange('first')} value={this.state.first}/>
          </FormGroup>
          <FormGroup>
            <Label for="last">Last Name</Label>
            <Input type="text" name="lastName" id="last" placeholder="ex. Smith" onChange={this.onChange('last')} value={this.state.last}/>
          </FormGroup>
          <FormGroup>
            <Label for="recoveryCode">Recovery Code</Label>
            <Input type="text" name="recoveryCode" id="recoveryCode" placeholder="xxxx-xxxxx-xxxxx" value={this.state.recoveryCode} onChange={this.onChange('recoveryCode')}/>
          </FormGroup>
        </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.switchViews}>Back</Button>
          <Button color="primary" onClick={this.submitRecover}>Recover</Button>
        </ModalFooter>
      </div>
      );
  }

  render() {
    return(
      <div>
        <Modal isOpen={this.state.open} >
          {this.modal()}
        </Modal>
      </div>
    );
  }
}

export default RegistryModal;

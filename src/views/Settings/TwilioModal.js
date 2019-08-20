import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import {customEvent, customQuery} from '../../utils/manifoldSDK';
import {getManifoldECI} from '../../utils/AuthService';

class TwilioModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
    this.getToPhone = this.getToPhone.bind(this);
    this.getFromPhone = this.getFromPhone.bind(this);
    this.setToPhone = this.setToPhone.bind(this);
    this.setFromPhone = this.setFromPhone.bind(this);
  }

  componentDidMount() {
    this.getToPhone();
    this.getFromPhone();
    this.getToken();
    this.getSID();
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      this.setState({
        [stateKey]: value
      })
    }
  }

  saveInputs = () =>{
    this.setToPhone();
    this.setFromPhone();
    this.setToken();
    this.setSID();
    this.toggle();
  }

  getToken() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    let promise = customQuery(getManifoldECI(),"io.picolabs.twilio_notifications", "getToken", {"rs": app_name, "id": id});

    promise.then((resp) => {
        this.setState({
          token: resp.data
        });
    })
  }

  setToken() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    customEvent( getManifoldECI(), "twilio", "set_Token", {"token": this.state.token, "ruleSet": app_name, "id": id}, 'setToken');
  }

  getSID() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    let promise = customQuery(getManifoldECI(),"io.picolabs.twilio_notifications", "getSID", {"rs": app_name, "id": id});

    promise.then((resp) => {
        this.setState({
          sid: resp.data
        });
    })
  }

  setSID() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    customEvent( getManifoldECI(), "twilio", "set_SID", {"sid": this.state.sid, "ruleSet": app_name, "id": id}, 'setSID');
  }

  getToPhone() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    let promise = customQuery(getManifoldECI(),"io.picolabs.twilio_notifications", "getToPhone", {"rs": app_name, "id": id});

    promise.then((resp) => {
        this.setState({
          toPhone: resp.data
        });
    })
  }

  setToPhone() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    customEvent( getManifoldECI(), "twilio", "set_toPhone", {"toPhone": this.state.toPhone, "ruleSet": app_name, "id": id}, 'toPhoneSet');
  }

  getFromPhone() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    let promise = customQuery(getManifoldECI(),"io.picolabs.twilio_notifications", "getFromPhone", {"rs": app_name, "id": id});

    promise.then((resp) => {
        this.setState({
          fromPhone: resp.data
        });
    })
  }

  setFromPhone() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    customEvent( getManifoldECI(), "twilio", "set_fromPhone", {"fromPhone": this.state.fromPhone, "ruleSet": app_name, "id": id}, 'fromPhoneSet');
  }


  render() {
    return (
      <span>
        <a className="edit-link" onClick={this.toggle}>Edit</a>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Twilio Settings</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup row>
                <Label for="sid" sm={4}>Account SID</Label>
                <Col sm={10}>
                  <Input type="sid" name="sid" id="sid" placeholder="Account SID" value={this.state.sid} onChange={this.onChange('sid')}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="token" sm={4}>Account Token</Label>
                <Col sm={10}>
                  <Input type="token" name="token" id="token" placeholder="Account Token" value={this.state.token} onChange={this.onChange('token')}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="twilioNumber" sm={4}>Twilio Number</Label>
                <Col sm={10}>
                  <Input type="twilioNumber" name="twilioNumber" id="twilioNumber" placeholder="Twilio Number" value={this.state.fromPhone} onChange={this.onChange('fromPhone')}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="toPhone" sm={4}>To Phone</Label>
                <Col sm={10}>
                  <Input type="toPhone" name="toPhone" id="toPhone" placeholder="To Phone" value={this.state.toPhone} onChange={this.onChange('toPhone')}/>
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.saveInputs}>Save</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </span>
    );
  }
}

export default TwilioModal;

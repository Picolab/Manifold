import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import {customEvent, customQuery} from '../../utils/manifoldSDK';
import {getManifoldECI} from '../../utils/AuthService';

class EmailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
    this.getRecipient = this.getRecipient.bind(this);
    this.setRecipient = this.setRecipient.bind(this);
  }

  componentDidMount() {
    this.getRecipient();
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
    this.setRecipient();
    this.toggle();
  }

  getRecipient() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    let promise = customQuery(getManifoldECI(),"io.picolabs.manifold.email_notifications", "getRecipient", {"rs": app_name, "id": id});

    promise.then((resp) => {
        this.setState({
          recipient: resp.data
        });
    })
  }

  setRecipient() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    customEvent( getManifoldECI(), "email", "set_recipient", {"recipient": this.state.recipient, "ruleSet": app_name, "id": id}, 'setting recipient');
  }


  render() {
    return (
      <span>
        <a className="edit-link" onClick={this.toggle}>Edit</a>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Email Settings</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup row>
                <Label for="recipient" sm={4}>Recipient</Label>
                <Col sm={10}>
                  <Input type="recipient" name="recipient" id="recipient" placeholder="Recipient" value={this.state.recipient} onChange={this.onChange('recipient')}/>
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

export default EmailModal;

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import {customEvent, customQuery} from '../../utils/manifoldSDK';
import {getManifoldECI} from '../../utils/AuthService';

class TextMessageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
    this.getToPhone = this.getToPhone.bind(this);
    this.setToPhone = this.setToPhone.bind(this);
  }

  componentDidMount() {
    this.getToPhone();
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
    this.toggle();
  }

  getToPhone() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    let promise = customQuery(getManifoldECI(),"io.picolabs.manifold.text_message_notifications", "getToPhone", {"rs": app_name, "id": id});

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
    customEvent( getManifoldECI(), "text_messenger", "set_toPhone", {"toPhone": this.state.toPhone, "ruleSet": app_name, "id": id}, 'setting toPhone');
  }


  render() {
    return (
      <span>
        <a className="edit-link" onClick={this.toggle}>Edit</a>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Text Message Settings</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup row>
                <Label for="toPhone" sm={4}>To Phone</Label>
                <Col sm={10}>
                  <Input type="text" pattern="[2-9][0-9]{2}[2-9][0-9]{2}[0-9]{4}" name="toPhone" id="toPhone" placeholder="Phone Number" value={this.state.toPhone} onChange={this.onChange('toPhone')}/>
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

export default TextMessageModal;

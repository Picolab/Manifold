import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import {customEvent, customQuery} from '../../utils/manifoldSDK';
import {getManifoldECI} from '../../utils/AuthService';

class ProwlModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
    this.getProwlAPIKey = this.getProwlAPIKey.bind(this);
    this.setProwlAPIKey = this.setProwlAPIKey.bind(this);
  }

  componentDidMount() {
    this.getPriority();
    this.getProwlAPIKey();
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
    this.setProwlAPIKey();
    this.toggle();
  }

  getProwlAPIKey() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    let promise = customQuery(getManifoldECI(),"io.picolabs.prowl_notifications", "getAPIKey", {"rs": app_name, "id": id});

    promise.then((resp) => {
        this.setState({
          prowlAPIKey: resp.data
        });
    })
  }

  setProwlAPIKey() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    customEvent( getManifoldECI(), "prowl", "set_APIKey", {"key": this.state.prowlAPIKey, "ruleSet": app_name, "id": id}, 'prowlAPIKeySet');
  }

  getPriority() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    let promise = customQuery(getManifoldECI(),"io.picolabs.prowl_notifications", "getPriority", {"rs": app_name, "id": id});

    promise.then((resp) => {
        this.setState({
          priority: resp.data
        });
    })
  }

  changePriority(priority) {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    customEvent( getManifoldECI(), "prowl", "set_priority", {"priority": priority, "ruleSet": app_name, "id": id}, 'priorityChange');
  }

  render() {
    return (
      <span>
        <a className="edit-link" onClick={this.toggle}>Edit</a>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Prowl Settings</ModalHeader>
          <ModalBody>
            <div>Priority</div>
            <Input type="select" bsSize="sm" name="priority" className="select" onChange={(event) => {this.changePriority(event.target.value)}}>
              <option selected={(this.state.priority === "-2") ? "selected" : "" } value="-2">Very Low</option>
              <option selected={(this.state.priority === "-1") ? "selected" : "" } value="-1">Moderate</option>
              <option selected={(this.state.priority === "0" || this.state.priority == null) ? "selected" : "" } value="0">Normal</option>
              <option selected={(this.state.priority === "1") ? "selected" : "" } value="1">High</option>
              <option selected={(this.state.priority === "2") ? "selected" : "" } value="2">Emergency</option>
            </Input>
            <Form>
              <FormGroup row>
                <Label for="prowlAPIKey" sm={4}>Prowl API Key</Label>
                <Col sm={10}>
                  <Input type="prowlAPIKey" name="prowlAPIKey" id="prowlAPIKey" placeholder="Prowl API Key" value={this.state.prowlAPIKey} onChange={this.onChange('prowlAPIKey')}/>
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

export default ProwlModal;

import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, FormText,Dropdown, DropdownMenu, DropdownToggle, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import { customEvent } from '../../utils/manifoldSDK';

const brandPrimary =  '#20a8d8';
const brandSuccess =  '#4dbd74';
const brandInfo =     '#63c2de';
const brandDanger =   '#f86c6b';

class JournalTemplate extends Component {
  constructor(props) {
    super(props);

    this.toggleLogModal = this.toggleLogModal.bind(this);
    this.handleLogClick = this.handleLogClick.bind(this);
    this.state = {
      logModal: false,
      LogTitle: "",
      LogEntry: ""
    }
  }

  handleLogClick(){
    const logTitle = this.state.LogTitle;
    const logEntry = this.state.LogEntry;
    this.setState({
      logModal: !this.state.logModal,
      LogTitle: "", // this will reset the title/entry info when you navigate away from the log modal
      LogEntry: ""
    });//reset everything
    if(logTitle != "" && logEntry != ""){
      this.props.dispatch({
        type: 'command',
        command: customEvent,
        params: [this.props.eci, "journal", "new_entry", {"title": logTitle, "memo": logEntry}],
        query: { type: 'DISCOVERY', eci: this.props.eci, pico_id: this.props.id },
        delay: "500" //wait a half second
      });
    }
  }

  toggleLogModal() {
    this.setState({
      logModal: !this.state.logModal,
      LogTitle: "", // this will reset the title/entry info when you navigate away from the log modal
      LogEntry: ""
    });
  }

  createEntry(entry, index) {
    console.log("create entry",entry);
    return(
      <div key={index}>
        {entry.title}: {entry.memo}
      </div>
    );
  }

  entryForm(){
    return(
      <div>
        <Form>
          <FormGroup>
            <Label for="entryName">Title for entry</Label>
            <Input type="text" name="LogTitle" id="Title" placeholder="Title"
              onChange={(element) => this.setState({ LogTitle: element.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label for="exampleText">Log your info here</Label>
            <Input type="textarea" name="text" id="entryText" placeholder="ex. Replaced the air filter"
              onChange={(element) => this.setState({ LogEntry: element.target.value})} />
          </FormGroup>
        </Form>
      </div>
    );
  }

  render(){
    console.log("props",
      this.props
    );
    return (
      <div>
        <p style={{verticalAlign:"top", textAlign:"center"}}>{this.props.header}</p>
        <button style={{position: "absolute", top: "50px", right: "8px"}} className="btn btn-primary btn-sm" onClick={() => this.toggleLogModal()}>+</button>

        {this.props.entries.map(this.createEntry)}

        <Modal isOpen={this.state.logModal}  className={'modal-primary'}>
          <ModalHeader >Make an Entry </ModalHeader>
          <ModalBody>
            {this.entryForm()}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleLogClick}>Log entry</Button>
            <Button color="secondary" onClick={this.toggleLogModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  if(state.identities){
    return {
       identities: state.identities
    }
  }else{
    return {}
  }
}

export default connect(mapStateToProps)(JournalTemplate);

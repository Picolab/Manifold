import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';

const brandPrimary =  '#20a8d8';
const brandSuccess =  '#4dbd74';
const brandInfo =     '#63c2de';
const brandDanger =   '#f86c6b';

class JournalTemplate extends Component {
  constructor(props) {
    super(props);

    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.state = {
      addModal: false,
      name: ""
    }
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal,
      name: "" // this will reset the name when you navigate away from the add thing modal
    });
  }

  createEntry(entry) {
    console.log(entry);
    return(
      <div>
        {entry.title}: {entry.data}
      </div>
    );
  }

  render(){
    console.log("props",
      this.props.entries
    );
    return (
      <div>
        <p style={{verticalAlign:"top", textAlign:"center"}}>{this.props.header}</p>
        <button style={{position: "absolute", top: "50px", right: "8px"}} className="btn btn-primary btn-sm" onClick={() => this.toggleAddModal()}>+</button>

        {this.props.entries.map(this.createEntry)}
      </div>
    );
  }
}

export default connect()(JournalTemplate);

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import "./Advanced.css"
import { displayError } from '../../../../../utils/manifoldSDK';

class DeleteConnectionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.deleteConnection = this.deleteConnection.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  deleteConnection() {
    const promise = this.props.signalEvent({
      domain: "aca",
      type: "deleted_connection",
      attrs: {
        their_vk: this.props.their_vk
      }
    });
    promise.then((resp) => {
      this.props.getConnections();
      if(this.props.returnToConnections) {
        this.props.returnToConnections();
      }
    }).catch((e) => {
        displayError(true, "Error deleting connection.", 404);
        console.error("Error deleting connection.", e);
    });
  }


  render() {
    return (
      <div>
        <button className="deleteConnectionButton" onClick={this.toggle}>Delete Connection</button>
        <Modal isOpen={this.state.modal}>
          <ModalHeader>Delete Connection?</ModalHeader>
          <ModalBody>
            Are you sure you want to delete the connection?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.deleteConnection}>Delete Connection</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default DeleteConnectionModal;

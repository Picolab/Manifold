import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import "./ConnectionInfo.css";

class RemovePingModal extends React.Component {

  constructor (props) {
    super(props);

  	this.state = {
      modal: false
  	}
    this.removePing = this.removePing.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  removePing() {
    const promise = this.props.signalEvent({
      domain:"sovrin",
      type:"remove_trust_pings",
      attrs: {
      }
    })
    promise.then((resp) => {
      this.props.canPing()
      this.toggle()
    })
  }

  render() {
    return (
      <div>
        <div style={{"float": "left"}} onClick={this.toggle} className="linkText">Remove Ping?</div>
        <Modal isOpen={this.state.modal}>
          <ModalHeader>Remove ping capability?</ModalHeader>
          <ModalBody>
            Are you sure you want to remove the ability to ping for your agent?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.removePing}>Remove Ping</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default RemovePingModal;

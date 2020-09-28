import React, { useState } from 'react';
import { styles } from './ModalStyles';
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, Button } from 'reactstrap';

class JoinGameModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      receivedInvitation: ""
    };
    this.toggle = this.toggle.bind(this);
    this.receiveInvitation = this.receiveInvitation.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  receiveInvitation() {
    let attributes = { uri: this.state.receivedInvitation }
    const promise = this.props.signalEvent({
      domain : "didcomm",
      type: "message",
      attrs : attributes
    })
    promise.then((resp) => {
      this.setState({
        receivedInvitation: ""
      });
      this.toggle();
    })
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      this.setState({
        [stateKey]: value
      })
    }
  }

  render() {

    return (
      <div>
        {this.props.hasCharacter ? <button className="D-DButton" onClick={this.toggle}> Join Game </button> : <button className="DisabledD-DButton" > Join Game </button>}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader style={styles.modalContent} toggle={this.toggle}>Join Game</ModalHeader>
          <ModalBody style={styles.modalContent}>
            <div className="recGameInvitationContainer">
                <div> Game Invitation </div>
                <Input type="text" name="invitation" placeholder="Receive Invitation" className="recInvitationInput" value={this.state.receivedInvitation} onChange={this.onChange('receivedInvitation')}/>
                <Button className="D-DButton" style={{"margin": "auto"}} onClick={this.receiveInvitation}>Receive</Button>
              </div>
          </ModalBody>
          <ModalFooter style={styles.modalFooter} className="createGameModalFooter">
            <button className="D-DButton" onClick={this.toggle}>Cancel</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default JoinGameModal;

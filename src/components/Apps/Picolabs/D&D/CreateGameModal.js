import React, { useState } from 'react';
import { styles } from './ModalStyles';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class CreateGameModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  createGame() {
    this.toggle();
    this.props.changeCurrentPage("CreateGame");
  }

  render() {

    return (
      <div>
        <button className="D-DButton" onClick={this.toggle}> Create Game </button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader style={styles.modalContent} toggle={this.toggle}>Create Game</ModalHeader>
          <ModalBody style={styles.modalContent}>
            Are you sure you want to create a D&D game?
          </ModalBody>
          <ModalFooter style={styles.modalFooter} className="createGameModalFooter">
            <button className="D-DButton" onClick={()=>{this.createGame();}}>Yes</button>{' '}
            <button className="D-DButton" onClick={this.toggle}>No</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default CreateGameModal;

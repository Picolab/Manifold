import React, { useState } from 'react';
import { styles } from './ModalStyles';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { displayError } from '../../../../utils/manifoldSDK';

class CreateGameModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
    };
    this.toggle = this.toggle.bind(this);
    this.createGame = this.createGame.bind(this);
    this.checkGameCreation = this.checkGameCreation.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  createGame() {
    this.setState({
      loading: true
    })
    let promise = this.props.signalEvent({
      domain : "dnd",
      type: "create_game"
    });
    promise.then((resp) => {
      setTimeout(this.checkGameCreation, 3000);
    }).catch((e) => {
      displayError(true, "Error getting creating game.", 404);
      this.setState({
        loading: false
      })
    });
  }

  checkGameCreation() {
    let promise = this.props.manifoldQuery({
      rid: "DND_Game",
      funcName: "getGameStatus"
    });
    promise.then((resp) => {
      if(resp.data.gameEci) {
        this.props.setGameStatus(resp.data)
        this.toggle();
      }
      else {
        displayError(true, "Error creating game.", 500);
      }
      this.setState({
        loading: false
      })
    }).catch((e) => {
        displayError(true, "Error getting Game Status.", 404);
        this.setState({
          loading: false
        })
    });
  }

  displayModalContent() {
    if(this.state.loading) {
      return(
        <div>
          <ModalBody style={styles.modalContent}>
            Creating D&D game...
          </ModalBody>
          <ModalFooter style={styles.modalFooter} className="createGameModalFooter">
          </ModalFooter>
        </div>
      )
    }
    return(
      <div>
        <ModalBody style={styles.modalContent}>
          Are you sure you want to create a D&D game?
        </ModalBody>
        <ModalFooter style={styles.modalFooter} className="createGameModalFooter">
          <button className="D-DButton" onClick={()=>{console.log("onClick"); this.createGame();}}>Yes</button>{' '}
          <button className="D-DButton" onClick={this.toggle}>No</button>
        </ModalFooter>
      </div>
    )
  }

  render() {

    return (
      <div>
        <button className="D-DButton" onClick={this.toggle}> Create Game </button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader style={styles.modalContent} toggle={this.toggle}>Create Game</ModalHeader>
          {this.displayModalContent()}
        </Modal>
      </div>
    );
  }
}

export default CreateGameModal;

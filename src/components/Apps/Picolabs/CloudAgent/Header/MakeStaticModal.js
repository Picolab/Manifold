import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import "./ConnectionDropdown.css";

class MakeStaticModal extends React.Component {

  constructor (props) {
    super(props);

  	this.state = {
      modal: false
  	}
    this.makeStatic = this.makeStatic.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  makeStatic() {
    const promise = this.props.signalEvent({
      domain:"sovrin",
      type:"make_static",
      attrs: {
      }
    })
    promise.then((resp) => {
      this.props.activateActionsToggle();
      this.props.isStatic()
      this.toggle()
    })
  }

  render() {
    return (
      <div>
        <div onClick={()=>{this.props.activateActionsToggle(); this.toggle();}} className="linkText">Make Agent Static?</div>
        <Modal isOpen={this.state.modal}>
          <ModalHeader>Make Agent Static?</ModalHeader>
          <ModalBody>
            Are you sure you want to make your agent static? Doing so would not allow any further connections unless connections are enabled again.
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.makeStatic}>Make Static</Button>{' '}
            <Button color="secondary" onClick={()=>{this.props.activateActionsToggle(); this.toggle();}}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default MakeStaticModal;

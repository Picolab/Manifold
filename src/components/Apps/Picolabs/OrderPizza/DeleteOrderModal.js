
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class DeleteOrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  deleteOrder(e) {
    this.toggle;
    let promise = this.props.signalEvent({
      domain : "delete",
      type: "order",
      attrs : {
        eci:e.target.value
      }
    })

    promise.then(() =>{
      this.props.getChildrenOrders();
    })
  }

  render() {
    return (
      <div>
        <Button color="danger" className="deleteButton" onClick={this.toggle}>X</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={'modal-danger'}>
          <ModalHeader toggle={this.toggle}>Delete Order</ModalHeader>
          <ModalBody>
            Are you sure you want to delete {this.props.title}?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" value={this.props.eci} onClick={this.deleteOrder}>Delete</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default DeleteOrderModal;

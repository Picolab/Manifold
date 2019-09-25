import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class DeleteRouterModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routerHost: this.props.routerHost,
      routerEci: this.props.routerEci,
      routerLabel: this.props.routerLabel,
      deleteRouterModal: false
    };
  }


  render() {
    return (
      <span style={{"width": "100%"}}>
        {this.props.button}
        <Modal isOpen={this.props.deleteRouterModal} backdrop={this.state.backdrop} className={'modal-danger'}>
          <ModalHeader >Delete Router</ModalHeader>
          <ModalBody>
            {this.props.hasRouterConnection ? <div>Router cannot be deleted because it is in use.</div> : <div>Are you sure you want to delete {this.props.routerLabel}?</div> }
          </ModalBody>
          <ModalFooter>
            {this.props.hasRouterConnection ? <Button color="danger" onClick={this.props.deleteRouter} disabled>Delete</Button> : <Button color="danger" onClick={this.props.deleteRouter}>Delete</Button>}{' '}
            <Button color="secondary" onClick={this.props.deleteRouterToggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </span>
    );
  }
}

export default DeleteRouterModal;

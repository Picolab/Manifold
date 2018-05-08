import React, { Component } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

export class CommunitiesModal extends Component {
  render() {
    return (
      <Modal isOpen={this.state.picoCommunitiesModal} className={'modal-info'}>
        <ModalHeader >Communities containing {this.props.name}</ModalHeader>
        <ModalBody>

        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.togglePicoCommunitiesModal}>Close</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default CommunitiesModal

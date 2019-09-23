import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getOwnerECI } from '../../../src/utils/AuthService';
import { customEvent } from '../../../src/utils/manifoldSDK';

class RemoveModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  remove = () => {
    this.removeSection();
    this.props.editModalToggle();
    this.toggle();
    this.props.getOtherInfo();
  }

  removeSection() {
    customEvent( getOwnerECI(), "profile", "other_profile_remove", {"section": this.props.sectionTitle}, "removing_section");
  }

  render() {
    return (
      <div>
        <Button color="danger" onClick={this.toggle}><i className="fa fa-times-circle" aria-hidden="true" onClick={this.toggle}></i>{' '}Remove Section</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={'modal-danger'}>
          <ModalHeader toggle={this.toggle}>Remove {this.props.sectionTitle}</ModalHeader>
          <ModalBody>
            Are you sure you want to remove {this.props.sectionTitle}?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.remove}>Remove</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default RemoveModal;

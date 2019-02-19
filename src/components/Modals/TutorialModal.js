import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Help from '../../views/Help/Help';


export class TutorialModal extends Component {
  constructor(props){
    super(props);

    this.state = {
      modalOn: props.modalOn
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  //this allows the modal to update its state when its props change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      modalOn: nextProps.modalOn
    }
  }



  handleToggle() {
    this.setState({
      rulesetToInstall: ""
    })
    this.props.toggleFunc();
  }

  render() {
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.handleToggle} className={'modal-info'}>
        <ModalHeader toggle={this.handleToggle}>Tutorial</ModalHeader>
        <ModalBody>
          <Help />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.handleToggle}>Got it!</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

TutorialModal.propTypes = {
  //parent provides these
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired
}

export default connect()(TutorialModal)

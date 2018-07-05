import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { commandAction } from '../../actions/command';
import { removeThing } from '../../utils/manifoldSDK';
import { getName, getSubID } from '../../reducers';

export class RemoveThingModal extends Component {
  constructor(props){
    super(props);

    this.state = {};

    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  //this allows the modal to update its state when its props change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      modalOn: nextProps.modalOn
    }
  }

  handleRemoveClick() {
    if(!this.props.name){
      alert("Internal Error! Missing name in props.")
    }
    this.handleToggle();
    this.props.removeThing(this.props.name, this.props.subID);
  }

  handleToggle() {
    this.props.toggleFunc();
  }

  render() {
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.handleToggle} className={'modal-danger'}>
        <ModalHeader toggle={this.handleToggle}>Delete a Thing</ModalHeader>
        <ModalBody>
          Are you sure you want to delete {this.props.name}?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.handleRemoveClick}>Delete Thing</Button>{' '}
          <Button color="secondary" onClick={this.handleToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

RemoveThingModal.propTypes = {
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired,
  removeThing: PropTypes.func.isRequired,
  picoID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  subID: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    name: getName(state, ownProps.picoID),
    subID: getSubID(state, ownProps.picoID)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeThing: (name, subID) => {
      dispatch(commandAction(removeThing, [name, subID]))
    }
  }
}

//connect to redux store so we can get access to dispatch in the props
export default connect(mapStateToProps, mapDispatchToProps)(RemoveThingModal);

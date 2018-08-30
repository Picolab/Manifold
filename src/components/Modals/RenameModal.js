import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, Input } from 'reactstrap';
import { connect } from 'react-redux';
import { renameThing } from '../../utils/manifoldSDK';
import ActionTypes from '../../actions/index';
import PropTypes from 'prop-types';


export class RenameModal extends Component {
  constructor(props){
    super(props);

    this.state = {
      modalOn: props.modalOn,
      changedName: ""
    };

    this.handleRename = this.handleRename.bind(this);
    this.textChange = this.textChange.bind(this);
  }

  //this allows the modal to update its state when its props change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      modalOn: nextProps.modalOn
    }
  }

  textChange(e) {
    this.setState({ changedName : e.target.value });
  }

  handleRename() {
    this.props.renameThing(this.props.picoID, this.state.changedName);
    this.props.toggleFunc();
  }

  render() {
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.props.toggleFunc} className={'modal-info'}>
        <ModalHeader toggle={this.handleToggle}>Rename Thing</ModalHeader>
        <ModalBody>
          <InputGroup>
            <Input placeholder="Enter a new name" value={this.state.changedName} onChange={this.textChange} />
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="info" onClick={this.handleRename}>Rename</Button>
          <Button color="secondary" onClick={this.props.toggleFunc}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

RenameModal.propTypes = {
  //parent provides these
  picoID: PropTypes.string.isRequired,
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    renameThing: (picoID, changedName) => {
        const promise = renameThing(picoID, changedName);
        promise.then(() => {
          dispatch({type: ActionTypes.MANIFOLD_INFO});
        }).catch((e) => {
          console.error("Failure to rename thing", e);
        });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RenameModal)

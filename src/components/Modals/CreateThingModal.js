import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createThing } from '../../utils/manifoldSDK';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { commandAction } from '../../actions/command';

export class CreateThingModal extends Component{
  constructor(props){
    super(props);

    this.state = {
      name: ""
    };

    this.handleAddClick = this.handleAddClick.bind(this);
  }

  //this allows the modal to update its state when its props change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      modalOn: nextProps.modalOn
    }
  }

  handleAddClick() {
    const newName = this.state.name;
    this.props.toggleFunc();
    this.props.createThing(newName);
  }

  render(){
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.props.toggleFunc} className={'modal-primary'}>
        <ModalHeader toggle={this.props.toggleFunc}>Create a new Thing</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label> New Thing's name</label>
            <input type="text" className="form-control" id="name" placeholder="THING NAME" onChange={(element) => this.setState({ name: element.target.value})}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button id="createButton" color="primary" onClick={this.handleAddClick}>Create Thing</Button>{' '}
          <Button id="createCancel" color="secondary" onClick={this.props.toggleFunc}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

CreateThingModal.propTypes = {
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired,
  createThing: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    createThing: (name) => {
      dispatch(commandAction(createThing, [name]))
    }
  }
}

//connect to redux store so we can get access to dispatch in the props
export default connect(null, mapDispatchToProps)(CreateThingModal);

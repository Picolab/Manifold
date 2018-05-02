import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createThing } from '../../utils/manifoldSDK';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';

class CreateThingModal extends Component{
  constructor(props){
    super(props)

    this.state = {
      name: ""
    }
  }
  //this allows the modal to update its state when its props change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      modalOn: nextProps.modalOn,
      toggleFunc: nextProps.toggleFunc
    }
  }

  handleAddClick = () => {
    const newName = this.state.name;
    this.state.toggleFunc();
    this.props.dispatch({
      type: "command",
      command: createThing,
      params: [newName],
      query: { type: 'MANIFOLD_INFO'}
    });
  }

  render(){
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.state.toggleFunc} className={'modal-primary'}>
        <ModalHeader toggle={this.state.toggleFunc}>Create a new Thing</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label> New Thing's name</label>
            <input type="text" className="form-control" id="name" placeholder="THING NAME" onChange={(element) => this.setState({ name: element.target.value})}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleAddClick}>Create Thing</Button>{' '}
          <Button color="secondary" onClick={this.state.toggleFunc}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

CreateThingModal.propTypes = {
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired
}

//connect to redux store so we can get access to dispatch in the props
export default connect()(CreateThingModal);

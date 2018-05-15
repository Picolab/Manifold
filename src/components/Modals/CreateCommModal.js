import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createCommunity } from '../../utils/manifoldSDK';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { commandAction } from '../../actions/command';

export class CreateCommModal extends Component{
  constructor(props){
    super(props);

    this.state = {
      name: ""
    };

    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  //this allows the modal to update its state when its props change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      modalOn: nextProps.modalOn
    }
  }

  handleAddClick() {
    const newName = this.state.name;
    if(!newName || newName === ""){
      alert('Please enter a name.');
      return;
    }
    this.handleToggle();
    this.props.createCommunity(newName);
  }

  handleToggle() {
    //reset the name state, then toggle
    this.setState({name: ""});
    this.props.toggleFunc();
  }

  render(){
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.handleToggle} className={'modal-primary'}>
        <ModalHeader toggle={this.handleToggle}>Create a new Community</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label> New Community's name</label>
            <input type="text" className="form-control" id="name" placeholder="Community Name" onChange={(element) => this.setState({ name: element.target.value})}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button id="createButton" color="primary" onClick={this.handleAddClick}>Create Community</Button>{' '}
          <Button id="createCancel" color="secondary" onClick={this.handleToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

CreateCommModal.propTypes = {
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired,
  createCommunity: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    createCommunity: (name) => {
      dispatch(commandAction(createCommunity, [name]))
    }
  }
}

//connect to redux store so we can get access to dispatch in the props
export default connect(null, mapDispatchToProps)(CreateCommModal);

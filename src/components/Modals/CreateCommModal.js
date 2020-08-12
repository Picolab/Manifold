import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import IconSelector from './CreateThingModal/IconSelector';
import { createCommunity } from '../../utils/manifoldSDK';
import { connect } from 'react-redux';
import { commandAction } from '../../actions/command';

export class CreateCommModal extends Component{
  constructor(props){
    super(props);

    this.state = {
      name: "",
      iconSelector: "",
      icon: ""
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
    this.props.createCommunity(newName, this.state.icon);
    this.handleToggle();
  }

  handleToggle() {
    //reset the name state, then toggle
    this.setState({name: "", iconSelector: ""});
    this.props.toggleFunc();
  }

  handleNextClick = () => {
    if (this.state.name !== "") this.setState({ iconSelector: this.state.name})
  }

  createButton = () => {
    if (this.state.iconSelector) {
      return (<Button id="createButton" color="primary" onClick={this.handleAddClick}>Create Community</Button>);
    }
    else {
      return (<Button id="createButton" color="primary" onClick={this.handleNextClick}>Next</Button>);
    }
  }

  modalBody = () => {
    if (this.state.iconSelector) {
      return (
        <ModalBody>
          <IconSelector search={this.state.iconSelector} selected={this.state.icon} setSelected={(icon) => { this.setState({icon}); }} />
        </ModalBody>
      );
    }
    else {
      return (
        <ModalBody>
          <div className="form-group">
            <label> New Community's name</label>
            <input type="text" className="form-control" id="name" placeholder="Community Name" onChange={(element) => this.setState({ name: element.target.value})}/>
          </div>
        </ModalBody>
      );
    }
  }

  render(){
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.handleToggle} className={'modal-primary'}>
        <ModalHeader toggle={this.handleToggle}>Create a new Community</ModalHeader>
          {this.modalBody()}
        <ModalFooter>
          {this.createButton()}
          <Button id="createCancel" color="secondary" onClick={this.handleToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CreateCommModal.propTypes = {
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired,
  createCommunity: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    createCommunity: (name, icon) => {
      dispatch(commandAction(createCommunity, [name, icon], {delay : 500} ))
    }
  }
}

//connect to redux store so we can get access to dispatch in the props
export default connect(null, mapDispatchToProps)(CreateCommModal);

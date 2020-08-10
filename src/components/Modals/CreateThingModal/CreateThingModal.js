import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createThing } from '../../../utils/manifoldSDK';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { commandAction } from '../../../actions/command';
import IconSelector from './IconSelector';

export class CreateThingModal extends Component{
  constructor(props){
    super(props);

    this.state = {
      name: "",
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
    this.handleToggle();
    this.props.createThing(newName);

  }

  handleToggle() {
    //reset the name state, then toggle
    this.setState({name: "", icon: ""});
    this.props.toggleFunc();
  }

  handleNextClick = () => {
    if (this.state.name !== "") this.setState({ icon: this.state.name})
  }

  createButton = () => {
    if (this.state.icon) {
      return (<Button id="createButton" color="primary" onClick={this.handleAddClick}>Create Thing</Button>);
    }
    else {
      return (<Button id="createButton" color="primary" onClick={this.handleNextClick}>Next</Button>);
    }
  }

  modalBody = () => {
    if (this.state.icon) {
      return (
        <ModalBody>
          <IconSelector search={this.state.icon} />
        </ModalBody>
      );
    }
    else {
      return (
        <ModalBody>
          <div className="form-group">
            <label> New Thing's name</label>
            <input type="text" className="form-control" id="name" placeholder="THING NAME" onChange={(element) => this.setState({ name: element.target.value})}/>
          </div>
        </ModalBody>
      );
    }

  }

  render(){
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.handleToggle} className={'modal-primary'}>
        <ModalHeader toggle={this.handleToggle}>Create a new Thing</ModalHeader>
        {this.modalBody()}
        <ModalFooter>
          {this.createButton()}
          <Button id="createCancel" color="secondary" onClick={this.handleToggle}>Cancel</Button>
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
      dispatch(commandAction(createThing, [name], {delay : 500} ))
    }
  }
}

//connect to redux store so we can get access to dispatch in the props
export default connect(null, mapDispatchToProps)(CreateThingModal);

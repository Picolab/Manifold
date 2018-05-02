import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';

class RegisterRulesetModal extends Component{
  constructor(props){
    super(props)

    this.state = {
      url: ""
    }
  }
  //this allows the modal to update its state when its props change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      modalOn: nextProps.modalOn,
      toggleFunc: nextProps.toggleFunc
    }
  }

  handleRegClick = () => {
    alert("Sorry, this isn't implemented yet!")
    this.state.toggleFunc()
  }

  render(){
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.state.toggleFunc} className={'modal-info'}>
        <ModalHeader toggle={this.state.toggleFunc}>Register a new Ruleset</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label> App url to register: </label>
            <input type="text" className="form-control" id="url" placeholder="Lord Sauron" onChange={(element) => this.setState({ url: element.target.value})}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="info" onClick={this.handleRegClick}>Register it</Button>{' '}
          <Button color="secondary" onClick={this.state.toggleFunc}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

RegisterRulesetModal.propTypes = {
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired
}

//connect to redux store so we can get access to dispatch in the props
export default connect()(RegisterRulesetModal);

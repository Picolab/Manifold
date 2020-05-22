import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toggleErrorModal, clearErrorModal } from '../../../actions';
import {errorModalToggle, listErrors } from '../../../reducers';
import { connect } from 'react-redux';
import "./ErrorModal.css"

class ErrorModal extends React.Component {

  constructor(props) {
    super(props);

    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.toggle = this.toggle.bind(this);
  }


  toggle() {
    this.props.clearErrorModal()
  }

  copyToClipboard() {
    var text = document.createElement("textarea");
    text.style.display = "none";
    document.body.appendChild(text);
    var copyMessage = JSON.stringify(Object.values(this.props.errors));
    text.value = copyMessage;

    text.select();
    text.setSelectionRange(0, 99999); /*For mobile devices*/

    document.execCommand("copy");

    var x = document.getElementById("snackbar");

    x.className = "show";

    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

  displayErrors() {
    let out = [];

    for(let e in this.props.errors) {
      out.push(
        <div>
          <div> Message: {this.props.errors[e].message} </div>
          <div> Status Code: {this.props.errors[e].status} </div>
        </div>
      )
    }

    return out;
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.errorModal} >
          <ModalHeader className="errorText" toggle={this.toggle} >Error</ModalHeader>
          <ModalBody className="errorText">
            {this.displayErrors()}
          </ModalBody>
          <ModalFooter>
          <Button href="mailto:picolabsbyu@gmail.com" >
            Report?
          </Button>
            <Button color="primary" onClick={this.copyToClipboard}> Copy </Button>
          </ModalFooter>
          <div id="snackbar">Error Message Copied.</div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    errorModal: errorModalToggle(state),
    errors: listErrors(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleErrorModal: (val, message, status) => dispatch(toggleErrorModal(val, message, status)),
    clearErrorModal: () => dispatch(clearErrorModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);

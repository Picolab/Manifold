import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { connect } from 'react-redux';
import { commandAction } from '../../actions/command';
import { colorThing } from '../../utils/manifoldSDK';
import PropTypes from 'prop-types';
import { getName, getColor } from '../../reducers';

export class ColorModal extends Component {
  constructor(props){
    super(props);

    this.state = {
      modalOn: props.modalOn,
      newColor: ""
    };

    this.handleColor = this.handleColor.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  //this allows the modal to update its state when its props change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      modalOn: nextProps.modalOn
    }
  }

  handleColor() {
    let newColor = this.state.newColor;
    if(!newColor || newColor === ""){
      alert("Error! A color ought to be selected, but found none.");
      return;
    }
    this.props.changeColor(this.props.name, newColor);
    this.handleToggle();
  }

  handleToggle() {
    this.setState({ newColor: "" });
    this.props.toggleFunc();
  }

  render() {
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.handleToggle} className={'modal-info'}>
        <ModalHeader toggle={this.handleToggle}>Change Color</ModalHeader>
        <ModalBody>
          <label> Select a color: <br/></label>
          <input type="color" defaultValue={this.state.newColor} onChange={(element) => this.setState({ newColor: element.target.value })}/>
        </ModalBody>
        <ModalFooter>
          <Button color="info" onClick={this.handleColor}>Set Color</Button>{' '}
          <Button color="secondary" onClick={this.handleToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

ColorModal.propTypes = {
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired,
  picoID: PropTypes.string.isRequired,
  changeColor: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  currentColor: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    name: getName(state, ownProps.picoID),
    currentColor: getColor(state, ownProps.picoID)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeColor: (name, newColor) => {
      dispatch(commandAction(colorThing, [name, newColor]))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColorModal)

import React, { Component } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Combobox } from 'react-input-enhancements';
import { connect } from 'react-redux';
import { commandAction } from '../../actions/command';
import { installApp } from '../../utils/manifoldSDK';
import PropTypes from 'prop-types';
import { getDID } from '../../reducers';

export class InstallModal extends Component {
  constructor(props){
    super(props);

    this.state = {
      modalOn: props.modalOn,
      //we should consider dynamic option discovery over hardcoding
      appOptions: ["io.picolabs.safeandmine"],
      value: "DEFAULT INPUT VAL",
      rulesetToInstall: ""
    };

    this.handleInstall = this.handleInstall.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  //this allows the modal to update its state when its props change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      modalOn: nextProps.modalOn
    }
  }

  handleInstall() {
    let toInstall = this.state.rulesetToInstall;
    if(!toInstall || toInstall === ""){
      alert("You must choose a ruleset to install before you can perform this action!");
      return;
    }
    this.props.installRuleset(this.props.DID, toInstall);
    this.handleToggle();
  }

  handleToggle() {
    this.setState({
      rulesetToInstall: ""
    })
    this.props.toggleFunc();
  }

  render() {
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.handleToggle} className={'modal-info'}>
        <ModalHeader toggle={this.handleToggle}>Install an App</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label> Select a ruleset to install:</label>
                <Col xs={6}>
                  <Combobox defaultValue={this.state.value}
                            options={this.state.appOptions}
                            onSelect={(element) => this.setState({ rulesetToInstall: element})}
                            autosize
                            autocomplete>
                    {(inputProps, { matchingText, width }) =>
                      <input {...inputProps} type='text' placeholder="Select APP" />
                    }
                  </Combobox>
                </Col>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="info" onClick={this.handleInstall}>Install it</Button>
          <Button color="secondary" onClick={this.handleToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

InstallModal.propTypes = {
  //parent provides these
  picoID: PropTypes.string.isRequired,
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired,
  //no need to provide the following
  installRuleset: PropTypes.func.isRequired,
  DID: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    DID: getDID(state, ownProps.picoID)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    installRuleset: (DID, rulesetName) => {
      dispatch(commandAction(installApp, [DID, rulesetName]))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InstallModal)

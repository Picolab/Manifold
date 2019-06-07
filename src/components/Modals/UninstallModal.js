import React, { Component } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Combobox } from 'react-input-enhancements';
import { connect } from 'react-redux';
import { uninstallApp } from '../../utils/manifoldSDK';
import PropTypes from 'prop-types';
import { getDID } from '../../reducers';
import { discovery } from '../../actions';
import AppMap from '../Apps/AppMap';

const createAppOptions = () => {
  return Object.keys(AppMap);
}

export class UninstallModal extends Component {
  constructor(props){
    super(props);

    this.state = {
      modalOn: props.modalOn,
      //we should consider dynamic option discovery over hardcoding
      appOptions: createAppOptions(),
      value: "DEFAULT INPUT VAL",
      rulesetToUninstall: ""
    };

    this.handleUninstall = this.handleUninstall.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  //this allows the modal to update its state when its props change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      modalOn: nextProps.modalOn
    }
  }

  handleUninstall() {
    let toUninstall = this.state.rulesetToUninstall;
    if(!toUninstall || toUninstall === ""){
      alert("You must choose a ruleset to install before you can perform this action!");
      return;
    }
    this.props.uninstallRuleset(this.props.DID, toUninstall, this.props.picoID);
    this.handleToggle();
  }

  handleToggle() {
    this.setState({
      rulesetToUninstall: ""
    })
    this.props.toggleFunc();
  }

  render() {
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.handleToggle} className={'modal-danger'}>
        <ModalHeader toggle={this.handleToggle}>Delete an App</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label> Select a ruleset to uninstall:</label>
                <Col xs={6}>
                  <Combobox defaultValue={this.state.value}
                            options={this.state.appOptions}
                            onSelect={(element) => this.setState({ rulesetToUninstall: element})}
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
          <Button color="danger" onClick={this.handleUninstall}>Delete</Button>
          <Button color="secondary" onClick={this.handleToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

UninstallModal.propTypes = {
  //parent provides these
  picoID: PropTypes.string.isRequired,
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired,
  //no need to provide the following
  uninstallRuleset: PropTypes.func.isRequired,
  DID: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    DID: getDID(state, ownProps.picoID)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    uninstallRuleset: (DID, rulesetName, picoID) => {
        const promise = uninstallApp(DID, rulesetName);
        promise.then(() => {
          dispatch(discovery(DID, picoID));
        }).catch((e) => {
          console.error("Failure to uninstall app", e);
        });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UninstallModal)

import React, { Component } from 'react';
import { Col, Dropdown, ButtonDropdownMenu, DropdownMenu, ButtonDropdown, DropdownToggle, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Link } from 'react-router-dom';
import {logOut} from '../../utils/AuthService';
import { Combobox } from 'react-input-enhancements';
import {createThing,removeThing,updateThing} from '../../utils/manifoldSDK';
import { connect } from 'react-redux';
import TestForm from './testForm';
import InnerHTML from 'dangerously-set-inner-html';
import Parser from 'html-react-parser';
import CardReplace from '../../utils/cardReplaceAPI';
import JsxParser from 'react-jsx-parser';
import JournalTemplate from '../Templates/journalTemplate';
import { Chart } from 'react-google-charts';

const brandPrimary =  '#20a8d8';
const brandSuccess =  '#4dbd74';
const brandInfo =     '#63c2de';
const brandDanger =   '#f86c6b';

const testHTML = `<TestForm />`;

class Thing extends Component {
  constructor(props) {
    super(props);

    this.toggleSettings = this.toggleSettings.bind(this);
    this.toggleBothRemove = this.toggleBothRemove.bind(this);
    this.toggleBothInstall = this.toggleBothInstall.bind(this);
    // handle clicks 
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleInstallRulesetClick = this.handleInstallRulesetClick.bind(this);
    // modals 
    this.toggleRemoveModal = this.toggleRemoveModal.bind(this);
    this.toggleInstallRulesetModal = this.toggleInstallRulesetModal.bind(this);
    // drop downs
    this.toggleInstallRulesetDropdown = this.toggleInstallRulesetDropdown.bind(this);
    this.injectCode = this.injectCode.bind(this);

    this.state = {
      dropdownOpen: false,
      installRulesetDropdownOpen: false,
      removeModal: false,
      installRulesetModal: false,
      rulesetToInstallName: "",
      url: "",
      currentApp: 0,
      value: "DEFAULT INPUT VAL",
      options: ["OPT1", "OPT2", "THING3", "WHATEVER", "LOOOOOONG ENTRY"]
    }
  }

  componentWillMount(){
    //query for the discovery and app info
    this.props.dispatch({type: 'DISCOVERY', eci: this.props.eci, pico_id: this.props.id});
  }

  toggleRemoveModal(){
    this.setState({
      removeModal: !this.state.removeModal
    });
  }

  toggleInstallRulesetModal(){
    this.setState({
      installRulesetModal: !this.state.installRulesetModal
    });
  }

  handleRemoveClick(){
    const nameToDelete = this.props.name;
    this.toggleRemoveModal();
    this.props.dispatch({type: "command", command: removeThing, params: [nameToDelete]});
  }

  handleInstallRulesetClick(){
  this.toggleInstallRulesetModal();
  this.props.dispatch({type: "installApp", eci: this.props.eci, pico_id: this.props.id, rid: this.state.rulesetToInstallName});
  }

  toggleSettings() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  toggleInstallRulesetDropdown(){
    this.setState({
      installRulesetDropdownOpen: !this.state.installRulesetDropdownOpen
    });
  }

  toggleBothRemove(){
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      removeModal: !this.state.removeModal
    });
  }

  toggleBothInstall(){
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      installRulesetModal: !this.state.installRulesetModal
    });
  }

  injectCode(){
    const thingIdentity = this.props.identities[this.props.id];
    if(thingIdentity && thingIdentity[this.state.currentApp]){
      const currentAppInfo = thingIdentity[this.state.currentApp];
      if(currentAppInfo.options && currentAppInfo.options.tile){
        const htmlString = currentAppInfo.options.tile;
        return (
          <div style={{'maxHeight':'inherit', 'maxWidth':'inherit'}}>
            <JsxParser
              bindings={{}}
              components={{ Chart, TestForm, JournalTemplate }}
              jsx={htmlString}
            />
          </div>
        )
      }
    }

    //have a default return
    return (
      <div>There are no apps currently installed on this Thing!</div>
    )
  }

  render(){
    return (
      <div className={"card"} style={{  height: "inherit", width: "inherit" }}>
        <div className="card-header">
          {this.props.name}

          <Dropdown className="float-right" isOpen={this.state.dropdownOpen} toggle={this.toggleSettings}>
            <DropdownToggle
              tag="span"
              onClick={this.toggleSettings}
              data-toggle="dropdown"
              aria-expanded={this.state.dropdownOpen} >

              <i className="fa fa-cogs float-right fa-lg" />
            </DropdownToggle>
            <DropdownMenu>

              <DropdownItem onClick={this.toggleBothRemove}>
                Delete a Pico
                <i className="fa fa-trash float-right" />
              </DropdownItem>

              <DropdownItem onClick={this.toggleBothInstall}>
                Install an App
                <i className="fa fa-cloud-download float-right"/>
              </DropdownItem>

            </DropdownMenu>
          </Dropdown>
        </div>

        <Modal isOpen={this.state.removeModal} className={'modal-danger'}>
          <ModalHeader >Delete a Thing</ModalHeader>
          <ModalBody>
            Are you sure you want to delete {this.props.name}?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.handleRemoveClick}>Delete Thing</Button>{' '}
            <Button color="secondary" onClick={this.toggleRemoveModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.installRulesetModal} className={'modal-info'}>
          <ModalHeader >Install an App</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label> Select a ruleset to install:</label>
                  <Col xs={6}>
                    <Combobox defaultValue={this.state.value}
                              options={this.state.options}
                              onSelect={(element) => this.setState({ rulesetToInstallName: element})}
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
            <Button color="info" onClick={this.handleInstallRulesetClick}>Install it</Button>
            <Button color="secondary" onClick={this.toggleInstallRulesetModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <div className="card-block">
          {this.injectCode()}
        </div>
      </div>
    );
  }
}
// ID: {this.props.id} <br/>
// ECI: {this.props.eci}<br/>
// PARENT_ECI: {this.props.parent_eci}
const mapStateToProps = state => {
  if(state.identities){//more than 1 directive/app installed in this pico
    return {
       identities: state.identities
    }
  }else{
    return {}
  }
}


export default connect(mapStateToProps)(Thing);

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
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleInstallRulesetClick = this.handleInstallRulesetClick.bind(this);
    this.toggleRemoveModal = this.toggleRemoveModal.bind(this);
    this.toggleInstallRulesetModal = this.toggleInstallRulesetModal.bind(this);
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
  const appURL = this.props.url;
  this.toggleInstallRulesetModal();
  //this.props.dispatch({type: "command", command: installRuleset, params: [appURL]});
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
          Parser(htmlString, {
            replace: CardReplace
          })
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

              <div onClick={this.toggleSettings}>Custom dropdown item</div>
              <div onClick={this.toggleSettings}>Custom dropdown item</div>
            </DropdownMenu>
          </Dropdown>
        </div>

        <Modal isOpen={this.state.removeModal} toggle={this.toggleRemoveModal} className={'modal-danger'}>
          <ModalHeader toggle={this.toggleRemoveModal}>Delete a Thing</ModalHeader>
          <ModalBody>
            Are you sure you want to delete {this.props.name}?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.handleRemoveClick}>Delete Thing</Button>{' '}
            <Button color="secondary" onClick={this.toggleRemoveModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.installRulesetModal} toggle={this.toggleInstallRulesetModal} className={'modal-info'}>
          <ModalHeader toggle={this.toggleInstallRulesetModal}>Install an App</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label> Select a ruleset to install:</label>
              {/*<input type="text" className="form-control" id="url" placeholder="Lord Sauron" onChange={(element) => this.setState({ url: element.target.value})}/>*/}


                  <Col xs={6}>
                    <Combobox defaultValue={this.state.value}
                              options={this.state.options}
                              onChange={console.log("SUP HOMIES")}
                              autosize
                              autocomplete
                              placeholder="APP NAME">
                      {(inputProps, { matchingText, width }) =>
                        <input type='text' {...inputProps} />
                      }
                    </Combobox>
                  </Col>




            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="info" onClick={this.handleInstallRulesetClick}>Install it</Button>{' '}
            <Button color="secondary" onClick={this.toggleInstallRulesetModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <div className="card-block">
          ID: {this.props.id} <br/>
          ECI: {this.props.eci}<br/>
          PARENT_ECI: {this.props.parent_eci}
          {this.injectCode()}
        </div>
      </div>
    );
  }
}

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

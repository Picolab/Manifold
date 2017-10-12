import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Link } from 'react-router-dom';
import {logOut} from '../../utils/AuthService';
import {createThing,removeThing,updateThing} from '../../utils/manifoldSDK';
import { connect } from 'react-redux';
import TestForm from './testForm';
import InnerHTML from 'dangerously-set-inner-html';
import Parser from 'html-react-parser';
import CardReplace from '../../utils/cardReplaceAPI';
import JsxParser from 'react-jsx-parser';
import { Chart } from 'react-google-charts';

const brandPrimary =  '#20a8d8';
const brandSuccess =  '#4dbd74';
const brandInfo =     '#63c2de';
const brandDanger =   '#f86c6b';

const testHTML = `<TestForm />`;

class Thing extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleBoth = this.toggleBoth.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.toggleRemoveModal = this.toggleRemoveModal.bind(this);
    this.injectCode = this.injectCode.bind(this);

    this.state = {
      dropdownOpen: false,
      removeModal: false,
      currentApp: 0
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

  handleRemoveClick(){
    const nameToDelete = this.props.name;
    this.toggleRemoveModal();
    this.props.dispatch({type: "command", command: removeThing, params: [nameToDelete]});
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleBoth(){
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      removeModal: !this.state.removeModal
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
              components={{ Chart, TestForm }}
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

          <Dropdown className="float-right" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle
              tag="span"
              onClick={this.toggle}
              data-toggle="dropdown"
              aria-expanded={this.state.dropdownOpen} >

              <i className="fa fa-cogs float-right fa-lg" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.toggleBoth}>
                Delete this Pico
                <i className="fa fa-trash float-right" />
              </DropdownItem>
              <div onClick={this.toggle}>Custom dropdown item</div>
              <div onClick={this.toggle}>Custom dropdown item</div>
              <div onClick={this.toggle}>Custom dropdown item</div>
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

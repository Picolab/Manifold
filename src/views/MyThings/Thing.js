import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import {logOut} from '../../utils/AuthService';
import {createThing,removeThing,updateThing} from '../../utils/manifoldSDK';
import { connect } from 'react-redux';

const brandPrimary =  '#20a8d8';
const brandSuccess =  '#4dbd74';
const brandInfo =     '#63c2de';
const brandDanger =   '#f86c6b';

class Thing extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  handleRemoveClick(){
    const nameToDelete = this.props.name;
    //this.toggleRemoveModal();
    this.props.dispatch({type: "command", command: removeThing, params: [nameToDelete]});
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render(){
    return (
      <div className={"card"} style={{  height: "inherit", width: "inherit" }}>
        <div className="card-header">
          {this.props.name}
        <i className="fa fa-cogs float-right fa-2x" >
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} >
            <button onClick={this.toggle} className="nav-link dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>

            </button>

            <DropdownMenu className="dropdown-menu-right" style={{zIndex:501}}>
              <DropdownItem header className="text-center"><strong>Pico Config</strong></DropdownItem>

              <DropdownItem><i className="fa fa-cloud-download"></i>Install App</DropdownItem>
              <DropdownItem><i className="fa fa-trash" onClick={this.handleRemoveClick()}></i> Delete Pico</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i>Rename</DropdownItem>


              <DropdownItem header className="text-center"><strong>App 1 settings</strong></DropdownItem>
              <Link to="/profile" style={{ textDecoration: 'none' }}><DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem></Link>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>


            </DropdownMenu>
          </Dropdown>
        </i>

        </div>
        <div className="card-block">
          ID: {this.props.id} <br/>
          ECI: {this.props.eci}<br/>
          PARENT_ECI: {this.props.parent_eci}
        </div>
      </div>
    );
  }
}

export default connect()(Thing);

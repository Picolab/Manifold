import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem} from 'reactstrap';
import ColorModal from '../Modals/ColorModal';
// import CommunitiesModal from '../Modals/CommunitiesModal';
import RemoveCommunityModal from '../Modals/RemoveCommunityModal';
import InstallModal from '../Modals/InstallModal';
import UninstallModal from '../Modals/UninstallModal';
import AddCommThingModal from '../Modals/AddCommThingModal';
import RemoveCommThingModal from '../Modals/RemoveCommThingModal';
import PropTypes from 'prop-types';

export class CommunityDropdown extends Component {
  constructor(props){
    super(props);

    this.state = {
      isOpen: props.isOpen,
      removeOpen: false,
      installOpen: false,
      uninstallOpen: false,
      addThingOpen: false,
      removeThingOpen: false,
      colorOpen: false,
      communitiesOpen: false
    }

    this.openRemove = this.openRemove.bind(this);
    this.openInstall = this.openInstall.bind(this);
    this.openUninstall = this.openUninstall.bind(this);
    this.openAddThing = this.openAddThing.bind(this);
    this.openRemoveThing = this.openRemoveThing.bind(this);
    this.openColor = this.openColor.bind(this);

    this.toggleRemove = this.toggleRemove.bind(this);
    this.toggleInstall = this.toggleInstall.bind(this);
    this.toggleUninstall = this.toggleUninstall.bind(this);
    this.toggleAddThing = this.toggleAddThing.bind(this);
    this.toggleRemoveThing = this.toggleRemoveThing.bind(this);
    this.toggleColor = this.toggleColor.bind(this);
  }

  //this allows the modal to update its state when its props change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      isOpen: nextProps.isOpen
    }
  }

  openRemove() {
    //close the dropdown
    this.props.toggleSettings();
    this.toggleRemove();
  }

  openInstall() {
    this.props.toggleSettings();
    this.toggleInstall();
  }

  openUninstall() {
    this.props.toggleSettings();
    this.toggleUninstall();
  }

  openAddThing() {
    this.props.toggleSettings();
    this.toggleAddThing();
  }

  openRemoveThing() {
    this.props.toggleSettings();
    this.toggleRemoveThing();
  }

  openColor() {
    this.props.toggleSettings();
    this.toggleColor();
  }

  toggleRemove() {
    this.setState({
      removeOpen: !this.state.removeOpen
    })
  }

  toggleInstall() {
    this.setState({
      installOpen: !this.state.installOpen
    })
  }

  toggleUninstall() {
    this.setState({
      uninstallOpen: !this.state.uninstallOpen
    })
  }

  toggleAddThing() {
    this.setState({
      addThingOpen: !this.state.addThingOpen
    })
  }

  toggleRemoveThing() {
    this.setState({
      removeThingOpen: !this.state.removeThingOpen
    })
  }

  toggleColor() {
    this.setState({
      colorOpen: !this.state.colorOpen
    })
  }

  render() {
    return (
      <Dropdown className="float-right"  isOpen={this.state.isOpen} toggle={this.props.toggleSettings}>
        <DropdownToggle
          tag="span"
          onClick={this.props.toggleSettings}
          data-toggle="dropdown"
          aria-expanded={this.state.isOpen} >

          <i className="fa fa-gear float-right fa-lg manifoldDropdown"/>
        </DropdownToggle>
        <DropdownMenu right>

          <DropdownItem onClick={this.openRemove} >
            Remove Community
            <i className="fa fa-trash float-right" />
          </DropdownItem>
          <RemoveCommunityModal modalOn={this.state.removeOpen} toggleFunc={this.toggleRemove} picoID={this.props.picoID}/>

          <DropdownItem onClick={this.openInstall}>
            Install an App
            <i className="fa fa-cloud-download float-right" style={{"marginRight": "0", "marginTop": "4px"}} />
          </DropdownItem>
          <InstallModal modalOn={this.state.installOpen} toggleFunc={this.toggleInstall} picoID={this.props.picoID}/>

          <DropdownItem onClick={this.openUninstall}>
            Uninstall an App
            <i className="fa fa-eject float-right" style={{"marginRight": "0", "marginTop": "4px"}} />
          </DropdownItem>
          <UninstallModal modalOn={this.state.uninstallOpen} toggleFunc={this.toggleUninstall} picoID={this.props.picoID}/>

          <DropdownItem onClick={this.openAddThing}>
            Add Thing
            <i className="fa fa-plus float-right"/>
          </DropdownItem>
          <AddCommThingModal modalOn={this.state.addThingOpen} toggleFunc={this.toggleAddThing} picoID={this.props.picoID}/>

          <DropdownItem onClick={this.openRemoveThing}>
            Remove Thing
            <i className="fa fa-minus float-right"/>
          </DropdownItem>
          <RemoveCommThingModal modalOn={this.state.removeThingOpen} toggleFunc={this.toggleRemoveThing} picoID={this.props.picoID}/>

          <DropdownItem onClick={this.openColor}>
            Change Color
            <i className="fa fa-cubes float-right"/>
          </DropdownItem>
          <ColorModal modalOn={this.state.colorOpen} toggleFunc={this.toggleColor} picoID={this.props.picoID}/>

        </DropdownMenu>

      </Dropdown>
    )
  }
}

CommunityDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSettings: PropTypes.func.isRequired,
  picoID: PropTypes.string.isRequired
}

export default CommunityDropdown;

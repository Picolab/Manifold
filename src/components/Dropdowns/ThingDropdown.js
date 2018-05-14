import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem} from 'reactstrap';
import ColorModal from '../Modals/ColorModal';
// import CommunitiesModal from '../Modals/CommunitiesModal';
import InstallModal from '../Modals/InstallModal';
import RemoveThingModal from '../Modals/RemoveThingModal';
import PropTypes from 'prop-types';

export class ThingDropdown extends Component {
  constructor(props){
    super(props);

    this.state = {
      isOpen: props.isOpen,
      removeOpen: false,
      installOpen: false,
      colorOpen: false,
      communitiesOpen: false
    }

    this.openRemove = this.openRemove.bind(this);
    this.openInstall = this.openInstall.bind(this);
    this.openColor = this.openColor.bind(this);
    this.openCommunities = this.openRemove.bind(this);

    this.toggleRemove = this.toggleRemove.bind(this);
    this.toggleInstall = this.toggleInstall.bind(this);
    this.toggleColor = this.toggleColor.bind(this);
    this.toggleCommunities = this.toggleCommunities.bind(this);
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

  openColor() {
    this.props.toggleSettings();
    this.toggleColor();
  }

  openCommunities() {
    this.props.toggleSettings();
    this.toggleCommunities();
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

  toggleColor() {
    this.setState({
      colorOpen: !this.state.colorOpen
    })
  }

  toggleCommunities() {
    this.setState({
      communitiesOpen: !this.state.communitiesOpen
    })
  }

  render() {
    return (
      <Dropdown className="float-right"  isOpen={this.state.isOpen} toggle={this.props.toggleSettings} style={{paddingLeft:"125px"}}>
        <DropdownToggle
          tag="span"
          onClick={this.props.toggleSettings}
          data-toggle="dropdown"
          aria-expanded={this.state.isOpen} >

          <i className="fa fa-cogs float-right fa-lg" style={{backgroundColor:"#ddd", padding:"5px", borderStyle:"solid", borderColor:"#aaa"}}/>
        </DropdownToggle>
        <DropdownMenu>

          <DropdownItem onClick={this.openRemove} >
            Delete a Pico
            <i className="fa fa-trash float-right" />
          </DropdownItem>
          <RemoveThingModal modalOn={this.state.removeOpen} toggleFunc={this.toggleRemove} name={this.props.name} sub_id={this.props.sub_id}/>

          <DropdownItem onClick={this.openInstall}>
            Install an App
            <i className="fa fa-cloud-download float-right"/>
          </DropdownItem>
          <InstallModal modalOn={this.state.installOpen} toggleFunc={this.toggleInstall} Rx={this.props.Rx}/>

          <DropdownItem onClick={this.openColor}>
            Change Color
            <i className="fa fa-cubes float-right"/>
          </DropdownItem>
          <ColorModal modalOn={this.state.colorOpen} toggleFunc={this.toggleColor} currentColor={this.props.currentColor} name={this.props.name}/>

        </DropdownMenu>

      </Dropdown>
    )
  }
}

/*
Since the idea of a community is not yet solidly formed, I'm refraining from adding the modal. This can be readded and fixed once
we have a good idea what we want a community in Manifold to look like.
<DropdownItem onClick={this.openCommunities}>
  Communities
  <i className="fa fa-users float-right"/>
</DropdownItem>
<CommunitiesModal modalOn={this.state.communitiesOpen} toggleFunc={this.openCommunities}/>
*/

ThingDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSettings: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired, //the remove modal needs this
  Rx: PropTypes.string.isRequired,
  currentColor: PropTypes.string.isRequired,
  sub_id: PropTypes.string.isRequired
}

export default ThingDropdown

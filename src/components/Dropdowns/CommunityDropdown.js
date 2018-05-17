import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem} from 'reactstrap';
import ColorModal from '../Modals/ColorModal';
// import CommunitiesModal from '../Modals/CommunitiesModal';
import InstallModal from '../Modals/InstallModal';
import RemoveCommunityModal from '../Modals/RemoveCommunityModal';
import PropTypes from 'prop-types';

export class CommunityDropdown extends Component {
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

    this.toggleRemove = this.toggleRemove.bind(this);
    this.toggleInstall = this.toggleInstall.bind(this);
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

  toggleColor() {
    this.setState({
      colorOpen: !this.state.colorOpen
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

          <i className="fa fa-cogs float-right fa-lg manifoldDropdown" style={{backgroundColor:"#ddd", padding:"5px", borderStyle:"solid", borderColor:"#aaa"}}/>
        </DropdownToggle>
        <DropdownMenu>

          <DropdownItem onClick={this.openRemove} >
            Remove Community
            <i className="fa fa-trash float-right" />
          </DropdownItem>
          <RemoveCommunityModal modalOn={this.state.removeOpen} toggleFunc={this.toggleRemove} name={this.props.name} sub_id={this.props.sub_id}/>

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

CommunityDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSettings: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired, //the remove modal needs this
  Rx: PropTypes.string.isRequired,
  currentColor: PropTypes.string.isRequired,
  sub_id: PropTypes.string.isRequired
}

export default CommunityDropdown;

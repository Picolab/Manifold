import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroupItem } from 'reactstrap';
import { getName } from '../../reducers';
import OpenCardButton from '../Buttons/OpenCardButton';
import ThingDropdown from '../Dropdowns/ThingDropdown';

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen : false
    }

    this.toggleSettings = this.toggleSettings.bind(this);
  }

  toggleSettings() {
    //console.log("Settings dropdown toggled");
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render(){
    return(
      <ListGroupItem>
        {this.props.name}
        <ThingDropdown isOpen={this.state.dropdownOpen} toggleSettings={this.toggleSettings} picoID={this.props.picoID}/>
        <OpenCardButton picoID={this.props.picoID} />
      </ListGroupItem>
    );
  }
}

ListItem.propTypes = {
  picoID: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    name: getName(state, ownProps.picoID)
  }
}

export default connect(mapStateToProps)(ListItem);

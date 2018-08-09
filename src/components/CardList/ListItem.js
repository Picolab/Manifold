import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroupItem } from 'reactstrap';
import { getName } from '../../reducers';
import ThingDropdown from '../Dropdowns/ThingDropdown';
import { Link } from 'react-router-dom';

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
        <ListGroupItem action>
          <Link to={"/mythings/" + this.props.picoID}>
            <div style={{'width':'80%','float':'left'}}>
              {this.props.name}
            </div>
          </Link>
          <ThingDropdown isOpen={this.state.dropdownOpen} toggleSettings={this.toggleSettings} picoID={this.props.picoID} />
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

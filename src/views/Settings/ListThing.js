import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroupItem } from 'reactstrap';
import { getName } from '../../reducers';
//import ThingDropdown from '../Dropdowns/ThingDropdown';
import { Link } from 'react-router-dom';

class ListThing extends Component {
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
  // <Link to={"/settings/" + this.props.picoID}>
  //   <div style={{'width':'80%','float':'left'}}>
  //     {this.props.name}
  //   </div>
  // </Link>
  render(){
    return(
        <ListGroupItem action>
            <div style={{'width':'80%','float':'left'}}>
              {this.props.name}
            </div>
        </ListGroupItem>
    );
  }
}

ListThing.propTypes = {
  picoID: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    name: getName(state, ownProps.picoID)
  }
}

export default connect(mapStateToProps)(ListThing);

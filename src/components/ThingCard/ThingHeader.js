import React, { Component } from 'react';
import ThingDropdown from '../Dropdowns/ThingDropdown';
import PropTypes from 'prop-types';


class ThingHeader extends Component {
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
        <div className="card-header" style={{"backgroundColor": this.props.color}}>
          <div style={{float: "left", "maxWidth":"85%", "overflow":"hidden", "textOverflow": "ellipsis"}}>
            {this.props.name}
          </div>

          <ThingDropdown isOpen={this.state.dropdownOpen} toggleSettings={this.toggleSettings} name={this.props.name} eci={this.props.eci} currentColor={this.props.color}/>

        </div>
      );
    }
}

ThingHeader.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  eci: PropTypes.string.isRequired
}

export default ThingHeader;

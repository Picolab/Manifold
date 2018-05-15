import React, { Component } from 'react';
import ThingDropdown from '../Dropdowns/ThingDropdown';
import CommunityDropdown from '../Dropdowns/CommunityDropdown';
import PropTypes from 'prop-types';


class CardHeader extends Component {
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

    renderDropdown(){
      if(this.props.cardType === 'Thing'){
        return (
          <ThingDropdown isOpen={this.state.dropdownOpen} toggleSettings={this.toggleSettings} name={this.props.name} Rx={this.props.Rx} currentColor={this.props.color} sub_id={this.props.sub_id}/>
        )
      }else if(this.props.cardType === 'Community'){
        return (
          <CommunityDropdown isOpen={this.state.dropdownOpen} toggleSettings={this.toggleSettings} name={this.props.name} Rx={this.props.Rx} currentColor={this.props.color} sub_id={this.props.sub_id}/>
        )
      }else{
        return (
          <div>ERROR: Unkonw card type!</div>
        )
      }
    }

    render(){
      return(
        <div className="card-header" style={{"backgroundColor": this.props.color}}>
          <div style={{float: "left", "maxWidth":"85%", "overflow":"hidden", "textOverflow": "ellipsis"}}>
            {this.props.name}
          </div>

          {this.renderDropdown()}

        </div>
      );
    }
}

CardHeader.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  Rx: PropTypes.string.isRequired,
  sub_id: PropTypes.string.isRequired,
  cardType: PropTypes.string.isRequired
}

export default CardHeader;

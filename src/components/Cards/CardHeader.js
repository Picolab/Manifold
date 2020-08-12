import React, { Component } from 'react';
import ThingDropdown from '../Dropdowns/ThingDropdown';
import CommunityDropdown from '../Dropdowns/CommunityDropdown';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getName, getColor, getIcon } from '../../reducers';
import OpenCardButton from '../Buttons/OpenCardButton';

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

    renderDropdown() {
      if(this.props.cardType === 'Thing'){
        return (
          <ThingDropdown isOpen={this.state.dropdownOpen} toggleSettings={this.toggleSettings} picoID={this.props.picoID}/>
        )
      }else if(this.props.cardType === 'Community'){
        return (
          <CommunityDropdown isOpen={this.state.dropdownOpen} toggleSettings={this.toggleSettings} picoID={this.props.picoID}/>
        )
      }else{
        return (
          <div>ERROR: Unknown card type!</div>
        )
      }
    }

    render() {
      return(
        <div className="card-header draggable" style={{"backgroundColor": this.props.color}}>
          <div style={{float: "left", "maxWidth":"85%", "overflow":"hidden", "textOverflow": "ellipsis"}}>
            <div style={{display: 'inline-block'}}>
              {this.props.icon && <div style={{ display: 'inline-block', background: 'white', padding: 5, borderRadius: 15 }}><img src={this.props.icon} style={{width: 20, height: 20}} /></div>}
              <div style={{display: 'inline-block', marginLeft: 20, height: 30, verticalAlign: 'middle'}}><h4>{this.props.name}</h4></div>
            </div>
          </div>
          {this.renderDropdown()}
          {this.props.appInfo && <OpenCardButton picoID={this.props.picoID} rid={this.props.appInfo.rid}/>}
        </div>
      );
    }
}

CardHeader.propTypes = {
  picoID: PropTypes.string.isRequired,
  cardType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string
}

const mapStateToProps = (state, ownProps) => {
  return {
    name: getName(state, ownProps.picoID),
    color: getColor(state, ownProps.picoID),
    icon: getIcon(state, ownProps.picoID)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardHeader);

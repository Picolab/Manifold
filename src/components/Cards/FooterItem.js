import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';

class FooterItem extends Component {
  constructor(props){
    super(props);

    this.dotClicked = this.dotClicked.bind(this);
  }

  dotClicked(){
    this.props.onDotClick(this.props.index);
  }

  render(){
    const mediaID = "iconMedia" + this.props.index;
    if(this.props.index === this.props.currentApp){
      return(
        <div className="circle-selected" id={mediaID} onClick={this.dotClicked}>
          <img src={this.props.allApps[this.props.index].iconURL} alt={this.props.allApps[this.props.index].name} style={{width: 30, "borderRadius": 50}} />
          <UncontrolledTooltip placement="bottom" delay={800} target={mediaID}>
            {this.props.allApps[this.props.index].name}
          </UncontrolledTooltip>
        </div>
      );
    }else{
      return(
        <div className="circle" id={mediaID} onClick={this.dotClicked}>
          <img src={this.props.allApps[this.props.index].iconURL} alt={this.props.allApps[this.props.index].name} style= {{width: 25, "borderRadius": 50}} />
          <UncontrolledTooltip placement="bottom" delay={800} target={mediaID}>
            {this.props.allApps[this.props.index].name}
          </UncontrolledTooltip>
        </div>
      );
    }
  }
}

FooterItem.propTypes = {
  onDotClick: PropTypes.func.isRequired,
  currentApp: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
}

export default FooterItem;

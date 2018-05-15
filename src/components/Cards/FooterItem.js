import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FooterItem extends Component {
  constructor(props){
    super(props);

    this.dotClicked = this.dotClicked.bind(this);
  }

  dotClicked(){
    this.props.onDotClick(this.props.index);
  }

  render(){
    if(this.props.index === this.props.currentApp){
      return(
        <btn className="circle-selected" onClick={this.dotClicked}></btn>
      );
    }else{
      return(
        <btn className="circle" onClick={this.dotClicked}></btn>
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

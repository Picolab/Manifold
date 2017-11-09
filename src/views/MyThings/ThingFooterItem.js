import React, { Component } from 'react';

class ThingFooterItem extends Component {
  dotClicked(index){
    this.props.onDotClick(index);
  }

  render(){
    if(this.props.index == this.props.currentApp){
    return(
        <btn className="circle-selected" onClick={this.dotClicked.bind(this, this.props.index)}></btn>
    );
    }else{
      return(
        <btn className="circle" onClick={this.dotClicked.bind(this, this.props.index)}></btn>
      );
      }
  }
}

export default ThingFooterItem;

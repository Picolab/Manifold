import React, { Component } from 'react';

class ThingFooterItem extends Component {
  dotClicked(app){
    this.props.onDotClick(app);
    //console.log(title);
  }

  render(){
    return(
        <btn className="circle" onClick={this.dotClicked.bind(this, this.props.app)}></btn>
    );
  }
}

export default ThingFooterItem;

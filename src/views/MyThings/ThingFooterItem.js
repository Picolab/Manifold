import React, { Component } from 'react';

class ThingFooterItem extends Component {
  dotClicked(title){
    this.props.onDotClick(title);
    //console.log(title);
  }

  render(){
    return(
        <btn className="circle" onClick={this.dotClicked.bind(this, this.props.app.title)}></btn>
    );
  }
}

export default ThingFooterItem;

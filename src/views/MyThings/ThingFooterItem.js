import React, { Component } from 'react';

class ThingFooterItem extends Component {
  dotClicked(title){
    this.props.onDotClick(title);
    //console.log(title);
  }

  render(){
    return(
      <div>
        <btn className="circle" onClick={this.dotClicked.bind(this, this.props.app.title)}></btn>
        {this.props.app.title}
      </div>
    );
  }
}

export default ThingFooterItem;

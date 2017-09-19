import React, { Component } from 'react';

const brandPrimary =  '#20a8d8';
const brandSuccess =  '#4dbd74';
const brandInfo =     '#63c2de';
const brandDanger =   '#f86c6b';

class Thing extends Component {
  render(){
    return (
      <div className={"card"}  style={this.props.style}>
        <div className="card-header">
          Card title
        </div>
        <div className="card-block">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
        </div>
      </div>
    );
  }
}

export default Thing;

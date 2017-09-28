import React, { Component } from 'react';

const brandPrimary =  '#20a8d8';
const brandSuccess =  '#4dbd74';
const brandInfo =     '#63c2de';
const brandDanger =   '#f86c6b';

class Thing extends Component {
  render(){
    return (
      <div className={"card"} style={{  height: "inherit", width: "inherit" }}>
        <div className="card-header">
          {this.props.name}
        </div>
        <div className="card-block">
          ID: {this.props.id} <br/>
          ECI: {this.props.eci}<br/>
          PARENT_ECI: {this.props.parent_eci}
        </div>
      </div>
    );
  }
}

export default Thing;

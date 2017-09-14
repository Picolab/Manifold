import React, { Component } from 'react';
import {createThing,removeThing,updateThing} from '../../utils/manifoldSDK';

const brandPrimary =  '#20a8d8';
const brandSuccess =  '#4dbd74';
const brandInfo =     '#63c2de';
const brandDanger =   '#f86c6b';

class MyThings extends Component {
  handleAddClick(){
    createThing("ThingsName");
  }
  handleRemoveClick(){
    removeThing("ThingsName");
  }
  handleUpdateClick(){
    updateThing("ThingsName",{});
  }
  render(){
    return (
      <div>
        <button style={{float:"right"}} onClick={() => this.handleAddClick()}>+</button>
        <button style={{float:"right"}} onClick={() => this.handleRemoveClick()}>-</button>
        <button style={{float:"right"}} onClick={() => this.handleUpdateClick()}>^</button>
        <div className= "container-fluid">
          <div className = "row">
            <div className = "col-md-4">

            </div>
            <div className = "col-md-4">

            </div>
            <div className = "col-md-4">

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyThings;

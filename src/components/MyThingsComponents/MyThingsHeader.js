import React, { Component } from 'react';
import CreateThingModal from '../Modals/CreateThingModal';
import RegisterRulesetModal from '../Modals/RegisterRulesetModal';


class MyThingsHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addModal: false,
      registerModal: false
    }
  }

  toggleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal
    })
  }

  toggleRegModal = () => {
    this.setState({
      registerModal: !this.state.registerModal
    })
  }

  render(){
    return (
      <div>
        <div style={{height:"30px"}}>
          <button style={{float:"right"}} className="btn btn-primary" onClick={this.toggleAddModal}>+</button>
          <button style={{float:"right"}} className="btn btn-warning" onClick={this.toggleRegisterRulesetModal}>R</button>
        </div>
        <CreateThingModal modalOn={this.state.addModal} toggleFunc={this.toggleAddModal}/>
        <RegisterRulesetModal modalOn={this.state.registerModal} toggleFunc={this.toggleRegModal}/>
      </div>
    );
  }
}


export default MyThingsHeader;

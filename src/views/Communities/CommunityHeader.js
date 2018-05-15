import React, { Component } from 'react';
import CreateCommModal from '../../components/Modals/CreateCommModal';

class CommunityHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addModal: false
    }

    this.toggleAddModal = this.toggleAddModal.bind(this);
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal
    })
  }

  render(){
    return (
      <div>
        <div style={{height:"30px"}}>
          <button style={{float:"right"}} className="btn btn-primary" onClick={this.toggleAddModal}>+</button>
        </div>
        <CreateCommModal modalOn={this.state.addModal} toggleFunc={this.toggleAddModal}/>
      </div>
    );
  }
}

export default CommunityHeader;

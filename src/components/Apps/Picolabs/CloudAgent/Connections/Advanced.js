import React from 'react';
import {customEvent} from '../../../../../utils/manifoldSDK';
import {Button} from 'reactstrap';
import "./advanced.css"
import DeleteConnectionModal from './DeleteConnectionModal'

class Advanced extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="advancedContainer">
        <h4>Connection Information</h4>
        <div className="textStickOut"> My DID: {this.props.myDID} </div>
        <div className="textStickOut"> Their DID: {this.props.theirDID} </div>
        <DeleteConnectionModal
          getUI={this.props.getUI}
          their_vk={this.props.their_vk}
          signalEvent={this.props.signalEvent}
        />
      </div>
    );
  }
}

export default Advanced;

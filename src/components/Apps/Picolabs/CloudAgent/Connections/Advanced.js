import React from 'react';
import "./Advanced.css";
import DeleteConnectionModal from './DeleteConnectionModal';

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
          getConnections={this.props.getConnections}
          their_vk={this.props.their_vk}
          signalEvent={this.props.signalEvent}
          returnToConnections={this.props.returnToConnections}
        />
      </div>
    );
  }
}

export default Advanced;

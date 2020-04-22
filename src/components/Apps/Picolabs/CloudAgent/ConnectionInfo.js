import React from 'react';
import {customEvent} from '../../../../utils/manifoldSDK';

class ConnectionInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  deleteConnection() {
    const promise = customEvent( this.props.myDID , "sovrin", "connection_expired", { their_vk: this.props.their_vk }, '5');
    promise.then((resp) => {
      this.props.getUI();
    });
    this.props.modalToggle();
  }

  render() {
    return (
      <div>
        <h4>Connection Information</h4>
        <div className="textStickOut"> My DID: {this.props.myDID} </div>
        <div className="textStickOut"> Their DID: {this.props.theirDID} </div>
        { !this.props.hasRouter && <button className="btn-info" onClick={this.sendTrustPing}>Send Trust Ping</button>} {' '}
        <button className="btn-danger" onClick={this.deleteConnection}>Delete Connection</button>
      </div>
    );
  }
}

export default ConnectionInfo;

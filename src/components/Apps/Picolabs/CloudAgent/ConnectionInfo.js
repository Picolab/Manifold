import React from 'react';
import {customEvent} from '../../../../utils/manifoldSDK';
import {Button} from 'reactstrap';
import "./ConnectionInfo.css"

class ConnectionInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canPing: false
    };

    this.acceptPings = this.acceptPings.bind(this);
    this.canPing = this.canPing.bind(this);
    this.deleteConnection = this.deleteConnection.bind(this);
  }

  componentDidMount() {
    this.canPing()
  }

  acceptPings() {
    const promise = this.props.signalEvent({
      domain: "sovrin",
      type: "accept_trust_pings",
      attrs: {}
    }).catch((e) => {
      console.error("Error enabling trust ping", e);
    });

    promise.then((resp) => {
      this.canPing();
    })
  }

  canPing() {
    const promise = this.props.manifoldQuery({
      rid: "org.sovrin.manifold_cloud_agent",
      funcName: "canPing"
    }).catch((e) => {
        console.error("Error getting if agent can ping", e);
    });
    promise.then((resp) => {
      this.setState({
        canPing: resp.data
      });
    });
  }

  deleteConnection() {
    const promise = customEvent( this.props.myDID , "sovrin", "connection_expired", { their_vk: this.props.their_vk }, '5');
    promise.then((resp) => {
      this.props.getUI();
    });
    this.props.modalToggle();
  }

  displayPingButton() {
    if(this.state.canPing) {
      return (
        <button className="pingAgentButton" onClick={this.props.sendTrustPing}>Send Trust Ping</button>
      )
    }
    return (
      <Button onClick={this.acceptPings} className="pingAgentButton"> <i className="fa fa-plus-circle" /> Enable Pinging</Button>
    )
  }

  render() {
    return (
      <div>
        <h4>Connection Information</h4>
        <div className="textStickOut"> My DID: {this.props.myDID} </div>
        <div className="textStickOut"> Their DID: {this.props.theirDID} </div>
        { this.displayPingButton() } {' '}
        <button className="deleteConnectionButton" onClick={this.deleteConnection}>Delete Connection</button>
      </div>
    );
  }
}

export default ConnectionInfo;

import React from 'react';
import {customEvent} from '../../../../utils/manifoldSDK';
import {Button} from 'reactstrap';
import "./ConnectionInfo.css"
import RemovePingModal from './RemovePingModal'
import DeleteConnectionModal from './DeleteConnectionModal'

class ConnectionInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canPing: true
    };

    this.acceptPings = this.acceptPings.bind(this);
    this.canPing = this.canPing.bind(this);
  }

  componentDidMount() {
    this.canPing()
  }

  acceptPings() {
    const promise = this.props.signalEvent({
      domain: "sovrin",
      type: "accept_trust_pings",
      attrs: {
        "their_vk": this.props.their_vk
      }
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
      funcName: "canPing",
      funcArgs: {
        "their_vk": this.props.their_vk
      }
    }).catch((e) => {
        console.error("Error getting if agent can ping", e);
    });
    promise.then((resp) => {
      this.setState({
        canPing: resp.data
      });
    });
  }

  // <RemovePingModal
  //   signalEvent={this.props.signalEvent}
  //   canPing={this.canPing}
  // />
  displayPingButton() {
    if(this.state.canPing) {
      return (
        <div style={{"display": "grid"}}>
          <button className="pingAgentButton" onClick={this.props.sendTrustPing}>Send Trust Ping</button>
        </div>
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
        <DeleteConnectionModal
          getUI={this.props.getUI}
          their_vk={this.props.their_vk}
          signalEvent={this.props.signalEvent}
        />
      </div>
    );
  }
}

export default ConnectionInfo;

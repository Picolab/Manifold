import React from 'react';
import "./Ping.css"

class Ping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pingStatus: this.props.pingStatus
    };
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.pingStatus !== prevState.pingStatus && nextProps.pingStatus !== ""){
      return { pingStatus: nextProps.pingStatus};
    }
    else return null;
  }

  displayPingButton() {
    return (
      <div style={{"display": "grid"}}>
        <button className="pingAgentButton" onClick={this.props.sendTrustPing}>Send Trust Ping</button>
      </div>
    )
  }

  render() {
    return (
      <div className="pingContainer">
        <h4>Ping Status</h4>
        <div className="textStickOut">
          Last Session Response:
          <span style={{"color": (this.state.pingStatus === "connected") ? "green" : "red" }}>
            {' '}{this.state.pingStatus.toUpperCase()}
          </span>
        </div>
        { this.displayPingButton() } {' '}
      </div>
    );
  }
}

export default Ping;

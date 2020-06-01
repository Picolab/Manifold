import React from 'react';
import './CloudAgent.css';
import icon from './Aries.png';
import { Media } from 'reactstrap';
import ConnectionCardView from './Connections/ConnectionCardView';
import ConnectionDropdown from './Header/ConnectionDropdown';
import { displayError } from '../../../../utils/manifoldSDK';

class CloudAgentCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invitationOpen: false,
      connections: {},
      messages: [],
      configured: false,
      edgeModal: false,
      deleteRouterModal: false,
      hasRouterConnection: false,
      viaRouterCheck: false,
      loading: true
    };
    this.getLabel = this.getLabel.bind(this);
    this.getConnections = this.getConnections.bind(this);
    this.poll = this.poll.bind(this);
    this.resetPoll = this.resetPoll.bind(this);
    this.visibilitychange = this.visibilitychange.bind(this);
    this.connTimeout = null;
    this.prev = 1;
    this.curr = 1;

    this.displayConnection = this.displayConnection.bind(this);
    this.returnToConnections = this.returnToConnections.bind(this);
  }

  componentDidMount() {
    this.getLabel()
    this.poll()
    window.addEventListener("mouseover", this.resetPoll)
    window.addEventListener("visibilitychange", this.visibilitychange)
  }

  componentDidUpdate(prevProps) {
    if (this.props.picoID !== prevProps.picoID) {
      this.setState({
        loading: true
      })
      this.getLabel();
      this.resetPoll();
    }
  }

  resetPoll() {
    clearTimeout(this.connTimeout);
    this.prev = 1;
    this.curr = 1;
    this.poll();
  }

  visibilitychange() {
    if(!document.hidden) {
      this.resetPoll();
    }
  }

  poll() {
    this.connTimeout = setTimeout(async () => {
      let next = this.prev + this.curr;
      this.prev = this.curr;
      this.curr = next;

      await this.getConnections();
      this.poll()
    }, this.curr * 1000);
  }

  setCurrentPage() {
    this.props.signalEvent({
      domain:"sovrin",
      type:"set_page",
      attrs: {
        page: "connections"
      }
    })
  }

  componentWillUnmount() {
    clearTimeout(this.connTimeout);
    window.removeEventListener("mouseover", this.resetPoll);
    window.removeEventListener("visibilitychange", this.visibilitychange);
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      this.setState({
        [stateKey]: value
      })
    }
  }

  getLabel() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.manifold_cloud_agent",
      funcName: "getLabel"
    });
    promise.then((resp) => {
        this.setState({
          label: resp.data
        });
    }).catch((e) => {
        displayError(true, "Error getting agent label.", 404);
        console.error("Error getting agent label.", e);
    });
  }

  getConnections() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.manifold_cloud_agent",
      funcName: "getConnections"
    });
    promise.then((resp) => {
      if(JSON.stringify(resp.data) !== JSON.stringify(this.state.connections)) {
        this.setState({
          connections: resp.data,
          loading: false
        });
      }
    }).catch((e) => {
        displayError(true, "Error getting agent connections.", 404);
        console.error("Error getting connections.", e);
    });
  }

  displayHeader() {
      return (
        <div>
          <h1 className='connectionCardHeader'>
            <Media object src={icon} className='iconCardView'/>
            <ConnectionDropdown
              signalEvent={this.props.signalEvent}
              manifoldQuery={this.props.manifoldQuery}
              picoID={this.props.picoID}
            />
          </h1>
        </div>
      );
  }

  displayConnections() {
    var output = [];
    for(var item in this.state.connections) {
      if(this.state.connections[item] !== undefined) {
        let id = JSON.stringify(this.state.connections[item])
        output.push(
          <div key={this.state.connections[item]['their_did']}>
            <div className="connectionWrapper" onClick={()=>{this.displayConnection(id);}}>
              <svg className="connection" data-jdenticon-value={this.state.connections[item]['label']} ></svg>
            </div>
            <div className="agentLabel">
              {this.state.connections[item]['label']}
            </div>
          </div>
        );
      }
    }

    return (
      <div className="flex-container">
        {output}
      </div>
    );
  }

  displayConnection(id) {
    let connection = JSON.parse(id);
    let connectionView =
      <div>
        <div className="returnToConnectionsContainer" onClick={this.returnToConnections}>
          <i className="fa fa-arrow-left returnToConnections" />
          Return
        </div>
        <ConnectionCardView
          myImage= {<svg className="profilePic" data-jdenticon-value={this.state.label}></svg>}
          image= {null}
          title={connection['label']}
          myDID={connection['my_did']}
          theirDID={connection['their_did']}
          their_vk={connection['their_vk']}
          signalEvent={this.props.signalEvent}
          manifoldQuery={this.props.manifoldQuery}
          getConnections={this.getConnections}
          endPoint={connection["their_endpoint"]}
          returnToConnections={this.returnToConnections}
        />
      </div>

    this.setState({
      connectionView: connectionView
    })
  }

  loading() {
    return (
      <div className="loadingio-spinner-spinner-e99p94i3o4p"><div className="ldio-o87ynsbkwv">
      <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
      </div></div>
    )
  }

  returnToConnections() {
    this.setState({connectionView: null });
  }

  render() {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jdenticon@2.1.1";
    script.async = true;
    document.body.appendChild(script);

    if(this.state.connectionView) {
      return this.state.connectionView
    }
    else {
      return(
        <div>
            {this.displayHeader()}
          <div>
            { this.state.loading ? this.loading() : this.displayConnections()}
          </div>
        </div>
      );
    }
  }

}
export default CloudAgentCard;

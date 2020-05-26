import React from 'react';
import './CloudAgent.css';
import icon from './SovrinIcon.png';
import { Media } from 'reactstrap';
import ConnectionModal from './Connections/ConnectionModal';
import ConnectionDropdown from './Header/ConnectionDropdown';
import { displayError } from '../../../../utils/manifoldSDK';

class CloudAgent extends React.Component {
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
          <h1 className='connectionHeader'>
            <Media object src={icon} className='icon'/>
            <div className='myConnection'>{this.state.label}'s Connections</div>
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
        output.push(
          <div key={this.state.connections[item]['their_did']}>
            <ConnectionModal
              myImage= {<svg className="profilePic" data-jdenticon-value={this.state.label}></svg>}
              image= {null}
              title={this.state.connections[item]['label']}
              myDID={this.state.connections[item]['my_did']}
              theirDID={this.state.connections[item]['their_did']}
              their_vk={this.state.connections[item]['their_vk']}
              signalEvent={this.props.signalEvent}
              manifoldQuery={this.props.manifoldQuery}
              getConnections={this.getConnections}
              endPoint={this.state.connections[item]["their_endpoint"]}
            />
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

  loading() {
    return (
      <div className="loadingio-spinner-spinner-e99p94i3o4p"><div className="ldio-o87ynsbkwv">
      <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
      </div></div>
    )
  }

  render() {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jdenticon@2.1.1";
    script.async = true;
    document.body.appendChild(script);
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
export default CloudAgent;

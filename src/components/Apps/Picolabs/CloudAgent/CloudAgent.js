import React from 'react';
import './SovrinAgent.css';
import icon from './SovrinIcon.png';
import { Media } from 'reactstrap';
import ConnectionModal from './ConnectionModal';
import ConnectionDropdown from './ConnectionDropdown';

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
      viaRouterCheck: false
    };
    this.getLabel = this.getLabel.bind(this);
    this.getUI = this.getUI.bind(this);

  }

  componentDidMount() {
    this.getLabel()
    this.getUI()
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jdenticon@2.1.1";
    script.async = true;
    document.body.appendChild(script);
    this.connVar = setInterval(() => this.getUI(), 3000);
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
    clearInterval(this.connVar);
    clearInterval(this.pollInterval);
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
      rid: "org.sovrin.manifold_cloud_agent",
      funcName: "getLabel"
    }).catch((e) => {
        console.error("Error getting technical details", e);
    });
    promise.then((resp) => {
        this.setState({
          label: resp.data
        });
    });
  }

  getUI() {
    const promise = this.props.manifoldQuery({
      rid: "org.sovrin.manifold_cloud_agent",
      funcName: "getConnections"
    }).catch((e) => {
        console.error("Error getting technical details", e);
    });
    promise.then((resp) => {
      if(JSON.stringify(resp.data) !== JSON.stringify(this.state.connections)) {
        this.setState({
          connections: resp.data
        });
      }
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
              getUI={this.getUI}
              endPoint={this.state.connections[item]["their_endpoint"]}
            />
            <div className="agentLabel">
              <div className="agentLabel"> {this.state.connections[item]['label']} </div>
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

  render() {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jdenticon@2.1.1";
    script.async = true;
    document.body.appendChild(script);
    return(
      <div>
          {this.displayHeader()}
        <div>
          {this.displayConnections()}
        </div>
      </div>
    );
  }

}
export default CloudAgent;

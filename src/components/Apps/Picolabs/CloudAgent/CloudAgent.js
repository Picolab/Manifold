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
      technicalDetails: {},
      messages: [],
      configured: false,
      edgeModal: false,
      deleteRouterModal: false,
      hasRouterConnection: false,
      viaRouterCheck: false
    };
    this.poll = this.poll.bind(this);
    this.deleteRouter = this.deleteRouter.bind(this)
    this.getUI = this.getUI.bind(this);

  }

  componentDidMount() {
    this.getUI()
    //this.setCurrentPage();
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jdenticon@2.1.1";
    script.async = true;
    document.body.appendChild(script);
    this.pollInterval = setInterval(() => this.poll(), 3000);
    this.connVar = setInterval(() => this.getUI(), 3000);
  }

  deleteRouterToggle() {
    this.setState(prevState => ({
      deleteRouterModal: !prevState.deleteRouterModal,
      actionsOpen: !prevState.actionsOpen
    }));
  }

  poll() {
    this.props.signalEvent({
        domain:"edge",
        type:"poll_all_needed",
        attrs: {
        }
    });
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

  getUI() {
    const promise = this.props.manifoldQuery({
      rid: "org.sovrin.agent",
      funcName: "ui"
    }).catch((e) => {
        console.error("Error getting technical details", e);
    });
    promise.then((resp) => {
      if(JSON.stringify(resp.data) !== JSON.stringify(this.state.technicalDetails)) {
        this.setState({
          technicalDetails: resp.data
        });
        //clearInterval(this.connVar);
        this.getEdgeUI(resp.data["connections"]);
        this.getIconImages(resp.data['connections'])
      }
    });
  }

  getEdgeUI(connections) {
    const promise = this.props.manifoldQuery({
      rid: "org.sovrin.edge",
      funcName: "ui"
    }).catch((e) => {
        console.error("Error getting edge ui", e);
    });
    promise.then((resp) => {
      if(resp !== undefined && resp.data !== null) {
        this.setRouter(resp.data);
        this.hasRouterConnection(resp.data)
      }
      else {
        this.setState({
          configured: false
        });
      }
    });
  }

  hasRouterConnection(routerUI) {
    let hasRouterConn = false
    if(Object.keys(routerUI["routerConnections"]).length > 1) {
      hasRouterConn = true
    }
    else {
        if(routerUI["routerConnections"][routerUI["routerName"].concat(" to ".concat(this.state.technicalDetails["name"]))]
          === null) {
            hasRouterConn = true
          }
    }
    this.setState({
      hasRouterConnection: hasRouterConn
    })
  }

  getIconImages(connections) {
    for(let item in connections) {
      const promise = this.props.signalEvent({
        domain:"sovrin",
        type:"image",
        attrs: {
          label: connections[item]["label"]
        }
      })
      promise.then((resp) => {
        this.setState({
          [connections[item]["label"]]: resp.data.directives[0]['options']['icon']
        })
      })
    }
  }

  setRouter(routerUI) {
    this.setState({
      routerUI: routerUI,
      routerName: routerUI['routerName'],
      configured: true
    });
  }

  hasRouter(label) {
    let routerConn = label.concat(" to ".concat(this.state.technicalDetails["name"]));
    if (this.state.routerUI !== undefined && this.state.routerUI["routerConnections"][routerConn] !== undefined) {
      return true;
    }
    else {
      return false;
    }
  }

  deleteRouter() {
    const promise = this.props.signalEvent({
      domain : "edge",
      type: "router_removal_requested",
      attrs : {

      }
    })
    promise.then((resp) => {
      this.getEdgeUI();
    })
  }

  displayHeader() {
      return (
        <div>
          <h1 className='connectionHeader'>
            <Media object src={icon} className='icon'/>
            <div className='myConnection'>{this.state.technicalDetails['name']}'s Connections</div>
            <ConnectionDropdown
              signalEvent={this.props.signalEvent}
              manifoldQuery={this.props.manifoldQuery}
            />
          </h1>
        </div>
      );
  }

  createDefaultImage(label) {
    return (
      <svg className="connection" data-jdenticon-value={label}></svg>
    );
  }

  displayConnections() {
    var output = [];
    for(var item in this.state.technicalDetails['connections']) {
      if(this.state.technicalDetails['connections'][item] !== undefined) {
        let hasRouter = this.hasRouter(this.state.technicalDetails['connections'][item]['label'])
        if(this.state[this.state.technicalDetails['connections'][item]['label']] !== undefined) {
          output.push(
            <div key={this.state.technicalDetails['connections'][item]['their_did']}>
              <ConnectionModal
                myImage= {<svg className="profilePic" data-jdenticon-value={this.state.technicalDetails['name']}></svg>}
                image= {this.state[this.state.technicalDetails['connections'][item]['label']]}
                title={this.state.technicalDetails['connections'][item]['label']}
                myDID={this.state.technicalDetails['connections'][item]['my_did']}
                theirDID={this.state.technicalDetails['connections'][item]['their_did']}
                their_vk={this.state.technicalDetails['connections'][item]['their_vk']}
                messages={this.state.technicalDetails['connections'][item]['messages']}
                signalEvent={this.props.signalEvent}
                manifoldQuery={this.props.manifoldQuery}
                getUI={this.getUI}
                invitation={this.state.technicalDetails["invitation"]}
                hasRouter={hasRouter}
              />
                { hasRouter === true  ? <div className="agentLabel"> {this.state.technicalDetails['connections'][item]['label']} <span> (via {this.state.routerName}) </span> </div> : <div className="agentLabel"> {this.state.technicalDetails['connections'][item]['label']} </div>}
            </div>
          );
        } else {
          output.push(
            <div key={this.state.technicalDetails['connections'][item]['their_did']}>
              <ConnectionModal
                myImage= {<svg className="profilePic" data-jdenticon-value={this.state.technicalDetails['name']}></svg>}
                image= {null}
                title={this.state.technicalDetails['connections'][item]['label']}
                myDID={this.state.technicalDetails['connections'][item]['my_did']}
                theirDID={this.state.technicalDetails['connections'][item]['their_did']}
                their_vk={this.state.technicalDetails['connections'][item]['their_vk']}
                messages={this.state.technicalDetails['connections'][item]['messages']}
                signalEvent={this.props.signalEvent}
                manifoldQuery={this.props.manifoldQuery}
                getUI={this.getUI}
                invitation={this.state.technicalDetails["invitation"]}
                hasRouter={hasRouter}
              />
              <div className="agentLabel">
                { hasRouter === true  ? <div className="agentLabel"> {this.state.technicalDetails['connections'][item]['label']} (via {this.state.routerName}) </div> : <div className="agentLabel"> {this.state.technicalDetails['connections'][item]['label']} </div>}
              </div>
            </div>
          );
        }
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
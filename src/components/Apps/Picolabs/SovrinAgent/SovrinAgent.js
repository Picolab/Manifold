import React from 'react';
import './SovrinAgent.css';
import icon from './SovrinIcon.png';
import { Button, Media, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup, InputGroupAddon, Input} from 'reactstrap';
import InvitationModal from './InvitationModal';
import ConnectionModal from './ConnectionModal';
import EdgeModal from './EdgeModal';
import DeleteRouterModal from './DeleteRouterModal';
import ViaRouterSwitch from './ViaRouterSwitch';

class SovrinAgent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invitationOpen: false,
      actionsOpen: false,
      technicalDetails: {},
      received_Invitation: "",
      messages: [],
      configured: false,
      edgeModal: false,
      deleteRouterModal: false,
      hasRouterConnection: false,
      viaRouterCheck: false
    };
    this.poll = this.poll.bind(this);
    this.invitationToggle = this.invitationToggle.bind(this);
    this.actionsToggle = this.actionsToggle.bind(this);
    this.receiveInvitation = this.receiveInvitation.bind(this);
    this.deleteRouter = this.deleteRouter.bind(this)
    this.getUI = this.getUI.bind(this);
    this.getEdgeUI = this.getEdgeUI.bind(this);
    this.edgeToggle = this.edgeToggle.bind(this);
    this.deleteRouterToggle = this.deleteRouterToggle.bind(this);
    this.viaRouterCheck = this.viaRouterCheck.bind(this);

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

  edgeToggle() {
    this.setState(prevState => ({
      edgeModal: !prevState.edgeModal,
      actionsOpen: !prevState.actionsOpen
    }));
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

  invitationToggle() {
    this.setState(prevState => ({
      invitationOpen: !prevState.invitationOpen
    }));
  }

  actionsToggle() {
    this.setState(prevState => ({
      actionsOpen: !prevState.actionsOpen
    }));
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
        this.getEdgeUI();
        this.getIconImages(resp.data['connections'])
      }
    });
  }

  getEdgeUI() {
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

  displayViaRouterInvitation() {
    return (
      <div>
        <DropdownItem className="actionHeader" header>Generate Invitation via {this.state.routerName}</DropdownItem>
        <InputGroup>
          <Input id={this.state.routerUI["invitationVia".concat(this.state.routerName)]} defaultValue={this.state.routerUI["invitationViaRouter"]}/>
            <InputGroupAddon addonType="append">
              <Button className="copyButton" id={this.state.routerUI["invitationVia".concat(this.state.routerName)]} value={this.state.routerUI["invitationViaRouter"]} onClick={this.copyInvitation}>Copy</Button>
            </InputGroupAddon>
        </InputGroup>
        </div>
    );
  }

  displayMakeEdgeOption() {
    return (
      <DropdownItem className="actionHeader" style={{"padding": "0", "marginTop": "5px"}} header>
        <EdgeModal
          name={this.state.technicalDetails['name']}
          edgeToggle={this.edgeToggle}
          edgeModal={this.state.edgeModal}
          signalEvent={this.props.signalEvent}
          manifoldQuery={this.props.manifoldQuery}
          getEdgeUI={this.getEdgeUI}
          button={<Button className="makeEdge" style={{"color": "#87cefa"}} onClick={this.edgeToggle}><i className="fa fa-plus-circle" /> Configure Inbound Router</Button>}
        />
      </DropdownItem>
    );
  }

  displayDeleteRouterOption() {
    return (
      <DropdownItem className="actionHeader" style={{"padding": "0", "marginTop": "5px"}} header>
        <DeleteRouterModal
          name={this.state.technicalDetails['name']}
          deleteRouterToggle={this.deleteRouterToggle}
          deleteRouterModal={this.state.deleteRouterModal}
          signalEvent={this.props.signalEvent}
          manifoldQuery={this.props.manifoldQuery}
          hasRouterConnection={this.state.hasRouterConnection}
          deleteRouter={this.deleteRouter}
          button={<Button className="makeEdge" style={{"color": "red"}} onClick={this.deleteRouterToggle}><i className="fa fa-minus-circle" /> Delete Inbound Router</Button>}
        />
      </DropdownItem>
    );
  }

  viaRouterCheck() {
    this.setState(prevState => ({
      viaRouterCheck: !prevState.viaRouterCheck
    }));
  }

  openInvite(e) {
    return (
      <div>
        <InvitationModal/>
      </div>
    );
  }

  copyInvitation(e) {
    const text = document.getElementById(e.target.id);
    text.select();
    document.execCommand('copy');
  }

  receiveInvitation() {
    let attributes = this.state.viaRouterCheck === true ? { url: this.state.received_Invitation, need_router_connection: true } : { url: this.state.received_Invitation }
    const promise = this.props.signalEvent({
      domain : "sovrin",
      type: "new_invitation",
      attrs : attributes
    })
    promise.then((resp) => {
      this.setState({
        received_Invitation: "",
        viaRouterCheck: false
      });
    })
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
            <Dropdown isOpen={this.state.actionsOpen} toggle={this.actionsToggle}>
              <DropdownToggle color='primary' className='notificationButton' outline caret>
                Actions
              </DropdownToggle>
              <DropdownMenu className="actionsMenu">
                <DropdownItem className="actionHeader" header>Generate Invitation</DropdownItem>
                  <InputGroup>
                    <Input id={this.state.technicalDetails["invitation"]} defaultValue={this.state.technicalDetails["invitation"]}/>
                    <InputGroupAddon addonType="append">
                      <Button className="copyButton" id={this.state.technicalDetails["invitation"]} value={this.state.technicalDetails["invitation"]} onClick={this.copyInvitation}>Copy</Button>
                    </InputGroupAddon>
                  </InputGroup>
              {this.state.configured === true && this.displayViaRouterInvitation()}
              <div className="actionHeader">Receive Invitation {this.state.configured && <ViaRouterSwitch text={"via "+this.state.routerName} isChecked={this.state.viaRouterCheck} action={this.viaRouterCheck}/>}</div>
                <InputGroup>
                  <Input type="text" name="received_Invitation" placeholder="Receive Invitation" value={this.state.received_Invitation} onChange={this.onChange('received_Invitation')}/>
                  <InputGroupAddon addonType="append">
                    <Button className="receiveButton" onClick={this.receiveInvitation}>Receive</Button>
                  </InputGroupAddon>
                </InputGroup>
              {this.state.configured === false ? this.displayMakeEdgeOption() : this.displayDeleteRouterOption()}
            </DropdownMenu>
            </Dropdown>
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
              />
                {this.hasRouter(this.state.technicalDetails['connections'][item]['label']) === true  ? <div className="agentLabel"> {this.state.technicalDetails['connections'][item]['label']} <span> (via {this.state.routerName}) </span> </div> : <div className="agentLabel"> {this.state.technicalDetails['connections'][item]['label']} </div>}
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
              />
              <div className="agentLabel">
                {this.hasRouter(this.state.technicalDetails['connections'][item]['label']) === true  ? <div className="agentLabel"> {this.state.technicalDetails['connections'][item]['label']} (via {this.state.routerName}) </div> : <div className="agentLabel"> {this.state.technicalDetails['connections'][item]['label']} </div>}
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
export default SovrinAgent;

import React from "react";
import { Button, Dropdown, DropdownToggle, DropdownMenu, Input} from 'reactstrap';
import MakeStaticModal from "./MakeStaticModal"
import "./ConnectionDropdown.css";
import { displayError } from '../../../../../utils/manifoldSDK';

class ConnectionDropdown extends React.Component {

  constructor ( props ) {
    super(props);

  	this.state = {
      actionsOpen: false,
      generateInvitationToggle: false,
      invitation: "",
      receivedInvitation: "",
      isStatic: true,
      actionsToggleActive: true,
      loading: true
  	}

    this.actionsToggle = this.actionsToggle.bind(this);
    this.generateInvitationToggle = this.generateInvitationToggle.bind(this);
    this.receiveInvitation = this.receiveInvitation.bind(this);
    this.getInvitation = this.getInvitation.bind(this);
    this.isStatic = this.isStatic.bind(this);
    this.acceptConnections = this.acceptConnections.bind(this);
    this.activateActionsToggle = this.activateActionsToggle.bind(this);
  }

  componentDidMount() {
    this.isStatic()
  }

  componentDidUpdate(prevProps) {
    if (this.props.picoID !== prevProps.picoID) {
      this.setState({
        loading: true
      },()=>{this.isStatic();})
    }
  }
  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      this.setState({
        [stateKey]: value
      })
    }
  }

  isStatic() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.manifold_cloud_agent",
      funcName: "isStatic"
    });
    promise.then((resp) => {
      this.setState({
        isStatic: resp.data,
        loading: !resp.data
      });

      if(resp.data === false) {
        this.getInvitation()
      }
    }).catch((e) => {
        displayError(true, "Error chekcing if agent is static.", 404);
        console.error("Error checking if agent is static.", e);
    });
  }

  acceptConnections() {
    const promise = this.props.signalEvent({
      domain:"sovrin",
      type:"accept_connections",
      attrs: {
      }
    })
    promise.then((resp) => {
      this.isStatic()
    })
  }

  getInvitation() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.aca.connections",
      funcName: "invitation"
    })
    promise.then((resp) => {
      this.setState({
        invitation: resp.data,
        loading: false
      });
    }).catch((e) => {
        displayError(true, "Error getting invitation.", 404);
        console.error("Error getting invitation.", e);
    });
  }

  activateActionsToggle() {
    console.log("activate or deactivate");
    this.setState(prevState => ({
      actionsToggleActive: !prevState.actionsToggleActive
    }));
  }

  actionsToggle() {
    if(this.state.actionsToggleActive) {
      this.setState(prevState => ({
        actionsOpen: !prevState.actionsOpen
      }));
    }
  }

  generateInvitationToggle() {
    this.setState(prevState => ({
      generateInvitationToggle: !prevState.generateInvitationToggle
    }));
  }

  copyInvitation(e) {
    const text = document.getElementById(e.target.id);
    text.select();
    document.execCommand('copy');
  }

  receiveInvitation() {
    let attributes = { uri: this.state.receivedInvitation }
    const promise = this.props.signalEvent({
      domain : "didcomm",
      type: "message",
      attrs : attributes
    })
    promise.then((resp) => {
      this.setState({
        receivedInvitation: ""
      });
    })
  }

  displayInvitation() {
    return (
      <div>
        <Input id={this.state.invitation} defaultValue={this.state.invitation} className="genInvitationInput"/>
        <Button className="actionButton" id={this.state.invitation} value={this.state.invitation} onClick={this.copyInvitation}>Copy</Button>
      </div>
    );
  }



  displayConnectionActions() {
    if(this.state.isStatic === false) {
      return (
        <Dropdown isOpen={this.state.actionsOpen} toggle={this.actionsToggle}>
          <DropdownToggle color='primary' className='notificationButton' outline caret>
            Actions
          </DropdownToggle>
          <DropdownMenu className="actionsMenu">
            <div className="actionsContainer">
              <div className="genInvitationContainer">
                { this.state.generateInvitationToggle ? <div>Generated Invitation</div> : <div>Generate Invitation</div>}
                { this.state.generateInvitationToggle ? this.displayInvitation() : <i className="fa fa-plus-circle fa-3x genInvitationButton" onClick={this.generateInvitationToggle}/>}
              </div>
              <div className="orContainer">
                <div className="divider" />
                <div style={{"marginLeft": "5px", "marginRight": "5px"}}>or</div>
                <div className="divider"/>
              </div>
              <div className="recInvitationContainer">
                <div> Receive an Invitation </div>
                <Input type="text" name="invitation" placeholder="Receive Invitation" className="recInvitationInput" value={this.state.receivedInvitation} onChange={this.onChange('receivedInvitation')}/>
                <Button className="actionButton" onClick={this.receiveInvitation}>Receive</Button>
              </div>
              <MakeStaticModal
                isStatic={this.isStatic}
                signalEvent={this.props.signalEvent}
                activateActionsToggle={this.activateActionsToggle}
              />
            </div>
          </DropdownMenu>
        </Dropdown>
      );
    }
    else {
      return (
          <Button onClick={this.acceptConnections} className="enableConnectionsButton"> <i className="fa fa-plus-circle" /> Enable Connections</Button>
      );
    }
  }


  render () {
      if(this.state.loading) {
        return(
          <div className="connectionButtonContainer">
            <div className="connectionButtonLoading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        );
      }
      return(
        <div className="connectionButtonContainer">
          {this.displayConnectionActions()}
        </div>
      );
    }

}
export default ConnectionDropdown;

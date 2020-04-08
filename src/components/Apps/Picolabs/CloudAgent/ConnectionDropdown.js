import React from "react";
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup, InputGroupAddon, Input} from 'reactstrap';

class ConnectionDropdown extends React.Component {

  constructor ( props ) {
    super(props);

  	this.state = {
      actionsOpen: false,
      invitation: "",
      receivedInvitation: "",
      isStatic: true
  	}

    this.actionsToggle = this.actionsToggle.bind(this);
    this.receiveInvitation = this.receiveInvitation.bind(this);
    this.getInvitation = this.getInvitation.bind(this);
    this.isStatic = this.isStatic.bind(this);
    this.acceptConnections = this.acceptConnections.bind(this);
  }

  componentDidMount() {
    this.isStatic()
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
      rid: "org.sovrin.manifold_cloud_agent",
      funcName: "isStatic"
    }).catch((e) => {
        console.error("Error getting technical details", e);
    });
    promise.then((resp) => {
      this.setState({
        isStatic: resp.data
      });

      if(resp.data === false) {
        this.getInvitation()
      }
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
      rid: "org.sovrin.aca.connections",
      funcName: "invitation"
    }).catch((e) => {
        console.error("Error getting technical details", e);
    });
    promise.then((resp) => {
      this.setState({
        invitation: resp.data
      });
    });
  }

  actionsToggle() {
    this.setState(prevState => ({
      actionsOpen: !prevState.actionsOpen
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

  displayConnectionActions() {
    if(this.state.isStatic === false) {
      return (
        <Dropdown isOpen={this.state.actionsOpen} toggle={this.actionsToggle}>
          <DropdownToggle color='primary' className='notificationButton' outline caret>
            Actions
          </DropdownToggle>
          <DropdownMenu className="actionsMenu">
            <DropdownItem className="actionHeader" header>Generate Invitation</DropdownItem>
              <InputGroup>
                <Input id={this.state.invitation} defaultValue={this.state.invitation}/>
                <InputGroupAddon addonType="append">
                  <Button className="copyButton" id={this.state.invitation} value={this.state.invitation} onClick={this.copyInvitation}>Copy</Button>
                </InputGroupAddon>
              </InputGroup>
            <div className="actionHeader">Receive Invitation </div>
              <InputGroup>
                <Input type="text" name="invitation" placeholder="Receive Invitation" value={this.state.receivedInvitation} onChange={this.onChange('receivedInvitation')}/>
                <InputGroupAddon addonType="append">
                  <Button className="receiveButton" onClick={this.receiveInvitation}>Receive</Button>
                </InputGroupAddon>
              </InputGroup>
          </DropdownMenu>
        </Dropdown>
      );
    }
    else {
      return (
          <Button onClick={this.acceptConnections}>Enable Connections</Button>
      );
    }
  }


  render () {
      return(
        <div>
          {this.displayConnectionActions()}
        </div>
      );
    }

}
export default ConnectionDropdown;

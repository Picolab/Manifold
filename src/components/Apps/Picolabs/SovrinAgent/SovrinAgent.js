import React from 'react';
import './SovrinAgent.css';
import icon from './SovrinIcon.png';
import { Button, Media, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup, InputGroupAddon, Input} from 'reactstrap';
import InvitationModal from './InvitationModal';
import ConnectionModal from './ConnectionModal';

class SovrinAgent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invitationOpen: false,
      actionsOpen: false,
      technicalDetails: {},
      received_Invitation: "",
      messages: []
    };
    this.invitationToggle = this.invitationToggle.bind(this);
    this.actionsToggle = this.actionsToggle.bind(this);
    this.receiveInvitation = this.receiveInvitation.bind(this);
    this.getUI = this.getUI.bind(this);
  }

  componentDidMount() {
    this.getUI()
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jdenticon@2.1.1";
    script.async = true;
    document.body.appendChild(script);
    this.connVar = setInterval(() => this.getUI(), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.connVar);
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
        this.getIconImages(resp.data['connections'])
      }
    });
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
    const promise = this.props.signalEvent({
      domain : "sovrin",
      type: "new_invitation",
      attrs : {
        url: this.state.received_Invitation
      }
    })
    promise.then((resp) => {
      this.setState({
        received_Invitation: ""
      });
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
                    <Input id={this.state.technicalDetails["invitation"]} value={this.state.technicalDetails["invitation"]}/>
                    <InputGroupAddon addonType="append">
                      <Button id={this.state.technicalDetails["invitation"]} value={this.state.technicalDetails["invitation"]} onClick={this.copyInvitation}>Copy</Button>
                    </InputGroupAddon>
                  </InputGroup>
                <DropdownItem header>Receive Invitation</DropdownItem>
                  <InputGroup>
                    <Input type="text" name="received_Invitation" placeholder="Receive Invitation" value={this.state.received_Invitation} onChange={this.onChange('received_Invitation')}/>
                    <InputGroupAddon addonType="append">
                      <Button onClick={this.receiveInvitation}>Receive</Button>
                    </InputGroupAddon>
                  </InputGroup>
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
              <div className="agentLabel">
                {this.state.technicalDetails['connections'][item]['label']}
              </div>
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
                {this.state.technicalDetails['connections'][item]['label']}
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

import React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Media, TabContent, TabPane, Nav, NavItem,
        NavLink, Row, Col} from 'reactstrap';
import {customEvent} from '../../../../utils/manifoldSDK';
import Chat from './Chat';
import classnames from 'classnames';

class ConnectionModal extends React.Component {
  constructor(props) {
    super(props);
    let modalState = localStorage.getItem('modalState'.concat(this.props.theirDID));
    let tab = localStorage.getItem('currentTab'.concat(this.props.theirDID));
    this.state = {
      modal: modalState === 'true' ? true : false,
      activeTab: tab !== null ? tab : '1',
      pingStatus: null
    };
    this.modalToggle = this.modalToggle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.sendTrustPing = this.sendTrustPing.bind(this);
    this.getPingStatus = this.getPingStatus.bind(this);
    this.deleteConnection = this.deleteConnection.bind(this);
  }

  componentDidMount() {
    // const script = document.createElement("script");
    // script.src = "https://cdn.jsdelivr.net/npm/jdenticon@2.1.1";
    // script.async = true;
    // document.body.appendChild(script);
  }

  modalToggle() {
    localStorage.setItem('modalState'.concat(this.props.theirDID), !this.state.modal)
    this.setState(prevState => ({
      modal: !prevState.modal,
      pingStatus: null
    }));
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      localStorage.setItem('currentTab'.concat(this.props.theirDID), tab);
      this.setState({
        activeTab: tab,
        pingStatus: null
      });
    }
  }

  getPingStatus() {
    const promise = this.props.manifoldQuery({
      rid: "org.sovrin.manifold_agent",
      funcName: "pingStatus"
    }).catch((e) => {
        console.error("Error getting message status", e);
    });
    promise.then((resp) => {
      console.log(resp.data);
      if(resp.data === "pending") {
        if(this.pingStatusCheck === undefined || this.pingStatusCheck === null) {
            this.pingStatusCheck = setInterval(() => this.getPingStatus(), 500);
        }
        this.setState({
          pingStatus: resp.data
        });
      }
      else if(resp.data === "disconnected") {
        if(this.pingStatusCheck !== undefined) {
            clearInterval(this.pingStatusCheck);
            this.pingStatusCheck = undefined;
        }
        this.setState({
          pingStatus: resp.data
        });

      }
      else if(resp.data === "connected") {
        this.props.getUI();
        if(this.pingStatusCheck !== undefined) {
            clearInterval(this.pingStatusCheck);
            this.pingStatusCheck = undefined;
        }
        this.setState({
          pingStatus: resp.data
        });
      }
    });
  }

  sendTrustPing() {
    const promise = this.props.signalEvent({
      domain : "sovrin",
      type: "check_connection",
      attrs : {
        their_vk: this.props.their_vk
      }
    });
    promise.then((resp) => {
      this.getPingStatus();
    });
  }

  deleteConnection() {
    const promise = customEvent( this.props.myDID , "sovrin", "connection_expired", { their_vk: this.props.their_vk }, '5');
    promise.then((resp) => {
      this.props.getUI();
    });
    this.modalToggle();
  }

  render() {
    // const script = document.createElement("script");
    // script.src = "https://cdn.jsdelivr.net/npm/jdenticon@2.1.1";
    // script.async = true;
    // document.body.appendChild(script);
    return (
      <div className="agentLabel">
        { this.props.image !== null ? <Media object src={this.props.image} className='connection' onClick={this.modalToggle}/> : <svg className="connection" data-jdenticon-value={this.props.title} onClick={this.modalToggle}></svg>}
        <Modal isOpen={this.state.modal} toggle={this.modalToggle} className={this.props.className}>
          <ModalHeader toggle={this.modalToggle}>Connection with {this.props.title}</ModalHeader>
          <ModalBody>
            <div>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggle('1'); }}
                  >
                    Info
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggle('2'); }}
                  >
                    Chat
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <h4>Connection Information</h4>
                        <div className="textStickOut"> My DID: {this.props.myDID} </div>
                        <div className="textStickOut"> Their DID: {this.props.theirDID} </div>
                      <button className="btn-info" onClick={this.sendTrustPing}>Send Trust Ping</button> {' '}
                      <button className="btn-danger" onClick={this.deleteConnection}>Delete Connection</button>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Chat
                    myImage={this.props.myImage}
                    connectionImage = { this.props.image !== null ? <Media object src={this.props.image} className="connectionPic" /> : null}
                    messages={this.props.messages}
                    their_vk={this.props.their_vk}
                    signalEvent={this.props.signalEvent}
                    manifoldQuery={this.props.manifoldQuery}
                    getUI={this.props.getUI}
                    theirDID={this.props.theirDID}
                    title={this.props.title}
                    invitation={this.props.invitation}
                  />
                </TabPane>
              </TabContent>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.modalToggle}>Cancel</Button>
          </ModalFooter>
          {(this.state.pingStatus === 'connected') && <div id="snackbar" style={{left: "50%", color: "green"}}>You are connected to {this.props.title}</div>}
          {(this.state.pingStatus === 'disconnected') && <div id="snackbar" style={{left: "47%"}}>You are not connected to {this.props.title}</div>}
        </Modal>
      </div>
    );
  }
}
export default ConnectionModal;

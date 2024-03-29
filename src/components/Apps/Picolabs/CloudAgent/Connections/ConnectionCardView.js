import React from 'react';
import { Media, TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import { customQuery, displayError } from '../../../../../utils/manifoldSDK';
import { getManifoldECI } from '../../../../../utils/AuthService';
import Messaging from './Messaging';
import Ping from './Ping';
import Advanced from './Advanced';
import "./ConnectionModal.css"
import classnames from 'classnames';
import queryString from 'query-string';

class ConnectionCardView extends React.Component {
  constructor(props) {
    super(props);
    let tab = localStorage.getItem('currentTab'.concat(this.props.theirDID));

    this.state = {
      activeTab: tab !== null ? tab : '1',
      pingStatus: ""
    };
    this.toggle = this.toggle.bind(this);
    this.sendTrustPing = this.sendTrustPing.bind(this);
    this.getPingStatus = this.getPingStatus.bind(this);
  }

  componentDidMount() {
    this.setCurrentPage();
  }

  componentWillUnmount() {
    this.props.signalEvent({
      domain:"sovrin",
      type:"set_page",
      attrs: {
        page: "connections"
      }
    });
  }

  componentDidUpdate() {
    this.checkForNotifications();
    this.setCurrentPage();
  }

  setCurrentPage() {

    if(localStorage.getItem('modalState'.concat(this.props.theirDID)) === "false") {
      this.props.signalEvent({
        domain:"sovrin",
        type:"set_page",
        attrs: {
          page: "connections"
        }
      })
    } else {
      if(localStorage.getItem('currentTab'.concat(this.props.theirDID)) === '1') {
        this.props.signalEvent({
          domain:"sovrin",
          type:"set_page",
          attrs: {
            page: "info"
          }
        })
      } else {
        this.props.signalEvent({
          domain:"sovrin",
          type:"set_page",
          attrs: {
            page: "messaging",
            their_vk: this.props.their_vk
          }
        })
      }
    }
  }

  checkForNotifications() {
    var index = window.location.href.lastIndexOf("?");
    if(index === -1) {
      return;
    }
    let {id} = queryString.parse(window.location.href.substring(index));
    if(id === null) {
      return;
    }
    let promise = customQuery(getManifoldECI(),"io.picolabs.notifications", "getState", {id});

    promise.then((resp) => {
      if(this.props.theirDID === resp.data.agent) {
        this.setState({
          activeTab: resp.data.tab,
          modal: true
        });
      }

      window.location.href = window.location.href.substring(0,index);
    })

  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      localStorage.setItem('currentTab'.concat(this.props.theirDID), tab);
      this.setState({
        activeTab: tab,
        pingStatus: ""
      });
    }
  }

  getPingStatus() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.manifold_cloud_agent",
      funcName: "getPingStatus"
    })

    promise.then((resp) => {
      this.setState({
        pingStatus: resp.data
      })
    }).catch((e) => {
        displayError(true, "Error getting ping status.", 404);
        console.error("Error getting ping status.", e);
    });
  }

  sendTrustPing() {
    const promise = this.props.signalEvent({
      domain: "aca_trust_ping",
      type: "new_ping",
      attrs: {
        their_vk: this.props.their_vk
      }
    });

    promise.then((resp) => {
      setTimeout(this.getPingStatus, 3000);
    }).catch((e) => {
        displayError(true, "Error sending trust ping.", 404);
        console.error("Error sending trust ping.", e);
    });
  }

  render() {
    return (
      <div>
        <div>
          <div>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}
                >
                  Ping
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2'); }}
                >
                  Messaging
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3' })}
                  onClick={() => { this.toggle('3'); }}
                >
                  Credentials
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '4' })}
                  onClick={() => { this.toggle('4'); }}
                >
                  Advanced
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Ping
                  sendTrustPing={this.sendTrustPing}
                  signalEvent={this.props.signalEvent}
                  manifoldQuery={this.props.manifoldQuery}
                  their_vk={this.props.their_vk}
                  pingStatus={this.state.pingStatus}
                />
              </TabPane>
              <TabPane tabId="2">
                <Messaging
                  myImage={this.props.myImage}
                  connectionImage = { this.props.image !== null ? <Media object src={this.props.image} className="connectionPic" /> : null}
                  their_vk={this.props.their_vk}
                  signalEvent={this.props.signalEvent}
                  manifoldQuery={this.props.manifoldQuery}
                  title={this.props.title}
                  invitation={this.props.endPoint}
                />
              </TabPane>
              <TabPane tabId="3">
                <div>Coming soon...</div>
              </TabPane>
              <TabPane tabId="4">
                <Advanced
                  myDID={this.props.myDID}
                  theirDID={this.props.theirDID}
                  their_vk={this.props.their_vk}
                  getConnections={this.props.getConnections}
                  signalEvent={this.props.signalEvent}
                  returnToConnections={this.props.returnToConnections}
                />
              </TabPane>
            </TabContent>
          </div>
        </div>
      </div>
    );
  }
}
export default ConnectionCardView;

import React, { Component } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroupItem, ListGroup} from 'reactstrap';
import {customQuery, customEvent} from '../../utils/manifoldSDK';
import {getManifoldECI} from '../../utils/AuthService';
import './notificationsCSS.css'

export class NotificationsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      notifications: [],
      notificationsCount: 0
    };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.getNotifications();
    this.getNotificationsCount();
    this.notifyCountVar = setInterval(() => this.getNotificationsCount(), 3000);
  }

  toggle() {
    if (!this.state.modal) this.getNotifications();
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  getNotifications() {
    const promise = customQuery(getManifoldECI(), 'io.picolabs.notifications', 'getNotifications');
    promise.then((resp) => {
      this.setState({
        notifications: resp.data
      });
      console.log(resp.data);
    });
  }

  getNotificationsCount() {
    const promise = customQuery(getManifoldECI(), 'io.picolabs.notifications', 'getBadgeNumber', {});
    promise.then((resp) => {
      if(this.state.notificationsCount !== resp.data) {
        if(this.state.notificationsCount < resp.data) this.getNotifications();
        this.setState({
          notificationsCount: resp.data
        });
      }
    });
  }

  removeNotification(id) {
    return () => {
      const promise = customEvent(getManifoldECI(), 'manifold', 'remove_notification', {'notificationID': id}, 'remove_notification');
      promise.then((resp) => {
        this.getNotifications();
      });
    };
  }



  displayNotifications() {
    var out = [];
    for(var item in this.state.notifications) {
      out.push(
        <div>
          <ListGroupItem>
            <i id={"open" + this.state.notifications[item].message} className="fas fa-external-link-alt"></i>
            <i id={"delete" + this.state.notifications[item].message} className="fa fa-trash float-right fa-lg manifoldDropdown" onClick={this.removeNotification(this.state.notifications[item].id)}/>
            <h5 className="title" >{this.state.notifications[item].app}</h5>
            <p className="timestamp">from {this.state.notifications[item].thing}</p>
            <p className="content">{this.state.notifications[item].message}</p>

          </ListGroupItem>
        </div>
      );
    }
    if(out.length !== 0)return out;
    else return "You have no new notifications.";
  }

  render() {
    return (
      <div>
        <div>
          {this.state.notificationsCount > 0 && <span className="manifold_notification" color="#f00" onClick={this.toggle}>{this.state.notificationsCount}</span>}
          <i className="icon-bell bell" onClick={this.toggle}></i>
        </div>
        <Modal isOpen={this.state.modal} className={'modal-info'}>
          <ModalHeader > Notifications</ModalHeader>
          <ModalBody>
            <ListGroup className="notificationsBody">
              {this.displayNotifications()}
            </ListGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default NotificationsModal

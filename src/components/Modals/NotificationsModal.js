import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroupItem, ListGroup} from 'reactstrap';
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

  convertDate(timestamp) {
    let toReturn = "";
    let ampm = "";
    let date = 0;
    let difference = 0;
    let year = timestamp.substring(0,4);
    let day = timestamp.substring(8,10);
    let month = timestamp.substring(5,7);
    let hour = timestamp.substring(11,13);
    let minute = timestamp.substring(14,16);
    let second = timestamp.substring(17,19);

    switch (month) {
      case "01":
        month = "January";
        break;
      case "02":
        month = "February";
        break;
      case "03":
        month = "March";
        break;
      case "04":
        month = "April";
        break;
      case "05":
        month = "May";
        break;
      case "06":
        month = "June";
        break;
      case "07":
        month = "July";
        break;
      case "08":
        month = "August";
        break;
      case "09":
        month = "September";
        break;
      case "10":
        month = "October";
        break;
      case "11":
        month = "November";
        break;
      case "12":
        month = "December";
        break;
      default:
        month = "";
    }

    date = new Date(month + " " + day + ", " + year + " " + hour + ":" + minute + ":" + second + " GMT+07:00");
    difference = date.getTimezoneOffset() / 60;
    hour -= difference;

    if (hour < 1) hour += 24;
    if (hour > 12) {
      hour -=12;
      ampm = "pm"
    } else {
      ampm = "am"
    }

    toReturn = month + " " + day + ", " + year + " " + hour + ":" + minute + ampm;
    return toReturn;
  }


  displayNotifications() {
    var out = [];
    for(var item in this.state.notifications) {
      out.push(
        <div>
          <ListGroupItem style={{"padding": "1rem 1.25rem"}}>
            <i id={"delete" + this.state.notifications[item].message} className="fa fa-trash float-right fa-lg manifoldDropdown" onClick={this.removeNotification(this.state.notifications[item].id)}/>
            <a href={`/#/mythings/${this.state.notifications[item].picoId}/${this.state.notifications[item].ruleset}`} onClick={this.toggle}><i id={"open" + this.state.notifications[item].message} className="fa fa-sign-in float-right fa-lg manifoldDropdown" /></a>
            <h5 className="title" >{this.state.notifications[item].thing} - {this.state.notifications[item].app}</h5>
            <p className="timestamp">{this.convertDate(this.state.notifications[item].time)}</p>
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

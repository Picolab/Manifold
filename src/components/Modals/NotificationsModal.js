import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroupItem, ListGroup} from 'reactstrap';
import { connect } from 'react-redux';
import { storeNotifications, storeNotificationsCount } from '../../actions';
import { getNotificationsCount, getNotifications } from '../../reducers';
import {customQuery, customEvent} from '../../utils/manifoldSDK';
import {getManifoldECI} from '../../utils/AuthService';
import './notificationsCSS.css'

class NotificationsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      count: 0,
      isActive: true
    };
    this.toggle = this.toggle.bind(this);
    this.getNotificationsCount = this.getNotificationsCount.bind(this);
    this.poll = this.poll.bind(this);
    this.resetPoll = this.resetPoll.bind(this);
    this.visibilitychange = this.visibilitychange.bind(this);
    this.timeout = null;
    this.prev = 1;
    this.curr = 1;
  }

  componentDidMount() {
    this.getNotifications();
    this.poll()
    window.addEventListener("mouseover", this.resetPoll)
    window.addEventListener("visibilitychange", this.visibilitychange)
  }

  componentWilUnmount() {
    window.removeEventListener("mouseover", this.resetPoll);
    window.removeEventListener("visibilitychange", this.visibilitychange);
  }

  resetPoll() {
    clearTimeout(this.timeout);
    console.log("cleared");
    this.prev = 1;
    this.curr = 1;
    this.poll();
  }

  visibilitychange() {
    if(!document.hidden) {
      this.resetPoll();
    }
  }

  poll() {
    this.timeout = setTimeout(async () => {
      let next = this.prev + this.curr;
      this.prev = this.curr;
      this.curr = next;

      await this.getNotificationsCount();
      this.poll()
      console.log(this.curr);
    }, this.curr * 1000);
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
      this.props.storeNotifications(resp.data);
    });
  }

  getNotificationsCount() {
    if(this.state.isActive === true) {
      const promise = customQuery(getManifoldECI(), 'io.picolabs.notifications', 'getBadgeNumber', {});
      promise.then((resp) => {
        if(this.props.count !== resp.data) {
          if(this.props.count < resp.data) this.getNotifications();
          this.props.storeCount(resp.data);
        }
      });
    }
  }

  removeNotification(id) {
    return () => {
      const promise = customEvent(getManifoldECI(), 'manifold', 'remove_notification', {'notificationID': id}, 'remove_notification');
      promise.then((resp) => {
        this.getNotifications();
      });
    };
  }

  seenNotification(id) {
    return () => {
      let remove = this.removeNotification(id);
      remove();
      this.toggle();
    }
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
    for(var item in this.props.notifications) {
      out.push(
        <div key={this.props.notifications[item].id}>
          <ListGroupItem style={{"padding": "1rem 1.25rem"}}>
            <i id={"delete" + this.props.notifications[item].message} className="fa fa-trash float-right fa-lg manifoldDropdown" onClick={this.removeNotification(this.props.notifications[item].id)}/>
            <a href={`/#/mythings/${this.props.notifications[item].picoId}/${this.props.notifications[item].ruleset}?id=${this.props.notifications[item].id}`}><i id={"open" + this.props.notifications[item].message} className="fa fa-sign-in float-right fa-lg manifoldDropdown" onClick={this.seenNotification(this.props.notifications[item].id)}/></a>
            <h5 className="title" >{this.props.notifications[item].thing} - {this.props.notifications[item].app}</h5>
            <p className="timestamp">{this.convertDate(this.props.notifications[item].time)}</p>
            <p className="content">{this.props.notifications[item].message}</p>

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
          {this.props.count > 0 && <span className="manifold_notification" color="#f00" onClick={this.toggle}>{this.props.count}</span>}
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

const mapStateToProps = (state) => {
  return {
    count: getNotificationsCount(state),
    notifications: getNotifications(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    storeCount: (count) => dispatch(storeNotificationsCount(count)),
    storeNotifications: (notifications) => dispatch(storeNotifications(notifications))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsModal);

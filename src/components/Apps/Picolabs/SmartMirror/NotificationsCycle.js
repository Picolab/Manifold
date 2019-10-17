import React from 'react';
import {customQuery} from '../../../../utils/manifoldSDK';
import {getManifoldECI} from '../../../../utils/AuthService';
import './NotificationsCycle.css';

class NotificationsCycle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      notificationsCount: 0,
      notificationIndex: 0,
      notificationOnDisplay: 0,
      fadeIn: true
    }

  }

  componentDidMount() {
    this.getNotifications();
    this.getNotificationsCount();
    this.notifyCountVar = setInterval(() => this.getNotificationsCount(), 3000);
    this.cycleVar = setInterval(() => this.cycle(), 3000);
  }

  componentDidUpdate() {
  }

  cycle() {
    if(this.state.notifications[0] && this.state.notifications.length > 0) {
      if(this.state.notifications[this.state.notificationIndex] &&
        this.state.notificationOnDisplay !== this.state.notifications[this.state.notificationIndex].id) {

        this.setState({
          fadeIn: true,
          notificationOnDisplay: this.state.notifications[this.state.notificationIndex].id,
          notificationIndexOnDisplay: this.state.notificationIndex
        })
      }
      else {
        if(this.state.notificationsCount > 1) {
          this.setState({
            fadeIn: false,
            notificationIndex: (this.state.notificationIndex + 1) % this.state.notifications.length
          })
        }
      }
    }
}

  getNotifications() {
    const promise = customQuery(getManifoldECI(), 'io.picolabs.notifications', 'getNotifications');
    promise.then((resp) => {
      if(resp.data[0]) {
        this.setState({
          notifications: resp.data,
          notificationOnDisplay: resp.data[0].id,
          notificationIndexOnDisplay: 0
        });
      }
      this.setState({
        notifications: resp.data
      });
    });
  }

  getNotificationsCount() {
    const promise = customQuery(getManifoldECI(), 'io.picolabs.notifications', 'getBadgeNumber', {});
    promise.then((resp) => {
      if(this.state.notificationsCount !== resp.data) {
        if(this.state.notificationsCount > 0) this.getNotifications();
        this.setState({
          notificationsCount: resp.data
        });
      }
    });
  }

  displayNotifications() {
    let index = this.state.notificationIndexOnDisplay;
    if(this.state.notifications.length > 0) {
        return (
          <div className={this.state.fadeIn ? "notifications show" : "notifications noshow"}>
              <h5 className="title" style={{"fontSize": "28px"}}>{this.state.notifications[index].thing} - {this.state.notifications[index].app}</h5>
              <div className="distimestamp" style={{"fontSize": "20px"}}>{this.convertDate(this.state.notifications[index].time)}</div>
              <div className="discontent" style={{"fontSize": "28px"}}>{this.state.notifications[index].message}</div>
          </div>
        );
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

  render() {
    if(this.state.notifications.length === 0) {
      return <div className="noNotifications">You have no new notifications.</div>;
    }
    return(
      this.displayNotifications()
    );
  }
}
export default NotificationsCycle;

import React from 'react';
import {connect} from 'react-redux';
import {getNotifications, getNotificationsCount} from '../../../../reducers';
import './NotificationsCycle.css';

class NotificationsCycle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      fadeIn: true
    }
  }

  componentDidMount() {
    this.cycleVar = setInterval(() => this.cycle(), 3000);
  }

  componentWilUnmount() {
    clearInterval(this.cycleVar);
  }

  cycle() {
    const { notifications } = this.props;
    const { fadeIn, current } = this.state;
    if (fadeIn) {
      this.setState({
        fadeIn: false,
      })
    }
    else {
      this.setState({
        fadeIn: true,
        current: (current + 1) % notifications.length
      })
    }
  }

  displayNotifications() {
    const { current, fadeIn } = this.state;
    return (
      <div className={fadeIn ? "notifications show" : "notifications noshow"}>
          <h5 className="title" style={{"fontSize": "28px"}}>{this.props.notifications[current].thing} - {this.props.notifications[current].app}</h5>
          <div className="distimestamp" style={{"fontSize": "20px"}}>{this.convertDate(this.props.notifications[current].time)}</div>
          <div className="discontent" style={{"fontSize": "28px"}}>{this.props.notifications[current].message}</div>
      </div>
    );
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
    if(this.props.notifications.length === 0) {
      return <div className="noNotifications">You have no new notifications.</div>;
    }
    return(
      this.displayNotifications()
    );
  }
}

const mapStateToProps = (state) => {
  return {
    count: getNotificationsCount(state),
    notifications: getNotifications(state)
  }
}
export default connect(mapStateToProps)(NotificationsCycle);

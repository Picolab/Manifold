import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Container, Row, Col, Table } from 'reactstrap';
import ReactAnimatedWeather from 'react-animated-weather';

export default class Temperatures extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null
    };

    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
    setInterval(this.getData, 300000);
  }

  convertTime(timestamp) {
    if(timestamp === "") return "--:--";
    let toReturn = "";
    let ampm = "";
    let difference = 0;
    let date;
    let year = timestamp.substring(0,4);
    let day = timestamp.substring(8,10);
    let month = timestamp.substring(5,7);
    let hour = timestamp.substring(11,13);
    let minute = timestamp.substring(14,16);
    let second = timestamp.substring(17,19);

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

    toReturn = hour + ":" + minute + " " + ampm;
    return toReturn;
  }

  getData() {
    let promise = this.props.manifoldQuery({
      rid: "io.picolabs.temperatures_app",
      funcName: "getLevels"
    });
    promise.then((resp) => {
      this.setState({ data: resp.data });
    });
  }

  makeTable() {
    return (
      <Table>
        <thead>
          <tr>
            <th>Temperature</th>
            <th>Timestamp</th>
          </tr>
          {this.makeRows()}
        </thead>
      </Table>
    );
  }

  makeRows() {
    return this.state.data.reverse().map((x) => {
      return(
        <tr>
          <td>{x.temperatureF}</td>
          <td>{this.convertTime(x.timestamp)}</td>
        </tr>
      );
    })

  }

  render() {
    return(
      <div className="shortenedWidth">
        {!this.state.data && <div>Loading...</div>}
        {this.state.data && this.makeTable()}
      </div>
    );
  }

}

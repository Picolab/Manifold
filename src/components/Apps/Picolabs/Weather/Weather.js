/*
  These import statements are react libraries that we are importing. The first
  one is standard and is needed for all react components. The second one is a
  library we imported
*/
import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Container, Row, Col, Table } from 'reactstrap';
import ReactAnimatedWeather from 'react-animated-weather';

export default class Weather extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {},
      humidity: 0,
      icon: "",
      summary: "",
      temperature: 0.0,
      timestamp: ""
    }

    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();

    setInterval(this.getData, 180000);
  }

  convertUnixHours(t) {
    let date = new Date(t*1000);
    return date.getHours();
  }

  convertTime() {
    if(this.state.timestamp === "") return "--:--";
    let toReturn = "";
    let ampm = "";
    let difference = 0;
    let date;
    let year = this.state.timestamp.substring(0,4);
    let day = this.state.timestamp.substring(8,10);
    let month = this.state.timestamp.substring(5,7);
    let hour = this.state.timestamp.substring(11,13);
    let minute = this.state.timestamp.substring(14,16);
    let second = this.state.timestamp.substring(17,19);

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
      rid: "io.picolabs.weather",
      funcName: "getData"
    });
    promise.then((resp) => {
      this.setState({
        data: resp.data,
        timestamp: resp.data.timestamp
      });
    });
  }
  formatIcon(icon) {
    return icon.replace(/-/g, '_').toUpperCase()
  }

  renderHourly() {
    var hourly = this.state.data.hourly.data;
    var out = [];
    var i = 0;
    var isToday = true;

    console.log("hourly", hourly);
    if (hourly.length < 1) { return <div/> }
    while(isToday) {
      let militaryHours = this.convertUnixHours(hourly[i].time);
      let hours = (militaryHours > 12) ? militaryHours - 12 : militaryHours;
      let ampm = (militaryHours > 12) ? "PM" : "AM"
      let time = hours + ":00 " + ampm;
      console.log("hours", hours, "time", time);
      out.push(
            <tr key={i}>
              <th scope="row">{time}</th>
              <td id="WeatherIcon"><ReactAnimatedWeather icon={this.formatIcon(hourly[i].icon)} size={50} animate={true}/></td>
              <td>{hourly[i].temperature}</td>
            </tr>
      );
      if (militaryHours === 23) {
        isToday = false;
      }
      i++;
    }
    return out;
  }

  render() {
    if(this.state.data.currently === undefined) {
      return(
        <div></div>
      );
    }
    return(
      <div className="shortenedWidth">
      <ListGroup>
        <h4>Current Weather:</h4>
        <ListGroupItem>
          <Container>
            <Row>
              <Col id="WeatherIcon" xs="3" ><ReactAnimatedWeather icon={this.formatIcon(this.state.data.currently.icon)} size={70} animate={true} /></Col>
              <Col xs="9" >
                <h3>{this.state.data.currently.temperature}<sup>o</sup> F</h3>
                <h6>{this.state.data.currently.humidity * 100}% humidity</h6>
              </Col>
            </Row>
            <Row>
              <Col>
              <h6>Summary: {this.state.data.currently.summary}</h6>
              <p>Last updated at {this.convertTime()}</p>
              </Col>
            </Row>
          </Container>
        </ListGroupItem>
        <br/>
        <ListGroupItem>
          <Container>
            <Table borderless>
              <thead>
                <tr>
                  <th>Time</th>
                  <th></th>
                  <th>Temperature</th>
                </tr>
              </thead>
              <tbody>
                {this.renderHourly()}
              </tbody>
            </Table>
          </Container>
        </ListGroupItem>
      </ListGroup>
      </div>
    );
  }

}

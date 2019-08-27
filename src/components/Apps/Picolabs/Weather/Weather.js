/*
  These import statements are react libraries that we are importing. The first
  one is standard and is needed for all react components. The second one is a
  library we imported
*/
import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Container, Row, Col } from 'reactstrap';
import ReactAnimatedWeather from 'react-animated-weather';

export default class Weather extends Component {

  constructor(props) {
    super(props);

    this.state = {
      humidity: 0,
      icon: "",
      summary: "",
      temperature: 0.0,
      timestamp: ""
    }

    this.getCurrent = this.getCurrent.bind(this);
  }

  componentDidMount() {
    this.getCurrent();

    setInterval(this.getCurrent, 180000);
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

  getCurrent() {
    let promise = this.props.manifoldQuery({
      rid: "io.picolabs.weather",
      funcName: "getCurrent"
    });
    promise.then((resp) => {
      this.setState(resp.data);
    });
  }

  render() {
    return(
      <div className="shortenedWidth">
      <ListGroup>
      <h4>Current Weather:</h4>
      <ListGroupItem>
      <Container>
        <Row>
          <Col xs="3" ><ReactAnimatedWeather icon={this.state.icon} size={70} animate={true} /></Col>
          <Col xs="9" >
            <h3>{this.state.temperature}<sup>o</sup> F</h3>
            <h6>{this.state.humidity * 100}% humidity</h6>
          </Col>
        </Row>
        <Row>
          <Col>
          <h6>Summary: {this.state.summary}</h6>
          <p>Last updated at {this.convertTime()}</p>
          </Col>
        </Row>
      </Container>
      </ListGroupItem>
      </ListGroup>
      </div>
    );
  }

}

import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button, Container, Row, Col, Media, ListGroup, ListGroupItem } from 'reactstrap';

export default class Reminders extends Component {

  constructor(props) {
    super(props);

    this.state = {
      message: "",
      date: "",
      time: "",
      title: "",
      reminders: []
    }

    this.getReminders();

    this.submit = this.submit.bind(this);
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

    toReturn = hour + ":" + minute + ampm + " on " + month + " " + day + ", " + year;
    return toReturn;
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value;
      this.setState({
        [stateKey]: value
      })
    }
  }

  submit(e) {
    e.preventDefault();
    let timestamp = `${this.state.date}T${this.state.time}:00.000Z`;
    console.log(timestamp);
    let promise = this.props.signalEvent({
      domain: "reminder",
      type: "add_reminder",
      attrs : {
        time : timestamp,
        message : this.state.message,
        title : this.state.title
      }
    });
    promise.then((resp) => {
      this.getReminders();
    });
  }

  getReminders() {
    let promise = this.props.manifoldQuery({
      rid: "io.picolabs.reminders",
      funcName: "reminders"
    });
    promise.then((resp) => {
      this.setState({reminders: resp.data})
    })
  }

  deleteReminder(id) {
    return () => {
      let promise = this.props.signalEvent({
        domain: "reminder",
        type: "remove_reminder",
        attrs : {
          id
        }
      });

      promise.then(() => {
        this.getReminders();
      })

    }
  }

  displayReminders() {
    let toDisplay = [];
    this.state.reminders.forEach((reminder) => {
      toDisplay.push(
        <ListGroupItem >
          <i id={"delete" + Object.values(reminder)[0].timestamp} className="fa fa-trash float-right fa-lg manifoldDropdown" onClick={this.deleteReminder(Object.keys(reminder)[0])} />
          <h5 className="title">{Object.values(reminder)[0].title}</h5>
          <p className="timestamp">You'll be reminded at {this.convertDate(Object.values(reminder)[0].time)}</p>
          <p className="content">{Object.values(reminder)[0].message}</p>
        </ListGroupItem>
      );
    });
    return toDisplay;
  }

  render() {
    return(
      <div className="shortenedWidth">

        <h3>Reminders:</h3>
        <br />
        <ListGroup>
        <ListGroupItem>
        <Form onSubmit={this.submit}>
          <Container>
            <Row>
              <Col xs="6">
                <FormGroup>
                  <Label for="Time">Time:</Label>
                  <Input type="time" name="time" id="Time" placeholder="time placeholder" value={this.state.time} onChange={this.onChange('time')} />
                </FormGroup>
              </Col>
              <Col xs="6">
                <FormGroup>
                  <Label for="Date">Date:</Label>
                  <Input type="date" name="date" id="Date" placeholder="date placeholder" value={this.state.date} onChange={this.onChange('date')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="Title">Title:</Label>
                  <Input type="title" name="title" id="Title" placeholder="title" value={this.state.title} onChange={this.onChange('title')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="Message">Message:</Label>
                  <Input type="textarea" name="message" id="Message" style={{height: '150px'}} placeholder="Remind me to..." value={this.state.message}  onChange={this.onChange('message')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button color="primary" style={{"float" : "right"}}>Set Reminder</Button>
              </Col>
            </Row>
          </Container>
        </Form>
        </ListGroupItem>
        </ListGroup>

        <br /><br />

          <ListGroup>
            {this.displayReminders()}
          </ListGroup>

      </div>
    );
  }

}

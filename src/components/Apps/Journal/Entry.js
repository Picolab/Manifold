import React, { Component } from 'react';
import { ListGroupItem, Collapse, Button, Form, FormGroup, Input } from 'reactstrap';
import './Journal.css';

export default class Entry extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      content: ""
    }
    this.deleteEntry = this.deleteEntry.bind(this);
    this.editToggle = this.editToggle.bind(this);
    this.onChange = this.onChange.bind(this);
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

    toReturn = month + " " + day + ", " + year + " " + hour + ":" + minute + ampm;
    return toReturn;
  }

  deleteEntry() {
    const promise = this.props.signalEvent({
      domain : "journal",
      type : "delete_entry",
      attrs : { timestamp : this.props.entry.timestamp }
    })
    promise.then(() => {
      this.props.retrieveEntries();
    })
  }

  editToggle() {
    this.setState({
      collapse: !this.state.collapse
    })
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      this.setState({
        [stateKey]: value
      })
    }
  }

  submit(e) {
    e.preventDefault();

    const promise = this.props.signalEvent({
      domain : "journal",
      type : "edit_entry",
      attrs : {
        timestamp : this.props.entry.timestamp,
        newContent : this.state.content
      }
    })
    promise.then(() => {
      this.props.retrieveEntries();
      this.setState({
        collapse : false
      })
    })
  }

  render() {
    const { entry } = this.props;
    return (
      <div>
        <ListGroupItem>
          <i id={"delete" + entry.timestamp} className="fa fa-trash float-right fa-lg manifoldDropdown" onClick={this.deleteEntry}/>
          <i id={"edit" + entry.timestamp} className="fa fa-edit float-right fa-lg manifoldDropdown" onClick={this.editToggle} />
          <h5 className="title">{entry.title}</h5>
          <p className="timestamp">{this.convertDate(entry.timestamp)}</p>
          <p className="content">{entry.content}</p>

          <Collapse isOpen={this.state.collapse}>
            <Form onSubmit={this.submit}>
              <FormGroup>
                New content:
                <Input type="textarea" name="message" id="Message" style={{height: '75px'}} value={this.state.content} onChange={this.onChange('content')} />
              </FormGroup>
              <Button color="primary">Update</Button>
            </Form>
          </Collapse>

        </ListGroupItem>
      </div>
    );
  }

}

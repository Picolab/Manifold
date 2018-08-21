import React, { Component } from 'react';
import Entry from './Entry';
import { Button, Form, FormGroup, Input, ListGroup, ListGroupItem } from 'reactstrap';
import './Journal.css';

export default class JournalApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      entries: [],
      title: "",
      content: ""
    }

    this.retrieveEntries = this.retrieveEntries.bind(this);
    this.onChange = this.onChange.bind(this);
    this.newEntry = this.newEntry.bind(this);
  }

  componentDidMount() {
      this.retrieveEntries();
  }

  retrieveEntries() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.journal",
      funcName: "getEntry"
    });

    promise.then((resp) => {
      this.setState({
        entries: resp.data.reverse()
      })
    }).catch((e) => {
      console.error("Error loading journal entries", e);
    })
  }

  newEntry(e) {
    e.preventDefault();

    const promise = this.props.signalEvent({
      domain: "journal",
      type: "new_entry",
      attrs : {
        title : this.state.title,
        content : this.state.content,
      }
    });
    promise.then(() => {
      this.retrieveEntries();
      this.setState({
        title: "",
        content: ""
      })
    }).catch((e) => {
      console.error(e);
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

  render() {
    return(
      <div>
        <h1>Journal</h1>
        <br></br>
        <ListGroup className="shortenedWidth">
          <ListGroupItem>
            <Form onSubmit={this.newEntry}>
              <FormGroup>
                Title:
                <Input type="text" name="title" id="title" placeholder="Title" value={this.state.title} onChange={this.onChange('title')} />
              </FormGroup>
              <FormGroup>
                Content:
                <Input type="textarea" name="message" id="Message" style={{height: '75px'}} placeholder="Dear Diary..." value={this.state.content} onChange={this.onChange('content')} />
              </FormGroup>
              <Button color="primary" style={{"float" : "right"}}>Add Entry</Button>
            </Form>
          </ListGroupItem>
        </ListGroup>
        <br></br>
        <ListGroup className="shortenedWidth">
          {this.state.entries.map((entry) => {
            return (
              <Entry key={entry.timestamp} entry={entry} retrieveEntries={this.retrieveEntries} signalEvent={this.props.signalEvent}/>
            );
          })}
        </ListGroup>
      </div>
    );
  }
}

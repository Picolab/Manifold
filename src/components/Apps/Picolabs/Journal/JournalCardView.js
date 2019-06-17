import React, { Component } from 'react';
import CardEntry from './CardEntry';
import { ListGroup } from 'reactstrap';
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
        entries: resp.data.reverse().slice(0,3)
      })
    }).catch((e) => {
      console.error("Error loading journal entries", e);
    })
  }



  render() {
    return(
      <div>
        <h6>Recent Journal Entries:</h6>
        <ListGroup>
          {this.state.entries.map((entry) => {
            return (
              <CardEntry key={entry.timestamp} entry={entry} retrieveEntries={this.retrieveEntries} signalEvent={this.props.signalEvent}/>
            );
          })}
        </ListGroup>
      </div>
    );
  }
}

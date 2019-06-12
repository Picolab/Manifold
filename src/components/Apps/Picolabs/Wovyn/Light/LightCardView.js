import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Container, Row, Col, Table } from 'reactstrap';
import ReactAnimatedWeather from 'react-animated-weather';

export default class LightCardView extends Component {

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

  getData() {
    let promise = this.props.manifoldQuery({
      rid: "io.picolabs.light_app",
      funcName: "getLevels"
    });
    promise.then((resp) => {
      this.setState({ data: resp.data });
    });
  }

  makeTable() {
    return (
      <ListGroup>
        <ListGroupItem>
          <h5>Current Light Level:</h5>
          <p>{this.state.data}</p>
        </ListGroupItem>
      </ListGroup>
    );
  }

  render() {
    return(
      <div>
        {!this.state.data && <div>Loading...</div>}
        {this.state.data && this.makeTable()}
      </div>
    );
  }

}

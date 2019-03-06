import React, { Component } from 'react';
import { Collapse, ListGroup, ListGroupItem } from 'reactstrap';
import './UTA.css';

class RouteList extends Component {
  constructor (props) {
    super(props);
    var temp = {};
    Object.keys(this.props.Routes).forEach((x) => {
      temp[x] = false;
    })
    this.state = temp;
    this.clicked = this.clicked.bind(this);
  }

  generateList() {
    return Object.keys(this.props.Routes).map((x) => {
      return(
        <div onClick={this.clicked}>
          <ListGroupItem>
          {this.minimize(x)}<b>{x}</b><p className="eta">{this.props.Routes[x][this.props.Routes[x].length - 1]} min</p>
          </ListGroupItem>
          <Collapse isOpen={this.state[x]}>
            {this.generateTimes(x)}
          </Collapse>
        </div>
      );
    });
  }

  generateTimes(routeName) {
    return this.props.Routes[routeName].map((x) => {
      if(this.props.Routes[routeName][this.props.Routes[routeName].length - 1] !== x)return (<ListGroupItem key={x}>{this.prettyTimes(x)}</ListGroupItem>);

    })
  }

  minimize(x) {
    if(this.state[x]) return (<p className="minimize">-</p>);
    else return (<p className="minimize">+</p>);
  }

  prettyTimes(timeString) {
    var hourString;
    var minuteString;
    var hourInt;

    if(timeString.length === 7) {
      hourString = timeString.substring(0,1);
      minuteString = timeString.substring(2,4);
    }
    else {
      hourString = timeString.substring(0,2);
      minuteString = timeString.substring(3,5);
    }

    hourInt = parseInt(hourString);
    if(hourInt > 11) {
      if (hourInt > 12) hourInt -= 12;
      return hourInt + ":" + minuteString + " pm";
    }
    else return hourString + ":" + minuteString + " am";

  }

  clicked(e) {
    var text = e.target.textContent;
    this.setState({[text] : !this.state[text]});
  }

  render() {
    return(
      <ListGroup>
        {this.generateList()}
      </ListGroup>
    );
  }
}

export default RouteList;

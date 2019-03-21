import React, { Component } from 'react';
import { Collapse, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { customEvent } from '../../../utils/manifoldSDK';
import './UTA.css';

class RouteList extends Component {
  constructor (props) {
    super(props);
    var temp = {
      disabled: false
    };
    Object.keys(this.props.Routes).forEach((x) => {
      temp[x] = false;
    })
    this.state = temp;
    this.clicked = this.clicked.bind(this);
    this.takeBus = this.takeBus.bind(this);
  }

  generateList() {
    return Object.keys(this.props.Routes).map((x) => {
      return(
        <div onClick={this.clicked}>
          <ListGroupItem className="listItems">
            <div>
              <div className="insideItem">
                {this.minimize(x)}<b>{x}</b>
              </div>
              {this.showETAandButton(x)}
            </div>
          </ListGroupItem>
          <Collapse isOpen={this.state[x]}>
            {this.generateTimes(x)}
          </Collapse>
        </div>
      );
    });
  }

  showETAandButton(x) {
    let minutes = this.props.Routes[x][this.props.Routes[x].length - 1];
    if(minutes > 0) return (<p className="eta">{minutes} min</p>);
    else return(
        <Button color="primary" disabled={this.state.disabled} className="eta" onClick={this.takeBus}>Take Bus</Button>);
  }

  takeBus() {
    let promise = customEvent("XoX1STRX5b1QzYZKLzKTxc", "score_wrapper", "new_points", { scoreTracker: window.localStorage.getItem("scoreTracker"), points : 1, descr : this.props.stopCode }, "take_bus");
    promise.then((resp) => {
      console.log("score recorded")
      this.setState({disabled: true});
      this.props.getStanding();
    })
    console.log("taken");
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

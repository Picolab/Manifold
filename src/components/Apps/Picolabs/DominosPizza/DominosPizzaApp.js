import React from 'react';
import StoreMenu from './StoreMenu';
import StoreLocator from './StoreLocator';
import { Link, Route, Router, Switch } from 'react-router-dom'

class DominosPizzaApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenu: false,
      isLocator: true
    }
    this.displaySwitch = this.displaySwitch.bind(this);
  }

  displaySwitch(val) {
    if(val == "Menu")
    {
      this.setState({
        isMenu: true,
        isLocator: false
      })
    }
    if(val == "Locator")
    {
      this.setState({
        isMenu: false,
        isLocator: true
      })
    }
  }

  display () {
    if(this.state.isLocator)
    {
      return <StoreLocator signalEvent={this.props.signalEvent} displaySwitch={this.displaySwitch} manifoldQuery={this.props.manifoldQuery}/>;
    }
    else if(this.state.isMenu)
    {
      return <StoreMenu signalEvent={this.props.signalEvent} displaySwitch={this.displaySwitch} manifoldQuery={this.props.manifoldQuery}/>
    }

  }

  render() {
    return (
      <div>
        {this.display()}
      </div>
    );
  }
};
export default DominosPizzaApp;

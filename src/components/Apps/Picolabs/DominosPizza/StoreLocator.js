import React from 'react';
import logo from './pico-labs-pizza.png';
import './DominosPizzaApp.css'
import { Link, Route, Router, Switch } from 'react-router-dom'
import DominosPizzaApp from './DominosPizzaApp';
import { Button, ButtonGroup, Form, FormGroup, Input, ListGroup, ListGroupItem, Media } from 'reactstrap';

class StoreLocator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      street: "",
      city: "",
      state: "",
      postalcode:"",
      rSelected: ""
    }
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.findNearestStore = this.findNearestStore.bind(this);
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      this.setState({
        [stateKey]: value
      })
    }
  }

  onRadioBtnClick(rSelected) {
    this.setState({ rSelected });
  }


  findNearestStore() {
    this.props.signalEvent({
      domain : "find",
      type: "store",
      attrs : {
        street: this.state.street,
        city: this.state.city,
        state: this.state.state,
        zipcode: this.state.postalcode,
        firstname: this.state.first_name,
        lastname: this.state.last_name,
        phone: this.state.phone,
        email: this.state.email,
        type: this.state.rSelected
      }
    })
    this.props.displaySwitch("Menu");
  }

  render() {
    return (
      <div>
        <div>
        <Media object src={logo} className="logoImage"></Media>
        </div>
        <ListGroup className="shortenedWidth">
          <ListGroupItem>
            <Form>
            <h2>Personal Information</h2>
              <FormGroup>
                First Name:
                <Input type="text" name="first_name" placeholder="First Name" value={this.state.first_name} onChange={this.onChange('first_name')}/>
              </FormGroup>
              <FormGroup>
                Last Name:
                <Input type="text" name="last_name" placeholder="Last Name" value={this.state.last_name} onChange={this.onChange('last_name')}/>
              </FormGroup>
              <FormGroup>
                Phone
                <Input type="text" name="phone" placeholder="Phone" value={this.state.phone} onChange={this.onChange('phone')}/>
              </FormGroup>
              <FormGroup>
                Email
                <Input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.onChange('email')}/>
              </FormGroup>
              <h2>Address</h2>
              <FormGroup>
                Street
                <Input type="text" name="street" placeholder="Street" value={this.state.street} onChange={this.onChange('street')}/>
              </FormGroup>
              <FormGroup>
                City
                <Input type="text" name="city" placeholder="City" value={this.state.city} onChange={this.onChange('city')}/>
              </FormGroup>
              <FormGroup>
                State
                <Input type="text" name="state" placeholder="State" value={this.state.state} onChange={this.onChange('state')}/>
              </FormGroup>
              <FormGroup>
                Postal Code
                <Input type="text" name="postalcode" placeholder="Postal Code" value={this.state.postalcode} onChange={this.onChange('postalcode')}/>
              </FormGroup>
            </Form>
            <div className="stickOutText">
              Service Method:
            </div>
            <ButtonGroup>
              <Button color="primary" onClick={() => this.onRadioBtnClick("Carryout")} active={this.state.rSelected === "Carryout"}>Carryout</Button>
              <Button color="primary" onClick={() => this.onRadioBtnClick("Delivery")} active={this.state.rSelected === "Delivery"}>Delivery</Button>
            </ButtonGroup>
            <p>Selected: {this.state.rSelected}</p>
            <Button color="primary" size="sm" style={{"float" : "right"}} onClick={this.findNearestStore}> Submit </Button>
        </ListGroupItem>
        </ListGroup>
      </div>
    );
  }

}

export default StoreLocator;

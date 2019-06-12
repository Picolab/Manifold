import React from 'react';
import logo from './pico-labs-pizza.png';
import './OrderPizzaApp.css'
import OrderModal from './OrderModal';
import {customQuery, customEvent} from '../../../../utils/manifoldSDK';
import { Container, Col, Label, Button, ButtonGroup, Form, FormGroup, Input, ListGroup, ListGroupItem, Media, Card, CardTitle, CardText } from 'reactstrap';

class StoreLocator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: undefined,
      last_name: undefined,
      phone: undefined,
      email: undefined,
      street: undefined,
      city: undefined,
      state: undefined,
      postalcode:undefined,
      rSelected: undefined,
      cart: [],
      variants:[] ,
      arrayOrders: [],
      title: "",
      description: "",
      children: [],
      mapTitles: {},
      mapDescriptions: {},
      formComplete: null,
      errorMessage: "",
    }
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.findNearestStore = this.findNearestStore.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.getOrderDescription = this.getOrderDescription.bind(this);
    this.getChildrenOrders = this.getChildrenOrders.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
    //this.addOrderCard = this.addOrderCard.bind(this);
  }

  componentDidMount() {
    this.getChildrenOrders();
  }

  getOrderDescription(eci) {
    const promise = customQuery(eci, "io.picolabs.child_order", "getOrderDescription");
    promise.then((resp) => {
      this.setState({
        [eci]: resp.data
      })
    }).catch((e) => {
      console.error("Error getting description", e);
    });
  }

  getChildrenOrders() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.pizza",
      funcName: "getChildrenOrders"
    });
    promise.then((resp) => {
      this.setState({
        children: resp.data
      })
      for(var item in resp.data) {
        this.getOrderDescription(resp.data[item]);
      }
    }).catch((e) => {
        console.error("Error getting description", e);
    });
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
    if(this.state.rSelected === "" || this.state.street === "" || this.state.city === "" ||
    this.state.state === "" || this.state.postalcode === "" || this.state.first_name === "" ||
    this.state.last_name === "" || this.state.rSelected === undefined || this.state.street === undefined || this.state.city === undefined ||
    this.state.state === undefined || this.state.postalcode === undefined || this.state.first_name === undefined || this.state.last_name === undefined) {
      this.setState({
        formComplete: false,
        errorMessage: "",
        first_name: (this.state.first_name === "" || this.state.first_name === undefined ) ? "" : this.state.first_name,
        last_name: (this.state.last_name === "" || this.state.last_name === undefined) ? "" : this.state.last_name,
        phone: (this.state.phone === "" || this.state.phone === undefined) ? "" : this.state.phone,
        street: (this.state.street === "" || this.state.street === undefined) ? "" : this.state.street,
        city: (this.state.city === "" || this.state.city === undefined) ? "" : this.state.city,
        state: (this.state.state === "" || this.state.state === undefined) ? "" : this.state.state,
        postalcode: (this.state.postalcode === "" || this.state.postalcode === undefined) ? "" : this.state.postalcode,
        rSelected: (this.state.rSelected === "" || this.state.rSelected === undefined ) ? "" : this.state.rSelected

      });
    } else {
      const promise = this.props.signalEvent({
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
      }).catch((e) => {
        console.error("Error getting Store Info", e);
        this.setState({
          errorMessage: "Error getting Store Info: ".concat(e)
        });
      });
      promise.then((resp) => {
        if(resp.data.directives.length === 0 ) {
          this.props.displaySwitch("Menu");
        }
      });
    }
  }

  getParsedVariants() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.pizza",
      funcName: "getParsedVariants"
    });
    promise.then((resp) => {
      this.setState({
        varaints: resp.data
      }).catch((e) => {
        console.error("Error getting Descriptions", e);
      })
    });
  }

  getCart() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.pizza",
      funcName: "getProductCart"
    });
    promise.then((resp) => {
      this.setState({
          cart: resp.data
      }).catch((e) => {
        console.error("Error getting Descriptions", e);
      })
    });
  }

  handleCheck(e) {
    var eci = e.target.id;
    if(this.state[eci]['active'] === "true") {
      let promise = customEvent(e.target.id, "change", "active", { active: 'false' }, "5");
      promise.then((resp) => {
        this.getChildrenOrders();
      })
    }
    else {
      let promise = customEvent(e.target.id, "change", "active", { active: 'true' }, "5");
      for(var item in this.state.children) {
        if(this.state[this.state.children[item]]['active'] === 'true' && this.state.children[item] !== eci) {
          customEvent(this.state.children[item], "change", "active", { active: 'false' }, "5");
        }
      }
      promise.then((resp) => {
        this.getChildrenOrders();
      })
    }
  }

  submitOrder() {
    console.log("You Ordered Pizza");
    this.props.signalEvent({
      domain : "place",
      type: "order",
      attrs : {
      }
    })
  }

  deleteOrder(e) {
    let promise = this.props.signalEvent({
      domain : "delete",
      type: "order",
      attrs : {
        eci:e.target.value
      }
    })

    promise.then(() =>{
      this.getChildrenOrders();
    })
  }

  /*<Card className="card card2" body outline color="primary">
    <CardTitle>
      <FormGroup check>
        <Label check>
          <Input style={{'margin-left':"-1rem"}} type="checkbox" />{' '}
            Activate
        </Label>
      </FormGroup>
    </CardTitle>
    <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
    <Button className="viewOrderButton" color="secondary">Cart</Button>
  </Card>*/
/*{this.state[eci]['active'] === 'true' ? <Input style={{'marginLeft':"-1rem"}} type="checkbox" value={eci} onChange={this.handleCheck} checked/>  : <Input style={{'marginLeft':"-1rem"}} type="checkbox" value={eci} onChange={this.handleCheck}/>}*/
  renderCards() {
    var out = [];
     for(var item in this.state.children) {
       var eci = this.state.children[item]
    //     this.getOrderTitle(this.state.children[item]);
    //     this.getOrderDescription(this.state.children[item]);
      if(this.state[eci] !== undefined) {
        out.push(
          <div key={eci.concat("card")}>
            <Card key={eci} className="card card2" body outline color="primary">
            <Button color="danger" className="deleteButton" value={eci} onClick={this.deleteOrder}>X</Button>
              <CardTitle className="orderTitle">
                <FormGroup  check>
                  <Label check>
                    {this.state[eci]['active'] === 'true' ? <div className="checkmarkChecked" id={eci} ref={eci} onClick={this.handleCheck} checked="checked"/> : <div className="checkmark" id={eci} ref={eci} onClick={this.handleCheck}/>}{' '}
                      <div style={{"marginLeft": "1rem"}}>{this.state[eci]['title']}</div>
                  </Label>

                </FormGroup>
              </CardTitle>
              <CardText style={{'paddingLeft': '5px', 'textAlign': 'left'}}>
                Description: {this.state[eci]['description']}
                <div>Payment Method: {this.state[eci]['Payment Method'] === "Cash" ? this.state[eci]['Payment Method'] : "Card ending in ".concat(this.state[eci]['Payment Method'])}</div>
                <div>Service Method: {this.state[eci]['Service Method']}</div>
              </CardText>

              <OrderModal
                buttonLabel='Cart'
                orderEci={eci}
                title={this.state[eci]['title']}
                description={this.state[eci]['description']}
                manifoldQuery={this.props.manifoldQuery}
                signalEvent={this.props.signalEvent}
                displaySwitch={this.props.displaySwitch}
              />
              {this.state[eci]['active'] === 'true' ? <Button color="primary" className="OrderButton" size="sm" onClick={this.submitOrder}> Order </Button> : <Button color="primary" className="OrderButton" size="sm" disabled onClick={this.submitOrder}> Order </Button>}

            </Card>
          </div>
        );
        }
      }
      return out;
  }

  render() {
    return (
      <div>
        <div>
        <Media object src={logo} className="logoImage"></Media>
        </div>
        <ListGroup className="shortenedWidth">
          <ListGroupItem>
            <Form autoComplete="on">
            <h2>Personal Information</h2>
              <FormGroup>
                First Name:
                {this.state.first_name === "" ? <Input type="text" name="first_name" placeholder="First Name" value={this.state.first_name} onChange={this.onChange('first_name')} className="invalid"/> : <Input type="text" name="first_name" placeholder="First Name" value={this.state.first_name} onChange={this.onChange('first_name')}/>}
              </FormGroup>
              <FormGroup>
                Last Name:
                {this.state.last_name === "" ? <Input type="text" name="last_name" placeholder="Last Name" value={this.state.last_name} onChange={this.onChange('last_name')} className="invalid"/> : <Input type="text" name="last_name" placeholder="Last Name" value={this.state.last_name} onChange={this.onChange('last_name')}/>}
              </FormGroup>
              <FormGroup>
                Phone
                {this.state.phone === "" ? <Input type="text" name="phone" placeholder="Phone" value={this.state.phone} onChange={this.onChange('phone')} className="invalid" /> : <Input type="text" name="phone" placeholder="Phone" value={this.state.phone} onChange={this.onChange('phone')}/>}
              </FormGroup>
              <FormGroup>
                Email
                {this.state.email === "" ? <Input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.onChange('email')} className="invalid" /> : <Input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.onChange('email')}/>}
              </FormGroup>
              <h2>Address</h2>
              <FormGroup>
                Street
                {this.state.street === "" ? <Input type="text" name="street" placeholder="Street" value={this.state.street} onChange={this.onChange('street')} className="invalid" /> : <Input type="text" name="street" placeholder="Street" value={this.state.street} onChange={this.onChange('street')}/>}
              </FormGroup>
              <FormGroup>
                City
                {this.state.city === "" ? <Input type="text" name="city" placeholder="City" value={this.state.city} onChange={this.onChange('city')} className="invalid"/> : <Input type="text" name="city" placeholder="City" value={this.state.city} onChange={this.onChange('city')}/>}
              </FormGroup>
              <FormGroup>
                State
                {this.state.state === "" ? <Input type="text" name="state" placeholder="State" value={this.state.state} onChange={this.onChange('state')} className="invalid"/> : <Input type="text" name="state" placeholder="State" value={this.state.state} onChange={this.onChange('state')}/>}
              </FormGroup>
              <FormGroup>
                Postal Code
                {this.state.postalcode === "" ? <Input type="text" name="postalcode" placeholder="Postal Code" value={this.state.postalcode} onChange={this.onChange('postalcode')} className="invalid"/> : <Input type="text" name="postalcode" placeholder="Postal Code" value={this.state.postalcode} onChange={this.onChange('postalcode')}/>}
              </FormGroup>
            </Form>
            <div className="stickOutText">
              Service Method:
            </div>
            <ButtonGroup>
              <Button color="primary" onClick={() => this.onRadioBtnClick("Carryout")} active={this.state.rSelected === "Carryout"}>Carryout</Button>
              <Button color="primary" onClick={() => this.onRadioBtnClick("Delivery")} active={this.state.rSelected === "Delivery"}>Delivery</Button>
            </ButtonGroup>
            {this.state.rSelected === "" ? <p className="invalid">Selected: {this.state.rSelected}</p> : <p>Selected: {this.state.rSelected}</p>}
            <Button color="primary" size="sm" className="genericButton" style={{"float" : "right"}} onClick={this.findNearestStore}> Submit </Button>
        </ListGroupItem>
          { this.state.formComplete === false && <div style={{ 'color': 'red'}}>* Please fill the required fields </div> }
          <div style={{ 'color': 'red'}}>{this.state.errorMessage}</div>
        </ListGroup>
        <Container>
        <Col>
          {this.renderCards()}
        </Col>
        </Container>
      </div>
    );
  }

}

export default StoreLocator;

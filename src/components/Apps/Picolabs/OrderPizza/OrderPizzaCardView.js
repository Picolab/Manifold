import React from 'react';
import OrderModalCardView from './OrderModalCardView';
import DeleteOrderModal from './DeleteOrderModal';
import './OrderPizzaApp.css'
import logo from './pico-labs-pizza.png';
import pizza from './pizza logo.png';
import {customQuery, customEvent} from '../../../../utils/manifoldSDK';
import { Label, Button, Form, FormGroup, Card, CardTitle, CardText, Media} from 'reactstrap';

class OrderPizzaCardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      variants:[] ,
      arrayOrders: [],
      title: "",
      description: "",
      children: [],
      mapTitles: {},
      mapDescriptions: {}
    }
    this.handleCheck = this.handleCheck.bind(this);
    this.getChildrenOrders = this.getChildrenOrders.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
    this.changeServiceMethod = this.changeServiceMethod.bind(this);
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

  changeServiceMethod(e) {
    let promise = customEvent(e.target.id, "change", "service", { method: e.target.value }, "5");
    promise.then((resp) => {
      this.getChildrenOrders();
    })
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

  renderCards() {
    var out = [];
     for(var item in this.state.children) {
       var eci = this.state.children[item]
      if(this.state[eci] !== undefined) {
        out.push(
          <div key={eci.concat("card")}>
            <Card key={eci} className="card card2" style={{"margin": "3px"}} body outline color="primary">
            <DeleteOrderModal
              title={this.state[eci]['title']}
              eci={eci}
              signalEvent={this.props.signalEvent}
              getChildrenOrders={this.getChildrenOrders}
            />
              <CardTitle className="orderTitle">
                <FormGroup  check>
                  <Label check>
                    {this.state[eci]['active'] === 'true' ? <div className="checkmarkChecked" id={eci} ref={eci} onClick={this.handleCheck} checked="checked"/> : <div className="checkmark" id={eci} ref={eci} onClick={this.handleCheck}/>}{' '}
                      <div style={{"marginLeft": "1rem"}}>{this.state[eci]['title']}</div>
                  </Label>

                </FormGroup>
              </CardTitle>
              <div style={{'paddingLeft': '5px', 'textAlign': 'left'}}>
                Description: {this.state[eci]['description']}
                <div>Payment Method: {this.state[eci]['Payment Method'] === "Cash or pay at store" ? this.state[eci]['Payment Method'] : "Card ending in ".concat(this.state[eci]['Payment Method'])}</div>
                <div style={{"paddingTop": "5px"}}>
                  <Button color="primary" className="serviceMethodSmall" onClick={this.changeServiceMethod} value="Carryout" id={eci} active={this.state[eci]['Service Method'] === "Carryout"}>Carryout</Button>
                  <Button color="primary" className="serviceMethodSmall" onClick={this.changeServiceMethod} value="Delivery" id={eci} active={this.state[eci]['Service Method'] === "Delivery"}>Delivery</Button>
                </div>
                <div>
                  Selected: {this.state[eci]['Service Method']}
                </div>
              </div>

              <OrderModalCardView
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
    return(
      <div>
        <h1 style={{"textAlign": "center"}}>
          <div>
            Pizza Orders
          </div>
          <Media object src={logo} className="smalllogoImage"></Media>
        </h1>
        {this.renderCards()}
      </div>
    );
  }
}
export default OrderPizzaCardView;

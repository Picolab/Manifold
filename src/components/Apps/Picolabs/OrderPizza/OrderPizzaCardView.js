import React from 'react';
import OrderModalCardView from './OrderModalCardView';
import {customQuery, customEvent} from '../../../../utils/manifoldSDK';
import { Label, Button, Form, FormGroup, Card, CardTitle, CardText} from 'reactstrap';

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
    this.deleteOrder = this.deleteOrder.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
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
  }

  renderCards() {
    var out = [];
     for(var item in this.state.children) {
       var eci = this.state.children[item]
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
        {this.renderCards()}
      </div>
    );
  }
}
export default OrderPizzaCardView;

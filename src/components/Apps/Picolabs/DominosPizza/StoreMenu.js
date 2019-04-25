import React from 'react';
import './DominosPizzaApp.css';
import ItemModal from './ItemModal';
import spinner from './PizzaLoader.GIF';
import {amount, amountFlipped} from './toppings';
import classnames from 'classnames';
import {Collapse, Button, Form, FormGroup, Label, Input, CardBody, Card, Modal, ModalHeader, ModalBody, ModalFooter, TabContent, TabPane, Nav, NavItem, NavLink, CardTitle, CardText, Row, Col, Media} from 'reactstrap';

class StoreMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      StoreID: null,
      StoreAddress: null,
      StoreMenu: {},
      StoreVariants: {},
      StoreDescription: {},
      ProductMap: {},
      toppingsMap: {},
      reverseMap: {},
      toppingTags: {},
      collapse: {},
      cart: [],
      activeTab: '1',
      loading: true
      //title: "",
      //description: ""
    }
    this.toggle = this.toggle.bind(this);
    this.toggleCart = this.toggleCart.bind(this);
    this.tooggleTab = this.toggleTab.bind(this);
    this.getCart = this.getCart.bind(this);
    this.toggleCartToppings = this.toggleCartToppings.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
    this.validateOrder = this.validateOrder.bind(this);
    this.getToppingsMap = this.getToppingsMap.bind(this);
    this.changeQty = this.changeQty.bind(this);
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      this.setState({
        [stateKey]: value
      })
    }
  }

  toggleCart() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  toggle(e) {
    var t = e.target.textContent;
    this.setState({ [t]: !this.state[t]});
  }

  toggleCartToppings(e) {
    var t = e.target.id;
    this.setState({ [t]: !this.state[t] });
  }

  componentDidMount() {
    this.getStoreID();
    this.getToppingsMap();
    this.getStoreAddress();
    this.getStoreMenu();
    this.getStoreVariants();
    this.getDescription();
    this.getCart();
    var map = {};
    for( var item in this.state.StoreMenu)
    {
      this.setState({
        [item]: false
      })
    }
    setTimeout(() => {
      this.setState({
        loading: false
      })
    }, 3000)
  }

  myFunction() {
    this.setState({
      loading: false
    });
  }

  getToppingsMap() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.pizza",
      funcName: "getToppingsMap"
    });
    promise.then((resp) => {
      this.setState({
          toppingsMap: resp.data["toppings"],
          reverseMap: resp.data["reverse"],
          toppingTags: resp.data["tags"]
      })
    }).catch((e) => {
      console.error("Error getting toppings", e);
    });
  }

  getStoreID() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.pizza",
      funcName: "getStoreID"
    });
    promise.then((resp) => {
      this.setState({
          StoreID: resp.data
      })
    }).catch((e) => {
      console.error("Error getting StoreID", e);
    });
}

getStoreAddress() {
  const promise = this.props.manifoldQuery({
    rid: "io.picolabs.pizza",
    funcName: "getStoreAddress"
  });
  promise.then((resp) => {
    this.setState({
        StoreAddress: resp.data
    })
  }).catch((e) => {
    console.error("Error getting StoreAddress", e);
  });
}

getStoreMenu() {
  const promise = this.props.manifoldQuery({
    rid: "io.picolabs.pizza",
    funcName: "getMenu"
  });
  promise.then((resp) => {
    this.setState({
        StoreMenu: resp.data
    })
  }).catch((e) => {
    console.error("Error getting StoreMenu", e);
  });
}

getStoreVariants() {
  const promise = this.props.manifoldQuery({
    rid: "io.picolabs.pizza",
    funcName: "getVariants"
  });
  promise.then((resp) => {
    this.setState({
        StoreVariants: resp.data
    })
  }).catch((e) => {
    console.error("Error getting StoreVariants", e);
  });
}

getDescription() {
  const promise = this.props.manifoldQuery({
    rid: "io.picolabs.pizza",
    funcName: "getDescription"
  });
  promise.then((resp) => {
    this.setState({
        StoreDescription: resp.data
    })
  }).catch((e) => {
    console.error("Error getting Descriptions", e);
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
    });
    for(var item in resp.data) {
      this.setState({
        [resp.data[item]['Code']]: false
      })
    }
  }).catch((e) => {
    console.error("Error getting Descriptions", e);
  });
}

displayMenu() {
  var array = [];
  var count = 1;
  for( var item in this.state.StoreMenu) {
    let temp = count.toString();
    array.push(
      <NavItem key={item}>
            <NavLink
              className={classnames({ active: this.state.activeTab === temp})}
              onClick={() => {
                this.toggleTab(temp)}}>
                {item}
            </NavLink>
        </NavItem>
    );
    ++count;
  }


  return array;
}

displayMenuItems() {
  var array = [];
  var count = 1;
  for( var item in this.state.StoreMenu) {
    let temp = count.toString();
    array.push(
      <TabPane key={"The body of ".concat(item)} tabId={temp}>
          {this.findVariants(this.state.StoreMenu[item])}
      </TabPane>
    );
    count++;
  }
  return array;
}

findVariants(array, code) {
  var out = [];
  for(var item in array) {
    var avToppings = this.state.StoreDescription[array[item]];
    var toppings;
    if(avToppings == null) {
      toppings = "";
    }
    else {
      toppings = avToppings.AvailableToppings;
    }
    for(var product in this.state.StoreVariants) {
      if(this.state.StoreVariants[product]["ProductCode"] === array[item]) {
        out.push(
            <FormGroup key={this.state.StoreVariants[product]["Code"]} tag="fieldset">
            <FormGroup check>
              <Label check>
                {this.state.StoreVariants[product]["Name"]}
                <ItemModal
                  signalEvent={this.props.signalEvent}
                  buttonLabel='Order'
                  title={this.state.StoreVariants[product]["Name"]}
                  price={this.state.StoreVariants[product]["Price"]}
                  code={this.state.StoreVariants[product]["Code"]}
                  availableToppings={toppings}
                  defaultToppings={this.state.StoreVariants[product]["Tags"]["DefaultToppings"]}
                  getCart = {this.getCart}
                  toppings = {this.state.toppingsMap}
                  toppingsFlipped = {this.state.reverseMap}
                  toppingTags = {this.state.toppingTags}
                />
              </Label>
            </FormGroup>
            </FormGroup>
        );
      }
    }
  }
  return out;
}

cart() {
  return (
    <FormGroup tag="fieldset">
    <FormGroup check>
      <Label check>
      <div>
        <Button color="primary" className="cartButton" size="sm" onClick={this.toggleCart}>Cart</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggleCart} className={this.props.className}>
          <ModalHeader toggle={this.toggleCart}>Your Products</ModalHeader>
            <ModalBody>
              {this.listCartItems()}
                Order Title:
                <input type="text" name="title" style={{margin: 5}} ref={input => this._title = input}/>
                <div>
                Description:
                <input type="textarea" name="description" style={{margin: 5}} ref={input => this._description = input}/>
                </div>
            </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.validateOrder}>Submit</Button>{' '}
            <Button color="secondary" onClick={this.toggleCart}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <FormGroup>
        </FormGroup>
      </div>
      </Label>
    </FormGroup>
    </FormGroup>
  );
}

validateOrder() {
  let promise = this.props.signalEvent({
    domain : "create",
    type: "order",
    attrs : {
      title: this._title.value,
      description: this._description.value
    }
  })

  promise.then(() => {
    this.props.displaySwitch('Locator');
  })
}

cartItemToppings(toppings) {
  var out = [];

  for (var topping in toppings) {
    for(var amounts in toppings[topping]) {
    out.push(
      <div key={this.state.toppingsMap[topping].concat(amount[toppings[topping][amounts]])}>
        {this.state.toppingsMap[topping]} {' '}
        Amount: {amount[toppings[topping][amounts]]}
      </div>
    );
  }
}
  return out;
}

listCartItems() {
  var out = [];

  for(var item in this.state.cart)
  {
    if(this.state.StoreVariants !== undefined  && this.state.cart[item] !== null && this.state.StoreVariants[this.state.cart[item]['Code']] !== undefined) {
      var compare = JSON.parse(JSON.stringify(this.state.cart[item]['Options']));
      var id = this.state.cart[item]['Code'].concat(JSON.stringify(this.state.cart[item]['Options']));
      var value = JSON.stringify(this.state.cart[item]['Options']);
      var qty = this.state.cart[item]['Qty'].toString();
      out.push(
        <div key={id}>
          {this.state.StoreVariants[this.state.cart[item]['Code']]['Name']} {' '}
          Qty:
          <Input style={{width:50, display:"inline"}} type="select" bsSize="sm" name="Quantity" id={JSON.stringify(this.state.cart[item])} className="select" onChange={this.changeQty}>
            <option selected={qty=== '1' ? 'selected' : ""}>1</option>
            <option selected={qty === '2' ? 'selected' : ""}>2</option>
            <option selected={qty === '3' ? 'selected' : ""}>3</option>
            <option selected={qty === '4' ? 'selected' : ""}>4</option>
            <option selected={qty === '5' ? 'selected' : ""}>5</option>
            <option selected={qty === '6' ? 'selected' : ""}>6</option>
            <option selected={qty === '7' ? 'selected' : ""}>7</option>
            <option selected={qty === '8' ? 'selected' : ""}>8</option>
            <option selected={qty === '9' ? 'selected' : ""}>9</option>
            <option selected={qty === '10' ? 'selected' : ""}>10</option>
          </Input>
          {compare === '{}' ? "" : <button className='danger' id={id} value={value} onClick={this.toggleCartToppings}>
            {' '} Toppings
          </button>}
          <button className='danger' id={this.state.cart[item]['Code']} value={value} onClick={this.onClickRemove}>
            {' '} Remove
          </button>
          <Collapse isOpen={this.state[id]}>
              {this.cartItemToppings(this.state.cart[item]['Options'])}
          </Collapse>
        </div>
      );
    }
  }

  return out;
}

changeQty(e) {
  var item = e.target.id;
  var qty = e.target.value;

  var promise = this.props.signalEvent({
    domain : "change",
    type: "qty",
    attrs : {
      item: item,
      qty: qty
    }
  });

  promise.then((resp) => {
    this.getCart();
  });
}

onClickRemove(e) {
  var code = e.target.id;
  var toppings = e.target.value;

  this.removeItem(code, toppings);
}


removeItem(code, toppings) {
  this.props.signalEvent({
    domain : "remove",
    type: "Item",
    attrs : {
      code: code,
      toppings: toppings
    }
  })
  this.getCart();
}

render() {
    if(this.state.loading === true) {
      return (
        <div>
          <Media object src={spinner}></Media>
        </div>
      );
    } else {
      return (
        <div>
            <div>
              Nearest Store Address: {' '}
              {this.state.StoreAddress}
            </div>
            <div style={{float:'right'}}>
              {this.cart()}
            </div>
            <div>
              <Nav tabs>
                {this.displayMenu()}
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                {this.displayMenuItems()}
              </TabContent>
            </div>
        </div>
      );
    }
  }
}

export default StoreMenu;

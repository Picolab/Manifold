import React from 'react';
import './OrderPizzaApp.css';
import {customQuery} from '../../../../utils/manifoldSDK';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label} from 'reactstrap';

class OrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variants: {},
      eci: this.props.orderEci,
      cart: []
    };
    this.toggle = this.toggle.bind(this);
    this.getCart = this.getCart.bind(this);
    this.editOrder = this.editOrder.bind(this);
    this.getParsedVariants = this.getParsedVariants.bind(this);
  }

  componentDidMount() {
    this.getCart();
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  getParsedVariants(cart) {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.pizza",
      funcName: "parseVariants",
      funcArgs: {
        product: cart.toString()
      }
    });
    promise.then((resp) => {
      this.setState({
        variants: resp.data
      })
    }).catch((e) => {
      console.error("Error getting Parsed Variants", e);
    });
  }

  getCart() {
    const promise = customQuery(this.props.orderEci, "io.picolabs.child_order", "getProductCart");
    promise.then((resp) => {
      this.setState({
          cart: resp.data
      })
      var array = [];
      for(var item in resp.data) {
        array.push(resp.data[item]['Code']);
      }
      if(resp.data !== undefined) {
        this.getParsedVariants(array);
      }
    }).catch((e) => {
    console.error("Error getting Cart", e);
    });
  }

  displayCart() {
    var out = [];

    for(var item in this.state.cart) {
      if(this.state.cart[item] !== null && this.state.variants[this.state.cart[item]['Code']] !== undefined) {
      out.push(
        <div key={this.state.cart[item]['Code']}>
          {this.state.variants[this.state.cart[item]['Code']]['Name']} {' '}
          {this.state.variants[this.state.cart[item]['Code']]['Price']} {' '}
          {'Qty: '}{this.state.cart[item]['Qty']}
        </div>
      );
      }
    }
    return out;
  }

  editOrder() {
    const promise = customQuery(this.state.eci, "io.picolabs.child_order", "getOrder");
    promise.then((resp) => {
      const promiseTwo = this.props.signalEvent({
        domain : "set",
        type: "order",
        attrs : {
          products: JSON.stringify(this.state.cart),
          order: JSON.stringify(resp.data),
          eci: this.state.eci
        }
      }).catch((e) => {
        console.error("Error getting Order", e);
      });
      promiseTwo.then((resp) => {
        this.props.displaySwitch("Menu");
      })
    })
  }

  render() {
    return (
      <div>
      <Button className="viewOrderButton" size="sm" onClick={this.toggle}>{this.props.buttonLabel}</Button>
      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
        <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>
        <ModalBody>
          {this.displayCart()}
        </ModalBody>
        <ModalFooter>
        <Button color="primary" onClick={this.editOrder}>Edit</Button>{' '}
        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
    );
  }

}

export default OrderModal;

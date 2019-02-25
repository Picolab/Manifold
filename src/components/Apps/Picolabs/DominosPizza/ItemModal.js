import React from 'react';
import {toppings, amount, amountFlipped, toppingsFlipped} from './toppings';
import './DominosPizzaApp.css'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label} from 'reactstrap';

class ItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      defaultToppings: [],
      code: this.props.code,
      origToppingMap: {},
      toppingsMap: {},
      Options: {}
    };
    this.toggle = this.toggle.bind(this);
    this.addItems = this.addItems.bind(this);
  }

  componentWillUpdate() {
    this.findDefaultToppings()
    this.findAvailableToppings()
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  changeToppingAmount(topping, val) {
    var map = this.state.toppingsMap;
    map[topping] = {
      amount: amount[val]
    }
    this.setState({
      toppingsMap: map
    })
  }

  findDefaultToppings() {
    var firstArray = this.props.defaultToppings.split(",");
    for(var item in firstArray) {
        var array = firstArray[item].split("=");
        var map = this.state.toppingsMap;
        if(map[toppings[array[0]]] === undefined && array[0] !== "")
        {
          if(toppings[array[0]] === undefined)
          {
            console.log(array[0]);
          }
          map[toppings[array[0]]] = {
            amount: amount[array[1]]
          }
          this.setState({
            toppingsMap: map,
            origToppingMap: Object.assign({}, map)
          })
        }
    }
    //console.log(firstArray);
  }

  displayToppings() {
    var out = [];
    var firstArray = this.props.defaultToppings.split(",");
    for(var item in firstArray) {
      var array = firstArray[item].split("=");
        out.push(
          <div>
            <FormGroup>
              <Label for={toppings[array[0]]}>{toppings[array[0]]}</Label>
                <Input type="select" bsSize="sm" name={toppings[array[0]]} id={toppings[array[0]]} className="select" onChange={(event) => {this.changeToppingAmount(event.target.name, event.target.value)}}>
                  <option selected="" value="0">None</option>
                  <option selected={array[1] === "0.5" ? "selected" : "" } value="0.5">Light</option>
                  <option selected={array[1] === "1" ? "selected" : "" } value="1">Normal</option>
                  <option selected={array[1] === "1.5" ? "selected" : "" } value="1.5">Extra</option>
                  {array[0].substring(0,1) !== 'X' && <option selected={array[1] === "2" ? "selected" : "" }value="2">Double</option>}
                </Input>
              </FormGroup>
          </div>
        );
    }
    return out;
  }

  findAvailableToppings() {
    var array = this.props.availableToppings.split(',');
    for(var item in array) {
      var anotherArray = array[item].split('=');
      var map = this.state.toppingsMap;
      if(map[toppings[anotherArray[0]]] === undefined && array[0] !== "")
      {
        map[toppings[anotherArray[0]]] = {
          amount: amount[0]
        }
        this.setState({
          toppingsMap: map
        });
      }
      //console.log(map[toppings[anotherArray[0]]]);
    }
    //console.log(this.state.toppingsMap);
    //console.log(array);
  }

  displayAvailableToppings() {
    var out = [];
    var array = this.props.availableToppings.split(',');
    for(var item in array) {
      var anotherArray = array[item].split('=');
      var map = this.state.origToppingMap;
      if(map[toppings[anotherArray[0]]] === undefined)
      {
        out.push(
          <div>
            <FormGroup>
              <Label for={toppings[anotherArray[0]]}>{toppings[anotherArray[0]]}</Label>
                <Input type="select" bsSize="sm" name={toppings[anotherArray[0]]} id={toppings[anotherArray[0]]} className="select" onChange={(event) => {this.changeToppingAmount(event.target.name, event.target.value)}}>
                  <option selected="" value="0">None</option>
                  <option value="0.5">Light</option>
                  <option value="1">Normal</option>
                  <option value="1.5">Extra</option>
                  {anotherArray[0].substring(0,1) !== 'X' && <option value="2">Double</option>}
                </Input>
            </FormGroup>
          </div>
          );
        }
    }
    return out;
  }

  addItems() {
    //console.log("Pizza! Pizza!");
    for(var item in this.state.toppingsMap) {
      if(amountFlipped[this.state.toppingsMap[item].amount] !== 0) {
        this.state.Options[toppingsFlipped[item]] = {
          "1/1": amountFlipped[this.state.toppingsMap[item].amount]
        }
      }
    }
    console.log(this.state.Options);
    this.toggle();
  }

  render() {
    return (
      <div>
        <Button color="danger" size="sm" onClick={this.toggle}>{this.props.buttonLabel}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>
          <ModalBody>
            <div>
              Price: ${this.props.price}
            </div>
            <div>
              DefaultToppings: {this.displayToppings()}
            </div>
            <div>
              AvailableToppings: {this.displayAvailableToppings()}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addItems}>Add</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ItemModal;

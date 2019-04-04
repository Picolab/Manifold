import React from 'react';
import {amount, amountFlipped} from './toppings';
import './DominosPizzaApp.css'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, Container, Row, Col} from 'reactstrap';

class ItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      defaultToppings: [],
      code: this.props.code,
      origToppingMap: {},
      toppingsMap: {},
      Options: {},
      Qty: 1,
      toppings: this.props.toppings,
      toppingsFlipped: this.props.toppingsFlipped,
      toppingTags : this.props.toppingTags
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
        if(map[this.state.toppings[array[0]]] === undefined && array[0] !== "")
        {
          if(this.state.toppings[array[0]] === undefined)
          {
            console.log(array[0]);
          }
          map[this.state.toppings[array[0]]] = {
            amount: amount[array[1]]
          }
          this.setState({
            toppingsMap: map,
            origToppingMap: Object.assign({}, map)
          })
        }
    }
  }

  displayToppings() {
    var out = [];
    out.push(<div key={this.props.code.concat("DefaultToppings")}>DefaultToppings:</div>);
    var firstArray = this.props.defaultToppings.split(",");
    for(var item in firstArray) {
      var array = firstArray[item].split("=");
        out.push(
          <div key={this.props.code.concat(this.state.toppings[array[0]])}>
            <FormGroup>
              <Label for={this.state.toppings[array[0]]}>{this.state.toppings[array[0]]}</Label>
                <Input type="select" bsSize="sm" name={this.state.toppings[array[0]]} id={this.state.toppings[array[0]]} className="select" onChange={(event) => {this.changeToppingAmount(event.target.name, event.target.value)}}>
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
    if(out.length > 2) {
      return out;
    }
    return [];
  }

  findAvailableToppings() {
    var array = this.props.availableToppings.split(',');
    for(var item in array) {
      var anotherArray = array[item].split('=');
      var map = this.state.toppingsMap;
      if(map[this.state.toppings[anotherArray[0]]] === undefined && array[0] !== "")
      {
        map[this.state.toppings[anotherArray[0]]] = {
          amount: amount[0]
        }
        this.setState({
          toppingsMap: map
        });
      }
    }
  }

  displayAvailableToppings() {
    var outMeats = [];
    var outNonMeats = [];
    var outVegies = [];
    var outSauce = [];
    if (this.props.availableToppings.length > 0) {
      var array = this.props.availableToppings.split(',');
      for(var item in array) {
        var anotherArray = array[item].split('=');
        var map = this.state.origToppingMap;
        if(map[this.state.toppings[anotherArray[0]]] === undefined) {
          if(this.state.toppingTags[anotherArray[0]] !== undefined) {
            if(this.state.toppingTags[anotherArray[0]]["Meat"] === undefined) {
              if(this.state.toppingTags[anotherArray[0]]["Sauce"] === undefined && this.state.toppingTags[anotherArray[0]]["NonMeat"] === true) {
                if (this.state.toppingTags[anotherArray[0]]["Vege"] === undefined && this.state.toppingTags[anotherArray[0]]["NonMeat"] === true) {
                  outNonMeats.push(
                    <div  key={this.props.code.concat(this.state.toppings[anotherArray[0]])}>
                      <FormGroup>
                        <Label for={this.state.toppings[anotherArray[0]]}>{this.state.toppings[anotherArray[0]]}</Label>
                          <Input type="select" bsSize="sm" name={this.state.toppings[anotherArray[0]]} id={this.state.toppings[anotherArray[0]]} className="select" onChange={(event) => {this.changeToppingAmount(event.target.name, event.target.value)}}>
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
                else {
                  outVegies.push(
                    <div  key={this.props.code.concat(this.state.toppings[anotherArray[0]])}>
                      <FormGroup>
                        <Label for={this.state.toppings[anotherArray[0]]}>{this.state.toppings[anotherArray[0]]}</Label>
                          <Input type="select" bsSize="sm" name={this.state.toppings[anotherArray[0]]} id={this.state.toppings[anotherArray[0]]} className="select" onChange={(event) => {this.changeToppingAmount(event.target.name, event.target.value)}}>
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
              else {
                outSauce.push(
                  <div  key={this.props.code.concat(this.state.toppings[anotherArray[0]])}>
                    <FormGroup>
                      <Label for={this.state.toppings[anotherArray[0]]}>{this.state.toppings[anotherArray[0]]}</Label>
                        <Input type="select" bsSize="sm" name={this.state.toppings[anotherArray[0]]} id={this.state.toppings[anotherArray[0]]} className="select" onChange={(event) => {this.changeToppingAmount(event.target.name, event.target.value)}}>
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
            else {
              outMeats.push(
                <div  key={this.props.code.concat(this.state.toppings[anotherArray[0]])}>
                  <FormGroup>
                    <Label for={this.state.toppings[anotherArray[0]]}>{this.state.toppings[anotherArray[0]]}</Label>
                      <Input type="select" bsSize="sm" name={this.state.toppings[anotherArray[0]]} id={this.state.toppings[anotherArray[0]]} className="select" onChange={(event) => {this.changeToppingAmount(event.target.name, event.target.value)}}>
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
        }
      }
      if(outMeats.length > 0 || outSauce.length > 0 || outVegies.length > 0 || outNonMeats.length > 0) {
        return (
          <div>
          <div key={this.props.code.concat("AvailableToppings")}>AvailableToppings:</div>
          <Container>
          <Row>
            <Col className="col toppingCol">
              <div key={this.props.code.concat("Meats")}>Meats:</div>
              {outMeats}
            </Col>
            <Col className="col toppingCol">
              <div key={this.props.code.concat("Sauce")}>Sauces:</div>
              {outSauce}
            </Col>
            <Col className="col toppingCol">
              <div key={this.props.code.concat("Vegies")}>Vegies:</div>
              {outVegies}
            </Col>
            <Col className="col toppingCol">
              <div key={this.props.code.concat("Non-Meats")}>Non-Meats:</div>
              {outNonMeats}
            </Col>
          </Row>
          </Container>
          </div>
        );
      }
      else {
        return [];
      }
    }
    return [];
  }

  changeQty(qty) {
    this.setState({
      Qty: qty
    });
  }

  displayQty() {
    return (
      <FormGroup>
        <Label for="Quantity">Quantity
          <Input style={{width:50}} type="select" bsSize="sm" name="Quantity" id="Quantity" className="select" onChange={(event) => {this.changeQty(event.target.value)}}>
            <option selected='selected'>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
          </Input>
        </Label>
      </FormGroup>
    );
  }

  addItems() {
    //console.log("Pizza! Pizza!");
    var map = {}
    for(var item in this.state.toppingsMap) {
      if(amountFlipped[this.state.toppingsMap[item].amount] !== "0") {
        map[this.state.toppingsFlipped[item]] = {
          "1/1": amountFlipped[this.state.toppingsMap[item].amount]
        }
      }
    }

    //console.log(JSON.stringify(map));

    this.props.signalEvent({
      domain : "add",
      type: "Item",
      attrs : {
        item: this.props.code,
        Qty: this.state.Qty,
        options: JSON.stringify(map),
      }
    })
    this.toggle();
    this.props.getCart();
  }

  render() {
    return (
      <div>
        <Button color="danger" size="sm" onClick={this.toggle}>{this.props.buttonLabel}</Button>
        <Modal isOpen={this.state.modal} className="modal-xl" size="xl" toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>
          <ModalBody>
            <div>
              Price: ${this.props.price}
              {this.displayQty()}
            </div>
            <div className="defaultToppings">
              {this.displayToppings()}
            </div>
            <div className="availableToppings">
              {this.displayAvailableToppings()}
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

import React from 'react';
import './DominosPizzaApp.css';
import ItemModal from './ItemModal';
import {Collapse, Button, Form, FormGroup, Label, Input, CardBody, Card} from 'reactstrap';

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
      collapse: {}
    }
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    var t = e.target.textContent;
    this.setState({ [t]: !this.state[t]});
  }

  componentDidMount() {
    this.getStoreID();
    this.getStoreAddress();
    this.getStoreMenu();
    this.getStoreVariants();
    this.getDescription();
    var map = {};
    for( var item in this.state.StoreMenu)
    {
      this.setState({
        [item]: false
      })
    }
  }

  getStoreID() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.pizza",
      funcName: "getStoreID"
    });
    promise.then((resp) => {
      this.setState({
          StoreID: resp.data
      }).catch((e) => {
        console.error("Error getting StoreID", e);
      })
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
    }).catch((e) => {
      console.error("Error getting StoreAddress", e);
    })
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
    }).catch((e) => {
      console.error("Error getting StoreMenu", e);
    })
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
    }).catch((e) => {
      console.error("Error getting StoreVariants", e);
    })
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
    }).catch((e) => {
      console.error("Error getting Descriptions", e);
    })
});
}

displayMenu() {
  var array = [];
  for( var item in this.state.StoreMenu)
  {
    array.push(
      <div>
        <Button color="primary" size="lg" onClick={this.toggle} style={{ marginBottom: '1rem' }} block>
          {item}
        </Button>
        <Collapse isOpen={this.state[item]}>
          <Card>
            <CardBody>
              {this.findVariants(this.state.StoreMenu[item])}
            </CardBody>
          </Card>
        </Collapse>
      </div>
    );
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
            <FormGroup tag="fieldset">
            <FormGroup check>
              <Label check>
                {this.state.StoreVariants[product]["Name"]}
                <ItemModal
                  manifoldQuery={this.props.manifoldQuery}
                  buttonLabel='Order'
                  title={this.state.StoreVariants[product]["Name"]}
                  price={this.state.StoreVariants[product]["Price"]}
                  code={this.state.StoreVariants[product]["Code"]}
                  availableToppings={toppings}
                  defaultToppings={this.state.StoreVariants[product]["Tags"]["DefaultToppings"]}
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

render() {
    return (
      <div>
          <div>
            Nearest Store Address: {' '}
            {this.state.StoreAddress}
          </div>
          {this.displayMenu()}
      </div>
    );
  }
}

export default StoreMenu;

import React, { Component } from 'react';
import { createThing, moveThing } from '../../utils/manifoldSDK';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import Thing from './Thing';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class MyThings extends Component {
  constructor(props) {
    super(props);
    //console.log("THE PROPS!!!!",props);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.state = {
      addModal: false,
      name: "",
      registerRulesetModal: false,
    }
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleRegisterRulesetClick = this.handleRegisterRulesetClick.bind(this);
    this.toggleRegisterRulesetModal = this.toggleRegisterRulesetModal.bind(this);
  }

  toggleRegisterRulesetModal(){
    this.setState({
      registerRulesetModal: !this.state.registerRulesetModal
    });
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal,
      name: "" // this will reset the name when you navigate away from the add thing modal
    });
  }

  handleRegisterRulesetClick(){
    //const appURL = this.props.url;
    this.toggleRegisterRulesetModal();
    //this.props.dispatch({type: "command", command: registerRuleset, params: [appURL]});
  }

  handleAddClick(){
    const newName = this.state.name;
    this.toggleAddModal();
    this.props.dispatch({
      type: "command",
      command: createThing,
      params: [newName],
      query: { type: 'MANIFOLD_INFO'}
    });
  }

  updateLayout(layout) {
    for (var thing of layout) {
      var comp = this.state.layout[thing.i];
      if (!comp || 
        thing.x != comp.x || thing.y != comp.y || 
        thing.w != comp.w || thing.h != comp.h) {
        
        var thingName = this.props.things[thing.i].name;
        this.props.dispatch({
          type: "command",
          command: moveThing,
          params: [thingName, thing.x, thing.y, thing.w, thing.h],
          query: { type: 'MANIFOLD_INFO'}
        });
      }
    }
  }

  onLayoutChange(layout) {
    //this.props.onLayoutChange(layout);
    if (!this.state.layout || this.state.layout.length == 0) {
      this.setState({layout: layout});
      return;
    }
    this.updateLayout(layout);
    this.setState({layout: layout});
  }

  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  createElement(el) {
    return (
      <div key={el.key} data-grid={el} >
          <Thing name={el.name} id={el.id} color={el.color} parent_eci={el.parent_eci} eci={el.eci}/>
      </div>
    );
  }

  render(){
    return (
      <div>
        <div style={{height:"30px"}}>
          <button style={{float:"right"}} className="btn btn-primary" onClick={() => this.toggleAddModal()}>+</button>
          <button style={{float:"right"}} className="btn btn-warning" onClick={() => this.toggleRegisterRulesetModal()}>R</button>
        </div>

        <Modal isOpen={this.state.addModal} toggle={this.toggleAddModal} className={'modal-primary'}>
          <ModalHeader toggle={this.toggleAddModal}>Create a new Thing</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label> New Thing's name</label>
              <input type="text" className="form-control" id="name" placeholder="THING NAME" onChange={(element) => this.setState({ name: element.target.value})}/>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleAddClick}>Create Thing</Button>{' '}
            <Button color="secondary" onClick={this.toggleAddModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.registerRulesetModal} toggle={this.toggleRegisterRulesetModal} className={'modal-info'}>
          <ModalHeader toggle={this.toggleRegisterRulesetModal}>Register a new Ruleset</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label> App url to register: </label>
              <input type="text" className="form-control" id="url" placeholder="Lord Sauron" onChange={(element) => this.setState({ url: element.target.value})}/>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="info" onClick={this.handleRegisterRulesetClick}>Register it</Button>{' '}
            <Button color="secondary" onClick={this.toggleRegisterRulesetModal}>Cancel</Button>
          </ModalFooter>
        </Modal>


        <div>
          <ResponsiveReactGridLayout {...this.props} onLayoutChange={this.onLayoutChange}
            onBreakpointChange={this.onBreakpointChange}> 

            {_.map(this.props.things,this.createElement)}

          </ResponsiveReactGridLayout>
        </div>
      </div>
    );
  }
}

MyThings.defaultProps = {
  className: "layout",
  cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
  rowHeight: 100
};

function addPropsToThings(thingsArray){
  for (var thing of thingsArray.things.children) {
    thing.pos = thingsArray.thingsPosition[thing.name] || {"x":0, "y":0, "w":3, "h":2.25, "minW":3, "minH":2.25, "maxW":8, "maxH":5};
    thing.color = thingsArray.thingsColor[thing.name] || {"color": "#eceff1"}
  }
  return thingsArray.things.children.map(function(i, key, list) {
    return {
      key: key.toString(), 
      x: i.pos.x, y: i.pos.y, w: i.pos.w, h: i.pos.h, 
      minW: i.pos.minw, minH: i.pos.minh, maxW: i.pos.maxw, maxH: i.pos.maxh, 
      color: i.color.color, 
      name: i.name, id: i.id, eci: i.eci, parent_eci: i.parent_eci};
  })
};

const mapStateToProps = state => {
  if(state.manifoldInfo.things){
    return {
      things: addPropsToThings(state.manifoldInfo.things)
    }
  }else{
    return {}
  }
}


export default connect(mapStateToProps)(MyThings);

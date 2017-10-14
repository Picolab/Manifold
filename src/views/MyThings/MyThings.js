import React, { Component } from 'react';
import {createThing,removeThing,updateThing} from '../../utils/manifoldSDK';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import Thing from './Thing';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const brandPrimary =  '#20a8d8';
const brandSuccess =  '#4dbd74';
const brandInfo =     '#63c2de';
const brandDanger =   '#f86c6b';

class MyThings extends Component {
  constructor(props) {
    super(props);
    console.log("THE PROPS!!!!",props);
    this.onLayoutChange = this.onLayoutChange.bind(this);
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
    const appURL = this.props.url;
    this.toggleRegisterRulesetModal();
    //this.props.dispatch({type: "command", command: registerRuleset, params: [appURL]});
  }

  handleAddClick(){
    const newName = this.state.name;
    this.toggleAddModal();
    this.props.dispatch({type: "command", command: createThing, params: [newName]});
  }

  onLayoutChange(layout) {
    //this.props.onLayoutChange(layout);
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
          <Thing name={el.name} id={el.id} parent_eci={el.parent_eci} eci={el.eci}/>
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
              <input type="text" className="form-control" id="name" placeholder="Lord Sauron" onChange={(element) => this.setState({ name: element.target.value})}/>
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
  return thingsArray.map(function(i, key, list) {
    return {key: key.toString(), x: key * 2, y: 0, w: 3, h: 2, name: i.name, id: i.id, eci: i.eci, parent_eci: i.parent_eci};
  })
};

const mapStateToProps = state => {
  if(state.manifoldInfo.things){
    return {
      things: addPropsToThings(state.manifoldInfo.things.things.children)
    }
  }else{
    return {}
  }
}


export default connect(mapStateToProps)(MyThings);

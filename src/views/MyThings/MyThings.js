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
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    // this.state = {
    //   items : [0, 1, 2].map(function(i, key, list) {
    //     return {i: i.toString(), x: i * 2, y: 0, w: 3, h: 2, add: i === (list.length - 1).toString()};
    //   })
    // };
    this.state = {
      addModal: false
    }
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal,
      name: "" // this will reset the name when you navigate away from the add thing modal
    });
  }

  handleAddClick(){
    const newName = this.state.name;
    this.toggleAddModal();
    this.props.dispatch({type: "command", command: createThing, params: [newName]});
  }
  handleRemoveClick(){
    removeThing("ThingsName");
  }
  handleUpdateClick(){
    updateThing("ThingsName",{});
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
      <div key={el.i} data-grid={el} >
          <Thing />
      </div>
    );
  }

  render(){
    //{_.map(this.props.things, this.createElement)}
    return (
      <div>
        <button style={{float:"right"}} className="btn btn-primary" onClick={() => this.toggleAddModal()}>+</button>
        <button style={{float:"right"}} className="btn btn-danger" onClick={() => this.handleRemoveClick()}>-</button>
        <button style={{float:"right"}} className="btn btn-warning" onClick={() => this.handleUpdateClick()}>^</button>
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

        <ResponsiveReactGridLayout {...this.props} onLayoutChange={this.onLayoutChange}
          onBreakpointChange={this.onBreakpointChange}>



        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

MyThings.defaultProps = {
  className: "layout",
  cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
  rowHeight: 100
};

const mapStateToProps = state => {
  if(state.manifoldInfo.things){
    return {
      things: state.manifoldInfo.things.things.children
    }
  }else{
    return {}
  }
}

export default connect(mapStateToProps)(MyThings);

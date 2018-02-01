import React, { Component } from 'react';
import { createThing } from '../../utils/manifoldSDK';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import Thing from '../MyThings/Thing';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Community extends Component {
  constructor(props) {
    super(props);
    //Following functions used to control/create the given community's picos modal.
    this.togglePicosModal = this.togglePicosModal.bind(this);
    this.renderPicosModal = this.renderPicosModal.bind(this);
    //Following functions handle updates to card UI
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.state = {
      picosModal: false,
    }
  }

  togglePicosModal(){
    this.setState({
      picosModal: !this.state.picosModal
    });
  }

  createElement(el) {
    return (
      <div className={"card"}> Test</div>
    );
  }

  onLayoutChange(layout) {
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

  updateLayout(layout) {
    for (var thing of layout) {
      var comp = this.state.layout[thing.i];
      if (!comp ||
        thing.x != comp.x || thing.y != comp.y ||
        thing.w != comp.w || thing.h != comp.h) {
      }
    }
  }

  //Generate cards for the picos within the given community to be displayed in the modal
  renderPicosModal(){
    let picoCards;
    picoCards = this.props.picos.collection.map((item, i) => {
      return(
        <div key={i} style={{backgroundColor:"#fff"}}>
          <div className={"card"} style={{height:"60px"}}>
            <div className={"card-block"} style={{backgroundColor:"#888", "textOverflow": "clip", overflow: "hidden"}}>{item.name}</div>
          </div>
        </div>
      );
    });
    return(
    <Modal isOpen={this.state.picosModal} toggle={this.togglePicosModal}  className={'modal-primary'}>
      <ModalHeader toggle={this.togglePicosModal}>Picos in Community</ModalHeader>
        <ModalBody style={{backgroundColor:"#ddd" }}>
          <ResponsiveReactGridLayout {...this.props} style={{backgroundColor:"#ccc" }} onLayoutChange={this.onLayoutChange}
            onBreakpointChange={this.onBreakpointChange}>
            {picoCards}

          </ResponsiveReactGridLayout>

        </ModalBody>
      <ModalFooter>
      </ModalFooter>
    </Modal>
    )
  }
  //Main render function
  render(){
    return (

      <div className={"card"} style={{  height: "inherit", width: "inherit"}}>
        {this.renderPicosModal()}
        <div style={{backgroundColor:"#aaa", lineHeight: "100px", textAlign:"center", height:"inherit"}}>
          {this.props.picos.collectionName}
        </div>
        <Button color="info" style={{position: "absolute", bottom: "10", width: "inherit"}} onClick={this.togglePicosModal.bind(this)}> See Picos</Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {}
}


export default connect(mapStateToProps)(Community);

import React, { Component } from 'react';
import {createThing,removeThing,updateThing} from '../../utils/manifoldSDK';
import { Responsive, WidthProvider } from 'react-grid-layout';
import _ from 'lodash';
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
    this.state = {
      items : [0, 1, 2].map(function(i, key, list) {
        return {i: i.toString(), x: i * 2, y: 0, w: 3, h: 2, add: i === (list.length - 1).toString()};
      })
    };
  }

  handleAddClick(){
    createThing("ThingsName");
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
    return (
      <div>
        <button style={{float:"right"}} onClick={() => this.handleAddClick()}>+</button>
        <button style={{float:"right"}} onClick={() => this.handleRemoveClick()}>-</button>
        <button style={{float:"right"}} onClick={() => this.handleUpdateClick()}>^</button>
          <ResponsiveReactGridLayout {...this.props} onLayoutChange={this.onLayoutChange}
            onBreakpointChange={this.onBreakpointChange}>

            {_.map(this.state.items, this.createElement)}
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

export default MyThings;

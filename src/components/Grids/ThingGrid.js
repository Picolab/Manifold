import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { connect } from 'react-redux';
import Thing from '../ThingCard/Thing';
import { moveThing } from '../../utils/manifoldSDK';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

//this function assigns a position to a tile if one doesn't exist
function givePosition(thingsMap){
  if(thingsMap.things === undefined){
    return [];
  }
  for (var thing of thingsMap.things) {
    thing.pos = thingsMap.thingsPosition[thing.name] || {"x":0, "y":0, "w":3, "h":2.25, "minW":3, "minH":2.25, "maxW":8, "maxH":5};
  }
  return thingsMap.things;
};

class ThingGrid extends Component {
  constructor(props){
    super(props);
    this.state = {
      things: givePosition(props.things)
    }
  }

  //this allows rerendering of component if the props (passed in from the parent) change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      things: givePosition(nextProps.things)
    }
  }

  updateLayout = (layout) => {
    for (var thing of layout) {
      var comp = this.state.layout[thing.i];
      console.log("comp:", comp);
      if (!comp ||
        thing.x !== comp.x || thing.y !== comp.y ||
        thing.w !== comp.w || thing.h !== comp.h) {

        var thingName = this.state.things[thing.i].name;
        this.props.dispatch({
          type: "command",
          command: moveThing,
          params: [thingName, thing.x, thing.y, thing.w, thing.h],
          query: { type: 'MANIFOLD_INFO'}
        });
      }
    }
  }

  onLayoutChange = (layout) => {
    if (!this.state.layout || this.state.layout.length === 0) {
      this.setState({layout: layout});
      return;
    }
    this.updateLayout(layout);
    this.setState({layout: layout});
  }

  onBreakpointChange = (breakpoint, cols) => {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  renderThing = (thing, index) => {
    let grid_settings = {
      x: thing.pos.x, y: thing.pos.y, w: thing.pos.w, h: thing.pos.h,
      minW: thing.pos.minw, minH: thing.pos.minh, maxW: thing.pos.maxw, maxH: thing.pos.maxh
    }
    return (
      <div key={index.toString()} data-grid={grid_settings} >
          <Thing name={thing.name} sub_id={thing.Id} color={thing.color} Rx={thing.Rx} />
      </div>
    );
  }

  render(){
    return (
      <ResponsiveReactGridLayout {...this.props}
        onLayoutChange={this.onLayoutChange}
        onBreakpointChange={this.onBreakpointChange}>
          {this.state.things.map(this.renderThing)}
      </ResponsiveReactGridLayout>
    )
  }
}

//this is used in the "...this.props" in the ResponsiveReactGridLayout component
ThingGrid.defaultProps = {
  className: "layout",
  cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
  rowHeight: 100
};

ThingGrid.propTypes = {
  things: PropTypes.object.isRequired
}

export default connect()(ThingGrid);

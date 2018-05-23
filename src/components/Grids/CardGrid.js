import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { connect } from 'react-redux';
import Card from '../Cards/Card';
import { moveThing, moveCommunity } from '../../utils/manifoldSDK';
import { commandAction } from '../../actions/command';
import DropTargetCard from '../Cards/DropTargetCard';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

//this function assigns a position to a tile if one doesn't exist
function givePosition(objects, positions){
  if(objects === undefined){
    return [];
  }
  for (var object of objects) {
    object.pos = positions[object.pico_id] || {"x":0, "y":0, "w":3, "h":2.25, "minW":3, "minH":2.25, "maxW":8, "maxH":5};
  }
  return objects;
};

class CardGrid extends Component {
  constructor(props){
    super(props);
    this.state = {
      objects: givePosition(props.objects, props.objPositions)
    }
  }

  //this allows rerendering of component if the props (passed in from the parent) change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      objects: givePosition(nextProps.objects, nextProps.objPositions)
    }
  }

  updateLayout = (layout) => {
    for (var object of layout) {
      var comp = this.state.layout[object.i];
      if (!comp ||
        object.x !== comp.x || object.y !== comp.y ||
        object.w !== comp.w || object.h !== comp.h) {

        var pico_id = this.state.objects[object.i].pico_id;
        this.props.savePosition(pico_id, object.x, object.y, object.w, object.h)
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

  renderObject = (object, index) => {
    let grid_settings = {
      x: object.pos.x, y: object.pos.y, w: object.pos.w, h: object.pos.h,
      minW: object.pos.minw, minH: object.pos.minh, maxW: object.pos.maxw, maxH: object.pos.maxh
    }
    if(this.props.dropTargets){
      return(
        <div key={index.toString()} data-grid={grid_settings} >
          <DropTargetCard
            cardType={this.props.cardType}
            object={object}
            handleDrop={this.props.handleDrop} />
        </div>
      )
    }else{
      return (
        <div key={index.toString()} data-grid={grid_settings} >
          <Card
            name={object.name}
            sub_id={object.Id}
            color={object.color}
            eci={object.Tx}
            cardType={this.props.cardType}
            pico_id={object.pico_id}/>
        </div>
      );
    }
  }

  render(){
    return (
      <ResponsiveReactGridLayout {...this.props}
        onLayoutChange={this.onLayoutChange}
        onBreakpointChange={this.onBreakpointChange}
        draggableCancel=".nonDraggable">
          {this.state.objects.map(this.renderObject)}
      </ResponsiveReactGridLayout>
    )
  }
}

//this is used in the "...this.props" in the ResponsiveReactGridLayout component
CardGrid.defaultProps = {
  className: "layout",
  cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
  rowHeight: 100,
  dropTargets: false
};

CardGrid.propTypes = {
  objects: PropTypes.array.isRequired,
  objPositions: PropTypes.object.isRequired,
  cardType: PropTypes.string.isRequired, //this identifies whether we are displaying Things or Communities
  dropTargets: PropTypes.bool,
  handleDrop: function(props, propName, componentName) {
                if ((props['dropTargets'] === true && (props[propName] === undefined || typeof(props[propName]) !== 'function'))) {
                    return new Error(
                        `The prop \`${propName}\` is marked as a required function in \`${componentName}\` if the dropTargets boolean is true, but its value is \`${props[propName]}\`.`
                    );
                }
              } //require the handleDrop function if dropTargets is true
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    savePosition: (pico_id, x, y, w, h) => {
      if(ownProps.cardType === 'Thing'){
        dispatch(commandAction(moveThing, [pico_id, x, y, w, h]));
      }else if(ownProps.cardType === 'Community'){
        dispatch(commandAction(moveCommunity, [pico_id, x, y, w, h]));
      }else{
        console.error("UNKNOWN CARD TYPE WHEN TRYING TO SAVE POSITION!");
      }
    }
  }
}

export default connect(null, mapDispatchToProps)(CardGrid);

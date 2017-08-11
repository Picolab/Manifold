import React, { Component } from 'react';
import flow from 'lodash/flow';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from './itemtypes';

class ThingTile extends Component {
  render(){
    return(
      <div>Working on it!</div>
    );
  }
}

export default flow(
  DragSource(ItemTypes.THING),
  DropTarget(ItemTypes.THING)
)(ThingTile);

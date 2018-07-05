import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DropTarget } from 'react-dnd';
import DragTypes from '../DragTypes';

import Card from './Card';

import './cardStyles.css';

const dropCardSpec = {
  drop(props, monitor, component) {
    if(monitor.didDrop()){
      return;
    }
    const draggedCard = monitor.getItem();
    const thisCard = {
      cardType: props.cardType
      //...(props.object)
    }
    console.log("successfully dropped!", draggedCard);
    props.handleDrop(thisCard, draggedCard);
  }
}

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

class DropTargetCard extends Component {
  render() {
    const { isOver, connectDropTarget } = this.props
    return connectDropTarget(
      <div className={"dropTargetCard " + (isOver ? "hoveredTarget" : "nonHoveredTarget")}>
        <Card
          cardType={this.props.cardType}
          picoID={this.props.picoID}
          overlay={{ isActive: isOver}}/>
      </div>
    )
  }
}

DropTargetCard.propTypes = {
  picoID: PropTypes.string.isRequired,
  cardType: PropTypes.string.isRequired,
  handleDrop: PropTypes.func.isRequired
}

export default DropTarget(DragTypes.Card, dropCardSpec, collect)(DropTargetCard);

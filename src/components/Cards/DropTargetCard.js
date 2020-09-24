import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDID } from '../../reducers';

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
      cardType: props.cardType,
      picoID: props.picoID,
      DID: props.DID
    }
    props.handleDrop(thisCard, draggedCard);
    console.log("component", component);
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

const Drop = DropTarget(DragTypes.Card, dropCardSpec, collect)(DropTargetCard);

const mapStateToProps = (state, ownProps) => {
  return {
    DID: getDID(state, ownProps.picoID)
  }
}

export default connect(mapStateToProps)(Drop);

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DragSource } from 'react-dnd';
import DragTypes from '../DragTypes';

import Card from './Card';

import './cardStyles.css';

const cardSpec = {
  beginDrag(props){
    return {
      cardType: props.cardType
      //...(props.object)
    }
  }
}

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class DraggableCard extends Component {
  render() {
    const { isDragging, connectDragSource } = this.props
    return connectDragSource(
      <div>
        {isDragging ? <div className="draggingCard"/> :
            <Card
              cardType={this.props.cardType}
              picoID={this.props.picoID}/>
        }
      </div>
    )
  }
}

DraggableCard.propTypes = {
  picoID: PropTypes.string.isRequired,
  cardType: PropTypes.string.isRequired
}

export default DragSource(DragTypes.Card, cardSpec, collect)(DraggableCard);

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DragSource } from 'react-dnd';
import DragTypes from '../DragTypes';

import Card from './Card';

import './cardStyles.css';

const cardSpec = {
  beginDrag(props){
    return {
      cardType: props.cardType,
      ...(props.object)
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
              name={this.props.object.name}
              sub_id={this.props.object.Id}
              color={this.props.object.color}
              eci={this.props.object.Tx}
              cardType={this.props.cardType}
              pico_id={this.props.object.pico_id}/>
        }
      </div>
    )
  }
}

DraggableCard.propTypes = {
  object: PropTypes.shape({
    name: PropTypes.string.isRequired,
    Id: PropTypes.string.isRequired,
    color: PropTypes.string,
    Tx: PropTypes.string.isRequired,
    pico_id: PropTypes.string.isRequired,
  }),
  cardType: PropTypes.string.isRequired
}

export default DragSource(DragTypes.Card, cardSpec, collect)(DraggableCard);

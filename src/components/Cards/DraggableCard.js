import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDID } from '../../reducers';

import { DragSource } from 'react-dnd';
import DragTypes from '../DragTypes';

import DropTargetCard from './DropTargetCard';

import './cardStyles.css';

const cardSpec = {
  beginDrag(props){
    return {
      cardType: props.cardType,
      picoID: props.picoID,
      DID: props.DID
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
    const { /*isDragging,*/ connectDragSource } = this.props
    return connectDragSource(
      <div style={{width: '100%', height: '100%'}}>
            <DropTargetCard
              cardType={this.props.cardType}
              picoID={this.props.picoID}
              handleDrop={this.props.handleDrop}/>
      </div>
    )
  }
}

DraggableCard.propTypes = {
  picoID: PropTypes.string.isRequired,
  cardType: PropTypes.string.isRequired
}

const Draggable = DragSource(DragTypes.Card, cardSpec, collect)(DraggableCard);

const mapStateToProps = (state, ownProps) => {
  return {
    DID: getDID(state, ownProps.picoID)
  }
}


export default connect(mapStateToProps)(Draggable);

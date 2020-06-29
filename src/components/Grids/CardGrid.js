import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { connect } from 'react-redux';
import Card from '../Cards/Card';
import { moveThing, moveCommunity } from '../../utils/manifoldSDK';
import { commandAction } from '../../actions/command';
import DropTargetCard from '../Cards/DropTargetCard';
import { getPositionArray } from '../../reducers';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class CardGrid extends Component {
  state = {}

  updateLayout = (layout) => {
    for (var newPos of layout) {
      var prevPos = this.state.layout[newPos.i];
      if (!prevPos ||
        newPos.x !== prevPos.x || newPos.y !== prevPos.y ||
        newPos.w !== prevPos.w || newPos.h !== prevPos.h) {
        let index = newPos.i.substr(8);//the id here is "cardGrid" + <indexInArray>, so we just want the index
        let picoID = this.props.idList[index];
        this.props.savePosition(picoID, newPos.x, newPos.y, newPos.w, newPos.h)
      }
    }
  }

  onLayoutChange = (layout) => {
    if (!this.state.layout || this.state.layout.length === 0) {
      this.setState({ layout });
      return;
    }
    this.updateLayout(layout);
    this.setState({ layout });
  }

  onBreakpointChange = (breakpoint, cols) => {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  renderCard = (picoID, index) => {
    let pos = this.props.positionArray[index];
    if(pos) {
      let gridSettings = {};
      gridSettings.x = pos.x || 0;
      gridSettings.y = pos.y || 0;
      gridSettings.w = pos.w || 3;
      gridSettings.h = pos.h || 2.25;
      gridSettings.minW = pos.minw || 3;
      gridSettings.minH = pos.minh || 2.25;
      gridSettings.maxW = pos.maxw || 8;
      gridSettings.maxH = pos.maxh || 5;
      return(
        <div key={"gridCard" + index.toString()} data-grid={gridSettings} >

          {this.props.dropTargets && <DropTargetCard
                                      cardType={this.props.cardType}
                                      picoID={picoID}
                                      handleDrop={this.props.handleDrop} />}
          {!this.props.dropTargets && <Card
                                        cardType={this.props.cardType}
                                        picoID={picoID}/>}
        </div>
      )
    }
    else {
      return <div key={"gridCard" + index.toString()}></div>
    }
  }

  render(){
    return (
      <ResponsiveReactGridLayout {...this.props}
        onLayoutChange={this.onLayoutChange}
        onBreakpointChange={this.onBreakpointChange}
        draggableCancel=".nonDraggable">
          {this.props.idList.map(this.renderCard)}
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
  idList: PropTypes.array.isRequired,
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

const mapStateToProps = (state, ownProps) => {
  return {
    positionArray: getPositionArray(state, ownProps.idList)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    savePosition: (picoID, x, y, w, h) => {
      if(ownProps.cardType === 'Thing'){
        dispatch(commandAction(moveThing, [picoID, x, y, w, h]));
      }else if(ownProps.cardType === 'Community'){
        dispatch(commandAction(moveCommunity, [picoID, x, y, w, h]));
      }else{
        console.error("UNKNOWN CARD TYPE WHEN TRYING TO SAVE POSITION!");
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardGrid);

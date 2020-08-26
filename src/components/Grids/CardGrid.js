import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { connect } from 'react-redux';
import Card from '../Cards/Card';
import { moveThing, moveCommunity } from '../../utils/manifoldSDK';
import { commandAction } from '../../actions/command';
import DropTargetCard from '../Cards/DropTargetCard';
import DraggableCard from '../Cards/DraggableCard';
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
        let cardType = (this.props.cardType) ? this.props.cardType : (index > this.props.lastCommunityIndex ? 'Thing' : 'Community');
        if (this.props.dashboard) {
          this.props.savePosition(picoID, null, null, null, null, cardType, newPos.x, newPos.y, newPos.w, newPos.h);
        }
        else {
          this.props.savePosition(picoID, newPos.x, newPos.y, newPos.w, newPos.h, cardType, null, null, null, null);
        }
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
    let gridSettings = {};
    gridSettings.x = (this.props.dashboard ? pos.dashX : pos.x) || 0;
    gridSettings.y = (this.props.dashboard ? pos.dashY : pos.y) || 0;
    gridSettings.w = (this.props.dashboard ? pos.dashW : pos.w) || 3;
    gridSettings.h = (this.props.dashboard ? pos.dashH : pos.h)|| 2.25;
    gridSettings.minW = pos.minw || 3;
    gridSettings.minH = pos.minh || 2.25;
    gridSettings.maxW = pos.maxw || 8;
    gridSettings.maxH = pos.maxh || 5;

    let cardType = (this.props.cardType) ? this.props.cardType : (index > this.props.lastCommunityIndex ? 'Thing' : 'Community');

    return(
      <div key={"gridCard" + index.toString()} data-grid={gridSettings} >

        {this.props.dropTargets && cardType === 'Community' && <DropTargetCard
                                    cardType={cardType}
                                    picoID={picoID}
                                    handleDrop={this.props.handleDrop} />}
        {this.props.dropTargets && cardType === 'Thing' && <DraggableCard
                                    picoID={picoID}
                                    cardType={cardType}/>}
        {!this.props.dropTargets && <Card
                                      cardType={cardType}
                                      picoID={picoID}/>}
      </div>
    )
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
    savePosition: (picoID, x, y, w, h, cardType, dashX, dashY, dashW, dashH) => {
      if(cardType === 'Thing'){
        dispatch(commandAction(moveThing, [ picoID, x, y, w, h, dashX, dashY, dashW, dashH ]));
      }else if(cardType === 'Community'){
        dispatch(commandAction(moveCommunity, [ picoID, x, y, w, h, dashX, dashY, dashW, dashH ]));
      }else{
        console.error("UNKNOWN CARD TYPE WHEN TRYING TO SAVE POSITION!");
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardGrid);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CardGrid from '../../components/Grids/CardGrid';
import { getThingIdList, getCommunitiesIdList } from '../../reducers';
import { connect } from 'react-redux';
import { commandAction } from '../../actions/command';
import { addToCommunity } from '../../utils/manifoldSDK';

class Dashboard extends Component {
  handleDrop = (dropTargetCard, draggedCard) => {
    console.log("dropTargetCard", dropTargetCard);
    console.log("draggedCard", draggedCard);
    this.props.addThingToComm(dropTargetCard.DID, draggedCard.DID, draggedCard.picoID);
  }

  render() {
    return (
      <div>
        <CardGrid
          idList={[ ...this.props.communitiesIdList, ...this.props.thingIdList ]}
          lastCommunityIndex={this.props.communitiesIdList.length-1}
          dropTargets={true}
          handleDrop={this.handleDrop}
        />
      </div>
    );
  }
}

Dashboard.propTypes = {
  thingIdList: PropTypes.array.isRequired,
  communitiesIdList: PropTypes.array.isRequired
}

const mapStateToProps = state => {
  return {
    thingIdList: getThingIdList(state),
    communitiesIdList: getCommunitiesIdList(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addThingToComm: (commEci, eci, picoID) => {
      dispatch(commandAction(addToCommunity, [commEci, eci, picoID], {delay : 500} ))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

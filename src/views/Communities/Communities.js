import React, { Component } from 'react';
import { connect } from 'react-redux';
import CommunityHeader from './CommunityHeader';
import CardGrid from '../../components/Grids/CardGrid';
import CardSideBar from '../../components/CardSideBar/CardSideBar';
import { commandAction } from '../../actions/command';
import { addToCommunity } from '../../utils/manifoldSDK';
import PropTypes from 'prop-types';
import { getCommunitiesIdList, getCommunities, getThings } from '../../reducers';
import './CommStyles.css';

class Communities extends Component {
  constructor(props) {
    super(props);

    this.handleDrop = this.handleDrop.bind(this);
  }

  handleDrop(dropTargetCard, draggedCard) {
    //this.props.createCommSubscription(dropTargetCard.Tx, draggedCard.Tx)
    let communityTx = this.props.communities.getIn([dropTargetCard.picoID, "Tx"]);
    let thingTx = this.props.things.getIn([draggedCard.picoID, "Tx"]);

    if (communityTx && thingTx) {
      this.props.createCommSubscription(communityTx, thingTx);
    }
    else {
      console.error("Unable to connect thing to community!");
    }
  }

  renderGrid(){
    //make sure the communities array really exists before trying to display them
    if(this.props.communitiesIdList.length > 0){
      return (
        <CardGrid
          idList={this.props.communitiesIdList}
          cardType="Community"
          dropTargets={true}
          handleDrop={this.handleDrop}/>
      )
    }else{
      return (
        <div></div>
      )
    }
  }

  render(){
    return (
      <div className="commContainer">
        <div className="communities">
          <CommunityHeader />
          {this.renderGrid()}
        </div>
        <div className="commSidebar">
          <CardSideBar />
        </div>
      </div>
    );
  }
}

Communities.propTypes = {
  communitiesIdList: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
  return {
    communitiesIdList: getCommunitiesIdList(state),
    communities: getCommunities(state),
    things: getThings(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createCommSubscription: (commEci, toAddEci) => {
      dispatch(commandAction(addToCommunity, [commEci, toAddEci]))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Communities);

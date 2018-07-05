import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SideBarStyles.css';
import { connect } from 'react-redux';
import DraggableCard from '../Cards/DraggableCard';
import { getThingIdList, getCommunitiesIdList } from '../../reducers';

export class CardSideBar extends Component {
  renderCards(objects, cardType) {
    let cards = [];
    objects.forEach((picoID) => {
      cards.push(
        <div key={picoID} className="sideBarItem">
          <DraggableCard
            picoID={picoID}
            cardType={cardType}/>
        </div>
      )
    });
    return cards;
  }

  render(){
    return(
      <div className="sideBarContainer">
        <div className="sideListContainer">
          <h2 className="sideBarH2">Things</h2>
          {this.renderCards(this.props.thingIdList, 'Thing')}
          <h2 className="sideBarH2">Communities</h2>
          {this.renderCards(this.props.communitiesIdList, 'Community')}
        </div>
      </div>
    )
  }
}

CardSideBar.propTypes = {
  thingIdList: PropTypes.array.isRequired,
  communitiesIdList: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
  return {
    thingIdList: getThingIdList(state),
    communitiesIdList: getCommunitiesIdList(state)
  }
}

export default connect(mapStateToProps)(CardSideBar);

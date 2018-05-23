import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SideBarStyles.css';
import { connect } from 'react-redux';
import DraggableCard from '../Cards/DraggableCard';

export class CardSideBar extends Component {
  renderCards(objects, cardType) {
    let cards = [];
    objects.forEach((object) => {
      cards.push(
        <div key={object.pico_id} className="sideBarItem">
          <DraggableCard
            object={object}
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
          {this.renderCards(this.props.things, 'Thing')}
          <h2 className="sideBarH2">Communities</h2>
          {this.renderCards(this.props.communities, 'Community')}
        </div>
      </div>
    )
  }
}

CardSideBar.propTypes = {
  things: PropTypes.array.isRequired,
  communities: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
  let manifoldInfo = state.manifoldInfo;
  if(manifoldInfo && manifoldInfo.things && manifoldInfo.communities){
    return {
       things: manifoldInfo.things.things,
       communities: manifoldInfo.communities.communities
    }
  }else{
    return {
      things: [],
      communities: []
    }
  }
}

export default connect(mapStateToProps)(CardSideBar);

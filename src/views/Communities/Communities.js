import React, { Component } from 'react';
import { connect } from 'react-redux';
import CommunityHeader from './CommunityHeader';
import CardGrid from '../../components/Grids/CardGrid';

class Communities extends Component {
  renderGrid(){
    //make sure the communities array really exists before trying to display them
    if(this.props.communities.communities){
      return (
        <CardGrid
          objects={this.props.communities.communities}
          objPositions={this.props.communities.communitiesPosition}
          objColors={this.props.communities.communitiesColor}
          cardType="Community"/>
      )
    }else{
      return (
        <div></div>
      )
    }
  }

  render(){
    return (
      <div>
        <CommunityHeader />
        {this.renderGrid()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  if(state.manifoldInfo.communities){
    return {
      communities: state.manifoldInfo.communities
    }
  }else{
    return {
      communities: {}
    }
  }
}

export default connect(mapStateToProps)(Communities);

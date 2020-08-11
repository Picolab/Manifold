import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CardGrid from '../../components/Grids/CardGrid';
import { getThingIdList, getCommunitiesIdList } from '../../reducers';
import { connect } from 'react-redux';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <CardGrid idList={[ ...this.props.communitiesIdList, ...this.props.thingIdList ]} lastCommunityIndex={this.props.communitiesIdList.length-1} />
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

export default connect(mapStateToProps)(Dashboard);

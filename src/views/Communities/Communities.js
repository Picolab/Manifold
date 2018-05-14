import React, { Component } from 'react';
import { connect } from 'react-redux';
import CommunityHeader from './CommunityHeader';

class Communities extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render(){
    return (
      <div>
        <CommunityHeader />
        
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {}
}

export default connect(mapStateToProps)(Communities);

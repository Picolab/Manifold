import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TeamMember extends Component {
  render() {
    return (
      <div className="teamMemberItem">
        <h4 className="teamMemberName">{this.props.name}</h4>
        <p className="teamMemberTitle">{this.props.title}</p>
        <p>{this.props.bio}</p>
      </div>
    )
  }
}

TeamMember.propTypes = {
  bio: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default TeamMember;

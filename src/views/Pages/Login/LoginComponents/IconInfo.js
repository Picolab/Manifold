import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'reactstrap';

class IconInfo extends Component {
  render() {
    return (
      <ListGroupItem className="iconInfo">
        <i className={"fa fa-fw fa-4x loginIcon " + this.props.faIcon}></i>
        <div className="iconMsg">{this.props.msg}</div>
      </ListGroupItem>
    )
  }
}

IconInfo.propTypes = {
  faIcon: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired
}

export default IconInfo;

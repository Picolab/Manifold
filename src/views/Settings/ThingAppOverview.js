import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NotificationAppList from './NotificationAppList';
import { getName } from '../../reducers';
import './ThingAppOverview.css';

class ThingAppOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      installOpen: false
    }
  }


  render() {
    return (
      <div>
        <h1 className="centered">
          {this.props.name ? this.props.name : "Loading..."}
        </h1>
        <h3 className="overviewHeader">Apps</h3>
        <hr className="overviewUnderline"></hr>
        <NotificationAppList picoID={this.props.picoID}/>
      </div>
    );
  }
}

ThingAppOverview.propTypes = {
  picoID: PropTypes.string.isRequired,
  name: PropTypes.string
}

const mapStateToProps = (state, ownProps) => {
  const picoID = ownProps.match.params.picoID;
  return {
    picoID,
    name: getName(state, picoID)
  }
}


export default connect(mapStateToProps)(ThingAppOverview);

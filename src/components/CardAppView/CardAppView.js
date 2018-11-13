import React, { Component } from 'react';
import { connect } from 'react-redux';
//import PropTypes from 'prop-types';
import './CardAppView.css';
import ManifoldApp from '../Apps/ManifoldApp';
import AppMap from '../Apps/AppMap';

class CardAppView extends Component {
  render() {
    const { appRid, picoID } = this.props.match.params;
    const AppView = AppMap[appRid];
    return (
      <div>
        {AppView && <ManifoldApp picoID={picoID} developerComponent={AppView} bindings={{}}/>}
        {!AppView && <div>Error! App for {appRid} not found...</div>}
      </div>
    );
  }
}

CardAppView.propTypes = {
}

const mapStateToProps = (state, ownProps) => {
  return {}
}


export default connect(mapStateToProps)(CardAppView);

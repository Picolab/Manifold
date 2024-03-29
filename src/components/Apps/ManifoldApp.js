import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { customEvent, customQuery } from '../../utils/manifoldSDK';
import { getDID } from '../../reducers';


class ManifoldAppComponent extends Component {
  constructor(props) {
    super(props)
    this.manifoldQuery = this.manifoldQuery.bind(this);
    this.signalEvent = this.signalEvent.bind(this);
  }

  /*
  query looks like this:
  {
    funcArgs: {
      key1: value1 //put key value argument pairings here
    }, OPTIONAL
    rid: <string>,
    funcName: <string>
  }
  */
  manifoldQuery(query, options) {
    const funcArgs = query.funcArgs || {};
    return customQuery(this.props.DID, query.rid, query.funcName, funcArgs);
  }

  /*
  event looks like this:
  {
    domain: <string>,
    type: <string>,
    attrs: {
      key/value pairs here
    },
    eid: <string> OPTIONAL
  }
  */
  signalEvent(event) {
    const eid = event.eid || "CustomEvent";
    //provide checks to make sure everything valid is provided
    return customEvent(this.props.DID, event.domain, event.type, event.attrs, eid);
  }

  render() {
    let DeveloperComponent = this.props.developerComponent
    if(this.props.DID) {
      return (
          <DeveloperComponent
              {...(this.props)} manifoldQuery={this.manifoldQuery} signalEvent={this.signalEvent}
          />
      )
    }else {
      return (
        <div>Loading...</div>
      )
    }

  }
}

ManifoldAppComponent.propTypes = {
  developerComponent: PropTypes.func.isRequired,
  picoID: PropTypes.string.isRequired,
  /*DID: PropTypes.string.isRequired,*/ //DID is required, but I took it out of proptypes because it takes a second to come in and the console error is annoying
  bindings: PropTypes.object.isRequired
}

function mapStateToProps(state, ownProps) {
  return {
    DID: getDID(state, ownProps.picoID)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManifoldAppComponent);

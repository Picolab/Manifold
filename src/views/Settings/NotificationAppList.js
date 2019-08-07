import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Media, UncontrolledTooltip } from 'reactstrap';
import { getInstalledApps, getDID } from '../../reducers';
import {customEvent} from '../../utils/manifoldSDK';
import {getManifoldECI} from '../../utils/AuthService';
import { discovery } from '../../actions';
import { Link } from 'react-router-dom';
import './ThingAppOverview.css';

class NotificationAppList extends Component {

  componentDidMount() {
    this.updateAppList();
  }

  updateAppList() {
    const promise = customEvent( getManifoldECI(), "manifold", "update_app_list", {}, 'app_list_update');
    promise.then((resp) => {

    });
  }

  renderIcons() {
    let icons = [];
    //loop through an array of installed apps
    const apps = this.props.apps;
    if(apps) {
      apps.forEach((app, index) => {
        const mediaID = "iconMedia" + index;
        icons.push(
          <div key={"appList" + index}>
            <Link to={"/settings/" + this.props.picoID + "/notification-settings/" + app.rid}>
              <Media style={{"margin" : "5px"}} className="appIcon" id={mediaID} object src={app.iconURL} alt="App Icon" />
            </Link>
            <UncontrolledTooltip placement="bottom" delay={300} target={mediaID}>
              {app.name}
            </UncontrolledTooltip>
          </div>
        )
      });
    }
    return icons;
  }

  render(){
    if(!this.props.apps) {
      if(this.props.DID) { //on page refresh, if the view is on this page, then the DID may not yet be retrieved
        this.props.retrieveApps(this.props.DID);
      }
      //else the general list of things hasn't been retrieved yet.
    }
    return (
      <div className="appListContainer">
        {this.renderIcons()}
      </div>
    );
  }
}

//pass in an array of apps that meet a certain criteria in order to display everything.
//This could be passed in from the parent, or better yet, from the redux store
NotificationAppList.propTypes = {
  picoID: PropTypes.string.isRequired,
  DID: PropTypes.string,
  apps: PropTypes.array
}

const mapStateToProps = (state, ownProps) => {
  return {
    apps: getInstalledApps(state, ownProps.picoID),
    DID: getDID(state, ownProps.picoID)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    retrieveApps: (DID) => {
      dispatch(discovery(DID, ownProps.picoID));
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(NotificationAppList);

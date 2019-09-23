import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Media, UncontrolledTooltip } from 'reactstrap';
import { getInstalledApps, getDID } from '../../reducers';
import { discovery } from '../../actions';
import { Link } from 'react-router-dom';
import './CardOverview.css';

class AppList extends Component {

  constructor(props) {
    super(props);
    let params = (window.location.href.indexOf('?') !== -1) ? window.location.href.slice(window.location.href.indexOf('?')) : "";
    this.state = {
      params
    }
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
            <Link to={"/mythings/" + this.props.picoID + "/" + app.rid + this.state.params}>
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
AppList.propTypes = {
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


export default connect(mapStateToProps, mapDispatchToProps)(AppList);

import React from 'react';
import PropTypes from 'prop-types';
import { getInstalledApps, getDID } from '../../../../reducers';
import { discovery } from '../../../../actions';
import { connect } from 'react-redux';
import { customQuery } from '../../../../utils/manifoldSDK';
import './MirrorDisplay.css';
import CardMap from '../../../Apps/CardMap';
import ManifoldAppComponent from '../../../Apps/ManifoldApp';

class MirrorDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displaySettings: {},
      tl: "",
      tr: "",
      bl: "",
      br: "",
    }
  }
  componentDidMount() {
    let url_string = window.location.href.replace("#/", "")
    let url = new URL(url_string);
    let tl = url.searchParams.get("tl");
    let tr = url.searchParams.get("tr");
    let bl = url.searchParams.get("bl");
    let br = url.searchParams.get("br");
    console.log("componentDidMount", this.props.match.params.picoID);

    this.setState({ tl, tr, bl, br });

    this.getDisplaySettings();
  }

  async getDisplaySettings() {
    console.log("DID from getDisplaySettings", this.props.DID);
    let promise = customQuery( this.props.DID, "io.picolabs.manifold.smart_mirror", "getDisplaySettings");
    promise.then((resp) => {
      this.setState({
        displaySettings: resp.data
      })
      for(var item in resp.data) {
        if (item !== "Smart Mirror") {
          this.setState({
            [item]: resp.data[item].selected
          })
          let selection = resp.data[item].selected
          for(var i in selection) {
            this.displayChangeHelper(selection[i],item,"Added");
          }
        }
      }
    });
  }

  determineOrientation() {
    const { tl, tr, bl, br } = this.state;
    if (tl === tr || bl === br) {
      return "row";
    }
    else if (tl === bl || tr === br) {
      return "column"
    }
    return "";
  }

  getAppDisplay(app) {
    //return <div>{app}</div>
    if (!app) {
      return <div></div>
    }
    let rid = this.state.displaySettings[app].rid;
    let appInfo = this.getAppInfo(app);
    const CustomComponent = CardMap[rid];
    return (
      <ManifoldAppComponent developerComponent={CustomComponent} bindings={appInfo.bindings} picoID={this.props.picoID} DID={this.props.DID} />
    );
  }

  getAppInfo(app) {
    for(var i in this.props.apps) {
      if(this.props.apps[i].name === app) {
        return this.props.apps[i];
      }
    }
    return {};
  }

  renderDisplay() {
    const { tl, tr, bl, br } = this.state;
    const orientation = this.determineOrientation()
    if (orientation === "row") {
      return (
        <div className="preview-container">
          {(tl === tr) && <div className="preview-top-row">{this.getAppDisplay(tl)}</div>}
          {!(tl === tr) && <div className="preview-item left">{this.getAppDisplay(tl)}</div>}
          {!(tl === tr) && <div className="preview-item right">{this.getAppDisplay(tr)}</div>}

          {(bl === br) && <div className="preview-bottom-row">{this.getAppDisplay(bl)}</div>}
          {!(bl === br) && <div className="preview-item left">{this.getAppDisplay(bl)}</div>}
          {!(bl === br) && <div className="preview-item right">{this.getAppDisplay(br)}</div>}
        </div>
      );
    }
    else if (orientation === "column") {
      return (
        <div className="preview-container">
          {(tl === bl) && <div className="preview-left-column">{this.getAppDisplay(tl)}</div>}
          {!(tl === bl) && <div className="preview-item left">{this.getAppDisplay(tl)}</div>}
          {!(tl === bl) && <div className="preview-item left">{this.getAppDisplay(bl)}</div>}

          {(tr === br) && <div className="preview-right-column">{this.getAppDisplay(tr)}</div>}
          {!(tr === br) && <div className="preview-item right">{this.getAppDisplay(tr)}</div>}
          {!(tr === br) && <div className="preview-item right">{this.getAppDisplay(br)}</div>}
        </div>
      );
    }
    return (
      <div className="preview-container">
        <div className="preview-item left">{this.getAppDisplay(tl)}</div>
        <div className="preview-item right">{this.getAppDisplay(tr)}</div>
        <div className="preview-item left">{this.getAppDisplay(bl)}</div>
        <div className="preview-item right">{this.getAppDisplay(br)}</div>
      </div>
    );
  }

  render() {
    console.log("display state", this.state);
    if(!this.props.apps) {
      if(this.props.DID) { //on page refresh, if the view is on this page, then the DID may not yet be retrieved
        this.props.retrieveApps(this.props.DID);
      }
      //else the general list of things hasn't been retrieved yet.
    }
    return (
      <div className="mirror-display">
        {this.renderDisplay()}
      </div>
    );
  }
}

MirrorDisplay.propTypes = {
  picoID: PropTypes.string.isRequired,
  DID: PropTypes.string,
  apps: PropTypes.array
}

const mapStateToProps = (state, ownProps) => {
  console.log("redux state", state);
  console.log("ownProps", ownProps);
  return {
    apps: getInstalledApps(state, ownProps.match.params.picoID),
    DID: getDID(state, ownProps.match.params.picoID),
    picoID: ownProps.match.params.picoID
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  console.log("mapDispatchToProps", ownProps.match.params.picoID);
  return {
    retrieveApps: (DID) => {
      dispatch(discovery(DID, ownProps.match.params.picoID));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MirrorDisplay);

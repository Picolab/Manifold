import React from 'react';
import { Button, ButtonGroup, Container, Col, Row, Media } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CardMap from '../../CardMap';
import ManifoldAppComponent from '../../ManifoldApp';
import { getInstalledApps, getDID } from '../../../../reducers';
import { discovery } from '../../../../actions';
import "./SmartMirror.css"
import NotificationsCycle from "./NotificationsCycle";

const topDimensions = {"width": "50px", "height": "40px"}
const bottomDimensions = {"width": "50px", "height": "40px"}
// screen size is 1600px x 900px

class SmartMirror extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displaySettings: {},
      displaySelected: [],
      tl: "",
      tr: "",
      bl: "",
      br: "",
      picoID: "",
      isFullScreen: false
    }

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.getDisplaySettings = this.getDisplaySettings.bind(this);
    this.escFunction = this.escFunction.bind(this);
  }
  componentDidMount() {
    var url = window.location.href;
    var array = url.split("/");
    var id = array[array.length-2];
    this.setState({
      picoID: id
    });

    this.getDisplaySettings();
    document.addEventListener("keydown", this.escFunction, false);
  }

  componentDidUpdate() {
    if (this.state.isFullScreen && this.interval === undefined) {
      this.interval = setInterval(() => this.getDisplaySettings(), 3000);
    }
    else if (!this.state.isFullScreen && this.interval) {
      clearInterval(this.interval);
    }
    if (this.state.isFullScreen) {
      document.getElementsByTagName('body')[0].style.overflow = "hidden"
    }
    else {
      document.getElementsByTagName('body')[0].style.overflow = "visible"
    }
  }

  escFunction() {
    this.setState({ isFullScreen: false })
  }

  onRadioBtnClick(selection, name) {
    let selected = this.state[name]
    if(selected.includes(selection)) {
      let selectionRemoved = selected.filter(function(number) {
        return number !== selection
      })
      this.displayChangeHelper(selection, name, "Removed")
      this.setState({
        [name]: selectionRemoved
      })
    }
    else {
      this.displayChangeHelper(selection, name, "Added")
      selected.push(selection);
      this.setState({
        [name]: selected
      });
    }
  }

  displayChangeHelper(selection, name, action) {
    switch(selection) {
      case 1:
        if(action === "Removed") {
          this.setState({
            tl: ""
          })
        }
        else {
          this.setState({
            tl: name
          })
        }
        break;
      case 2:
        if(action === "Removed") {
          this.setState({
            tr: ""
          })
        }
        else {
          this.setState({
            tr: name
          })
        }
        break;
      case 3:
        if(action === "Removed") {
          this.setState({
            bl: ""
          })
        }
        else {
          this.setState({
            bl: name
          })
        }
        break;
      case 4:
        if(action === "Removed") {
          this.setState({
            br: ""
          })
        }
        else {
          this.setState({
            br: name
          })
        }
        break;
      default:
    }
  }

  saveSettings = () => {
    for(var i in this.props.apps) {
      if(this.props.apps[i].name !== "Smart Mirror") {
        this.props.signalEvent({
          domain : "mirror",
          type: "change_display_settings",
          attrs : {
            name: this.props.apps[i].name,
            selected: JSON.stringify(this.state[this.props.apps[i].name])
          }
        }).catch((e) => {
          console.error("Error setting changes", e);
        });
      }
    }
    this.props.signalEvent({
      domain : "mirror",
      type: "change_display_settings",
      attrs : {
        name: "NotificationsCycle",
        selected: JSON.stringify(this.state["NotificationsCycle"])
      }
    }).catch((e) => {
      console.error("Error setting changes", e);
    });
  }

  checkStatus(number, name) {
    const { tl, tr, bl, br } = this.state;
    let selected = this.state[name];
    switch(number) {
      case 1:
        if(selected.includes(4) || (tl !== "" && tl !== name)) {
          return true;
        }
        else {
          return false;
        }
      case 2:
        if(selected.includes(3) || (tr !== "" && tr !== name)) {
          return true;
        }
        else {
          return false;
        }
      case 3:
        if(selected.includes(2) || (bl !== "" && bl !== name)) {
          return true;
        }
        else {
          return false;
        }
      case 4:
        if(selected.includes(1) || (br !== "" && br !== name)) {
          return true;
        }
        else {
          return false;
        }
      default:
    }
  }

  async getDisplaySettings() {
    let promise = this.props.manifoldQuery({
      rid: "io.picolabs.manifold.smart_mirror",
      funcName: "getDisplaySettings"
    });
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

  showAvailableApps() {
    let out = [];
    //loop through an array of installed apps
    const apps = this.props.apps;
    if(apps) {
      apps.forEach((app, index) => {
        const mediaID = "iconMedia" + index;
        var selected = this.state[app.name]
        if(selected) {
          out.push(
            <div key={app.name} className="app_section">
              <h5>{app.name}</h5>
              <div key={"appList" + index}>
                <Media className="appIcon" id={mediaID} object src={app.iconURL} alt="App Icon" /> {' '}
                <ButtonGroup>
                  <Button style={topDimensions} color="primary" onClick={() => this.onRadioBtnClick(1, app.name)} active={selected.includes(1)} disabled={this.checkStatus(1, app.name)}>TL</Button>
                  <Button style={topDimensions} color="primary" onClick={() => this.onRadioBtnClick(2, app.name)} active={selected.includes(2)} disabled={this.checkStatus(2, app.name)}>TR</Button>
                </ButtonGroup>
                <br />
                <ButtonGroup>
                  <Button style={bottomDimensions} color="primary" onClick={() => this.onRadioBtnClick(3, app.name)} active={selected.includes(3)} disabled={this.checkStatus(3, app.name)}>BL</Button>
                  <Button style={bottomDimensions} color="primary" onClick={() => this.onRadioBtnClick(4, app.name)} active={selected.includes(4)} disabled={this.checkStatus(4, app.name)}>BR</Button>
                </ButtonGroup>
              </div>
            </div>
          )
        }
      });
    }
    return out;
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

  //Need to change background color of weather app
  // Need to get rid of box sizing inherent of container
  // Change text size
  getAppDisplay = (app) => {
    if (!app) {
      return <div/>
    }
    let rid = this.state.displaySettings[app].rid;
    let appInfo = this.getAppInfo(app);
    const CustomComponent = CardMap[rid];

    if (appInfo.bindings) {
      return (
        <ManifoldAppComponent developerComponent={CustomComponent} bindings={appInfo.bindings} picoID={this.props.picoID} DID={this.props.DID} />
      );
    }
    else if(app === "NotificationsCycle") {
      return (
        <NotificationsCycle />
      )
    }
    else return (
      <div/>
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

  renderPreview() {
    const { tl, tr, bl, br } = this.state;
    const orientation = this.determineOrientation()
    if (orientation === "row") {
      return (
        <div className="mirror-container">
          {(tl === tr) &&
            <Row style={{height: "50%", "overflow": "hidden"}}>
              <Col>{this.getAppDisplay(tl)}</Col>
            </Row>
          }
          {!(tl === tr) &&
            <Row style={{height: "50%", "overflow": "hidden"}}>
              <Col>{this.getAppDisplay(tl)}</Col>
              <Col>{this.getAppDisplay(tr)}</Col>
            </Row>
          }
          {(bl === br) &&
            <Row style={{height: "50%", "overflow": "hidden"}}>
              <Col>{this.getAppDisplay(bl)}</Col>
            </Row>
          }
          {!(bl === br) &&
            <Row style={{height: "50%", "overflow": "auto"}}>
              <Col>{this.getAppDisplay(bl)}</Col>
              <Col>{this.getAppDisplay(br)}</Col>
            </Row>
          }
        </div>
      );
    }
    else if (orientation === "column") {
      return (
        <div className="mirror-container">
          <Row>
            <Col>
              {(tl === bl) && this.getAppDisplay(tl)}
              {!(tl === bl) && this.getAppDisplay(tl)}
              {!(tl === bl) && this.getAppDisplay(bl)}
            </Col>
            <Col>
              {(tr === br) && this.getAppDisplay(tr)}
              {!(tr === br) && this.getAppDisplay(tr)}
              {!(tr === br) && this.getAppDisplay(br)}
            </Col>
          </Row>
        </div>
      );
    }
    return (
      <div className="mirror-container">
        <Row style={{height: "50%"}}>
          <Col>
            {this.getAppDisplay(tl)}
          </Col>
          <Col>
            {this.getAppDisplay(tr)}
          </Col>
        </Row>
        <Row style={{height: "50%"}}>
          <Col>
            {this.getAppDisplay(bl)}
          </Col>
          <Col>
            {this.getAppDisplay(br)}
          </Col>
        </Row>
      </div>
    );
  }

  renderNotificationApp() {
    if(this.state["NotificationsCycle"]) {
      var selected = this.state["NotificationsCycle"]
      return (
        <div className="app_section">
          <h5>Notifications</h5>
          <div>
            <div className="appIcon"><i className="fa fa-bell fa-5x"/></div>
            <ButtonGroup>
              <Button style={topDimensions} color="primary" onClick={() => this.onRadioBtnClick(1, "NotificationsCycle")} active={selected.includes(1)} disabled={this.checkStatus(1, "NotificationsCycle")}>TL</Button>
              <Button style={topDimensions} color="primary" onClick={() => this.onRadioBtnClick(2, "NotificationsCycle")} active={selected.includes(2)} disabled={this.checkStatus(2, "NotificationsCycle")}>TR</Button>
            </ButtonGroup>
            <br />
            <ButtonGroup>
              <Button style={bottomDimensions} color="primary" onClick={() => this.onRadioBtnClick(3, "NotificationsCycle")} active={selected.includes(3)} disabled={this.checkStatus(3, "NotificationsCycle")}>BL</Button>
              <Button style={bottomDimensions} color="primary" onClick={() => this.onRadioBtnClick(4, "NotificationsCycle")} active={selected.includes(4)} disabled={this.checkStatus(4, "NotificationsCycle")}>BR</Button>
            </ButtonGroup>
          </div>
        </div>
      );
    }
  }

  render() {
    if(this.state.isFullScreen) {
      return (
        <div className="mirror-display" onKeyDown={(e)=> this.setState({ isFullScreen: false })}>
          {this.renderPreview()}
        </div>
      );
    }
    if(!this.props.apps) {
      if(this.props.DID) { //on page refresh, if the view is on this page, then the DID may not yet be retrieved
        this.props.retrieveApps(this.props.DID);
      }
      //else the general list of things hasn't been retrieved yet.
    }
    return (
      <div>
        <h2>Available Apps for Display</h2>
        <Container className="appListContainer">
          <Col className="scrollableAppList">
            {this.renderNotificationApp()}
            {this.showAvailableApps()}
            <Col className="saveButtonColumn" style={{"width": "350px"}}>
              <Button color="primary" style={{"marginLeft": "auto"}} onClick={this.saveSettings}>Save</Button>
            </Col>
          </Col>
          <Col>
            <div onClick={() => this.setState({ isFullScreen: true })}>
              <div className="preview">
                <div className="overlay">
                  <div className="hoverText">Click to Preview</div>
                </div>
                {this.renderPreview()}
              </div>
            </div>
          </Col>
        </Container>
      </div>
    );
  }
}

SmartMirror.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SmartMirror);

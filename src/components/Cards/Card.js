import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardFooter from './CardFooter';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import PropTypes from 'prop-types';
import './cardStyles.css';
import './cardsStyle.css';
import { discovery } from '../../actions';
import { getInstalledApps, getDID, getColor } from '../../reducers';


class Card extends Component {
  constructor(props) {
    super(props);

    this.handleCarouselDotClick = this.handleCarouselDotClick.bind(this);

    this.state = {
      currentApp: 0,
    }

    this.renderBody = this.renderBody.bind(this);
  }

  componentWillMount(){
    //query for the discovery and app info
    if(!this.props.installedApps) { //if we haven't retrieved it yet
      this.props.dispatch(discovery(this.props.DID, this.props.picoID));
    }
  }


  handleCarouselDotClick(index) {
    this.setState({
      currentApp: index
    });
  }

  renderBody() {
    if(this.props.installedApps.length > 0){
      return (
        <CardBody picoID={this.props.picoID} appInfo={this.props.installedApps[this.state.currentApp]}/>
      )
    }else{
      let bodyText = "";
      switch (this.props.cardType) {
        case "Thing":
          bodyText = "To install an app, either click on the wheel at the top of this card, or open the card and do it from the next page. Try out our Safe and Mine app!";
          break;
        case "Community":
          bodyText = "To add things to the community, either click on the wheel at the top of this card, or drag a thing from the right toolbar onto this card! You can also install apps to this community just like you could with a thing";
          break;
        default:
          bodyText = "undefined card type";
          break;
      }
      return (
        <div>
          {bodyText}
        </div>
      )
    }
  }

  renderHeader() {
    if(this.props.installedApps.length > 0){
      return (
        <CardHeader picoID={this.props.picoID} cardType={this.props.cardType} appInfo={this.props.installedApps[this.state.currentApp]} />
      )
    }else{
      return (
        <CardHeader picoID={this.props.picoID} cardType={this.props.cardType} />
      )
    }
  }

  render(){
    return (
      <div className="card" style={{  height: "inherit", width: "inherit"}}>

        {this.props.installedApps && this.renderHeader()}

        <div className="card-block nonDraggable" style={{"textOverflow": "clip", overflow: "auto"}}>
          { this.props.installedApps && this.renderBody() }
          {!this.props.installedApps && <div>Loading...</div>}
        </div>

        <div className="card-footer nonDraggable" style={{"backgroundColor": this.props.color, overflow:"hidden",  textAlign: "center", minHeight:"40px"}}>
          {this.props.installedApps && <CardFooter
                                          dotClicked={this.handleCarouselDotClick}
                                          totalApps={this.props.installedApps.length}
                                          currentApp={this.state.currentApp}
                                          allApps={this.props.installedApps}
                                        />}
        </div>
        <div className={(this.props.overlay && this.props.overlay.isActive ? "cardOverlay" : "")}></div>
      </div>
    );
  }
}

Card.defaultProps = {
  color: "#eceff1" //light grey
}

Card.propTypes = {
  picoID: PropTypes.string.isRequired,
  cardType: PropTypes.string.isRequired,
  overlay: PropTypes.shape({
    isActive: PropTypes.bool.isRequired,
    color: PropTypes.string //should we provide overlay configs?
  }),
  DID: PropTypes.string.isRequired,
  installedApps: PropTypes.array,
  color: PropTypes.string
}

const mapStateToProps = (state, ownProps) => {
  return {
    DID: getDID(state, ownProps.picoID),
    installedApps: getInstalledApps(state, ownProps.picoID),
    color: getColor(state, ownProps.picoID)
  }
}


export default connect(mapStateToProps)(Card);

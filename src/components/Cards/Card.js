import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardFooter from './CardFooter';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import PropTypes from 'prop-types';
import './cardStyles.css';
import { discovery } from '../../actions';
import { getCardIdentity, getDID, getColor } from '../../reducers';


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
    this.props.dispatch(discovery(this.props.DID, this.props.picoID));
  }


  handleCarouselDotClick(index) {
    this.setState({
      currentApp: index
    });
    console.log("HELLO FROM DOT: " + index );
  }

  renderBody() {
    if(this.props.cardIdentity.length > 0){
      return (
        <CardBody picoID={this.props.picoID} appInfo={this.props.cardIdentity[this.state.currentApp]}/>
      )
    }else{
      return (
        <div>
          There are no apps currently installed on this Thing!
        </div>
      )
    }
  }

  render(){
    return (
      <div className="card" style={{  height: "inherit", width: "inherit"}}>

        <CardHeader picoID={this.props.picoID} cardType={this.props.cardType}/>

        <div className="card-block nonDraggable" style={{"textOverflow": "clip", overflow: "auto"}}>
          {this.renderBody()}
        </div>

        <div className="card-footer nonDraggable" style={{"backgroundColor": this.props.color, overflow:"hidden",  textAlign: "center", minHeight:"40px"}}>
          <CardFooter
            dotClicked={this.handleCarouselDotClick}
            totalApps={this.props.cardIdentity.length}
            currentApp={this.state.currentApp}
          />
        </div>
        <div className={(this.props.overlay && this.props.overlay.isActive ? "cardOverlay" : "")}>
        </div>
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
  cardIdentity: PropTypes.array.isRequired,
  color: PropTypes.string
}

const mapStateToProps = (state, ownProps) => {
  return {
    DID: getDID(state, ownProps.picoID),
    cardIdentity: getCardIdentity(state, ownProps.picoID),
    color: getColor(state, ownProps.picoID)
  }
}


export default connect(mapStateToProps)(Card);

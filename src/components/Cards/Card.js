import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardFooter from './CardFooter';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import PropTypes from 'prop-types';


class Card extends Component {
  constructor(props) {
    super(props);

    this.handleCarouselDotClick = this.handleCarouselDotClick.bind(this);

    this.state = {
      currentApp: 0
    }

    this.renderBody = this.renderBody.bind(this);
  }

  componentWillMount(){
    //query for the discovery and app info
    this.props.dispatch({type: 'DISCOVERY', eci: this.props.Rx, pico_id: this.props.id});
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
        <CardBody Rx={this.props.Rx} id={this.props.id} appInfo={this.props.thingIdentity[this.state.currentApp]}/>
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

        <CardHeader name={this.props.name} color={this.props.color} Rx={this.props.Rx} sub_id={this.props.sub_id} cardType={this.props.cardType}/>

        <div className="card-block" style={{"textOverflow": "clip", overflow: "hidden"}}>
          {this.renderBody()}
        </div>

        <div className="card-footer" style={{"backgroundColor": this.props.color, overflow:"hidden",  textAlign: "center", minHeight:"40px"}}>
          <CardFooter
            dotClicked={this.handleCarouselDotClick}
            totalApps={this.props.cardIdentity.length}
            currentApp={this.state.currentApp}
          />
        </div>

      </div>
    );
  }
}

Card.defaultProps = {
  color: "#eceff1" //light grey
}

Card.propTypes = {
  name: PropTypes.string.isRequired,
  sub_id: PropTypes.string.isRequired,
  Rx: PropTypes.string.isRequired,
  cardIdentity: PropTypes.array.isRequired,
  cardType: PropTypes.string.isRequired,
  color: PropTypes.string, //not required
}

const mapStateToProps = (state, ownProps) => {
  if(state.identities && state.identities[ownProps.id]){
    return {
       cardIdentity: state.identities[ownProps.id],
    }
  }else{
    return {
      cardIdentity: []
    }
  }
}


export default connect(mapStateToProps)(Card);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import ThingFooter from './ThingFooter';
import ThingHeader from './ThingHeader';
import ThingBody from './ThingBody';
import PropTypes from 'prop-types';


class Thing extends Component {
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
    this.props.dispatch({type: 'DISCOVERY', eci: this.props.eci, pico_id: this.props.id});
  }

  handleCarouselDotClick(index) {
    this.setState({
      currentApp: index
    });
    console.log("HELLO FROM DOT: " + index );
  }

  renderBody() {
    if(this.props.thingIdentity.length > 0){
      return (
        <ThingBody eci={this.props.eci} id={this.props.id} appInfo={this.props.thingIdentity[this.state.currentApp]}/>
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

        <ThingHeader name={this.props.name} color={this.props.color} eci={this.props.eci}/>

        <div className="card-block" style={{"textOverflow": "clip", overflow: "hidden"}}>
          {this.renderBody()}
        </div>

        <div className="card-footer" style={{"backgroundColor": this.props.color, overflow:"hidden",  textAlign: "center", minHeight:"40px"}}>
          <ThingFooter
            dotClicked={this.handleCarouselDotClick}
            totalApps={this.props.thingIdentity.length}
            currentApp={this.state.currentApp}
          />
        </div>

      </div>
    );
  }
}

Thing.defaultProps = {
  color: "#eceff1" //light grey
}

Thing.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  parent_eci: PropTypes.string.isRequired,
  eci: PropTypes.string.isRequired,
  thingIdentity: PropTypes.array.isRequired,
  color: PropTypes.string, //not required
}

const mapStateToProps = (state, ownProps) => {
  if(state.identities && state.identities[ownProps.id]){
    return {
       thingIdentity: state.identities[ownProps.id],
    }
  }else{
    return {
      thingIdentity: []
    }
  }
}


export default connect(mapStateToProps)(Thing);

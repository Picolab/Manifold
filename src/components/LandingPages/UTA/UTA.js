import React, { Component } from 'react';
import SearchBar from './SearchBar';
import RouteList from './RouteList';
import GMap from './GMap';
import { customQuery, customEvent } from '../../../utils/manifoldSDK';
import queryString from 'query-string';
import RegistryModal from './RegistryModal';
import './UTA.css';
import { GOOGLE_MAP_KEY } from '../../../utils/config';

const BUS_DID = "NoTRseQdso3LeRSQUXiQ6y";
const SCORE_WRAPPER_DID = "E9wYHmbefPCKrecyj5wToE";

class UTA extends Component {
  constructor(props) {
    super(props);
    //location is passed down from the Route component
    const { stopCode } = queryString.parse(props.location.search);
    this.state = {
      stopCode,
      player: { },
      stopInfo: []
    }
    this.searchStop = this.searchStop.bind(this);
    this.getStanding = this.getStanding.bind(this);
  }

  componentDidMount() {
    console.log(this.state.stopCode);
    this.searchStop(this.state.stopCode);
    this.getStanding();
  }

  getStanding() {
    const promise = customQuery(SCORE_WRAPPER_DID, "io.picolabs.score_wrapper", "currentStanding", { scoreTracker: window.localStorage.getItem("scoreTracker") });

    promise.then((resp) => {this.setState({player : resp.data});}).catch((e) => {
      console.error("Error loading player info: ", e);
    });
  }



  searchStop(sCode) {
/*
    const promise = customQuery("Er4b4f7hSZLrvQ72tCK85T", "uta_real", "getTimes", { code: sCode });

      promise.then((resp) => {this.setState({stopInfo : resp.data});}).catch((e) => {
        console.error("Error loading uta: ", e);
      });
      */

    const promise = customEvent(BUS_DID, "uta", "get_times", { stop_code : sCode}, "get_times").then((resp) => {
      this.setState({stopInfo : resp.data.directives[0].options, stopCode : sCode });
    }).catch((e) => {
      console.error("Error loading uta: ", e);
    });;
  }

  camelCase(stopName) {
    var charTemp = "";
    var toRet = "";

    for (var i = 0; i < stopName.length; i++) {
      if(i === 0) charTemp = stopName.charAt(i).toUpperCase();
      else if(stopName.charAt(i-1) === ' ') charTemp = stopName.charAt(i).toUpperCase();
      else charTemp = stopName.charAt(i).toLowerCase();
      toRet += charTemp;
    }
    return toRet;
  }

  addRankSuffix(rank) {
    return rank + "th";
  }

  createRankAndScoreStatement(player) {
    let statement = "You are currently ";

    if(player.tied) statement += "tied for ";
    else statement += "in ";

    statement += this.addRankSuffix(player.rank);
    statement += " place with ";

    statement += player.points;
    statement += " points!";


    return statement;
  }

  render() {
    const url = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_KEY}&v=3.exp&libraries=geometry,drawing,places`;
   
    console.log("api key", process.env.REACT_APP_GOOGLE_MAP_KEY);

    return (
      <div className='shortenedWidth'>
        <RegistryModal getStanding={this.getStanding} />
        {this.state.player.first && <h2>Signed in as {this.state.player.first + " " + this.state.player.last} </h2>}
        <h5>{this.createRankAndScoreStatement(this.state.player)}</h5>
        {this.state.stopInfo.name && <h3>{this.camelCase(this.state.stopInfo.name)}</h3>}

        {this.state.stopInfo.lat && this.state.stopInfo.lon && <GMap
          lat={parseFloat(this.state.stopInfo.lat)}
          lon={parseFloat(this.state.stopInfo.lon)}
          isMarkerShown
          googleMapURL={url}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `300px` }} />}
          mapElement={<div style={{ height: `100%` }} />}/>}

        {this.state.stopInfo.routes_array && <br></br> && <RouteList getStanding={this.getStanding} Routes={this.state.stopInfo.routes_array} stopCode={this.state.stopCode} className='listGroup' />}
        <br></br>
        <SearchBar search={this.searchStop}/>

      </div>
    )
  }
}

export default UTA;

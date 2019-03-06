import React, { Component } from 'react';
import SearchBar from './SearchBar';
import RouteList from './RouteList';
import GMap from './GMap';
import { customQuery, customEvent } from '../../../utils/manifoldSDK';
import queryString from 'query-string';
import RegistryModal from './RegistryModal';
import './UTA.css';

class UTA extends Component {
  constructor(props) {
    super(props);
    //location is passed down from the Route component
    const { stopCode } = queryString.parse(props.location.search);
    this.state = {
      stopCode,
      stopInfo: []
    }
    this.searchStop = this.searchStop.bind(this);
  }

  componentDidMount() {
    console.log(this.state.stopCode);
    this.searchStop(this.state.stopCode);
  }



  searchStop(sCode) {
/*
    const promise = customQuery("Er4b4f7hSZLrvQ72tCK85T", "uta_real", "getTimes", { code: sCode });

      promise.then((resp) => {this.setState({stopInfo : resp.data});}).catch((e) => {
        console.error("Error loading uta: ", e);
      });
      */

    const promise = customEvent("Er4b4f7hSZLrvQ72tCK85T", "uta", "get_times", { stop_code : sCode}, "get_times").then((resp) => {
      this.setState({stopInfo : resp.data.directives[0].options });
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

  render() {
    return (
      <div className='shortenedWidth'>
      <RegistryModal />
        {this.state.stopInfo.name && <h3>{this.camelCase(this.state.stopInfo.name)}</h3>}

        {this.state.stopInfo.lat && this.state.stopInfo.lon && <GMap
          lat={parseFloat(this.state.stopInfo.lat)}
          lon={parseFloat(this.state.stopInfo.lon)}
          isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `300px` }} />}
          mapElement={<div style={{ height: `100%` }} />}/>}

        {this.state.stopInfo.routes_array && <br></br> && <RouteList Routes={this.state.stopInfo.routes_array} />}
        <br></br>
        <SearchBar search={this.searchStop}/>

      </div>
    )
  }
}

export default UTA;

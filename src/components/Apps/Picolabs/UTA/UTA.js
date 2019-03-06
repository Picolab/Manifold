import React, { Component } from 'react';
import SearchBar from './SearchBar';
import RouteList from './RouteList';
import GMap from './GMap';
import './UTA.css';

class UTA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stopInfo: []
    }
    this.searchStop = this.searchStop.bind(this);
  }

  searchStop(sCode) {

    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.uta",
      funcName: "stopCode",
      funcArgs: {
        code: sCode
      }
    });

      promise.then((resp) => {this.setState({stopInfo : resp.data});}).catch((e) => {
        console.error("Error loading uta: ", e);
      });
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
        {this.state.stopInfo.name && <h3>{this.camelCase(this.state.stopInfo.name)}</h3>}

        {this.state.stopInfo.lat && this.state.stopInfo.lon && <GMap
          lat={parseFloat(this.state.stopInfo.lat)}
          lon={parseFloat(this.state.stopInfo.lon)}
          isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBUqjy3Fl507TdKgyAydFwsrqqB-k6E6vg&v=3.exp&libraries=geometry,drawing,places"
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

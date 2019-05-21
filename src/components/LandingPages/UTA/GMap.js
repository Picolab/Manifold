import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const GMap = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={18}
    center={{ lat: props.lat, lng: props.lon }}
  >
    {props.isMarkerShown && <Marker position={{ lat: props.lat, lng: props.lon }} />}
  </GoogleMap>
))

export default GMap;

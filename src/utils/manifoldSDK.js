import axios from 'axios';
import { getHostname, getOwnerECI ,getManifoldECI} from './AuthService';

function sky_cloud(eci){ return `http://${getHostname()}/sky/cloud/${eci}`};
function sky_event(eci) { return `http://${getHostname()}/sky/event/${eci}`};


export function getManifoldInfo(){
  return axios.get(`${sky_cloud(getOwnerECI())}/io.picolabs.manifold_pico/getManifoldInfo`);
}

export function createThing(){
  return axios.post(`${sky_event(getManifoldECI())}/Create_Thing/manifold/create_thing`);
}

export function retrieveManifoldEci(){
  return axios.post(`${sky_event(getOwnerECI())}/eid/manifold/channel_needed`);
}

import axios from 'axios';
import { getHostname, getOwnerECI ,getManifoldECI} from './AuthService';

function sky_cloud(eci){ return `http://${getHostname()}/sky/cloud/${eci}`};
function sky_event(eci) { return `http://${getHostname()}/sky/event/${eci}`};


export function getManifoldInfo(){
  return axios.get(`${sky_cloud(getOwnerECI())}/io.picolabs.manifold_pico/getManifoldInfo`);
}

export function retrieveManifoldEci(){
  return axios.post(`${sky_event(getOwnerECI())}/eid/manifold/channel_needed`);
}

export function createThing(name){
  return axios.post(`${sky_event(getManifoldECI())}/Create_Thing/manifold/create_thing?name=${name}`);
}

export function removeThing(name){
  return axios.post(`${sky_event(getManifoldECI())}/Remove_Thing/manifold/remove_thing?name=${name}`);
}

export function updateThing(name,thing){
  return axios.post(`${sky_event(getManifoldECI())}/Update_Thing/manifold/update_thing?name=${name}`);
}



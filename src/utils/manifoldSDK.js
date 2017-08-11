import axios from 'axios';
import { getHostname, getOwnerECI } from './AuthService';

const sky_cloud = `http://${getHostname()}/sky/cloud/${getOwnerECI()}`;
const sky_event = `http://${getHostname()}/sky/event/${getOwnerECI()}`

export function getManifoldInfo(){
  return axios.get(`${sky_cloud}/io.picolabs.manifold_pico/getManifoldInfo`);
}

export function createThing(){

}

export function retrieveManifoldEci(){
  return axios.get(`${sky_cloud}/io.picolabs.manifold_owner/getManifoldEci`);
}

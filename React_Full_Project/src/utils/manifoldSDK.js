import axios from 'axios';
import { getHostname, getRootECI } from './AuthService';

const sky_cloud = `http://${getHostname()}/sky/cloud/${getRootECI()}`

export function getManifoldInfo(){
  return axios.get(`${sky_cloud}/io.picolabs.manifold_pico/getManifoldInfo`);
}

export function createThing(){

}

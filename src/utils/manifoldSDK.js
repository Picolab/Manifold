import axios from 'axios';
import { getHostname, getOwnerECI ,getManifoldECI} from './AuthService';

function sky_cloud(eci){ return `http://${getHostname()}/sky/cloud/${eci}`};
function sky_event(eci) { return `http://${getHostname()}/sky/event/${eci}`};


function encodeQueryData(data) {
  let ret = [];
  for (let d in data){
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  return ret.join('&');
}

export function customEvent(eci, domain, type, attributes, eid){
  eid = eid ? eid : "customEvent";
  const attrs = encodeQueryData(attributes);
  return axios.post(`${sky_event(eci)}/${eid}/${domain}/${type}?${attrs}`);
}

export function customQuery(eci, ruleset, funcName, params){
  const parameters = encodeQueryData(params);
  return axios.get(`${sky_cloud(eci)}/${ruleset}/${funcName}/${parameters}`);
}

export function getManifoldInfo(){
  return axios.get(`${sky_cloud(getManifoldECI())}/io.picolabs.manifold_pico/getManifoldInfo`);
}

export function retrieveManifoldEci(){
  return axios.post(`${sky_event(getOwnerECI())}/eid/manifold/channel_needed`);
}

export function createThing(name){
  return axios.post(`${sky_event(getManifoldECI())}/Create_Thing/manifold/create_thing?name=${name}`);
}

export function createCommunity(name){
  return axios.post(`${sky_event(getManifoldECI())}/Create_Thing/manifold/create_community?name=${name}`);
}

export function removeThing(name, sub_id){
  return axios.post(`${sky_event(getManifoldECI())}/Remove_Thing/manifold/remove_thing?name=${name}&sub_id=${sub_id}`);
}

export function colorThing(name, color){
  return axios.post(`${sky_event(getManifoldECI())}/colorThing/manifold/color_thing?dname=${name}&color=%23${color.substring(1)}`);
}

export function moveThing(pico_id, x, y, w, h){
  return axios.post(`${sky_event(getManifoldECI())}/Move_Thing/manifold/move_thing?pico_id=${pico_id}&x=${x}&y=${y}&w=${w}&h=${h}`);
}

export function moveCommunity(pico_id, x, y, w, h){
  return axios.post(`${sky_event(getManifoldECI())}/Move_Thing/manifold/move_community?pico_id=${pico_id}&x=${x}&y=${y}&w=${w}&h=${h}`);
}

export function discovery(eci){
  return axios.post(`${sky_event(eci)}/DISCOVERY/manifold/apps`);
}

export function installApp(eci,rid){
  return axios.post(`${sky_event(eci)}/Apps/manifold/installapp?rid=${rid}`);
}

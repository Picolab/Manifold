import axios from 'axios';
import { getHostname, getOwnerECI ,getManifoldECI} from './AuthService';
import { HTTP_PROTOCOL, ROOT_SECURED_DID } from './config.js';

export function sky_cloud(eci){ return `${HTTP_PROTOCOL}${getHostname()}/sky/cloud/${eci}`};
export function sky_event(eci) { return `${HTTP_PROTOCOL}${getHostname()}/sky/event/${eci}`};


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

export function hasTutorial() {
  return axios.get(`${sky_cloud(getManifoldECI())}/io.picolabs.manifold_pico/hasTutorial`);
}

export function retrieveOwnerDID(attrs) {
  const eventAttrs = encodeQueryData(attrs);
  return axios.post(`${sky_event(ROOT_SECURED_DID)}/eid/google/owner_did_requested?${eventAttrs}`);
}

export function retrieveManifoldEci(){
  return axios.post(`${sky_event(getOwnerECI())}/eid/manifold/channel_needed`);
}

export function retrieveOwnerProfile() {
  return customQuery(getOwnerECI(), "io.picolabs.profile", "getProfile");
}

export function createThing(name){
  return axios.post(`${sky_event(getManifoldECI())}/Create_Thing/manifold/create_thing?name=${name}`);
}

export function createCommunity(name){
  return axios.post(`${sky_event(getManifoldECI())}/Create_Thing/manifold/create_community?name=${name}`);
}

export function removeThing(name, picoID){
  return axios.post(`${sky_event(getManifoldECI())}/Remove_Thing/manifold/remove_thing?name=${name}&picoID=${picoID}`);
}

export function removeCommunity(name, picoID){
  return axios.post(`${sky_event(getManifoldECI())}/Remove_Community/manifold/remove_community?name=${name}&picoID=${picoID}`);
}

export function colorThing(name, color){
  return axios.post(`${sky_event(getManifoldECI())}/colorThing/manifold/color_thing?dname=${name}&color=%23${color.substring(1)}`);
}

export function moveThing(picoID, x, y, w, h){
  return axios.post(`${sky_event(getManifoldECI())}/Move_Thing/manifold/move_thing?picoID=${picoID}&x=${x}&y=${y}&w=${w}&h=${h}`);
}

export function renameThing(picoID, changedName) {
  return axios.post(`${sky_event(getManifoldECI())}/Change_Thing_Name/manifold/change_thing_name?picoID=${picoID}&changedName=${changedName}`);
}

export function moveCommunity(picoID, x, y, w, h){
  return axios.post(`${sky_event(getManifoldECI())}/Move_Thing/manifold/move_community?picoID=${picoID}&x=${x}&y=${y}&w=${w}&h=${h}`);
}

export function addToCommunity(commEci, toAddEci){
  return axios.post(`${sky_event(commEci)}/AddToCommunity/community/addToCommunity?toAddEci=${toAddEci}`);
}

export function discovery(eci){
  return axios.post(`${sky_event(eci)}/DISCOVERY/manifold/apps`);
}

export function installApp(eci,rid){
  return axios.post(`${sky_event(eci)}/Apps/manifold/installapp?rid=${rid}`);
}

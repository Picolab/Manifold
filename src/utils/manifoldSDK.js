import axios from 'axios';
import { getHostname, getOwnerECI ,getManifoldECI} from './AuthService';
import { HTTP_PROTOCOL, GOOGLE_ROOT_SECURED_DID, GITHUB_ROOT_SECURED_DID } from './config.js';
import { store } from '../App';
import { toggleErrorModal } from '../actions';

//axios.defaults.withCredentials = true;

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
  return axios.get(`${sky_cloud(eci)}/${ruleset}/${funcName}?${parameters}`);
}

export function getManifoldInfo(){
  updateManifoldVersion();
  return axios.get(`${sky_cloud(getManifoldECI())}/io.picolabs.manifold_pico/getManifoldInfo`);
}

export function hasTutorial() {
  return axios.get(`${sky_cloud(getManifoldECI())}/io.picolabs.manifold_pico/hasTutorial`);
}

export function updateManifoldVersion() {
  return axios.post(`${sky_event(getManifoldECI())}/eid/manifold/update_version`);
}

export function retrieveOwnerDID(attrs) {
  const eventAttrs = encodeQueryData(attrs);
  return axios.post(`${sky_event(GOOGLE_ROOT_SECURED_DID)}/eid/google/owner_did_requested?${eventAttrs}`);
}

export function retrieveGithubOwnerDID(attrs) {
  const eventAttrs = encodeQueryData(attrs);
  return axios.post(`${sky_event(GITHUB_ROOT_SECURED_DID)}/eid/github/owner_DID_requested?${eventAttrs}`);
}

export function retrieveManifoldEci(){
  return axios.post(`${sky_event(getOwnerECI())}/eid/manifold/channel_needed`);
}

export function retrieveOwnerProfile() {
  return customQuery(getOwnerECI(), "io.picolabs.profile", "getProfile");
}

export function retrieveOtherProfile() {
  return customQuery(getOwnerECI(), "io.picolabs.profile", "getOther");
}

export function createThing(name, icon){
  return axios.post(`${sky_event(getManifoldECI())}/Create_Thing/manifold/create_thing`, { name, icon });
}

export function createCommunity(name, icon){
  return axios.post(`${sky_event(getManifoldECI())}/Create_Thing/manifold/create_community`, { name, icon });
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

export function addToCommunity(commEci, eci, picoID){ //eci and picoID correspond to the thing being added to the community
  return axios.post(`${sky_event(commEci)}/AddToCommunity/community/add_to_community`, { eci, picoID });
}

export function removeFromCommunity(eci, picoID) {
  return axios.post(`${sky_event(eci)}/RemoveFromCommunity/community/remove_from_community`, { picoID });
}

export function discovery(eci){
  return axios.post(`${sky_event(eci)}/DISCOVERY/manifold/apps`);
}

export function installApp(eci,rid){
  return axios.post(`${sky_event(eci)}/Apps/manifold/installapp?rid=${rid}`);
}

export function uninstallApp(eci,rid){
  return axios.post(`${sky_event(eci)}/Apps/manifold/uninstallapp?rid=${rid}`);
}

export function changeNotificationSetting(id, app_name, option) {
  return customEvent(getManifoldECI(), "manifold", "change_notification_setting", {id, app_name, option}, "Setting");
}

export function getCookie(name) {
  console.log("COOKIES", document.cookie);
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

//returns true if attemptNum is a number, eventFunction is a function, and eventAttrs is an object, else false
function backoffParamsAreOK(attemptNum, eventFunction, eventAttrs) {
  return false;
}

function linearBackoffHelper(attemptNum, eventFunction, eventAttrs) {
  if(!backoffParamsAreOK(attemptNum, eventFunction, eventAttrs)) {
    return;
  }
  if(attemptNum > 2) {
    console.error("Last attempt to retrieve owner DID failed 😭");
    return;
  }
  //linear backoff... wait for a calculated number of milliseconds depending on which attempt this is.
  setTimeout(() => {

    const eventPromise = eventFunction(eventAttrs);
    eventPromise.then((resp) => {
      const successfull_response = false;
      if(successfull_response) {

      }else {
        //we need to try again
        this.linearBackoffHelper(attemptNum + 1, eventFunction, eventAttrs);
      }
    }).catch((e) => {
      console.error(e);
    });
  }, attemptNum * 1000);
}

export function linearEventBackoff(eventFunction, eventAttrs) {
  return linearBackoffHelper(0, eventFunction, eventAttrs)
}

/*
	value (Boolean) true must be passed in to toggle the modal.
	message (String) the error message you want users to see.
	status (String or Number) the status code of the error response.
*/

export function displayError(value, message, status) {
  store.dispatch(toggleErrorModal(value, message, status))
}

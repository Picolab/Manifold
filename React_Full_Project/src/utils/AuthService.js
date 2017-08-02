import React from 'react';
import { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';
import { ECI_KEY, CLIENT_KEY, CLIENT_SECRET_KEY, CLIENT_STATE_KEY, CLIENT_HOST_KEY,PROTOCOL_KEY,CLIENT_KEY_KEY,
   HOST, CLIENT_SECRET,CALLBACK_URL_KEY,HTTP_PROTOCOL } from './config';
import Full from '../containers/Full/Full';

export function requireAuth(){
  if(!isLoggedIn()){
    return <Redirect to='/login' />
  }
  return <Full />
}

export function isLoggedIn(){
  return !getRootECI() ? false : true;
}

export function getRootECI(){
  return localStorage.getItem(ECI_KEY);
}

export function storeRootECI(eci){
  window.localStorage.setItem(ECI_KEY, eci.toString());
}

export function createState(){
  const new_state = Math.floor(Math.random() * 9999999);
  window.localStorage.setItem(CLIENT_STATE_KEY, new_state.toString());
  return new_state;
}
export function getState(){
  return localStorage.getItem(CLIENT_STATE_KEY);
}

export function storeHostname(hostname = HOST){
  window.localStorage.setItem(CLIENT_HOST_KEY, hostname.toString());
}
export function getHostname(){
  return window.localStorage.getItem(CLIENT_HOST_KEY) || HOST;
}
export function getCallbackURL(){
  return window.localStorage.getItem( CALLBACK_URL_KEY ) + "#/code" ;// window.location.origin + "/#/code";
}
export function getManifoldURL(){
  return window.localStorage.getItem( CALLBACK_URL_KEY );// window.location.origin + "/#/code";
}
export function storeCallbackURL(url = window.location.origin + window.location.pathname ){
  window.localStorage.setItem(CALLBACK_URL_KEY, url.toString());
}

export function storeProtocol(pro = window.location.protocol+"//" ){
  window.localStorage.setItem(PROTOCOL_KEY, pro.toString());
}
export function getProtocol(){
  return window.localStorage.getItem( PROTOCOL_KEY ) || HTTP_PROTOCOL;
}
export function storeClientSecret(client_secret){
  window.localStorage.setItem(CLIENT_SECRET_KEY, client_secret.toString());
}

export function storeClientId(client_id){
  window.localStorage.setItem(CLIENT_KEY_KEY, client_id.toString());
}
export function getClientId(){
  return window.localStorage.getItem( CLIENT_KEY_KEY ) || CLIENT_KEY;
}
export function getClientSecret(){
  return window.localStorage.getItem( CLIENT_SECRET_KEY ) || CLIENT_SECRET;
}


export function getOauthURI(hostname = HOST, client_secret = CLIENT_SECRET,client_id = CLIENT_KEY){
  storeClientSecret(client_secret);// redundant for default path
  storeHostname(hostname); // redundant for default path
  storeClientId(client_id); // redundant for default path
  storeCallbackURL();
  const newState = createState();
  const encodedCallback = encodeURIComponent(getCallbackURL());//callbacks with a '#' must be encoded
  const url = `${getProtocol()}${getHostname()}/authorize?response_type=code&redirect_uri=${encodedCallback}&client_id=${getClientId()}&state=${newState}`;
  return url;
}

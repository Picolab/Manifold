import React from 'react';
import { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';
import { ECI_KEY, CALLBACK_URL, CLIENT_KEY, CLIENT_SECRET_KEY, CLIENT_STATE_KEY, CLIENT_HOST_KEY } from './config';
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

function createState(){
  const new_state = Math.floor(Math.random() * 9999999);
  window.localStorage.setItem(CLIENT_STATE_KEY, new_state.toString());
  return new_state;
}

function storeHostname(hostname){
  window.localStorage.setItem(CLIENT_HOST_KEY, hostname.toString());
}

function storeClientSecret(client_secret){
  window.localStorage.setItem(CLIENT_SECRET_KEY, client_secret.toString());
}

export function getOauthURI(hostname, client_secret){
  storeClientSecret(client_secret);
  storeHostname(hostname);
  const newState = createState();
  const url = `http://${hostname}/authorize?response_type=code&redirect_uri=${CALLBACK_URL}&client_id=${CLIENT_KEY}&state=${newState}`;
  return url;
}

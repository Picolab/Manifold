import React from 'react';
import { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';
import { ECI_KEY } from './config';
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

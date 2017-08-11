import axios from 'axios';
import { HOST, CLIENT_KEY, CLIENT_SECRET } from '../utils/config';
import { getManifoldInfo } from '../utils/manifoldSDK';
import { getCallbackURL,getHostname,getClientSecret,getProtocol,getClientId } from '../utils/AuthService';
export const ACCESS_TOKEN = 'access_token';
export const MANIFOLD_INFO = 'manifold_info';

export function getAccessToken(code){
  const body = {
    "grant_type": "authorization_code",
    "redirect_uri": getCallbackURL(),
    "client_id": getClientId(),
    "code": code,
    "client_secret": getClientSecret()
  };
  const request = axios.post(`${getProtocol()}${getHostname()}/token`,body);

  return {
    type: ACCESS_TOKEN,
    payload: request
  };
}

export function getManifoldInformation(){
  const request = getManifoldInfo();

  return {
    type: MANIFOLD_INFO,
    payload: request
  }
}

import axios from 'axios';
import { HOST, CALLBACK_URL, CLIENT_KEY, CLIENT_SECRET } from '../utils/config';

export const ACCESS_TOKEN = 'access_token';

export function getAccessToken(code){
  const body = {
    "grant_type": "authorization_code",
    "redirect_uri": CALLBACK_URL,
    "client_id": CLIENT_KEY,
    "code": code,
    "client_secret": CLIENT_SECRET
  };
  const request = axios.post(`http://${HOST}/token`,body);


  return {
    type: ACCESS_TOKEN,
    payload: request
  };
}

//constants
export const CLIENT_HOST_KEY = "AUTH_CLIENT_HOST";
export const ECI_KEY = 'eci_key';
export const CLIENT_SECRET_KEY = "AUTH_CLIENT_SECRET";
export const CLIENT_STATE_KEY = "AUTH_CLIENT_STATE";
export const CALLBACK_URL = "http://localhost:3000/#/code";
export const CLIENT_KEY = "7001E532-04FC-11E7-B4DC-51DDE71C24E1";
export const EVENT_PATH = "sky/event";
export const FUNCTION_PATH = "sky/cloud";

//variables
export const CLIENT_SECRET = window.localStorage.getItem(CLIENT_SECRET_KEY) || "default";
export const HOST = window.localStorage.getItem(CLIENT_HOST_KEY) || "localhost:8080";

import { call, put, takeEvery } from 'redux-saga/effects';
import { discovery } from '../utils/manifoldSDK';
import ActionTypes, { discoverySuccess } from '../actions';

function* execute(action) {
  if(action.payload && action.payload.DID && action.payload.picoID && action.payload.DID !== ""){
    const result = yield call(discovery, action.payload.DID);
    yield put(discoverySuccess(result, action.payload.picoID));
  }else{
    console.error("DID missing in discovery call!")
  }
}

export default function* watchDiscovery() {
  yield takeEvery(ActionTypes.DISCOVERY, execute);
}

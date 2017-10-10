import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { discovery } from '../utils/manifoldSDK';

function* execute(action) {
  if(action.eci && action.eci != ""){
    const result = yield call(discovery, action.eci);
    yield put({type: 'DISCOVERY_SUCCESS', payload: result});
  }else{
    console.error("ECI missing in discovery call!")
  }
}

export default function* watchDiscovery() {
  yield takeEvery("DISCOVERY", execute);
}

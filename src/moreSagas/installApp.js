import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { installApp } from '../utils/manifoldSDK';

function* execute(action) {
  if(action.eci && action.eci != "" && action.rid){
    const result = yield call(installApp, action.eci, action.rid);
    yield put({type: 'INSTALL_APP_SUCCESS', payload: result, pico_id: action.pico_id});
  }else{
    console.error("ECI missing in installApp call!")
  }
}

export default function* watchDiscovery() {
  yield takeEvery("INSTALL_APP", execute);
}

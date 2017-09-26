import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { getManifoldInfo } from '../utils/manifoldSDK';

function* fetchManifoldInfo(action) {
  const result = yield call(getManifoldInfo);
  if(result.data.things.things){
    console.log("Got here 3");
    yield put({ type: "manifold_info", result })
  }
}

export default function* watchManifoldInfo() {
  yield takeLatest("MANIFOLD_INFO", fetchManifoldInfo);
}

export function* watchEciSuccess() {
  yield takeLatest("FETCH_ECI_SUCCEEDED", fetchManifoldInfo);
}

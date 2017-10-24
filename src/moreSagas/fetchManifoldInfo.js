import { call, put, takeLatest } from 'redux-saga/effects';
import { getManifoldInfo } from '../utils/manifoldSDK';

function* fetchManifoldInfo(action) {
  const result = yield call(getManifoldInfo);
  if(result.data && result.data.things && result.data.things.things){
    yield put({ type: "manifold_info", result })
  }
}

export default function* watchManifoldInfo() {
  yield takeLatest("MANIFOLD_INFO", fetchManifoldInfo);
}

export function* watchEciSuccess() {
  yield takeLatest("FETCH_ECI_SUCCEEDED", fetchManifoldInfo);
}

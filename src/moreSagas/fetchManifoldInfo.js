import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { getManifoldInfo } from '../utils/manifoldSDK';

function* fetchManifoldInfo(action) {
  const result = yield call(getManifoldInfo);
  console.log("THIS IS THE PLACE",result);
  if(result.data.things.things){
    console.log("DISPATCHING ACTION");
    yield put({ type: "manifold_info", result })
  }
}

export default function* watchManifoldInfo() {
  yield takeLatest("Manifold_Info", fetchManifoldInfo);
}

export function* watchEciSuccess() {
  yield takeLatest("FETCH_ECI_SUCCEEDED", fetchManifoldInfo);
}

import { call, put, takeLatest } from 'redux-saga/effects';
import { getManifoldInfo } from '../utils/manifoldSDK';
import ActionTypes from '../actions';

function* fetchManifoldInfo(action) {
  const result = yield call(getManifoldInfo);
  if(result.data && result.data.things && result.data.communities){
    yield put({ type: ActionTypes.MANIFOLD_INFO_RETRIEVED, result })
  }
}

export default function* watchManifoldInfo() {
  yield takeLatest(ActionTypes.MANIFOLD_INFO, fetchManifoldInfo);
}

export function* watchEciSuccess() {
  yield takeLatest(ActionTypes.FETCH_ECI_SUCCEEDED, fetchManifoldInfo);
}

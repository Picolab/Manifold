import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { getManifoldInfo } from '../utils/manifoldSDK';

function* execute(action) {
  const result = yield call(action.command, action.params); // .execute in command pattern  
  if(result.data){//check that the request did not fail.
    yield put({ type: "MANIFOLD_INFO" })
  }
}

export default function* watchCommand() {
  yield takeLatest("command", execute);
}

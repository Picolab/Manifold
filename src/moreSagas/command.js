import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { getManifoldInfo } from '../utils/manifoldSDK';

function* execute(action) {
  console.log("Got here 1");
  const result = yield call(action.command, action.params);
  if(result.data){
    console.log("Got here 2");
    yield put({ type: "MANIFOLD_INFO" })
  }
}

export default function* watchCommand() {
  yield takeLatest("command", execute);
}

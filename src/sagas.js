import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { retrieveManifoldEci } from './utils/manifoldSDK'

function* fetchEci(action) {
   try {
      const result = yield call(retrieveManifoldEci);
      yield put({type: "FETCH_ECI_SUCCEEDED", result});
   } catch (e) {
      yield put({type: "FETCH_ECI_FAILED", message: e.message});
   }
}

function* watchFetchEci() {
  yield takeLatest("FETCH_ECI", fetchEci);
}

export default function*  rootSaga() {
  yield [
    watchFetchEci()
  ]
};

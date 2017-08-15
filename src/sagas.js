import { delay } from 'redux-saga';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { retrieveManifoldEci } from './utils/manifoldSDK'

const START_DELAY_TIME = 0;
const START_ATTEMPT_NUM = 1;
const MAX_ATTEMPT_NUM = 3;

function* fetchEci(delayTime, attemptNum, action) {
   try {
      yield delay(delayTime);
      const result = yield call(retrieveManifoldEci);
      console.log("result in fetchEci:",result);
      if(result.data.directives[0].options.eci){
        yield put({type: "FETCH_ECI_SUCCEEDED", result});
      }else if(attemptNum <= MAX_ATTEMPT_NUM){//try again
        yield* fetchEci(delayTime + 1000, attemptNum + 1, action);
      }
   } catch (e) {//catch complete failures
      yield put({type: "FETCH_ECI_FAILED", message: e.message});
      console.error("Failed attempt to retrieve Manifold Pico eci.", e);
   }
}

function* watchFetchEci() {
  yield takeLatest("FETCH_ECI", fetchEci, START_DELAY_TIME, START_ATTEMPT_NUM);
}

export default function*  rootSaga() {
  yield [
    watchFetchEci()
  ]
};

import { call, put, takeEvery } from 'redux-saga/effects';
import { discovery } from '../utils/manifoldSDK';
import ActionTypes from '../actions';

function* execute(action) {
  if(action.eci && action.eci !== ""){
    const result = yield call(discovery, action.eci);
    yield put({type: ActionTypes.DISCOVERY_SUCCESS, payload: result, picoID: action.picoID});
  }else{
    console.error("ECI missing in discovery call!")
  }
}

export default function* watchDiscovery() {
  yield takeEvery(ActionTypes.DISCOVERY, execute);
}

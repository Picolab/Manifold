import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import ActionTypes from '../actions/index';

export function* execute(action) {
  try{
    const result = yield call(action.command, ...action.params); // .execute in command pattern
    if(result.data){//check that the request did not fail.
      if(action.delay && typeof action.delay === 'number'){
        yield call(delay, action.delay);
      }
      if(action.query && action.query.type && action.query.type !== ""){
        yield put(action.query);
      }
    }else{
      yield put({ type: ActionTypes.MALFORMED_RESPONSE, result })
      alert("Promise was not rejected, but still missing attribute data from result!");
    }
  }
  catch(error){
    yield put({ type: ActionTypes.COMMAND_FAILED, error });
  }
}

export default function* watchCommand() {
  yield takeLatest("command", execute);
}

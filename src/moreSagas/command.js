import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

function* execute(action) {
  try{
    const result = yield call(action.command, ...action.params); // .execute in command pattern
    if(result.data){//check that the request did not fail.
      if(action.delay && typeof action.delay === 'number'){
        console.log("Delaying " + action.delay + " milliseconds");
        yield delay(action.delay);
      }
      if(action.query && action.query.type && action.query.type !== ""){
        yield put(action.query);
      }
      //yield put({ type: "MANIFOLD_INFO" });
    }else{
      alert("Something went wrong. Please try again.");
    }
  }catch(error){
    alert(error + "\nPlease check your pico-engine logs for an error.");
  }

}

export default function* watchCommand() {
  yield takeLatest("command", execute);
}

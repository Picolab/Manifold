import watchFetchEci from './moreSagas/fetchManifoldEci';
import watchManifoldInfo, { watchEciSuccess } from './moreSagas/fetchManifoldInfo';


export default function*  rootSaga() {
  yield [
    watchFetchEci(),
    watchManifoldInfo(),
    watchEciSuccess()
  ]
};

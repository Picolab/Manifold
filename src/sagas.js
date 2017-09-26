import watchFetchEci from './moreSagas/fetchManifoldEci';
import watchManifoldInfo, { watchEciSuccess } from './moreSagas/fetchManifoldInfo';
import watchCommand from './moreSagas/command';

export default function*  rootSaga() {
  yield [
    watchFetchEci(),
    watchManifoldInfo(),
    watchEciSuccess(),
    watchCommand()
  ]
};

import watchFetchEci from './moreSagas/fetchManifoldEci';
import watchManifoldInfo, { watchEciSuccess } from './moreSagas/fetchManifoldInfo';
import watchCommand from './moreSagas/command';
import watchDiscovery from './moreSagas/discovery';

export default function*  rootSaga() {
  yield [
    watchFetchEci(),
    watchManifoldInfo(),
    watchEciSuccess(),
    watchCommand(),
    watchDiscovery()
  ]
};

import watchFetchEci from './moreSagas/fetchManifoldEci';
import watchManifoldInfo, { watchEciSuccess } from './moreSagas/fetchManifoldInfo';
import watchCommand from './moreSagas/command';
import watchDiscovery from './moreSagas/discovery';
import { all } from 'redux-saga/effects';

export default function*  rootSaga() {
  yield all([
    watchFetchEci(),
    watchManifoldInfo(),
    watchEciSuccess(),
    watchCommand(),
    watchDiscovery()
  ])
};

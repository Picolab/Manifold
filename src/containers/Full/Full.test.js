import React from 'react';
import ReactDOM from 'react-dom';
import Full from './Full';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import promise from 'redux-promise'
import { createStore, applyMiddleware } from 'redux';
import reducers from '../../reducers';

//redux-saga
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../../sagas'

const sagaMiddleware = createSagaMiddleware()
const history = createBrowserHistory();

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(promise, sagaMiddleware)
)
sagaMiddleware.run(rootSaga);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Full />
        </Router>
    </Provider>, div);
});

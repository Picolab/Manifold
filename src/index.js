import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history';

//redux and react-redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';

//middleware and backend
import promise from 'redux-promise'
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// Containers
import Full from './containers/Full/'

// Views
import Login from './views/Pages/Login/'
import Register from './views/Pages/Register/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'

//Oauth
import Code from './components/oauth/code';
import { requireAuth } from './utils/AuthService';

//redux-saga
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()
const history = createBrowserHistory();
//const createStoreWithMiddleware = applyMiddleware(promise, sagaMiddleware)(createStore);
const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(promise, sagaMiddleware)
)
sagaMiddleware.run(rootSaga);

ReactDOM.render((
  <Provider store={store}>
    <DragDropContextProvider backend={HTML5Backend}>
      <HashRouter history={history}>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login}/>
          <Route exact path="/register" name="Register Page" component={Register}/>
          <Route exact path="/404" name="Page 404" component={Page404}/>
          <Route exact path="/500" name="Page 500" component={Page500}/>
          <Route path="/code" component={Code}/>
          <Route path="/" name="Home" render={requireAuth}/>
        </Switch>
      </HashRouter>
    </DragDropContextProvider>
  </Provider>
), document.getElementById('root'))

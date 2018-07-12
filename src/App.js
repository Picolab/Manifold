import React, { Component } from 'react';

import { HashRouter, Route, Switch } from 'react-router-dom'

//redux and react-redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';

// Views
import Login from './views/Pages/Login/'
import Register from './views/Pages/Register/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'

//Oauth
import Code from './components/oauth/code';
import { requireAuth } from './utils/AuthService';

//redux-saga
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';

//drag-n-drop
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import { fromJS } from 'immutable';

import SafeAndMine from './components/LandingPages/SafeAndMine';

const initialState = fromJS({
  manifoldInfo: {
    things: {},
    communities: {}
  },
  identities: {}
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)
sagaMiddleware.run(rootSaga);

class App extends Component {
  displayAppLandingPages() {
    let landingPages = [];
    //do some dynamic looping or such to figure out how many apps there are
    landingPages.push(
      <Route key="dynamic-route-1" path="/picolabs/safeandmine" name="Safe and Mine" component={SafeAndMine} />
    )
    return landingPages;
  }

  render() {
    return(
      <Provider store={store}>
        <HashRouter>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login}/>
            <Route exact path="/register" name="Register Page" component={Register}/>
            <Route exact path="/404" name="Page 404" component={Page404}/>
            <Route exact path="/500" name="Page 500" component={Page500}/>
            <Route path="/code" component={Code}/>
            {this.displayAppLandingPages()}
            <Route path="/" name="Home" render={requireAuth}/>
          </Switch>
        </HashRouter>
      </Provider>
    )
  }
}

export default DragDropContext(HTML5Backend)(App);

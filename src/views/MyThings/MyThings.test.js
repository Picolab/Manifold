import React from 'react';
import ReactDOM from 'react-dom';
import { MyThings } from './MyThings';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

//enzyme
import { shallow } from 'enzyme'


describe('MyThings view', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Router history={history}>
        <MyThings />
      </Router>, div)
  });

  // it('Tries to create a new pico', () =>{
  //   const wrapper = shallow(<MyThings />)
  // })
})

import React from 'react';
import ReactDOM from 'react-dom';
import { MyThings } from './MyThings';
import { Router } from 'react-router-dom';

//enzyme
import { shallow } from 'enzyme'


describe('MyThings view', () => {
  it('renders without crashing', () =>{
    const wrapper = shallow(<MyThings />)
  })
})

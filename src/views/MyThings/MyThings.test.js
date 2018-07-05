import React from 'react';
import ReactDOM from 'react-dom';
import { MyThings } from './MyThings';

//enzyme
import { shallow } from 'enzyme'


describe('MyThings view', () => {
  it('renders without crashing', () =>{
    const wrapper = shallow(<MyThings thingIdList={[]}/>)
  })
})

import React from 'react';
import ReactDOM from 'react-dom';
import ConnectedModal, { CreateThingModal } from './CreateThingModal';
import { commandAction } from '../../actions/command';
import { createThing } from '../../utils/manifoldSDK';

//import stuff needed to mock the store
import configureStore from 'redux-mock-store'
import promise from 'redux-promise'
import createSagaMiddleware from 'redux-saga'
const sagaMiddleware = createSagaMiddleware()
const middlewares = [promise, sagaMiddleware]
const mockStore = configureStore(middlewares)

//we are not running the saga watchers, because we don't actually want the sagas to execute here.

//enzyme
import { mount, shallow } from 'enzyme'

let createContext = (store) => {
  return {
    context: { store }
  }
}

let mockToggle = jest.fn();
let mockCreateThing = jest.fn((name) => {
  return commandAction(createThing, [name])
});

//clear the function clicked counts inbetween each test
beforeEach(() => {
  mockToggle.mockClear();
  mockCreateThing.mockClear();
})

describe('CreateThingModal', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<CreateThingModal modalOn={false} toggleFunc={mockToggle} createThing={mockCreateThing}/>);
  })

  it('calls toggle and createThing on button click', () => {
    const wrapper = shallow(<CreateThingModal modalOn={false} toggleFunc={mockToggle} createThing={mockCreateThing}/>);
    wrapper.find('#createButton').simulate('click');
    expect(mockToggle.mock.calls.length).toBe(1);
    expect(mockCreateThing.mock.calls.length).toBe(1);
  })

  //this tests a connected modal
  it('dispatches a createThing action to the store', () => {
    const store = mockStore({});
    const wrapper = shallow(<ConnectedModal modalOn={false} toggleFunc={mockToggle} />, createContext(store));
    //when working with a connected component, we need .dive() to grab the inner components
    wrapper.dive().find('#createButton').simulate('click');
    let actions = store.getActions();
    expect(actions[0]).toEqual({
      type: "command",
      command: createThing,
      params: [""],
      query: { type: 'MANIFOLD_INFO'}
    });
  })
})

import React from 'react';
import ReactDOM from 'react-dom';
import ConnectedModal, { CreateThingModal } from './CreateThingModal';
import { createThing } from '../../utils/manifoldSDK';
import ActionTypes from '../../actions';
import uuid4 from 'uuid/v4';

//import stuff needed to mock the store
import configureStore from 'redux-mock-store';
import createSagaMiddleware from 'redux-saga';
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const mockStore = configureStore(middlewares);

//we are not running the saga watchers, because we don't actually want the sagas to execute here.

//enzyme
import { mount, shallow } from 'enzyme'

//this tool is just a wrapper to return a properly formatted object when mocking a store. To be explained later
import { createContext } from '../../utils/testingTools'

/*
NOTE: jest is a global variable of sorts that we don't need to declare/import ourselves
jest.fn() is called a spy. It keeps track of anything that happens to these mock functions. The mock function (google jest mock functions)
can be "implemented" to run some code, but in this case nothing runs when the mock function is called
*/
let mockToggle = jest.fn();
let mockCreateThing = jest.fn();

//clear the mock function clicked counts inbetween each test, otherwise the mock function tracking would carry from test to test
beforeEach(() => {
  mockToggle.mockClear();
  mockCreateThing.mockClear();
})

describe('CreateThingModal', () => {
  //this is a simple smoke test. Just see if the component renders (you must provide all props, otherwise a proptypes error will occur)
  it('renders without crashing', () => {
    const wrapper = shallow(<CreateThingModal modalOn={false} toggleFunc={mockToggle} createThing={mockCreateThing}/>);
  })

  //For this modal, clicking the create thing button ought to 1: call the create thing prop function, and 2: call the toggle function to turn off the modal
  it('calls toggle and createThing on valid createThing button click', () => {
    //perform the same action as the smoke test to render the component, but this time we will actually work with the wrapper.
    const wrapper = shallow(<CreateThingModal modalOn={false} toggleFunc={mockToggle} createThing={mockCreateThing}/>);
    //we must give it a valid name before we click the button. i.e. not the default empty string
    wrapper.setState({name: 'Some valid name'})

    /*
    Find the html component with the id: "createButton", and simulate a click. Note: the simulate function only works with prop functions
    that are common in html, like onClick or onHover etc. There are more examples further down of how to manually grab and execute the prop
    function
    */
    wrapper.find('#createButton').simulate('click');
    expect(mockToggle.mock.calls.length).toBe(1);
    expect(mockCreateThing.mock.calls.length).toBe(1);
  })

  it('calls only toggle when handling the cancel click', () => {
    const wrapper = shallow(<CreateThingModal modalOn={false} toggleFunc={mockToggle} createThing={mockCreateThing}/>);
    wrapper.find('#createCancel').simulate('click');
    expect(mockToggle.mock.calls.length).toBe(1);
    expect(mockCreateThing.mock.calls.length).toBe(0);
  })

  /*
  This tests a component connected to redux. It is trickier than a normal shallow component because we need to connect it to a
  mock redux store (otherwise an error is thrown), and do some enzyme navigation to get the component we actually want.
  */
  it('dispatches a createThing action to the store with the set name', () => {
    //this sets up a fake store with an empty {}. This is ok, because this modal doesn't actually use the store data, just the dispatch function
    const store = mockStore({});

    /*
    Shallow render it almost like normal (the missing createThing function will be explained further down), but this time make
    sure to give the store in the context section (the second arg) of the shallow function, and instead of using the CreateThingModal
    we imported at the top, we want the actual connected component to render, named in the import above as "ConnectedModal". The import
    above could have named it something else (because it is the default component... non default components cannot be so freely named),
    but it made sense to name it with the word "connected"
    */
    const wrapper = shallow(<ConnectedModal modalOn={true} toggleFunc={mockToggle} />, createContext(store));

    //when working with a connected component, we need .dive() to grab our inner component, rather than the redux store wrapped component
    const divedWrapper = wrapper.dive();
    //divedWrapper is now essentially the connectedModal component

    //generate a random name then update the new state
    let randomName = uuid4();
    //this sets the state and rerenders the dived connectedModal
    divedWrapper.setState({ name: randomName});

    /*
    Now we want to see what happens when we simulate the event.
    First: find the button we are interested in
    Second: grab its onClick function using the wrapper.prop() function
    Third: call the returned function to simulate the event being clicked
    */
    divedWrapper.find('#createButton').prop('onClick')();

    /*
    You will notice that the handleAddClick function that was just called above (as defined in our modal component) relies
    on a function called createThing. We mocked this createThing function in the previous tests, but when we are testing a
    redux connected component with Enzyme, the mapDispatchToProps function (also defined in the modal) is actually run, so
    we don't need to provide it as a prop when initially rendering it. This is a good thing, because now we don't need to
    write a mock function for it, and can see it actually run as it would in a normal environment. This will help us see the
    actual behavior when trying to dispatch that action.
    */

    //new see if the correct action got dispatched to the redux store, and with the right name

    //this function (as per the redux-mock-store docs) returns an array of actions dispatched since the store's creation
    let actions = store.getActions();

    /*
    Now assert that the received action is equal to what we know it should have dispatched. This second piece of information
    requires a knowledge of how the component is supposed to behave.
    */
    expect(actions[0]).toEqual({
      type: ActionTypes.COMMAND,
      command: createThing,
      params: [randomName],
      query: { type: ActionTypes.MANIFOLD_INFO }
    });
  })

  /*
  When navigating away from the modal, one bug we fixed was that the state was preserved, which is not a desirable trait.
  This is a good example of some test cases that we didn't know we needed at first, and then added when we found the bug
  in order to prevent regressions
  */
  it('clears the name state after creating a new thing', () => {
    //we don't need a redux connected component for this test, but we want the modal to start by being on.
    const wrapper = shallow(<CreateThingModal modalOn={true} toggleFunc={mockToggle} createThing={mockCreateThing}/>);
    //set the name to something other than the initial "" name state.
    wrapper.setState({name: 'FrodoSwaggins'});

    //perform a sanity check to make sure the wrapper.setState is doing what we think
    let beforeClickName = wrapper.state().name;
    expect(beforeClickName).toEqual('FrodoSwaggins')

    //now try clicking the createThing button and see if the state is reset to ""
    wrapper.find('#createButton').prop('onClick')();

    //grab the new state name
    let afterClickName = wrapper.state().name;

    //apply the assertion to make sure it was reset
    expect(afterClickName).toEqual('')
  })

  //very similar to the test above
  it('clears the name state after cancelling the modal', () => {
    const wrapper = shallow(<CreateThingModal modalOn={true} toggleFunc={mockToggle} createThing={mockCreateThing}/>);
    wrapper.setState({name: 'FrodoSwaggins'});

    let beforeClickName = wrapper.state().name;
    expect(beforeClickName).toEqual('FrodoSwaggins')

    //now try clicking the handleToggle button and see if the state is reset to ""
    wrapper.find('#createCancel').prop('onClick')();

    //grab the new state name
    let afterClickName = wrapper.state().name;

    //apply the assertion to make sure it was reset
    expect(afterClickName).toEqual('')
  })

  it('refuses to create a thing with an empty "" name', () => {
    const wrapper = shallow(<CreateThingModal modalOn={true} toggleFunc={mockToggle} createThing={mockCreateThing}/>);
    //click the button, which will use the default empty string name state in the handleAddClick call
    wrapper.find('#createButton').simulate('click');

    //make sure neither the toggle function nor the create thing functions were called
    expect(mockToggle.mock.calls.length).toEqual(0);
    expect(mockCreateThing.mock.calls.length).toEqual(0);
  })
})

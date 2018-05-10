import watchCommand, { execute } from './command';
import { commandAction } from '../actions/command';
import SagaTester from 'redux-saga-tester';
import ActionTypes from '../actions/index';
import { delay } from 'redux-saga';
import { call } from 'redux-saga/effects';

/*
The command action takes a function that returns a promise, an array of parameters (could be empty), and then an optional
object called options that has keys queryType (which defaults to MANIFOLD_INFO), and delay, which by default is not provided
*/

describe('command saga', () => {
  //this allows for a global variable for all the tests
  let sagaTester = null;
  //this is the mock redux store
  let initialState = {};

  /*
  Set up a mock command. All commands return promises using axios, but in this case we don't actually want to make an http call for testing.
  But we can still simulate the async behavior by manually creating and returning a promise
  */
  let mockCommandFunc = jest.fn(() => {
    return new Promise((resolve, reject) => {
      //set timeout simulates async behavior, like an http call
      setTimeout(() => {
        //resolve pretends that the async behavior succeeded. Reject would be used for an error
        resolve({ data: 'some success data'})
      }, 250)
    })
  });

  let mockFailedCommandFunc = jest.fn(() => {
    return new Promise((resolve, reject) => {
      //set timeout simulates async behavior, like an http call
      setTimeout(() => {
        //resolve pretends that the async behavior succeeded. Reject would be used for an error
        reject('something did not work!')
      }, 250)
    })
  });

  let mockMalformedFunc = jest.fn(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ someOtherKey: 'Missing the data key!'})
      }, 250)
    })
  });

  beforeEach(() => {
      // Init code
      sagaTester = new SagaTester({ initialState });
      //give the sagaTester the saga watcher we are trying to test and start it up
      sagaTester.start(watchCommand);

      //this clears the number of times mockCommandFunc has been called, so previous tests don't carry over to others
      mockCommandFunc.mockClear();
  });

  it('calls the command function', async () => {
    sagaTester.dispatch(commandAction(mockCommandFunc, []));
    await sagaTester.waitFor(ActionTypes.MANIFOLD_INFO);
    expect(mockCommandFunc.mock.calls.length).toBe(1);
  })

  it('calls the command function with the given parameters', async () => {
    sagaTester.dispatch(commandAction(mockCommandFunc, ['param1', 'param2', 'param3', 'param4']));
    await sagaTester.waitFor(ActionTypes.MANIFOLD_INFO);
    expect(mockCommandFunc.mock.calls[0][0]).toBe('param1');
    expect(mockCommandFunc.mock.calls[0][1]).toBe('param2');
    expect(mockCommandFunc.mock.calls[0][2]).toBe('param3');
    expect(mockCommandFunc.mock.calls[0][3]).toBe('param4');
  })

  //async declares the function to perform some sort of action. This allows us to use the await keyword, which resolves a promise if there is one.
  it('defaults queryType to MANIFOLD_INFO', async () => {
      /*
      To begin our test, we want to dispatch the action to the redux store. Because we started the saga in the beforeEach function above,
      if the action dispatches the right action type, then the saga will intercept the dispatched action and run before going to any reducers.
      In this case, we do not provide reducers because we will be mocking the command action itself, and will not actually be querying a pico
      engine
      */
      sagaTester.dispatch(commandAction(mockCommandFunc, []));

      /*
      waitFor takes an action type. Once the saga finishes from above, the sagaTester will make sure the given actionType was returned
      from the saga. If the action is NEVER dispatched, you will get a jasmine timeout error, because the sagaTester was waiting too long
      for an actionType that was never dispatched.
      */
      await sagaTester.waitFor(ActionTypes.MANIFOLD_INFO);

      // Assuming everything works correctly, the command saga should execute the default action type
      expect(sagaTester.getLatestCalledAction()).toEqual(
          {type: ActionTypes.MANIFOLD_INFO}
      );
  })

  it('dispatches a custom action if provided and successful', async () => {
    let testActionType = 'a test action';
    sagaTester.dispatch(commandAction(mockCommandFunc, [], { queryType: testActionType }));
    await sagaTester.waitFor(testActionType);
    expect(sagaTester.getLatestCalledAction()).toEqual(
        { type: testActionType }
    );
  })

  /*
  This next test is quite tricky, and depends on the order of yields in the saga execute function we are testing, meaning it will break
  if the execute saga changes the order of its yields. That does not quarantee the problem lies with the execute saga, but this test itself
  might need to be changed. What also makes this test tricky is the need to understand what a javascript generator function is, and how to
  properly use the .next() function on a generator iterator. For more information on this, look up a beginner's guide for javascript generators.
  This test differs from the previous ones, because we are not trying to test what actions were dispatched, but that under certain conditions
  a certain line of code is executed.
  */
  it('delays if the delay option is provided', () => {
    let delayTime = 50;
    /*
    To do this test, we don't want to use the redux-saga-tester as in the above examples, because we want to test the generator function
    itself. Instead of using the watchCommand function, we will directly import the execute generator function, because that is ultimately
    where the code we are interested in is located.
    */

    //First create the actual action that we would want to dispatch to the store in a real example
    let action = commandAction(mockCommandFunc, [], { delay: delayTime });
    //Then instantiate an iterator for the generator by directly calling the function. Since it is a generator, it returns an iterable object
    const genIterator = execute(action);
    /*
    These next few lines require understanding the .next function. Look at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/next
    for documentation on how to use it.
    */

    //We ignore the first yield in the execute function, which returns a call Effect (see Effects in the redux-saga docs).
    genIterator.next();
    /*
    For the following .next call, we need to pass the result of the previous yield as a parameter. Since the first genIterator.next() line
    above returns a redux-saga Effect, we cannot resolve it without some interpreter and so we simply mock the first yield return value
    */
    let mockResult = { data: "fake result from the first yield" };
    //now iterate and get the value of the next yield after passing in the mocked data. This returns a redux-saga Effect
    const receivedCall = genIterator.next(mockResult).value;
    /*
    Finally, we want to compare the actual received call Effect to what we would expect it to be. We can find out what we expect it to be
    because we know the generator function should be returning a call Effect created using the delay function and the delayTime we provided
    earlier. We can simply .toEqual these two values to make sure they are the same.
    */
    expect(receivedCall).toEqual(call(delay, delayTime));
  })

  it('dispatches a command error if the async command failed', async () => {
    sagaTester.dispatch(commandAction(mockFailedCommandFunc, []));
    await sagaTester.waitFor(ActionTypes.COMMAND_FAILED);
    //console.error(sagaTester.getLatestCalledAction());
    expect(sagaTester.getLatestCalledAction()).toEqual({
      type: ActionTypes.COMMAND_FAILED,
      error: 'something did not work!' //this line specifically is the result from our mock function. A real error would contain an http error response
    });
  })

  it('dispatches a MALFORMED_RESPONSE error if the response does not contain data', async () => {
    sagaTester.dispatch(commandAction(mockMalformedFunc, []));
    await sagaTester.waitFor(ActionTypes.MALFORMED_RESPONSE);
    expect(sagaTester.getLatestCalledAction()).toEqual({
      type: ActionTypes.MALFORMED_RESPONSE,
      result: { someOtherKey: 'Missing the data key!'}
    });
  })
});

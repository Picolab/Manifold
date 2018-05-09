import ActionTypes from './index.js';

export function commandAction(commandFunc, paramsArray, options = {}) {
  options.queryType = options.queryType || ActionTypes.MANIFOLD_INFO;
  let action = {
    type: "command",
    command: commandFunc,
    params: paramsArray,
    query: { type: options.queryType}
  }
  if(options.delay){
    action.delay = options.delay;
  }
  return action;
}

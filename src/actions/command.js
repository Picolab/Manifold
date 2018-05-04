export function commandAction(commandFunc, paramsArray, queryType = 'MANIFOLD_INFO') {
  return{
    type: "command",
    command: commandFunc,
    params: paramsArray,
    query: { type: queryType}
  }
}

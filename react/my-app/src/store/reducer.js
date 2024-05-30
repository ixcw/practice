const defaultState = {
  inputValue: '',
  list: [1,2,3]
}

export default (state = defaultState, action) => {
  // reducer 对 action 进行处理
  if (action.type === 'change_input_value') {
    const newState = Object.assign({}, state, {
      inputValue: action.value
    })
    return newState
  }
  if (action.type === 'add_todo_item') {
    const newState = { ...state }
    newState.list.push(newState.inputValue)
    newState.inputValue = ''
    return newState
  }
  if (action.type === 'delete_todo_item') {
    const newState = JSON.parse(JSON.stringify(state))
    newState.list.splice(action.index, 1)
    return newState
  }
  return state
}
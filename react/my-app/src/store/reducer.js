import {
  CHANGE_INPUT_VALUE,
  ADD_TODO_ITEM,
  DELETE_TODO_ITEM
} from './actionType'

const defaultState = {
  inputValue: '',
  list: []
}

export default (state = defaultState, action) => {
  // reducer 对 action 进行处理
  if (action.type === CHANGE_INPUT_VALUE) {
    const newState = Object.assign({}, state, {
      inputValue: action.value
    })
    return newState
  }
  if (action.type === ADD_TODO_ITEM) {
    const newState = { ...state }
    newState.list.push(newState.inputValue)
    newState.inputValue = ''
    return newState
  }
  if (action.type === DELETE_TODO_ITEM) {
    const newState = JSON.parse(JSON.stringify(state))
    newState.list.splice(action.index, 1)
    return newState
  }
  return state
}
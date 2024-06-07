import React, { useReducer } from "react"

const initialState = { count: 0 }

const reducer = (state, action) => {
  switch(action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      return state
  }
}

export const ReducerDemo = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return <div>
    count: {state.count}
    <button onClick={() => dispatch({ type: 'increment' })}>increment</button>
    <button onClick={() => dispatch({ type: 'decrement' })}>decrement</button>
  </div>
}
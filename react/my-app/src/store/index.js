import { createStore, applyMiddleware } from "redux"
import { thunk } from "redux-thunk"
import reducer from "./reducer"

// applyMiddleware([thunk, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()])
const store = createStore(
  reducer, 
  applyMiddleware(thunk)
)

export default store
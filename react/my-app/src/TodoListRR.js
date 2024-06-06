import React, { Component } from "react"

class TodoListRR extends Component {

  constructor(props) {
    super(props)
    this.state = store.getState()
    store.subscribe(this.storeChangeHandler)
  }

  inputChangeHandler = (e) => {
    const action = getInputChangeAction(e.target.value)
    store.dispatch(action)
  }

  storeChangeHandler = () => {
    this.setState(store.getState())
  }

  addHandler = () => {
    const action = getAddTodoItemAction()
    store.dispatch(action)
  }

  deleteItem = (index) => {
    const action = getDeleteTodoItemAction(index)
    store.dispatch(action)
  }

  render() {
    return (
      <TodoListUI
        inputValue={this.state.inputValue}
        list={this.state.list}
        inputChangeHandler={this.inputChangeHandler}
        addHandler={this.addHandler}
        deleteItem={this.deleteItem}
      />
    )
  }
}

export default TodoListRR
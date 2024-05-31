import React, { Component } from "react"
import store from "./store"
import {
  getInputChangeAction,
  getAddTodoItemAction,
  getDeleteTodoItemAction
} from './store/actionCreator'
import { 
  Input,
  Button,
  List
} from 'antd'

class TodoList extends Component {

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
      <div>
        <div>
          <Input 
            placeholder="todo info"
            style={{width: 300, marginRight: 10}}
            value={this.state.inputValue}
            onChange={this.inputChangeHandler} />
          <Button type="primary" onClick={this.addHandler}>add</Button>
        </div>
        <div>
          <List
            style={{width: 300, marginTop: 5}}
            header={<div>Header</div>}
            footer={<div>Footer</div>}
            bordered
            dataSource={this.state.list}
            renderItem={(item, index) => (
              <List.Item onClick={this.deleteItem.bind(this, index)}>
                {item}
              </List.Item>
            )}
          />
        </div>
      </div>
    )
  }
}

export default TodoList
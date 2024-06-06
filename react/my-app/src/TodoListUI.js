import React from 'react'
import { 
  Input,
  Button,
  List
} from 'antd'

const TodoListUI = (props) => {
  return (
    <div>
      <div>
        <Input 
          placeholder="todo info"
          style={{width: 300, marginRight: 10}}
          value={props.inputValue}
          onChange={props.inputChangeHandler} />
        <Button type="primary" onClick={props.addHandler}>add</Button>
      </div>
      <div>
        <List
          style={{width: 300, marginTop: 5}}
          header={<div>Header</div>}
          footer={<div>Footer</div>}
          bordered
          dataSource={props.list}
          renderItem={(item, index) => (
            <List.Item onClick={props.deleteItem.bind(this, index)}>
              {item}
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}

export default TodoListUI
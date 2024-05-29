import React, { Component } from "react";
import { Button, Input, List } from "antd";

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
]

class TodoList extends Component {
  render() {
    return <div>
      <Input placeholder="base use" style={{width: 300, marginRight: 10}}></Input>
      <Button type="primary">add</Button>
      <List
        style={{marginTop: 10, width: 300}}
        header={<div>Header</div>}
        footer={<div>Footer</div>}
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            {item}
          </List.Item>
        )}
      />
    </div>
  }
}

export default TodoList
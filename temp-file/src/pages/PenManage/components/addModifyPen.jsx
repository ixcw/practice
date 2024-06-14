/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2021/6/15
 *@Modified By:
* @updateAuthor:张江
 * @updateVersion:v1.0.1
 * @updateDate:2021年09月28日
 * @description 更新描述:优化 统一类型pumaNodeTypeList列表
 */
import React from 'react';
import {Col, Form, Modal, notification, Row, Select, Upload, Input, message, Button} from 'antd'
import { jurisdiction, paperMangeTypeList, particularYear, pumaNodeTypeList, testPaperType} from '@/utils/const'
import {PenManage as namespace} from '@/utils/namespace'
import {connect} from 'dva'
import {getLocationObj} from "@/utils/utils";

const FormItem = Form.Item;
const Option = Select.Option;

@connect(state => ({}))
export default class AddModifyPen extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      listRecord: undefined,
      file: {},
    };
  }

  componentDidMount() {
    this.props.onRef(this)
  }


  /**
   * 开关
   * @param record
   */
  handleSwitch = (record) => {
    const {isModalVisible} = this.state;
    this.setState({
      listRecord: !isModalVisible ? record : '',
      isModalVisible: !isModalVisible
    }, () => {
      !isModalVisible && this.formRef.current.resetFields()
    })
  }

  render() {
    const {isModalVisible, listRecord} = this.state;
    const {dispatch, location} = this.props;
    const {query} = getLocationObj(location);
    const layout = {
      labelCol: {span: 9},
      wrapperCol: {span: 16},
    };

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };

    const handleOk = () => {
      this.formRef.current.validateFields().then(payload => {
        dispatch({
          type: namespace + '/insertOrUpdatePenInformation',
          payload: {
            id: listRecord?.id || undefined,
            penName: payload.penName,
            penSerial: payload.penSerial,
            penType: payload.penType,
            roomId:query.id
          },
          callback: () => {
            message.success('点阵笔添加成功')
            this.handleSwitch()
            dispatch({
              type: namespace + '/findPenList',
              payload: {
                roomId:query.id,
                page: query?.p || 1,
                size: 10
              }
            })
          }
        })
      })
    }


    return (
      <div>
        <Modal title={`${listRecord?.id ? '修改' : '添加'}点阵笔`} visible={isModalVisible} onOk={handleOk}
               onCancel={this.handleSwitch}>
          <Form {...layout} ref={this.formRef}>
            <FormItem
              {...formItemLayout}
              label="点阵笔名称"
              name='penName'
              initialValue={listRecord?.penName || ''}
              rules={[{
                required: true,
                message: "请输入点阵笔名称",
              }]}
            >
              <Input placeholder="请输入点阵笔名称"/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="点阵笔序列号:"
              name='penSerial'
              initialValue={listRecord?.penSerial || ''}
              rules={[{
                required: true,
                message: '请输入点阵笔序列号',
              }]}
            >
              <Input  disabled={!!listRecord?.id} placeholder="请输入点阵笔序列号"/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              name='penType'
              label="点阵笔类型"
              initialValue={listRecord?.penType ? String(listRecord?.penType) : undefined}
              rules={[{
                required: true,
                message: '请选择点阵笔类型',
              }]}
            >
              <Select  disabled={!!listRecord?.id}  placeholder="请选择点阵笔类型">
                {pumaNodeTypeList.map(it =>
                  <Option key={it.key} value={it.key}>{it.name}</Option>
                )}
              </Select>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

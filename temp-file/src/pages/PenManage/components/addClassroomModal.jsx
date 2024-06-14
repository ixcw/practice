/**
 *@Author:ChaiLong
 *@Description: 添加教室弹窗
 *@Date:Created in  2021/8/27
 *@Modified By:
 */
import React from 'react';
import {Modal, Input, message, Spin} from 'antd';
import {connect} from 'dva'
import {PenManage as namespace} from '@/utils/namespace'


@connect((state) => ({
  loading: state[namespace].loading
}))
export default class AddClassroomModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      classValue: '',
      record: {},//教室信息
    };
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  /**
   * modal开关
   * @param status
   * @param record
   */
  switchOnOff = (status, record) => {
    this.setState({isModalVisible: status, classValue: record?.name || '', record: record || {}})
  }


  render() {
    const {dispatch, loading} = this.props;
    const {isModalVisible, classValue, record} = this.state;

    /**
     * 点击确认提交
     */
    const handleOk = () => {
      dispatch({
        type: namespace + '/insertOrUpdateRoomInfo',
        payload: {
          name: classValue,
          id: record?.id
        },
        callback: () => {
          dispatch({
            type: namespace + '/findRoomInfo',
            callback: () => {
              this.switchOnOff(false)
              message.success(`${record?.id ? '修改成功' : '创建成功'}`)
            }
          })
        }
      })

    }

    /**
     * 输入教室
     * @param e
     */
    const classroomValue = (e) => {
      this.setState({classValue: e.target.value})
    }

    return (
      <Modal confirmLoading={!!loading} closable={false} visible={isModalVisible} onOk={handleOk}
             onCancel={() => this.switchOnOff(false)}>
        <Spin spinning={!!loading}>
          <Input maxLength={12} value={classValue} onChange={classroomValue} placeholder="请输入教室名称"/>
        </Spin>
      </Modal>
    )
  }
}

/**
* 加入我的题组操作弹窗
* @author:张江
* @date:2022年01月25日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import {
  Radio,
  Modal,
  Spin,
  Button
} from 'antd';
import { questionGroupTypeArray } from '@/utils/const'
// import styles from './JoinQuestionGroupModal.less';

export default class JoinQuestionGroupModal extends React.Component {
  static propTypes = {

  };

  constructor() {
    super(...arguments);
    this.state = {
      questionGroupType: 1,
      isJoining: false,
      questionGroupInfo: null,
    };
  }

  componentDidMount() {
    //将ref暴露给父级
    this.props.onRef(this)
  }


  /**
  * 编辑类型选择
  * @param value  ：编辑类型值
  */
  editChange = ({ target: { value } }) => {
    this.setState({
      questionGroupType: value
    })
  }

  /**
 * 开关
 * @param state
 * @param record :传入的参数
 */
  onOff = (state, record) => {
    //开启操作
    const on = (bool) => {
      this.setState({ isJoinQuestionGroupModal: bool, questionGroupInfo: record, questionGroupType: record.paperType || (Number(record.paperType) < 4&&Number(record.paperType)>0)? record.paperType : 1 })
    }
    //关闭操作
    const off = (bool) => {
      this.setState({ isJoinQuestionGroupModal: bool, questionGroupInfo: null, questionGroupType: '', isJoining: false })
    }
    //控制开关
    switch (state) {
      case true:
        on(state)
        break;
      case false:
        off(state)
        break;
      default:
    }
  }

  // 加入我的题组
  operJoinMyQuestionGroup = () => {
    const {
      joinMyQuestionGroup } = this.props
    const { questionGroupType, questionGroupInfo } = this.state
    const callback = () => {
      this.onOff(false, null);
    }
    let payload = {
      paperId: questionGroupInfo.id,//试卷ID
      groupType: questionGroupType,//题组类型，1作业，2测试，3试卷
    }
    this.setState({
      isJoining: true
    })
    joinMyQuestionGroup(payload, callback)
  }

  render() {
    // const {} = this.props;
    const { questionGroupType, isJoinQuestionGroupModal, isJoining, questionGroupInfo } = this.state
    return (
      <div>
        <Modal
          title={`将《${questionGroupInfo && questionGroupInfo.name}》加入我的题组`}
          visible={isJoinQuestionGroupModal}
          onCancel={() => { this.onOff(false, null) }}
          maskClosable={false}
          footer={[
            <Button key='cancel' loading={isJoining} onClick={() => { this.onOff(false, null) }}>取消</Button>,
            <Button key='ok' type="primary" loading={isJoining} onClick={this.operJoinMyQuestionGroup}>确定</Button>
          ]}
        >
          <Spin spinning={isJoining} tip={'正在加入,请稍后...'}>
            <div>
              <span>题组类型：</span>
              <Radio.Group defaultValue={questionGroupType} onChange={this.editChange}>
                {questionGroupTypeArray.map((item) => {
                  return (<Radio key={item.code} value={item.code}>{item.name}</Radio>)
                })}
              </Radio.Group>
            </div>
          </Spin>
        </Modal>
      </div>
    )
  }
}


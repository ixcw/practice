/**
* 测评目标弹窗
* @author:张江
* @date:2021年03月10日
* @version:v1.0.0
* */
import React from 'react'
import { connect } from 'dva'
import {
  Modal,
  Input,
  message,
  Spin
} from 'antd'
import { PaperBoard as namespace } from "@/utils/namespace";
// import { existArr } from "@/utils/utils";
const { TextArea } = Input;

@connect(state => ({
  saveUpdateLoading: state[namespace].saveUpdateLoading
}))
export default class EvalTargetModal extends React.Component {

  constructor(props) {
    super(...arguments);
    this.state = {
      isModalVisible: false,//modal开关状态
      questionInfo: null,
      evalContent: '',
    }
  }

  componentDidMount() {
    this.props.getRef(this)
  }


  /**
   * 开关
   * @param state
   */
  handleOnOrOff = (state, questionInfo) => {
    const { dispatch } = this.props;
    if (state && questionInfo) {
      this.setState({ isModalVisible: state, questionInfo });
    } else {
      dispatch({//
        type: namespace + '/saveState',
        payload: { saveUpdateLoading: false },
      });
      this.setState({
        isModalVisible: state,
        // questionInfo: null,
        categoryCode: '',
      }
      )
    }
  }

  /**
* 测评目标
*/
  onEvalChange = ({ target: { value } }) => {
    this.setState({
      evalContent: value,
    })
  }

  handleOk = () => {
    const { dispatch } = this.props;
    const { evalContent, questionInfo } = this.state;
    // console.log('evalContent===', evalContent)
    questionInfo.value = evalContent;
    if (!evalContent) {
      message.warning('请输入测评目标');
      return;
    }
    dispatch({// 加载保存中
      type: namespace + '/saveState',
      payload: { saveUpdateLoading: true },
    });
    dispatch({// 保存修改
      type: namespace + '/updateQuestionCategory',
      payload: {
        questionId: questionInfo.questionId || questionInfo.id,
        evalContent: evalContent,
      },
      callback: (result) => {
        dispatch({//
          type: namespace + '/saveState',
          payload: { saveUpdateLoading: false },
        });
        const returnJudge = window.$HandleAbnormalStateConfig(result);
        if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
        message.success('保存成功');
        this.handleOnOrOff(false);
      }
    });
  }

  render() {
    const { saveUpdateLoading } = this.props
    const { isModalVisible, questionInfo } = this.state;

    return (
      <Modal
        width={480}
        title={`测评目标`}
        visible={isModalVisible}
        onOk={this.handleOk}
        confirmLoading={!!saveUpdateLoading}
        closable={!saveUpdateLoading}
        onCancel={() => this.handleOnOrOff(false)}>
        <Spin tip="正在保存,请稍候..." spinning={!!saveUpdateLoading}>
          <div>
            <div>
              <TextArea
                defaultValue={questionInfo && questionInfo.value}
                onChange={this.onEvalChange}
                placeholder="请输入测评目标"
                autoSize={{ minRows: 5 }}
              />
            </div>
          </div>
        </Spin>
      </Modal>
    )
  }
}

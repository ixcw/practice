/**
* 试题板设置参数弹窗
* @author:张江
* @date:2020年12月30日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import {
  Radio,
  notification,
  Upload,
  Modal,
  message,
  Alert,
  Spin,
  Button
} from 'antd';
import { connect } from "dva";
// import { InboxOutlined } from '@ant-design/icons';
import TopicContent from "@/components/TopicContent/TopicContent";
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
import SetParameterForm from "@/components/QuestionBank/SetParameterForm";
import { CommissionerSetParam as namespace, Auth, QuestionBank } from '@/utils/namespace';
import styles from './index.less';

@connect(state => ({
  saveLoading: state[QuestionBank].saveLoading,
  keyAbilityList: state[QuestionBank].keyAbilityList,//关键能力
  coreLiteracyList: state[QuestionBank].coreLiteracyList,//核心素养
  cognitiveLevelList: state[QuestionBank].cognitiveLevelList,//认知层次
  knowledgeDimensionList: state[QuestionBank].knowledgeDimensionList,//知识维度
}))

export default class SetParameterModal extends React.Component {
  static propTypes = {
    questionInfo: PropTypes.object.isRequired,//信息
    isSetParameterModal: PropTypes.bool.isRequired,//是否显示弹框
    hideSetParameterVisible: PropTypes.func.isRequired,//弹框操作隐藏
  };


  constructor() {
    super(...arguments);
    this.state = {

    };
  }

  componentDidMount() {

  }

  /**
* 更新题目参数
* @param payload  ：传参
* @param  QContent ：单个题目信息
*/
  updateQuestionParameter = (payload, QContent) => {
    const {
      dispatch,
      location,
    } = this.props;
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'undefined') {
        delete payload[key]
      }
    });

    dispatch({// 显示保存
      type: QuestionBank + '/saveState',
      payload: { saveLoading: true }
    });

    payload.subjectId = QContent.subjectId;
    dispatch({// 修改参数 多个 四要素
      type: QuestionBank + '/updateQuestionKnowle',
      payload: payload,
      callback: (result) => {
        const returnJudge = window.$HandleAbnormalStateConfig(result);
        if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
        message.success('参数设置成功');
      }
    });
  }

  render() {
    const {
      hideSetParameterVisible,
      isSetParameterModal,
      questionInfo,

      keyAbilityList = [],//关键能力
      coreLiteracyList = [],//核心素养
      cognitiveLevelList = [],//认知层次
      knowledgeDimensionList=[],//知识维度
      saveLoading
    } = this.props;

    return (
      <Modal
        className={styles['set-parameter-modal']}
        title={`设置参数-四要素`}
        visible={isSetParameterModal}
        onCancel={hideSetParameterVisible}
        maskClosable={false}
        width={'80vw'}
        footer={[
          <Button key='cancel' loading={!!saveLoading} onClick={hideSetParameterVisible}>取消</Button>,
          <Button key='ok' type="primary" loading={!!saveLoading} onClick={() => { hideSetParameterVisible(questionInfo) }}>完成设参</Button>
        ]}
      >
        {
          RenderMaterialAndQuestion(questionInfo, true, (RAQItem) => {
            return (<TopicContent topicContent={RAQItem}
              optionsFiledName='optionList'
              optionIdFiledName="code"
              contentFiledName='content'
              childrenFiledName='child'
            />)
          },
            (RAQItem) => {
              return <Spin spinning={!!saveLoading} tip={'正在保存,请稍候...'}>
                <SetParameterForm
                  knowledgeList={[]}
                  QContent={RAQItem}
                  updateQuestionParameter={this.updateQuestionParameter}
                  otherParam={{
                    keyAbilityList,//关键能力
                    coreLiteracyList,//核心素养
                    cognitiveLevelList,//认知层次
                    knowledgeDimensionList,//知识维度
                    comePage: 'setParam'
                  }}

                /></Spin>;
            },
          )
        }
      </Modal>
    )
  }
}


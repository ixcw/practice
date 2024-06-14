/**
* 题目内容修改组件
* @author:张江
* @date:2020年08月23日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  message,
  Button,
  Spin
} from 'antd';
import { connect } from "dva";
import crypto from 'crypto';
import QuestionParseUtil from "../MarkDown/QuestionParseUtil";
import styles from './EditQuestionModal.less';
import MarkdownRender from "../MarkdownRender/MarkdownRender";
import classNames from 'classnames';
import { QuestionBank as namespace } from '@/utils/namespace';
import { dealDataJoinByField, dealQuestionEdit } from "@/utils/utils";
import singleTaskInfoCache from '@/caches/singleTaskInfo';
import queryString from 'query-string';
@connect(state => ({
  saveLoading: state[namespace].saveLoading,//加载中
}))
export default class EditQuestionModal extends React.Component {
  static propTypes = {
    questionInfo: PropTypes.object.isRequired,//题目信息
    editQuestionVisible: PropTypes.bool.isRequired,//是否显示弹框
    hideQuestionVisible: PropTypes.func.isRequired,//弹框操作隐藏
    saveQuestionContent: PropTypes.func.isRequired,//保存修改的题目内容
  };


  constructor() {
    super(...arguments);
    this.state = {
      markdownRender: '',
    };
  }
  componentDidMount() {
    const {
      questionInfo,
      location,
    } = this.props;
    this.setState({
      markdownRender: dealQuestionEdit(questionInfo)
    })
  }

  /**
  * 文本编辑获取值
  * @param value  ：更新后的值
  */
  updateMarkdown = (event) => {
    const value = event.target.value;
    this.setState({ markdownRender: value });
  }

  /**
  * 保存题目更新后的值
  */
  saveQuestionInfo = () => {
    const {
      saveQuestionContent,
      questionInfo,
      dispatch,
      location,
      hideQuestionVisible
    } = this.props;
    const { markdownRender } = this.state;
    const { search } = location;
    const query = queryString.parse(search) || {};
    const dealQuestionInfo = dealQuestionEdit(questionInfo)
    let tempNewQuestionInfo = markdownRender.replace(new RegExp("【类型标记-", "g"), "[")
    const secret = 'md5';
    const changeContent = tempNewQuestionInfo || '';
    const content = dealQuestionInfo ? dealQuestionInfo.replace(new RegExp("【类型标记-", "g"), "[") : ''
    const hash1 = crypto.createHmac('sha256', secret).update(content).digest('hex');
    const hash2 = crypto.createHmac('sha256', secret).update(changeContent).digest('hex');
    const wordOption = singleTaskInfoCache();
    if (hash1 !== hash2 && changeContent) {
      dispatch({// 显示保存
        type: namespace + '/saveState',
        payload: { saveLoading: true }
      });
      dispatch({// 修改题干信息接口 包括选项 答案 解析等 不包含图片的修改
        type: namespace + '/updateQuestionInfo',
        payload: {
          paperId: wordOption.paperId && query.version == 2 ? wordOption.paperId : '',
          questionId: questionInfo.id,
          gradeId: questionInfo.gradeId ? questionInfo.gradeId : (wordOption.gradeId || ''),
          optionIdStr: dealDataJoinByField(questionInfo && questionInfo.optionList ? questionInfo.optionList : null, 'id'),
          optionCodeStr: dealDataJoinByField(questionInfo && questionInfo.optionList ? questionInfo.optionList : null, 'code'),
          questionStr: changeContent,
          dataId: questionInfo && questionInfo.dataId ? questionInfo.dataId : (questionInfo && questionInfo.questionData && questionInfo.questionData.id ? questionInfo.questionData.id : undefined)
        },
        callback: (result = {}) => {
          if (result && result.code == 200) {
            message.success('更新成功');
            saveQuestionContent(changeContent, content, questionInfo);
          } else {
            Modal.warning({
              title: '提示信息',
              content: result.message || result.msg || '错误编码：' + result.code,
            });
          }
        }
      });
    } else {
      hideQuestionVisible();
    }
  }

  render() {
    const {
      hideQuestionVisible,
      editQuestionVisible,
      saveLoading
    } = this.props;
    const { markdownRender } = this.state
    const classString = classNames(styles['pre-box'], 'answerAnalysisImgBox');
    return (
      <Modal
        className={styles['edit-question-box']}
        title="修改题目"
        visible={editQuestionVisible}
        onOk={this.saveQuestionInfo}
        onCancel={hideQuestionVisible}
        // okText="保存"
        // cancelText="取消"
        maskClosable={false}
        width={'95%'}
        footer={[
          <Button key='cancel' loading={!!saveLoading} onClick={hideQuestionVisible}>取消</Button>,
          <Button key='ok' type="primary"
            loading={!!saveLoading}
            onClick={this.saveQuestionInfo}>{!!saveLoading ? '保存中...' : '保存'}</Button>
        ]}
      >
        <Spin spinning={!!saveLoading} tip='正在保存,请稍后..'>
          <div className={styles['edit-pre-box']}>
            <div className={styles['edit-pre-item']}>
              <textarea
                className={styles['edit-textarea']}
                value={markdownRender}
                onChange={this.updateMarkdown}
              />
            </div>
            <div className={styles['edit-pre-item']}>
              <div className={classString}>
                <MarkdownRender
                  source={QuestionParseUtil.fixContent(markdownRender)}
                  escapeHtml={false} skipHtml={false}
                />
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
    )
  }
}


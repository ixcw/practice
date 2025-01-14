/**
 * 题目列表之题干渲染组件
 * @author:张江
 * @date:2019年11月21日
 * @version:v1.0.0
 * */
import React, { Component } from 'react';
import { Empty } from 'antd';
import PropTypes from 'prop-types';
import { dealQuestionRender } from '@/utils/utils';
import MarkdownRender from "../MarkdownRender/MarkdownRender";
import styles from './TopicContent.less'
import QuestionParseUtil from "../MarkDown/QuestionParseUtil";

export default class TopicContent extends Component {

  static propTypes = {
    topicContent: PropTypes.object,//题干数据
    contentFiledName: PropTypes.string,//题干数据字段名称
    optionsFiledName: PropTypes.string,//选择题选项数组的字段名称
    childrenFiledName: PropTypes.string,//小题数组的字段名称
    optionIdFiledName: PropTypes.string,//题目选项前面编号字段名称（备注：A,B,C,D的那个自段）

    currentPage: PropTypes.number,//当前题在所属页码（当题目对象没有serialCode字段数据时，用于计算当前题号）
    currentTopicIndex: PropTypes.number,//当前题在所属页码中的索引（当题目对象没有serialCode字段数据时，用于计算当前题号）
    pageSize: PropTypes.number,//当前题在所属页码的长度（当题目对象没有serialCode字段数据时，用于计算当前题号）
    optionColor: PropTypes.bool,//选项对错是否标注颜色
    showMultiple: PropTypes.bool,//是否标识出多选题
  };


  /**
   * 题目渲染方法
   * @param topicContent  ：题目相关信息
   */
  renderTopicContent = (topicContent) => {
    const { currentPage, currentTopicIndex, pageSize, optionColor = false, showMultiple = false } = this.props
    const questionId = topicContent && topicContent.sequenceCode && `${topicContent.sequenceCode}、` ||
      topicContent && topicContent.serialNumber && `${topicContent.serialNumber}、` ||
      topicContent && topicContent.serialCode && `${topicContent.serialCode}、` || 
      topicContent && topicContent.questionNum && `${topicContent.questionNum}、` ||
      currentPage && pageSize && currentTopicIndex !== undefined && currentTopicIndex !== null && currentTopicIndex !== '' && ((currentPage - 1) * pageSize + currentTopicIndex + 1) + '、' ||
      "";

    let contentPngList = dealQuestionRender(topicContent.contentPng, true)
    let { contentFiledName = 'content', optionsFiledName = 'optionList', childrenFiledName = 'children', optionIdFiledName = 'code' } = this.props;
    //给选项添加类名
    const opClass = (item) => {
      // if (topicContent && (topicContent.answer === item.optionCode)) {
      if (topicContent && (topicContent.answer.includes(item.optionCode))) {//兼容多选题的情况
        return 'right'
      }
      if (topicContent && (topicContent.studentAnswer === item.optionCode) && (topicContent.studentAnswer !== topicContent.answer)) {
        return 'error'
      }
    }
    if (topicContent[childrenFiledName] && Array.isArray(topicContent[childrenFiledName]) && topicContent[childrenFiledName].length > 0) {
      //渲染小题
      return (
        <div style={{
          textAlign: "justify",
          textJustify: "inter-ideograph"
        }}>
          <span style={{ fontWeight: 'bold' }}>{questionId}</span>
          <MarkdownRender
            source={QuestionParseUtil.fixContent(topicContent[contentFiledName] || '', contentPngList)}
            escapeHtml={false} skipHtml={false}
          />
          {
            topicContent[contentFiledName] && topicContent[contentFiledName].includes('[myImgCur]') ? null :
              <div style={{ padding: '10px 0 20px 30px' }}>{dealQuestionRender(topicContent.contentPng)}</div>
          }

          {
            topicContent[childrenFiledName].map((item, index) => {
              return (
                <div key={index} style={{ display: 'flex', padding: '0 0 0 60px' }}>
                  <div>
                    {
                      this.renderTopicContent(item)
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      )
    } else if (topicContent[optionsFiledName] && Array.isArray(topicContent[optionsFiledName]) && topicContent[optionsFiledName].length > 0) {
      const lintReg = new RegExp(/_{12,}/, "g");
      const isHaveContent = !topicContent[contentFiledName] && !topicContent.contentPng;
      const multipleStr = showMultiple && topicContent.flag === 1 ? "(多选题)" : '';
      //渲染选项
      return (
        <div className={isHaveContent ? styles['vertical-content-center'] : ''}>
          <div className="lineHeight3-2">
            <MarkdownRender
              source={QuestionParseUtil.fixContent(questionId + multipleStr + (topicContent[contentFiledName] || ''), contentPngList)}
              escapeHtml={false} skipHtml={false}
            />
          </div>

          {topicContent[contentFiledName] && topicContent[contentFiledName].includes('[myImgCur]') ? null : dealQuestionRender(topicContent.contentPng)}
          {/* 解答题 小题换行 */}
          <div style={{
            display: topicContent.rule == 4 ? undefined : 'flex',
            flexWrap: 'wrap',
            margin: isHaveContent ? 'none' : '10px 15px 10px 30px'
          }} className='answer-time'>
            {
              topicContent[optionsFiledName].map((it, index) => (
                <div key={index} style={{ margin: '0 20px 0px 0px' }}>
                  <div
                    style={{ display: topicContent.rule == 4 && lintReg.test(it[contentFiledName]) ? undefined : 'flex' }}>
                    <span style={{ marginRight: 5 }} className='question-option-item'>
                      <div className={`${optionColor ? styles[opClass(it)] : ''}`}>
                        {it[optionIdFiledName]}
                      </div>
                    </span>
                    {
                      it[contentFiledName] && it[contentFiledName] != 'null' ? <MarkdownRender
                        source={QuestionParseUtil.fixContent(it[contentFiledName] || '', dealQuestionRender(it.contentPng, true))}
                        escapeHtml={false} skipHtml={false}
                      /> : null
                    }
                  </div>
                  {it[contentFiledName] && it[contentFiledName].includes('[myImgCur]') ? null : dealQuestionRender(it.contentPng)}
                </div>
              ))
            }
          </div>
        </div>
      )
    } else {
      return (
        <div className="lineHeight3-2">
          <MarkdownRender
            source={QuestionParseUtil.fixContent(questionId + (topicContent[contentFiledName] || ''), contentPngList)}
            escapeHtml={false} skipHtml={false}
          />
          {topicContent[contentFiledName] && topicContent[contentFiledName].includes('[myImgCur]') ? null : dealQuestionRender(topicContent.contentPng)}
        </div>
      )
    }
  };

  render() {
    const { topicContent } = this.props;
    return (
      <div
        className={styles['topicContentWrap']}
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
      >
        {
          topicContent ? this.renderTopicContent(topicContent) : <Empty style={{ marginTop: 50 }} description={'暂无题干数据'} />
        }
      </div>
    )
  }
}

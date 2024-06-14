
/**
 * 题目列表页面头部任务参数信息组件
 * @author:张江
 * @date:2020年08月23日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React from 'react';
import {
  Affix,
} from 'antd';
import PropTypes from 'prop-types'
import styles from './QuestionHeaderOption.less';
import { dealTimestamp } from '@/utils/utils';
import { questionType, qTaskStatus } from '@/utils/const'


export default class QuestionHeaderOption extends React.Component {
  static propTypes = {
    wordOption: PropTypes.object,//导入文档配置信息
    query: PropTypes.object,//地址栏参数
  };


  constructor() {
    super(...arguments);
    this.state = {

    };
  }

  render() {
    const {
      wordOption,
      query = {}
    } = this.props;
    const isComePage = wordOption && wordOption.paperId && wordOption.comePage;
    return (
      <>
        <Affix offsetTop={0}>
          <div className={styles['title']}>
            <span>
              位置：{isComePage ? '数据入库' : '题库管理'}>{wordOption && wordOption.name ? wordOption.name + ' ' : '暂无'}
              {wordOption.isSee == -1 ? ' 设参' : wordOption.isSee == 3 ? ' 审核' : wordOption.isSee == 4 ? ' 审核修驳' : wordOption.isSee == 2 ? ' 修驳驳回' : '预览'}
            </span>
          </div>
          <div className={styles['question-option-box']}>

            <div className={styles['question-header-option']}>

              <div>
                <label>年级：</label>
                <span>{wordOption && wordOption.gradeName ? wordOption.gradeName : '暂无'}</span>
              </div>
              {
                isComePage ? null : <div>
                  <label>科目：</label>
                  <span>{wordOption && wordOption.subjetName ? wordOption.subjetName : '暂无'}</span>
                </div>
              }


            </div>
            {
              isComePage ? <div className={styles['question-header-option']}>

                <div>
                  <label>科目：</label>
                  <span>{wordOption && wordOption.subjectName ? wordOption.subjectName : '暂无'}</span>
                </div>
              </div> : null
            }
            {
              isComePage ? null : [
                <div className={styles['question-header-option']} key="1">

                  {
                    wordOption && wordOption.know_name ?
                      <div>
                        <label>章节知识点：</label>
                        <span>{wordOption && wordOption.know_name ? wordOption.know_name : '暂无'}</span>
                      </div> : <div>
                        <label>大类知识点：</label>
                        <span>{wordOption && wordOption.knowName ? wordOption.knowName : '暂无'}</span>
                      </div>
                  }

                  <div>
                    <label>状态：</label>
                    {
                      qTaskStatus.map((item) => {
                        if (item.value == wordOption.status) {
                          return (<span key={item.value}>{item.text}</span>)
                        }

                      })
                    }
                  </div>
                  {/* {
                wordOption && wordOption.know_name ? null :
                  [<div key={1}>
                    <label>题型：</label>
                    <span>{wordOption && wordOption.categoryName ? wordOption.categoryName : '暂无'}</span>
                  </div>,
                  <div key={2}>
                    <label>类型：</label>
                    <span>{
                      questionType && questionType.map((item) => {
                        if (wordOption.type == item.code) {
                          return (<span key={item.code}>{item.name}</span>)
                        }
                      })
                    }</span>
                  </div>]
              }

              <div>
                <label>状态：</label>
                {
                  qTaskStatus.map((item) => {
                    if (item.value == wordOption.status) {
                      return (<span key={item.value}>{item.text}</span>)
                    }

                  })
                }
              </div>
              <div>
                <label>年级：</label>
                <span>{wordOption && wordOption.gradeName ? wordOption.gradeName : '暂无'}</span>
              </div>
              <div>
                <label>科目：</label>
                <span>{wordOption && wordOption.subjetName ? wordOption.subjetName : '暂无'}</span>
              </div>
              {
                wordOption && wordOption.know_name ? null :
                  <div>
                    <label>难度：</label>
                    <span>{wordOption && wordOption.difficulty ? wordOption.difficulty : '其他'}</span>
                  </div>
              }

              <div>
                <label>导入时间：</label>
                <span>{wordOption && wordOption.createTime ? dealTimestamp(wordOption.createTime, 'YYYY-MM-DD HH:mm:ss') : '暂无'}</span>
              </div>
              {
                wordOption && wordOption.completeTime ?
                  <div>
                    <label>完成时间：</label>
                    <span>{dealTimestamp(wordOption.completeTime, 'YYYY-MM-DD HH:mm:ss')}</span>
                  </div> : null
              } */}
                </div>
                ,
                <div className={styles['question-header-option']} key="2">

                  {
                    wordOption && wordOption.know_name ? null :
                      [<div key={1}>
                        <label>题型：</label>
                        <span>{wordOption && wordOption.categoryName ? wordOption.categoryName : '暂无'}</span>
                      </div>,
                      <div key={2}>
                        <label>类型：</label>
                        <span>{
                          questionType && questionType.map((item) => {
                            if (wordOption.type == item.code) {
                              return (<span key={item.code}>{item.name}</span>)
                            }
                          })
                        }</span>
                      </div>]
                  }

                </div>
              ]
            }


            <div className={styles['question-header-option']}>

              {
                wordOption && wordOption.difficulty ? <div>
                  <label>难度：</label>
                  <span>{wordOption && wordOption.difficulty ? wordOption.difficulty : '其他'}</span>
                </div> : null

              }
              {
                wordOption && wordOption.version_name ?
                  <div>
                    <label>版本：</label>
                    <span>{wordOption && wordOption.version_name ? wordOption.version_name : '暂无'}</span>
                  </div> : null
              }
              {//2021年05月24日 数据入库新加 试卷总分
                wordOption && wordOption.paperId && (wordOption.questionTotalScore || wordOption.questionTotalScore == 0) ?
                  <div style={{ fontWeight: 'bold' }}>
                    <label>卷面总分：</label>
                    <span>{wordOption.questionTotalScore ? wordOption.questionTotalScore + ' 分' : '0分'}</span>
                  </div> : null
              }
            </div>

            <div className={styles['question-header-option']}>

              <div>
                <label>导入时间：</label>
                <span>{wordOption && wordOption.createTime ? dealTimestamp(wordOption.createTime, 'YYYY-MM-DD HH:mm:ss') : '暂无'}</span>
              </div>
              {
                wordOption && wordOption.completeTime ?
                  <div>
                    <label>完成时间：</label>
                    <span>{dealTimestamp(wordOption.completeTime, 'YYYY-MM-DD HH:mm:ss')}</span>
                  </div> : null
              }

            </div>

          </div>

        </Affix>
      </>
    )
  }
}


/**
 * 我的题组-导出预览
 * @author:张江
 * @date:2020年08月29日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React, { Component } from 'react';
import { Button, Modal, message } from "antd";
import { connect } from "dva";
import classNames from 'classnames';
import queryString from 'query-string';
import Page from '@/components/Pages/page';
import { MyQuestionGroup as namespace, PreviewExport as namespace2 } from '@/utils/namespace'

import styles from '@/pages/QuestionBank/Question.less';
import TopicContent from "@/components/TopicContent/TopicContent";
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
import BackBtns from "@/components/BackBtns/BackBtns";
import indexStyles from './index.less';

import BigTopicInfo from "../components/BigTopicInfo";//大题标题
import PaperTopTitle from "../components/PaperTopTitle";//试卷标题及说明
import TopSetPrint from "../components/TopSetPrint";//top设置导出模式
import AnswerArea from "../components/AnswerArea";//答题区域
import ScoreGrid from "../components/ScoreGrid";//分数格子
import JudgeArea from "../components/JudgeArea";//对错判断区域
import TemplateRule from "./components/TemplateRule/index"; // 模板规则

@connect(state => ({
    loading: state[namespace].loading
}))

export default class PreviewExport extends Component {
    constructor(props) {
        super(...arguments);
        this.state = {
          typographyData: {}, // 排版数据
          studentInfoList: [],
          questionListData: [], // 预览题组列表数据
          templatePageSets: [], // 跨页规则
          isShowStyleJustifyModal: false, // 是否显示样式调整框
          singleQuestionInfo: {} // 单题目信息
        };
    };

    UNSAFE_componentWillMount() {
        const {
            dispatch,
            location,
        } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        dispatch({// 通过题组id获取题目列表
            type: namespace + '/getQuetionInfoByPaperId',
            payload: {
              paperId: query && query.id ? query.id : ''
            },
            callback: res => {
              dispatch({ // 通过题组id获取题目批阅
                type: namespace + '/getInstructionPaperPreview',
                payload: {
                  paperId: query && query.id ? query.id : ''
                },
                callback: temRes => {
                  const questionListData = this.organizeCategoryQuestionList(res)
                  const templateList = temRes.data.questionInfoList
                  const templatePageSets = temRes.data.templatePageSets
                  // 将新的批阅模板信息合并到试卷信息里
                  questionListData.map(qItem => {
                    if (Array.isArray(qItem.questionList) && qItem.questionList.length > 0) {
                      qItem.questionList = qItem.questionList.map(item => {
                        // 筛选出 id 一致的题目信息合并
                        let questionInfo = null
                        if (Array.isArray(templateList)) {
                          questionInfo = templateList.find(qInfoItem => qInfoItem.questionId == item.id)
                        }
                        if (questionInfo) {
                          delete questionInfo.id
                          // 字符串转数字
                          for (const key in questionInfo) {
                            if (Object.prototype.hasOwnProperty.call(questionInfo, key)) {
                              if (typeof questionInfo[key] === 'string') {
                                questionInfo[key] = Number(questionInfo[key])
                              }
                            }
                          }
                          item = { ...item, ...questionInfo }
                          this.mergeMaterialQuestionData(item.materialQuestionList, questionInfo)
                        }
                        if (Array.isArray(item.childrenList) && item.childrenList.length > 0) {
                          item.childrenList = item.childrenList.map(item => {
                            // 筛选出 id 一致的题目信息合并
                            let childQuestionInfo = null
                            if (Array.isArray(templateList)) {
                              childQuestionInfo = templateList.find(qInfoItem => qInfoItem.questionId == item.id)
                            }
                            if (childQuestionInfo) {
                              delete childQuestionInfo.id
                              // 字符串转数字
                              for (const key in childQuestionInfo) {
                                if (Object.prototype.hasOwnProperty.call(childQuestionInfo, key)) {
                                  if (typeof childQuestionInfo[key] === 'string') {
                                    childQuestionInfo[key] = Number(childQuestionInfo[key])
                                  }
                                }
                              }
                              item = { ...item, ...childQuestionInfo }
                              this.mergeMaterialQuestionData(item.materialQuestionList, childQuestionInfo)
                            }
                            return item
                          })
                        }
                        return item
                      })
                    }
                    return qItem
                  })
                  const typographyData = {
                    stuName: temRes.data.stuName,
                    stuNameId: temRes.data.stuNameId,
                    stuClass: temRes.data.stuClass,
                    stuClassId: temRes.data.stuClassId,
                    stuNum: temRes.data.stuNum,
                    stuNumId: temRes.data.stuNumId,
                    font: temRes.data.font,
                    wordSize: temRes.data.wordSize,
                    composeType: temRes.data.composeType,
                    alignment: temRes.data.alignment,
                    sealLine: temRes.data.sealLine
                  }
                  const checkSortItems = [
                    {
                      key: temRes.data.stuNameId,
                      include: temRes.data.stuName,
                      value: '姓名'
                    },
                    {
                      key: temRes.data.stuClassId,
                      include: temRes.data.stuClass,
                      value: '班级'
                    },
                    {
                      key: temRes.data.stuNumId,
                      include: temRes.data.stuNum,
                      value: '学号'
                    }
                  ]
                  const checkListValue = checkSortItems
                    .filter(item => item.include == 1)
                    .sort((item1, item2) => item1.key - item2.key)
                    .map(item => item.value)
                  this.setState({ typographyData })
                  this.setState({ studentInfoList: checkListValue })
                  this.setState({ questionListData })
                  this.setState({ templatePageSets })
                }
              })
            }
        })
    }

    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    /**
     * 合并材料题目数据
     * @param {*} arr 待合并数组
     * @param {*} valueObj 待合并数据
     */
    mergeMaterialQuestionData = (arr, valueObj) => {
      if (Array.isArray(arr) && arr.length > 0) {
        arr.forEach(item => {
          Object.assign(item, valueObj)
          // 递归处理
          if (Array.isArray(item.materialQuestionList) && item.materialQuestionList.length > 0) {
            this.mergeMaterialQuestionData(item.materialQuestionList, valueObj)
          }
          if (Array.isArray(item.childrenList) && item.childrenList.length > 0) {
            this.mergeMaterialQuestionData(item.childrenList, valueObj)
          }
        })
      }
    }

    /**
     * 通过 parentId 组织题目列表
     * @param {*} questionList 题目列表
     */
    organizeQuestionListByParentId = (questionList) => {
      const questionMap = new Map()
      const organizeMaterialQuestionList = (materialQuestionList) => {
        if (Array.isArray(materialQuestionList)) {
          this.organizeQuestionListByParentId(materialQuestionList)
          materialQuestionList.forEach(materialQuestion => {
            if (Array.isArray(materialQuestion.materialQuestionList)) {
              organizeMaterialQuestionList(materialQuestion.materialQuestionList)
            }
          })
        }
      }
      questionList.forEach(question => {
        questionMap.set(question.id, question)
        if (Array.isArray(question.materialQuestionList)) {
          organizeMaterialQuestionList(question.materialQuestionList)
        } else if (!question.parentId) {
          question.childrenList = []
        }
      })
      for (let i = questionList.length -1; i >= 0; i--) {
        if (questionList[i].parentId) {
          const parent = questionMap.get(questionList[i].parentId)
          if (parent) {
            const content = parent.content
            const lastIndex = content.lastIndexOf('____')
            if (lastIndex !== -1) {
              questionList[i].lastContent = content.slice(lastIndex + 4)
            }
            parent.childrenList.unshift(questionList[i])
            questionList.splice(i, 1)
          }
        }
      }
    }

    /**
     * 组织分类题目列表
     * @param {*} categoryQuestionList 分类题目列表
     * @returns 分类题目列表
     */
    organizeCategoryQuestionList = (categoryQuestionList) => {
      categoryQuestionList.forEach(categoryQuestion => {
        const questionList = categoryQuestion.questionList
        if (Array.isArray(questionList)) {
          this.organizeQuestionListByParentId(questionList)
        }
      })
      return categoryQuestionList
    }

    /**
     * 打开样式调整框
     * @param {*} item 题目信息
     */
    openStyleJustifyModal = (item) => {
      console.log(item);
      if (item.childrenList && Array.isArray(item.childrenList) && item.childrenList.length > 0) {
        message.warning('拆分题暂不支持样式调整')
        return
      }
      const singleQuestionInfo = JSON.parse(JSON.stringify(item))
      singleQuestionInfo.isArea === 1 ? singleQuestionInfo.checked = true : singleQuestionInfo.checked = false
      singleQuestionInfo.smallItem === 1 ? singleQuestionInfo.splitChecked = true : singleQuestionInfo.splitChecked = false
      singleQuestionInfo.scoreSet === 3 ? singleQuestionInfo.scoreChecked = true : singleQuestionInfo.scoreChecked = false
      this.setState({ singleQuestionInfo }, () => {
        this.setState({ isShowStyleJustifyModal: true })
      })
    }

    /**
     * 关闭样式调整框
     */
    closeStyleJustifyModal = () => {
      this.setState({ isShowStyleJustifyModal: false })
    }

    /**
     * 修改单一题目规则
     * @param {*} value 修改值
     * @param {*} key key
     */
    changeTemplateRule = (value, key) => {
      const singleQuestionInfo = this.state.singleQuestionInfo
      singleQuestionInfo[key] = value
      this.setState({ singleQuestionInfo })
    }

    /**
     * 保存
     */
    saveStyleJustify = () => {
      const singleQuestionInfo = this.state.singleQuestionInfo
      const questionListData = this.state.questionListData
      questionListData.map(qItem => {
        if (Array.isArray(qItem.questionList) && qItem.questionList.length > 0) {
          qItem.questionList = qItem.questionList.map(item => {
            if (item.questionId === singleQuestionInfo.questionId) {
              item = { ...item, ...singleQuestionInfo }
            }
            return item
          })
        }
        return qItem
      })
      this.setState({ questionListData }, () => {
        this.setState({ isShowStyleJustifyModal: false })
      })
    }

    /**
     * 保存并应用当前同类题型
     */
    saveAndApplyStyleJustify = () => {
      const singleQuestionInfo = this.state.singleQuestionInfo
      const questionListData = this.state.questionListData
      const {
        reviewType,
        arrayType,
        isArea,
        scoreSet,
        height,
        smallItem
      } = singleQuestionInfo
      const questionParams = { reviewType, arrayType, isArea, scoreSet, height, smallItem }
      questionListData.map(qItem => {
        let findQItem = false
        if (Array.isArray(qItem.questionList) && qItem.questionList.length > 0) {
          qItem.questionList.map(item => {
            if (item.questionId === singleQuestionInfo.questionId) {
              findQItem = true
            }
          })
          if (findQItem) {
            qItem.questionList = qItem.questionList.map(item => {
              if (!(Array.isArray(item.childrenList) && item.childrenList.length > 0)) {
                item = { ...item, ...questionParams }
              }
              return item
            })
          }
        }
        return qItem
      })
      this.setState({ questionListData }, () => {
        this.setState({ isShowStyleJustifyModal: false })
      })
    }

    /**
     * 保存试题
     */
    saveQuestion = () => {
      const { dispatch, location } = this.props
      const { search } = location
      const query = queryString.parse(search)
      const questionListData = this.state.questionListData
      const templatePageSets = this.state.templatePageSets
      const params = {}
      params.paperId = Number(query.id)
      debugger
      const questionFlatList = questionListData
        .map(item => item.questionList)
        .flat()
        .map(item => item.materialQuestionList || item)
        .flat()
      params.questionInfos = questionFlatList.map(item => {
        const {
          id,
          questionId,
          reviewType,
          arrayType,
          isArea,
          scoreSet,
          height,
          smallItem
        } = item
        const questionInfo = {
          id,
          questionId,
          reviewType,
          arrayType,
          isArea,
          scoreSet,
          height,
          smallItem
        }
        return questionInfo
      })
      params.templatePageSets = templatePageSets
      return new Promise((resolve, reject) => {
        dispatch({
          type: namespace + '/updateInstructionPaperPreview',
          payload: params,
          callback: res => {
            if (res.errCode === 0) {
              console.log('保存成功：', res)
              message.success('保存成功！')
              resolve(res)
            } else {
              message.error(res.errDetail)
              reject(res)
            }
          }
        })
      })
    }

    render() {
      const {
        location,
        dispatch,
        loading
      } = this.props;
      const { pathname, search } = location;
      const query = queryString.parse(search);
      const title = (query.paperName || '') + '-我的题组';
      const breadcrumb = [title];
      const urls = ['/combinationTopic/history'];//上一级路由
      const header = (
        <Page.Header breadcrumb={breadcrumb} urls={urls} title={title} />
      );
      const classString = classNames(styles['Q-content'], 'gougou-content', indexStyles['PE-content']);
      const { questionListData, templatePageSets, isShowStyleJustifyModal, studentInfoList } = this.state
      const isEmpty = questionListData.length < 1;
      console.log('PreviewExport  questionListData:', questionListData)

      return (
        <Page header={header} loading={!!loading}>
          <div className={classString} id='watermark'>
            <TopSetPrint
              isShowWatermark={false}
              dispatch={dispatch}
              pdfType={1}
              location={location}
              saveQuestion={this.saveQuestion}
            />
            <div 
              className={isEmpty ? styles['question-list-empty'] : 'pre-question-list-box'}
              style={{ display: 'flex' }}>
                {
                  loading ? null :
                  <div style={{ 
                    position: 'relative', 
                    height: 1200, 
                    width: 100, 
                    paddingTop: 20 
                    }}>
                    <div style={{ 
                      position: 'absolute',
                      top: 600,
                      left: -480,
                      display: 'flex',
                      justifyContent: 'center',
                      transform: 'rotate(-90deg)',
                      width: 1000
                    }}>
                      {
                        studentInfoList.map(item => {
                          return (
                            <div style={{ marginRight: 32 }}>{item} ___________</div>
                          )
                        })
                      }
                    </div>
                    <div style={{ 
                      position: 'absolute',
                      top: 600,
                      left: -460,
                      display: 'flex',
                      alignItems: 'center',
                      transform: 'rotate(-90deg)',
                      width: 1000
                    }}>
                      <div style={{
                        width: '80%',
                        height: '1px',
                        borderBottom: '1px dashed #333',
                      }}></div>
                      <div style={{ margin: 8 }}>密</div>
                      <div style={{
                        width: '80%',
                        height: '1px',
                        borderBottom: '1px dashed #333',
                      }}></div>
                      <div style={{ margin: 8 }}>封</div>
                      <div style={{
                        width: '80%',
                        height: '1px',
                        borderBottom: '1px dashed #333',
                      }}></div>
                      <div style={{ margin: 8 }}>线</div>
                      <div style={{
                        width: '80%',
                        height: '1px',
                        borderBottom: '1px dashed #333',
                      }}></div>
                    </div>
                  </div>
                }
              <div>
                  {
                    loading ? null :
                      <PaperTopTitle paperName={query.paperName || ''} />
                  }
                  {
                    // 渲染题目数据
                    Array.isArray(questionListData) && questionListData.map((tItem, tIndex) => {
                      if (Array.isArray(tItem.questionList) && tItem.questionList.length > 0) {
                        return (
                          <div key={tItem.category || (tIndex+100)}>
                            <BigTopicInfo tItem={tItem} tIndex={tIndex} />
                              {
                                <div className={indexStyles['q-list']}>
                                  {
                                    Array.isArray(tItem.questionList) && tItem.questionList.map((item, index) => {
                                      return (
                                        <div>
                                          <div className={classNames('pre-question-item', indexStyles['subjective'], 'objective')} key={index}>
                                            {
                                              RenderMaterialAndQuestion(item, false,
                                                (RAQItem) => {
                                                  return (
                                                    <div style={{ width: '100%' }}>
                                                      <div>
                                                        <ScoreGrid 
                                                          hasScoreGrid={item.reviewType === 2 && item.arrayType === 3}
                                                          isDecimal={item.scoreSet === 3}
                                                          score={item.score} />
                                                      </div>
                                                      <div className={indexStyles['dry-system']} key={RAQItem.serialNumber}>
                                                        <TopicContent
                                                          topicContent={RAQItem}
                                                          childrenFiledName={'children'}
                                                          contentFiledName={'content'}
                                                          optionIdFiledName={'code'}
                                                          optionsFiledName={"optionList"}
                                                          currentPage={1}
                                                          currentTopicIndex={(RAQItem.serialNumber || RAQItem.serialCode || Number(RAQItem.questionNum)) - 1}
                                                          pageSize={10} />
                                                        <div style={{ display: 'flex', marginLeft: '20px' }}>
                                                          <JudgeArea
                                                            height={'70px'}
                                                            reviewType={item.reviewType}
                                                            hasJudgeArea={item.reviewType === 1 || item.reviewType === 3}
                                                            isHorizontal={item.arrayType === 1}
                                                            isEditable={false} />
                                                          <Button
                                                            type="link"
                                                            style={{ marginTop: '15px' }}
                                                            onClick={() => {this.openStyleJustifyModal(item)}}
                                                          >样式调整</Button>
                                                        </div>
                                                      </div>
                                                      <div>
                                                        <ScoreGrid 
                                                          hasScoreGrid={item.reviewType === 2 && item.arrayType === 4}
                                                          isDecimal={item.scoreSet === 3}
                                                          score={item.score} />
                                                      </div>
                                                      <div>
                                                        <AnswerArea 
                                                          id={RAQItem.questionId || RAQItem.id}
                                                          questionid={RAQItem.questionId || RAQItem.id}
                                                          height={RAQItem.height + 'px'}
                                                          hasAnswerArea={item.isArea === 1}
                                                          isEditable={false} />
                                                      </div>
                                                    </div>
                                                  )
                                                }
                                              )
                                            }
                                          </div>
                                        </div>
                                      )
                                    })
                                  }
                                </div>
                              }
                          </div>
                        )
                      } else {
                        return null
                      }
                    })
                  }
              </div>
            </div>
          </div>
          <div className='no-print'>
              <BackBtns tipText={"返回"} />
          </div>
          <Modal
            centered
            width={1080}
            closable={false}
            footer={null}
            visible={isShowStyleJustifyModal}
          >
            <div style={{ maxHeight: '470px', overflowY: 'auto' }}>
              <TemplateRule 
                isEditable={true} 
                templateDetail={this.state.singleQuestionInfo} 
                changeTemplateRule={this.changeTemplateRule} />
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', padding: '24px 16px 0 16px', textAlign: 'right', marginTop: 16 }}>
              <Button onClick={this.closeStyleJustifyModal} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button onClick={this.saveStyleJustify} style={{ marginRight: 8 }}>
                保存
              </Button>
              <Button type="primary" onClick={this.saveAndApplyStyleJustify}>
                保存并应用当前同类题型
              </Button>
            </div>
          </Modal>
        </Page>
      )
    }
}



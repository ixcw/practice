/**
* 试题板models
* @author:张江
* @date:2020年08月29日
* @version:v1.0.0
* */
import Model from "dva-model";
import { PaperBoard as namespace } from '@/utils/namespace'
import {
  getGroupCenterPaperBoard,
  clearPaperBoard,
  confirmPaperBoard,
  remveTopic,
  previewAnalysis,
  saveExamPaperDetailBoard,//给试题版上的题目设置分数
  getQuestionMates,//试题板中心-题目匹配-列表
  addQuestionMateInfo,//题目匹配入临时表
  findOrganizeInfoList, // 获取组织列表
} from '@/services/combination/paperBoard'

import { getQuestionTemplateTreeData,getVersionKnowledgePoints } from '@/services/questionTemplate/myQuestionTemplate'

export default Model({
  namespace,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, search } = location
        if (pathname.match(namespace)) {
          dispatch({
            type: 'getGroupCenterPaperBoard',
          })
        }
      })
    }
  },
  reducers: {
    /*赋值 state里的值 区分 方便各个组件使用*/
    saveState(state, { payload }) {
      return { ...state, ...payload };
    },
    //获取题目列表的成功回调
    getGroupCenterPaperBoardSuccess(state, action) {
      return { ...state, topicList: action.result, loading: false }
    },
    //获取模板数据列表的成功回调
    getQuestionTemplateTreeDataSuccess(state, action) {
      return { ...state, questionTemplateTreeData: action.result.data.children, loading: false }
    },
    //预览组题分析的接口调用成功回调
    previewAnalysisSuccess(state, action) {
      return { ...state, analysisData: action.result, loading: false }
    }
  }
}, {
  getGroupCenterPaperBoard,
  getQuestionTemplateTreeData,
  clearPaperBoard,
  confirmPaperBoard,
  remveTopic,
  previewAnalysis,
  saveExamPaperDetailBoard,//给试题版上的题目设置分数
  getQuestionMates,//试题板中心-题目匹配-列表
  addQuestionMateInfo,//题目匹配入临时表
  getVersionKnowledgePoints,
  findOrganizeInfoList
}
)

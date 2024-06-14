/**
* 手动组题models
* @author:张江
* @date:2020年08月29日
* @version:v1.0.0
* */
import Model from "dva-model"

import { ManualCombination as namespace, QuestionBank } from '@/utils/namespace'
import {
  getGroupCenterConditions,
  getTopicList,
  saveOptionQuestion,
  removeQuetion,
  collectTopic,
  cancleCollectTopic
} from '@/services/combination/manualCombination.js'
import { getKnowledgeDetailsByPid } from '@/services/questionBank'
import { getPageQuery, queryParamIsChange } from "@/utils/utils";


let lastQuery = {}
export default Model({

  namespace,
  effects: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, search } = location
        let query = getPageQuery()
        if (pathname.match(namespace)) {
          let { knowIdStr, page = 1, pageSize = 10, subjectId, clistId, glistId, dlistId, queryType = 1 } = query;
          if (knowIdStr && (clistId != undefined || glistId != undefined || dlistId != undefined)) {
            if (queryParamIsChange(lastQuery, query, ["page", "subjectId", "pageSize", 'clistId', 'glistId', 'dlistId', 'knowIdStr', 'queryType'])) {
              dispatch({
                type: `saveState`,
                payload: {
                  topicList: [],
                  topicListLoading:false
                }
              })
              window.scrollTo(0, 0)
              dispatch({
                type: `getTopicList`,
                payload: {
                  type: 1,//1.表示试题中心拉题；2.试题板换一题
                  page,
                  size: pageSize,
                  categoryStr: clistId,
                  gradeIdStr: glistId,
                  difficultIntStr: dlistId,
                  knowIdStr,
                  status: queryType,
                  subjectId
                }
              })
            }

          }
        }
        lastQuery = query
      })
    }
  },
  reducers: {
    /*赋值 state里的值 区分 方便各个组件使用*/
    saveState(state, { payload }) {
      return { ...state, ...payload };
    },
    getGroupCenterConditionsSuccess(state, action) {
      return { ...state, filterPanel: action.result, loading: false }
    },
    getTopicListSuccess(state, action) {
      return { ...state, topicList: action.result, topicListLoading: true }
    },
    saveOptionQuestionSuccess(state, action) {
      return { ...state, addMsg: action.result, loading: false }
    },
    collectTopicSuccess(state, action) {
      return { ...state, collectMsg: action.result, loading: false }
    },
    cancleCollectTopicSuccess(state, action) {
      return { ...state, cancleCollectMsg: action.result, loading: false }
    }
  }
}, {
  getKnowledgeDetailsByPid,
  getGroupCenterConditions,
  getTopicList,
  saveOptionQuestion,
  removeQuetion,
  collectTopic,
  cancleCollectTopic
})

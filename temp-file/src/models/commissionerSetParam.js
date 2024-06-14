/**
 * 题库专员四要素设参models
 * @author:张江
 * @date:2020年11月26日
 * @version:v1.0.0
 * */

import Model from 'dva-model';
import queryString from 'query-string';
import { CommissionerSetParam as namespace } from '@/utils/namespace';
import { queryParamIsChange, existArr } from '@/utils/utils';
import rememberScrollTopCache from '@/caches/rememberScrollTop';//记录body滚动的距离

import {
  getUserKnowJobQuestionList,//设参题目列表
  getExpertUserJobKnowList,//查询分配的知识点列表
  countUserKnowJob,//统计设参总量
  countUserKnowJobVideo,//统计任务下上传微课总量
  getQuestionDetailAndSmallClass,//查询题目详细信息-带微课
  updateSmallClassName,//修改视频名称
} from '@/services/commissionerSetParam';
import effect from 'dva-model/effect';

let lastQuery = {}
export default Model({
  namespace,
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, search } = location;
        const query = queryString.parse(search);
        if (pathname === '/commissioner-setParam') {
          let { questionType = 1, p = 1, s = 10, knowledgeId, keyword, subjectId } = query;
          if (knowledgeId && questionType) {
            if (queryParamIsChange(lastQuery, query, ["questionType", "p", "s", 'knowledgeId', 'keyword', 'subjectId'])) {
              const offsetTop = rememberScrollTopCache(null);
              if (offsetTop && offsetTop != -0.01) {
                const timer = setTimeout(() => {
                  window.scrollTo(0, offsetTop);
                  clearTimeout(timer)
                }, 200)
                rememberScrollTopCache(-0.01);
                return;
              }
              dispatch({//获取题目列表
                type: 'getUserKnowJobQuestionList',
                payload: {
                  subjectId: subjectId,
                  page: p || 1,
                  size: s || 10,
                  questionIds: keyword,
                  knowIds: knowledgeId,
                  isSetParam: questionType
                },
                // callback: () => {
                //   if (offsetTop!=-0.01){
                //     const timer = setTimeout(() => {
                //       window.scrollTo(0, offsetTop);
                //       clearTimeout(timer)
                //     }, 100)
                //     rememberScrollTopCache(-0.01);
                //   }
                // }
              });
            }

          }
        }
        lastQuery = query;
      });
    },
  },
  effects: {

  },

  reducers: {
    /*赋值 state里的值 区分 方便各个组件使用*/
    saveState(state, { payload }) {
      return { ...state, ...payload };
    },

    // 设参题目列表
    getUserKnowJobQuestionListSuccess(state, action) {
      return { ...state, questionList: action.result, questionLoading: true };
    },

    // 根据任务查询该任务下的题目信息列表
    getExpertUserJobKnowListSuccess(state, action) {
      const callbackResult = action.result ? action.result : {};
      const studySubjectName = callbackResult.studyAndSubjectName;
      const jobKnowList = callbackResult ? callbackResult.KnowList : {};
      return { ...state, studySubjectName, jobKnowList };
    },

    // 统计设参总量
    countUserKnowJobSuccess(state, action) {
      const result = action.result || [];
      let statisticalParamJson = {
        paramTotal: 0,
        haveParam: 0,
        notSetParam: 0,
      }
      // isSetParam: 0：全部，1：未设参，2：已设参
      result.map((item) => {
        if (item.isSetParam == 1) {
          statisticalParamJson.notSetParam = item.total;
        } else if (item.isSetParam == 2) {
          statisticalParamJson.haveParam = item.total;
        } else if (item.isSetParam == 0) {
          statisticalParamJson.paramTotal = item.total;
        }
      })
      statisticalParamJson.notSetParam = statisticalParamJson.paramTotal - statisticalParamJson.haveParam;//计算未设参数量
      return { ...state, statisticalParam: statisticalParamJson, statisticsLoading: true };
    },

    // 统计任务下上传微课总量
    countUserKnowJobVideoSuccess(state, action) {
      const result = existArr(action.result) ? action.result[0] : {
        "total": 0,//总量
        "notNum": 0,//未上传
        "setNum": 0,//已上传
      };
      return { ...state, statisticalVideo: result, statisticsLoading: true };
    },

    // 查询题目详细信息-带微课
    getQuestionDetailAndSmallClassSuccess(state, action) {
      const callbackResult = action.result ? action.result : {};
      const selfUploadMicroList = callbackResult.smallClass || [];
      const questionVos = callbackResult.questionVos ? callbackResult.questionVos : {};
      // const questionVos = existArr(callbackResult.questionVos) ? callbackResult.questionVos : [];
      return { ...state, selfUploadMicroList, questionVos, questionDetailLoading: true };
    },
  }
}, {
  getUserKnowJobQuestionList,//设参题目列表
  getExpertUserJobKnowList,//查询分配的知识点列表
  countUserKnowJob,//统计设参总量
  countUserKnowJobVideo,//统计任务下上传微课总量
  getQuestionDetailAndSmallClass,//查询题目详细信息-带微课
  updateSmallClassName,//修改视频名称
}
)

/**
 * 套题设参models
 * @author:张江
 * @date:2021年02月06日
 * @version:v1.0.0
 * */

import Model from 'dva-model';
import {
  Modal
} from 'antd';
import queryString from 'query-string';
import { SetQuestionSetParam as namespace } from '@/utils/namespace';
import { queryParamIsChange, existArr } from '@/utils/utils';
import rememberScrollTopCache from '@/caches/rememberScrollTop';//记录body滚动的距离

import {
  getExamPaperQuestionListByPaperId,//根据条件查询套卷内所有题目
  getExamPaperBySubjectId,//根据条件查询所有的套题
  determineExamPaperQuestion,//根据id修改套卷状态（确实完成设参）
  addErrorQuestionInfo,//添加纠错记录
} from '@/services/setQuestionSetParam';
import effect from 'dva-model/effect';
import userInfoCache from '@/caches/userInfo';//登录用户的信息

let lastQuery = {}
export default Model({
  namespace,
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const userInfo = userInfoCache() || {}
        if (pathname === '/set-question-list' && userInfo && userInfo.subjectId) {
          dispatch({
            type: 'saveState',
            payload: { examPaperLoading: false, }
          });
          dispatch({
            type: 'getExamPaperBySubjectId',
            payload: {
              name: query.keyword,
              isParam: query.isParam || 1, //是否完成设参（1：未完成，2：已完成）
              subjectId: userInfo.subjectId,
              page: query.p || 1,
              size: query.s || 10,
            }
          });
        }

        if (pathname === '/set-question-list/set-param') {
          let { isParam = 1, p = 1, s = 10, paperId, } = query;
          if (paperId && isParam) {
            if (queryParamIsChange(lastQuery, query, ["isParam", "p", "s", 'paperId'])) {
              const offsetTop = rememberScrollTopCache(null);
              if (offsetTop && offsetTop != -0.01) {
                const timer = setTimeout(() => {
                  window.scrollTo(0, offsetTop);
                  clearTimeout(timer)
                }, 200)
                rememberScrollTopCache(-0.01);
                return;
              }
              dispatch({
                type: 'saveState',
                payload: { questionLoading: false, }
              });
              dispatch({//获取题目列表
                type: 'getExamPaperQuestionListByPaperId',
                payload: {
                  isParam: isParam,
                  page: p || 1,
                  size: s || 10,
                  paperId: paperId,
                },
                callback: ({ total }) => {
                  // if (offsetTop!=-0.01){
                  //   const timer = setTimeout(() => {
                  //     window.scrollTo(0, offsetTop);
                  //     clearTimeout(timer)
                  //   }, 100)
                  //   rememberScrollTopCache(-0.01);
                  // }
                  //判断套题是否存在未设参的题目 如果不存在 直接更新套题的状态
                  if (total == 0 && isParam == 1) {
                    dispatch({//// 完成任务
                      type: 'determineExamPaperQuestion',
                      payload: {
                        id: paperId
                      },
                      callback: (result) => {
                        const returnJudge = window.$HandleAbnormalStateConfig(result);
                        if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
                        Modal.warning({
                          style: { top: '30vh' },
                          title: '该套题已完成设参哦！',
                          content: '',
                          onOk: () => {
                            //路由回退
                            window.history.go(-1);
                          }
                        });
                      }
                    });
                  }

                }
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

    // 根据条件查询套卷内所有题目
    getExamPaperQuestionListByPaperIdSuccess(state, action) {
      return { ...state, questionList: action.result, questionLoading: true };
    },

    //根据条件查询所有的套题
    getExamPaperBySubjectIdSuccess(state, action) {
      return { ...state, examPaperList: action.result, examPaperLoading: true };
    },

    //根据id修改套卷状态（确实完成设参）
    determineExamPaperQuestionSuccess(state, action) {
      return { ...state, determineLoading: false };
    },
  }
}, {
  getExamPaperQuestionListByPaperId,//根据条件查询套卷内所有题目
  getExamPaperBySubjectId,//根据条件查询所有的套题
  determineExamPaperQuestion,//根据id修改套卷状态（确实完成设参）
  addErrorQuestionInfo
}
)

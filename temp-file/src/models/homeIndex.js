/**
 * 首页models
 * @author:张江
 * @date:2020年08月21日
 * @version:v1.0.0
 * */

import Model from 'dva-model';
import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { HomeIndex as namespace } from '@/utils/namespace';
import {
  getIndexListTreeKnowledge,//获取知识点
  getQuestionByKnowledge,//根据知识点查询题目
  pageListIndexPaper,//根据知识点获取套题或者套卷
  getQuestionVideoList,//根据知识点id查询微课信息 / 获取热门微课
  getClassNewReportList,//根据班级获取班级最新报告
  getLearningTasksList,//根据学生查询学习任务
  uploadVideo,//教师--题目微课上传
  getMyClassInfoList,//教师--获取班级列表信息
  userAddClassInfo,//教师--加入班级
  getTestQuestionEdition,//教师--试题版统计
  userSwitchClass,//用户(学生/家长)-切换班级
  findRelatedCourse,//------热门微课 非单题微课
} from '@/services/homeIndex'
import effect from 'dva-model/effect';
import userInfoCache from '@/caches/userInfo';

export default Model({
  namespace,
  state: {

  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {


      });
    },
  },
  effects: {

    // 获取热门微课
    *getHotVideoList(action, saga) {
      yield saga.call(effect(getQuestionVideoList, 'getHotVideoListSuccess'), action, saga);
    },
    // 获取热门微课---非题目微课
    *findRelatedCourseList(action, saga) {
      yield saga.call(effect(findRelatedCourse, 'findRelatedCourseSuccess'), action, saga);
    },
    // 获取试题板统计
    *getTestQuestionEdition(action, saga) {
      const loginUserInfo = userInfoCache() || {};
      action.payload = {
        userId: loginUserInfo.userId,
        subjectId: loginUserInfo.subjectId,
        classId: loginUserInfo.classId,
        schoolId: loginUserInfo.schoolId
      };
      yield saga.call(effect(getTestQuestionEdition, 'getTestQuestionEditionSuccess'), action, saga);
    },

  },

  reducers: {
    /*赋值 state里的值 区分 方便各个组件使用*/
    saveState(state, { payload }) {
      return { ...state, ...payload };
    },
    // 获取知识点
    getIndexListTreeKnowledgeSuccess(state, action) {
      return { ...state, knowledgeList: action.result, knowledgeLoading: true };
    },

    // 根据知识点查询题目
    getQuestionByKnowledgeSuccess(state, action) {
      const { total = 0, data = [] } = action.result
      return { ...state, total, questionList: data, questionLoading: true };
    },

    // 根据知识点获取套题或者套卷
    pageListIndexPaperSuccess(state, action) {
      const { total = 0, data = [] } = action.result
      return { ...state, total, examPaperList: data, questionLoading: true };
    },

    // 根据知识点id查询微课信息
    getQuestionVideoListSuccess(state, action) {
      const { total = 0, data = [] } = action.result
      return { ...state, total, questionVideoList: data, questionLoading: true };
    },

    // 获取热门微课
    getHotVideoListSuccess(state, action) {
      const { total = 0, data = [] } = action.result
      return { ...state, hotVideoList: data, loading: false };
    },

    // 获取热门微课---非题目微课
    findRelatedCourseSuccess(state, action) {
      const { total = 0, data = [] } = action.result
      return { ...state, findRelatedCourseList: data, loading: false };
    },

    // 根据班级获取班级最新报告
    getClassNewReportListSuccess(state, action) {
      return { ...state, newReportList: action.result, loading: false };
    },

    // 根据学生查询学习任务
    getLearningTasksListSuccess(state, action) {
      return { ...state, learningTasksList: action.result || [], loading: false };
    },

    // 获取班级列表信息
    getMyClassInfoListSuccess(state, action) {
      return { ...state, myClassInfoList: action.result || [], loading: false };
    },

    // 试题版统计
    getTestQuestionEditionSuccess(state, action) {
      return { ...state, questionBoardStatistics: action.result || 0 };
    },

  }
}, {
  getIndexListTreeKnowledge,//获取知识点
  getQuestionByKnowledge,//根据知识点查询题目
    pageListIndexPaper,//根据知识点获取套题或者套卷
  getQuestionVideoList,//根据知识点id查询微课信息 / 获取热门微课
  getClassNewReportList,//根据班级获取班级最新报告
  getLearningTasksList,//根据学生查询学习任务
  uploadVideo,//教师--微课上传至腾讯云点播
  getMyClassInfoList,//教师--获取班级列表信息
  userAddClassInfo,//教师--加入班级
  // getTestQuestionEdition,//教师--试题版统计
  userSwitchClass,//用户(学生/家长)-切换班级
  findRelatedCourse,//------热门微课 非单题微课
}
)

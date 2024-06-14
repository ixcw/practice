/**
 *@Author:熊伟
 *@Description: 分销月报model
 *@Date:Created in  2020/9/02
 *@Modified By:
 */
import model from 'dva-model'
import queryString from 'query-string';
import effect from 'dva-model/effect';
import { PersonalCenter as namespace } from "@/utils/namespace";
import getUseInfo from '@/caches/userInfo'
import {
  findMyClassInfo,//获取班级列表
  userAddClassInfo,//加入班级
  updateUserInfo,//修改用户信息
  getSendEmail,//获取邮箱验证码
  userBindEmail,//用户绑定邮箱
  updateUserAccount,//更换账号
  userCheckEmailUpdatePwd,//邮箱改密码
  collect,//添加或取消收藏
  addCollection,//添加收藏
  removeCollection, //移除收藏
  pageListQuestionVideo, //分页查询用户题目微课收藏列表
  pageListPaper, //分页查询用户试卷收藏列表
  pageListQuestion, //分页查询用户题目收藏列表
  findMyQuestionVideo,//获取自己的微课
  saveOptionQuestion,//加入试题版
  getOrderByInviteCode,//个人分销月报
  getRevenues,//邀请好友的收益
  genInvitePoster,//获取分享图片地址
} from '@/services/PersonalCenter';
export default model({
  state: {
  },
  namespace,
  subscriptions: {
    setup: ({ dispatch, history }) => {
      history.listen(location => {
        const { search, pathname } = location;
        const query = queryString.parse(search);
        const userInfo = getUseInfo() || {};
        if (pathname === '/personalCenter') {
          if (query.myCollect == 1 && query.personalCenterItem == 3) {
            dispatch({
              type: 'pageListQuestion',
              payload: {
                queryType: 0,
                page: query.p || 1,
                size: query.s || 10,
                studyId: query.studyId || null,
                subjectId: query.subjectId || null,
              }
            })
          }
          if (query.myCollect == 2 && query.personalCenterItem == 3) {
            dispatch({
              type: 'pageListPaper',
              payload: {
                page: query.p || 1,
                size: query.s || 10,
                subjectId: query.subjectId || null
              }
            })
          }
          if (query.myCollect == 3 && query.personalCenterItem == 3) {
            dispatch({
              type: 'pageListPaper',
              payload: {
                page: query.p || 1,
                size: query.s || 10,
                subjectId: query.subjectId || null,
              }
            })
          }
          if (query.myCollect == 4 && query.personalCenterItem == 3) {
            dispatch({
              type: 'saveState',
              payload: {
                myCollectLoading: false,
                videoCollect: [],
                studyId: query.studyId || null,
                subjectId: query.subjectId || null,
              }
            })
            dispatch({
              type: 'pageListQuestionVideo',
              payload: {
                page: query.p || 1,
                size: query.s || 10,
                subjectId: query.subjectId || null,
              }
            })
          }
          if (query.personalCenterItem == 5) {
            dispatch({
              type: 'saveState',
              payload: {
                myCollectLoading: false,
                videoCollect: []
              }
            })
            dispatch({
              type: 'findMyQuestionVideo',
              payload: {
                page: query.p || 1,
                size: query.s || 8
              }
            })
          }
          //分销月报
          if (query.personalCenterItem == 6) {
            dispatch({
              type: 'getRevenues',
              payload: {
                ownInviteCode: userInfo.ownInviteCode,
              }
            })
            dispatch({
              type: 'getOrderByInviteCode',
              payload: {
                ownInviteCode: userInfo.ownInviteCode,
                startTime: query.startTime || null,
                endTime: query.endTime || null,
                page: query.p || 1,
                size: query.s || 10
              }
            })
          }
        }
      });
    }

  },
  effects: {
    * getUserPaperCollect(action, saga) {
      yield saga.put({ type: 'saveState', payload: { myCollectLoading: false } });
      yield saga.call(effect(pageListQuestion, 'pageListQuestionSuccess'), action, saga);
    }
  },
  reducers: {
    /*赋值 state里的值 区分 方便各个组件使用*/
    saveState(state, { payload }) {
      return { ...state, ...payload };
    },
    //获取班级列表
    findMyClassInfoSuccess(state, action) {
      return { ...state, classInfo: action.result, myClassLoading: false };
    },
    //修改用户信息
    updateUserInfoSuccess(state, action) {
      return { ...state, myInfoLoading: false };
    },
    //获取邮箱验证码
    getSendEmailSuccess(state, action) {
      return { ...state, myInfoLoading: false };
    },
    //获取用户题目收藏列表
    findUserPaperCollectSuccess(state, action) {
      return { ...state, listUserQuestionCollect: action.result, myCollectLoading: true };
    },
    //收藏的题目列表
    pageListQuestionSuccess(state, action) {
      return { ...state, questionCollect: action.result, myCollectLoading: true };
    },

    //收藏的题目微课列表
    pageListQuestionVideoSuccess(state, action) {
      return { ...state, videoCollect: action.result, myCollectLoading: true };
    },

    //收藏的试卷列表
    pageListPaperSuccess(state, action) {
      return { ...state, paperCollect: action.result, myCollectLoading: true };
    },

    //用户的微课列表
    findMyQuestionVideoSuccess(state, action) {
      return { ...state, videoCollect: action.result, myCollectLoading: true };
    },
    //加入试题版
    saveOptionQuestionSuccess(state, action) {
      return { ...state, addMsg: action.result, loading: false }
    },
    //个人分销月报
    getOrderByInviteCodeSuccess(state, action) {
      return { ...state, getOrderByInviteCode: action.result, tableLoading: false }
    },
    getRevenuesSuccess(state, action) {
      return { ...state, getRevenues: action.result, pageLoading: false }
    },
  }
}, {
  findMyClassInfo,//获取班级列表
  userAddClassInfo,//加入班级
  updateUserInfo,//修改用户信息
  getSendEmail,//获取邮箱验证码
  userBindEmail,//用户绑定邮箱
  updateUserAccount,//更换账号
  userCheckEmailUpdatePwd,//邮箱改密码
  collect,//添加或取消搜藏
  addCollection,//添加收藏
  removeCollection,//移除收藏
  pageListQuestionVideo, //分页查询用户题目微课收藏列表
  pageListPaper, //分页查询用户试卷收藏列表
  pageListQuestion, //分页查询用户题目收藏列表
  findMyQuestionVideo,//获取自己的微课
  saveOptionQuestion,//加入试题版
  getOrderByInviteCode,//个人分销月报
  getRevenues,//邀请好友的收益
  genInvitePoster,//获取分享图片地址
})

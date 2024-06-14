/**
 *@Author:ChaiLong，xiongwei
 *@Description:报告
 *@Date:Created in  2020/09/01
 *@Modified By:
 */

import Model from 'dva-model';
import { GradeReport as namespace } from '@/utils/namespace';
import {
  findGradeReportStudentCount,//统计考生参考情况
  findGradeReportTreeScore,//三分比较/成绩竞争力
  findGradeReportClassInfo,//同校同年级同届班级信息查询
  findGradeReporteClassAbility,//班级能力水平
  findGradeExamReportScore,//总分分布
  findExamScore,//学生得分统计
  findGradeReportQuestionDetail,//考题细目表
  getClassReportTotalScoreRate,//得分率分布
  findGradeReportExamClassDetailByQuestion,//考题细目表-详情
  findExamReportCompetence,//核心素养
  findExamReportKeyAbility,//关键能力
  findExamReportCognize,//认知层次
} from '@/services/gradeReport'
import effect from 'dva-model/effect';
import queryString from 'query-string';
import { existArr } from '@/utils/utils';
let lastQuery = undefined;
export default Model({
  namespace,
  state: {
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, search } = location;
        const query = queryString.parse(search);
        //---------------------教师获取学生报告
        if (pathname === '/gradeReport') {
          //统计考生参考情况
          dispatch({
            type: 'findGradeReportStudentCount',
            payload: {
              reportType: 3,
              jobId: query.jobId,
            }
          });
          //同校同年级同届班级信息查询
          dispatch({
            type: 'findGradeReportClassInfoAfter',
            payload: {
              reportType: 3,
              jobId: query.jobId,
              paperId:query.paperId
            }
          });
        }
        lastQuery = query;
      });
    },
  },
  effects: {
    * findGradeReportClassInfoAfter(action, saga) {
      const data = yield saga.call(effect(findGradeReportClassInfo, 'findGradeReportClassInfoSuccess'), action, saga)
      const classIds = [-1]
      existArr(data) && data.map(({ id }) => { classIds.push(id) })
      action.payload.classIds = classIds.toString()
      action.payload.page = 1
      action.payload.size = 10
      if (existArr(data)) {
        //三分比较
        yield saga.put({ type: 'findGradeReportTreeScoreOne', payload: action.payload })
        //得分率分布
        yield saga.put({ type: 'getClassReportTotalScoreRate', payload: action.payload })
        //总分分布
        yield saga.put({ type: 'findGradeExamReportScore', payload: {diffeScore:10,classId:-1,...action.payload} })
        //学生得分统计
        yield saga.put({ type: 'findExamScore', payload: action.payload })
        //成绩竞争力
        yield saga.put({ type: 'findGradeReportTreeScoreTwo', payload: action.payload })
        //班级能力水平
        yield saga.put({ type: 'findGradeReporteClassAbility', payload: action.payload })
        //考题细目表
        yield saga.put({ type: 'findGradeReportQuestionDetail', payload: action.payload })
        //认知层次
        yield saga.put({ type: 'findExamReportCognize', payload: {level:1,...action.payload} })
        //关键能力
        yield saga.put({ type: 'findExamReportKeyAbility', payload: {level:1,...action.payload} })
        //核心素养
        yield saga.put({ type: 'findExamReportCompetence', payload: {level:1,...action.payload} })
      }
    },
    * findGradeReportTreeScoreOne(action, saga) {
      yield saga.call(effect(findGradeReportTreeScore, 'findGradeReportTreeScoreOneSuccess'), action, saga)
    },
    * findGradeReportTreeScoreTwo(action, saga) {
      yield saga.call(effect(findGradeReportTreeScore, 'findGradeReportTreeScoreTwoSuccess'), action, saga)
    }
  },
  reducers: {
    /*赋值 state里的值 区分 方便各个组件使用*/
    saveState(state, { payload }) {
      return { ...state, ...payload };
    },
    // 同校同年级同届班级信息查询
    findGradeReportClassInfoSuccess(state, action) {
      return { ...state, findGradeReportClassInfo: action.result, findGradeReportClassInfoLoading: false };
    },
    // 三分比较
    findGradeReportTreeScoreOneSuccess(state, action) {
      return { ...state, findGradeReportTreeScoreOne: action.result, findGradeReportTreeScoreOneLoading: false };
    },
    // 成绩竞争力
    findGradeReportTreeScoreTwoSuccess(state, action) {
      return { ...state, findGradeReportTreeScoreTwo: action.result, findGradeReportTreeScoreTwoLoading: false };
    },
    // 统计考生参考情况
    findGradeReportStudentCountSuccess(state, action) {
      return { ...state, findGradeReportStudentCount: action.result, findGradeReportStudentCountLoading: false };
    },
    // 总分分布
    findGradeExamReportScoreSuccess(state, action) {
      return { ...state, findGradeExamReportScore: action.result, findGradeExamReportScoreLoading: false };
    },
    //学生得分统计
    findExamScoreSuccess(state, action) {
      return { ...state, findExamScore: action.result, findExamScoreLoading: false };
    },
    //考题细目表
    findGradeReportQuestionDetailSuccess(state, action) {
      return { ...state, findGradeReportQuestionDetail: action.result, findGradeReportQuestionDetailLoading: false };
    },
    //得分率分布
    getClassReportTotalScoreRateSuccess(state, action) {
      return { ...state, getClassReportTotalScoreRate: action.result, getClassReportTotalScoreRateLoading: false };
    },
    //考题细目表-详情
    findGradeReportExamClassDetailByQuestionSuccess(state, action) {
      return { ...state, findGradeReportExamClassDetailByQuestion: action.result, findGradeReportExamClassDetailByQuestionLoading: false };
    },
    //核心素养
    findExamReportCompetenceSuccess(state, action) {
      return { ...state, findExamReportCompetence: action.result, findExamReportCompetenceLoading: false };
    },
    //关键能力
    findExamReportKeyAbilitySuccess(state, action) {
      return { ...state, findExamReportKeyAbility: action.result, findExamReportKeyAbilityLoading: false };
    },
    //认知层次
    findExamReportCognizeSuccess(state, action) {
      return { ...state, findExamReportCognize: action.result, findExamReportCognizeLoading: false };
    },

  }
}, {
  findGradeReportStudentCount,//统计考生参考情况
  findGradeReportTreeScore,//三分比较/成绩竞争力
  findGradeReportClassInfo,//同校同年级同届班级信息查询
  findGradeReporteClassAbility,//班级能力水平
  findGradeExamReportScore,//总分分布
  findExamScore,//学生得分统计
  findGradeReportQuestionDetail,//考题细目表
  getClassReportTotalScoreRate,//得分率分布
  findGradeReportExamClassDetailByQuestion,//考题细目表-详情
  findExamReportCompetence,//核心素养
  findExamReportKeyAbility,//关键能力
  findExamReportCognize,//认知层次
}
)
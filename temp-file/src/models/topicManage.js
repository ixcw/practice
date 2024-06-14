/**
 *@Author:ChaiLong，xiongwei
 *@Description:报告
 *@Date:Created in  2020/09/01
 *@Modified By:
 */

import Model from 'dva-model';
import { TopicManage as namespace } from '@/utils/namespace';
import {
  //  -------------------订阅及批改
  getStudentLists,//获取学生列表
  getWorkListsByUserId,//获取用户任务信息
  getSubjectInfo,//获取科目
  //----------------学生个人报告
  findQuestionAnalysisInfo,//题目解析
  findStudentTreeScoreCompare,//全班三分比较
  findStudentReportTotalScore,//总分评价
  //----------------班级报告
  findClassReportTotalScoreDistribution,//总得分分布
  findClassReportSubjectiveAnalysis,//主观题分析
  findClassReportObjectiveAnalysis,//客观题分析
  findClassReportTreeScore,//总分三分比较
  findClassReportTotalScoreRate,//总得分率
  jobCompleteSituation,//这次任务的完成情况
  studentScoreStatistics,//学生得分统计
  questionCategoryScore,//题型分析统计
  findExemQuestionDataAnalysis,//考题参数分析
  findExemQuestionDataAbility,//能力水平
  findExemQuestionKnowStructure,//知识结构
  findExemReportCognInfo,//认知层次
  findExemReporTabilityInfo,//关键能力
  findExemReportCompInfo,//核心素养
  getNotCompleteStudentInfo,//获取未完成作答学生名单
  checkIsBuy,//查看是否购买
  findExemReportStudentInfoByExcepId,//班级学生失分名单查询
  findStudentReportErrorQuestionAnalysis,//个人报告--错题分析
} from '@/services/topicManage'
import effect from 'dva-model/effect';
import queryString from 'query-string';
import userInfoCache from "@/caches/userInfo";
import accessTokenCache from '@/caches/accessToken';
import getUseInfo from '@/caches/userInfo'
let lastQuery = undefined;
export default Model({
  namespace,
  state: {
    getStudentLists: [],//学生列表
    findStudentTreeScoreCompare: {},//全班三分比较
    findStudentReportTotalScore: {},//总分评价
    findQuestionAnalysisInfo: [],//题目分析
    findClassReportSubjectiveAnalysis: [],//主观题分析
    findClassReportTotalScoreDistribution: {},
    findClassReportObjectiveAnalysis: {
      list: [],
      options: []
    },//客观题分析
    jobCompleteSituation: {},
    studentScoreStatistics: [],
    questionCategoryScore: [],
    getNotCompleteStudentInfo:undefined
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const userInfo = getUseInfo();
        //---------------------教师获取学生报告
        if (pathname === '/teacherReport' && query.testType) {

          dispatch({
            type: 'getWorkListsByUserId',
            payload: {
              jobId: query.jobId,
              userId: query.id,
              paperTypeIds: query.testType,
              page: query.p || 1,
              size: query.s || 10,
              startTime: (query.dateArray && query.dateArray[0]) || '',
              endTime: (query.dateArray && query.dateArray[1]) || '',
              reportAndIsCorrt: 2,
              isCorrect: 1
            }
          });
        }
        //---------------------批阅及报告
        if (pathname === '/studentReport' && query.testType) {

          dispatch({
            type: 'getWorkListsByUserId',
            payload: {
              jobId: query.jobId,
              userId: query.id,
              paperTypeIds: query.testType,
              page: query.p || 1,
              size: query.s || 10,
              startTime: (query.dateArray && query.dateArray[0]) || '',
              endTime: (query.dateArray && query.dateArray[1]) || '',
              subjectId: query.subjectId || '',
              gradeId: query.gradeId || '',
              reportAndIsCorrt: 2,
              isCorrect: 1
            }
          });

          dispatch({
            type: 'getSubjectInfo',
            payload: {
              gradeId: query.gradeId ? query.gradeId : userInfoCache().gradeId
            }
          })
        }

        if (pathname === '/testReport' && query.jobId) {

          dispatch({
            type: 'checkIsBuy',
            payload: {
              code: query.jobId,
              goodsType: 5
            },
            callback: (result) => {
              if (result) {
                //总得分分布
                dispatch({
                  type: 'findClassReportTotalScoreDistribution',
                  payload: {
                    jobId: query.jobId,
                    diffeScore: query.diffeScore || 5
                  }
                });
                //主观题分析
                dispatch({
                  type: 'findClassReportSubjectiveAnalysis',
                  payload: {
                    jobId: query.jobId
                  }
                });
                //客观题分析
                dispatch({
                  type: 'findClassReportObjectiveAnalysis',
                  payload: {
                    jobId: query.jobId
                  }
                });
                //题型分析统计
                dispatch({
                  type: 'questionCategoryScore',
                  payload: {
                    jobId: query.jobId
                  }
                });


                //认知层次
                dispatch({
                  type: 'findExemReportCognInfo',
                  payload: {
                    jobId: query.jobId,
                    level: query.level,
                  }
                });
                //关键能力
                dispatch({
                  type: 'findExemReporTabilityInfo',
                  payload: {
                    jobId: query.jobId,
                    level: query.level,
                  }
                });
                //核心素养
                dispatch({
                  type: 'findExemReportCompInfo',
                  payload: {
                    jobId: query.jobId,
                    level: query.level,
                  }
                });
                // query.jobType == 1 && dispatch({
                //   type: "findStudentReportErrorQuestionAnalysis",
                //   payload: {
                //     userId: query.userId || query.id,
                //     jobId: query.jobId,
                //     classId: query.classId || userInfo.classId,
                //   }
                // })
                if (query.level == 1 || !query.level) {
                  //总分三分比较
                  dispatch({
                    type: 'findClassReportTreeScore',
                    payload: {
                      jobId: query.jobId
                    }
                  });
                  //总得分率
                  dispatch({
                    type: 'findClassReportTotalScoreRate',
                    payload: {
                      jobId: query.jobId
                    }
                  });
                  //任务的完成情况
                  dispatch({
                    type: 'jobCompleteSituation',
                    payload: {
                      jobId: query.jobId
                    }
                  });
                  //获取未完成作答学生名单
                  dispatch({
                    type: 'getNotCompleteStudentInfo',
                    payload: {
                      jobId: query.jobId
                    }
                  });
                  //学生得分统计
                  dispatch({
                    type: 'studentScoreStatistics',
                    payload: {
                      jobId: query.jobId,
                      rankType: query.rankType || -1,
                      rankWay: query.rankWay || 'desc'//	desc:升序；asc:降序
                    }
                  });
                  //考题参数分析
                  dispatch({
                    type: 'findExemQuestionDataAnalysis',
                    payload: {
                      jobId: query.jobId,
                      paperId: query.paperId,
                    }
                  });
                  //能力水平
                  dispatch({
                    type: 'findExemQuestionDataAbility',
                    payload: {
                      jobId: query.jobId,
                    }
                  });
                  //知识结构
                  dispatch({
                    type: 'findExemQuestionKnowStructure',
                    payload: {
                      jobId: query.jobId,
                    }
                  });
                  dispatch({
                    type: "findExemReportCognInfoOne",
                    payload: {
                      // studentId: query.id,
                      jobId: query.jobId,
                      level: 1,
                    }
                  })
                  //关键能力
                  dispatch({
                    type: 'findExemReporTabilityInfoOne',
                    payload: {
                      jobId: query.jobId,
                      level: 1,
                    }
                  });
                  //核心素养
                  dispatch({
                    type: 'findExemReportCompInfoOne',
                    payload: {
                      jobId: query.jobId,
                      level: 1,
                    }
                  });
                }
              }
            }
          });

        }
        lastQuery = query;
      });
    },
  },
  effects: {
    * findExemReportCognInfoOne(action, saga) {
      yield saga.call(effect(findExemReportCognInfo, 'findExemReportCognInfoOneSuccess'), action, saga);
    },
    * findExemReporTabilityInfoOne(action, saga) {
      yield saga.call(effect(findExemReporTabilityInfo, 'findExemReporTabilityInfoOneSuccess'), action, saga);
    },
    * findExemReportCompInfoOne(action, saga) {
      yield saga.call(effect(findExemReportCompInfo, 'findExemReportCompInfoOneSuccess'), action, saga);
    },
  },
  reducers: {
    /*赋值 state里的值 区分 方便各个组件使用*/
    saveState(state, { payload }) {
      return { ...state, ...payload };
    },
    searchStudent(state, action) {
      if (!action.payload.value) {
        state.getStudentLists = state.getStudentLists.filter(re => re.userName && (re.userName).indexOf(action.payload.value) !== -1);
      }
      return { ...state, getStudentLists: action.result, }
    },
    findStudentTreeScoreCompareSuccess(state, action) {
      return { ...state, findStudentTreeScoreCompare: action.result ? action.result : {}, loading: false };
    },
    findExemReportCognInfoOneSuccess(state, action) {
      return { ...state, findExemReportCognInfoOne: action.result, loading: false };
    },
    findExemReporTabilityInfoOneSuccess(state, action) {
      return { ...state, findExemReporTabilityInfoOne: action.result, loading: false };
    },
    findExemReportCompInfoOneSuccess(state, action) {
      return { ...state, findExemReportCompInfoOne: action.result, loading: false };
    },
  }
}, {
  getStudentLists,//获取学生列表
  getWorkListsByUserId,//获取用户任务信息
  getSubjectInfo,
  findQuestionAnalysisInfo,
  findStudentTreeScoreCompare,
  findStudentReportTotalScore,
  findClassReportTotalScoreDistribution,
  findClassReportSubjectiveAnalysis,
  findClassReportObjectiveAnalysis,
  findClassReportTreeScore,
  findClassReportTotalScoreRate,
  jobCompleteSituation,//这次任务的完成情况
  studentScoreStatistics,//学生得分统计
  questionCategoryScore,
  findExemQuestionDataAnalysis,//考题参数分析
  findExemQuestionDataAbility,//能力水平
  findExemQuestionKnowStructure,//知识结构
  findExemReportCognInfo,//认知层次
  findExemReporTabilityInfo,//关键能力
  findExemReportCompInfo,//核心素养
  checkIsBuy,//查看是否购买
  findExemReportStudentInfoByExcepId,//班级学生失分名单查询
  getNotCompleteStudentInfo,//获取未完成作答学生名单
  findStudentReportErrorQuestionAnalysis,//个人报告--错题分析
}
)


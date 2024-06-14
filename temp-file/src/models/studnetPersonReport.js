/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/9/28
 *@Modified By:
 */
import model from 'dva-model'
import { PayCenter, StudentPersonReport as namespace } from "@/utils/namespace";
import {
  findStudentReportTotalScore,//获取学生分数
  findStudentTreeScoreCompare,//获取三分比较，
  paperAnalysisDetails,//卷面分析，知识点分析，题目分析
  questionTypeScore,//题型得分情况
  findKnowledgePointAnalysis,//知识点分析
  findStudentPrivateReport,//知识结构;答题异常分析;考题参数分析;
  findStudentAbilityLevel,
  findStudentReportTotalScoreDistribution,
  findStudentCognitionLevel,
  findStudentKeyCompetencies,
  findStudentKeyAbility,
  findStudentResponseDetail,//个人考试报告----题目详情
  findStudentReportErrorQuestionAnalysis,//个人报告--错题分析
} from '@/services/studentPersonReport';
import effect from 'dva-model/effect';
import { existObj, getLocationObj, queryParamIsChange } from "@/utils/utils";
import userInfoCache from '@/caches/userInfo'
import accessTokenCache from '@/caches/accessToken';
import getUseInfo from '@/caches/userInfo'
export default model({
  state: {},
  namespace,
  subscriptions: {
    setup: ({ dispatch, history }) => {
      history.listen(location => {
        const { query, pathname } = getLocationObj(location) || {};
        const userInfo = getUseInfo();
        if (pathname === "/studentPersonReport" && query.id && query.jobId ) {

          // //判断是否有权限查看报告
          // dispatch({
          //   type: PayCenter + '/isBuyGoods',
          //   payload: {
          //     goodsType: 5,
          //     code: query.jobId
          //   },
          //   callback: (response) => {
          //     if(response){
          //       //获取学生分数
          //
          //     }
          //   }
          // })


          //认知层次
          dispatch({
            type: "findStudentCognitionLevel",
            payload: {
              studentId: query.id,
              jobId: query.jobId,
              level: query.level,
            }
          })
          //关键能力
          dispatch({
            type: "findStudentKeyAbility",
            payload: {
              studentId: query.id,
              jobId: query.jobId,
              level: query.level,
            }
          })
          //核心素养
          dispatch({
            type: "findStudentKeyCompetencies",
            payload: {
              studentId: query.id,
              jobId: query.jobId,
              level: query.level,
            }
          })
          //
          if (query.level == 1 || !query.level) {
            dispatch({
              type: "findStudentReportTotalScore",
              payload: {
                userId: query.id,
                jobId: query.jobId
              }
            })

            //获取三分比较
            dispatch({
              type: "findStudentTreeScoreCompare",
              payload: {
                userId: query.id,
                jobId: query.jobId
              }
            })

            //卷面分析，知识点分析，题目分析
            dispatch({
              type: "paperAnalysisDetails",
              payload: {
                studentId: query.id,
                jobId: query.jobId
              }
            })


            //卷面分析，知识点分析，题目分析
            dispatch({
              type: "findKnowledgePointAnalysis",
              payload: {
                studentId: query.id,
                jobId: query.jobId
              }
            })

            //题型得分情况
            dispatch({
              type: "questionTypeScore",
              payload: {
                studentId: query.id,
                jobId: query.jobId
              }
            })

            //题型得分情况
            dispatch({
              type: "findStudentPrivateReport",
              payload: {
                studentId: query.id,
                jobId: query.jobId
              }
            })
            //能力水平
            dispatch({
              type: "findStudentAbilityLevel",
              payload: {
                studentId: query.id,
                jobId: query.jobId
              }
            })
            //总得分分布
            dispatch({
              type: "findStudentReportTotalScoreDistribution",
              payload: {
                studentId: query.id,
                jobId: query.jobId
              }
            })
            dispatch({
              type: "findStudentCognitionLevelOne",
              payload: {
                studentId: query.id,
                jobId: query.jobId,
                level: 1,
              }
            })
            dispatch({
              type: "findStudentKeyAbilityOne",
              payload: {
                studentId: query.id,
                jobId: query.jobId,
                level: 1,
              }
            })
            dispatch({
              type: "findStudentKeyCompetenciesOne",
              payload: {
                studentId: query.id,
                jobId: query.jobId,
                level: 1,
              }
            })
            dispatch({
              type: "findStudentReportErrorQuestionAnalysis",
              payload: {
                userId: query.userId || query.id,
                jobId: query.jobId,
                classId: query.classId || userInfo.classId,
              }
            })
          }

        } else if (pathname === "/studentPersonReport" && !parseInt(query.equities, 10)) {
          const studyId = existObj(userInfoCache()) ? userInfoCache().studyId : '';
          //获取单个报告价格
          dispatch({
            type: PayCenter + '/getGoodsList',
            payload: {
              studyId,
              goodsType: 5
            }
          })
        }

      })
    }

  },
  effects: {
    * findStudentCognitionLevelOne(action, saga) {
      yield saga.call(effect(findStudentCognitionLevel, 'findStudentCognitionLevelOneSuccess'), action, saga);
    },
    * findStudentKeyAbilityOne(action, saga) {
      yield saga.call(effect(findStudentKeyAbility, 'findStudentKeyAbilityOneSuccess'), action, saga);
    },
    * findStudentKeyCompetenciesOne(action, saga) {
      yield saga.call(effect(findStudentKeyCompetencies, 'findStudentKeyCompetenciesOneSuccess'), action, saga);
    },
  },

  reducers: {
    /*赋值 state里的值 区分 方便各个组件使用*/
    saveState(state, { payload }) {
      return { ...state, ...payload };
    },
    findStudentCognitionLevelOneSuccess(state, action) {
      return { ...state, findStudentCognitionLevelOne: action.result, loading: false };
    },
    findStudentKeyAbilityOneSuccess(state, action) {
      return { ...state, findStudentKeyAbilityOne: action.result, loading: false };
    },
    findStudentKeyCompetenciesOneSuccess(state, action) {
      return { ...state, findStudentKeyCompetenciesOne: action.result, loading: false };
    },
    // 个人考试报告----题目详情
    findStudentResponseDetailSuccess(state, action) {
      return { ...state, questionInfo: action.result, questionDetailLoading: false };
    },
  }
}, {
  findStudentReportTotalScore,
  findStudentTreeScoreCompare,
  paperAnalysisDetails,
  questionTypeScore,
  findKnowledgePointAnalysis,
  findStudentPrivateReport,//知识结构;答题异常分析;考题参数分析;
  findStudentAbilityLevel,
  findStudentReportTotalScoreDistribution,
  findStudentCognitionLevel,
  findStudentKeyCompetencies,
  findStudentKeyAbility,
  findStudentResponseDetail,//个人考试报告----题目详情
  findStudentReportErrorQuestionAnalysis,//个人报告--错题分析
})

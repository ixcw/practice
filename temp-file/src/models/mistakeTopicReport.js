/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2021/3/8
 *@Modified By:
 */
import model from 'dva-model'
import queryString from 'query-string';
import {MistakeTopicReport as namespace, StudentPersonReport} from "@/utils/namespace";
import userInfoCache from '@/caches/userInfo';
import {existObj, getLocationObj, getTimestamp} from "@/utils/utils";
import getUseInfo from '@/caches/userInfo'
import {
  findClassErrorQuestionTask,//查询报告基本信息（基本信息及知识结构）
  findErrorTrainList,//获取错题专练列表统计
  findClassAnalysisTableInfo,//获取答题分析统计详情
  findClassAnalysisTable,//获取答题分析统计
  findErrorTrainInfoByUserId,//获取错题专练列表统计详情
  findStudentReportErrorQuestionAnalysis,
} from '@/services/mistakeTopicReport';

export default model({
  state: {},
  namespace,
  subscriptions: {
    setup: ({dispatch, history}) => {
      history.listen(location => {
        const {query, pathname} = getLocationObj(location) || {};
        const userInfo = getUseInfo();
        if (pathname === "/mistakeTopicReport" && query.id && query.jobId ) {//&& parseInt(query.equities, 10)取消权限判断
          const {classId} = existObj(userInfoCache()) || {};
          dispatch({
            type: "findClassErrorQuestionTask",
            payload: {
              jobId: query.jobId
            }
          })
          dispatch({
            type: "findErrorTrainList",
            payload: {
              jobId: query.jobId,
              page: 1,
              size: 10
            }
          })
          dispatch({
            type: "findClassAnalysisTable",
            payload: {
              jobId: query.jobId,
              classId: classId || query.classId,
              page: 1,
              size: 10
            }
          })
          // query.jobType == 1 && dispatch({
          //   type: "findStudentReportErrorQuestionAnalysis",
          //   payload: {
          //     userId: query.userId || query.id,
          //     jobId: query.jobId,
          //     classId: query.classId || userInfo.classId,
          //   }
          // })
        }
      })

    }

  },
  reducers: {}
}, {
  findClassErrorQuestionTask,
  findErrorTrainList,
  findClassAnalysisTableInfo,
  findClassAnalysisTable,
  findErrorTrainInfoByUserId,
  findStudentReportErrorQuestionAnalysis

})

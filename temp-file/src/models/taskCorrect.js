/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/9/3
 *@Modified By:
 */
import Model from 'dva-model';
import {existArr, existObj, getLocationObj, queryParamIsChange} from '@/utils/utils'
import {TaskCorrect as namespace, TopicManage} from '@/utils/namespace'
import {
  getWorkListsByUserId,//获取任务列表
} from '@/services/topicManage'
import {
  findStudentListsByJobId,//通过任务获取学生列表
  findCorrectionLists,//获取学生作答试卷
  correctionQuestion,//提交题目分数
  confirmCorrectionComplete,//完成批改
  getNotCompleteStudentInfo,//获取未完成学生
  findAllWaitingCorrectQuestions,//获取所有待批阅的题目
} from '@/services/taskCorrect'
import userInfoCache from "@/caches/userInfo";


let lastQuery = undefined;
export default Model({
    namespace,
    state: {},
    subscriptions: {
      setup({dispatch, history}) {
        history.listen(location => {
          const {query, pathname} = getLocationObj(location);
          let loginUserInfo = userInfoCache() || {};
          if (pathname === '/taskCorrect') {
            dispatch({
              type: 'getWorkListsByUserId',
              payload: {
                jobId: query.jobId,
                userId: loginUserInfo.userId,
                paperTypeIds: query.paperType || '1,2,3',
                page: query.p || 1,
                size: 10,
                startTime: '',
                endTime: '',
                isCorrect: 0,
                reportAndIsCorrt: 1
              }
            });
          }
          if (pathname === '/correctJob') {
            queryParamIsChange(lastQuery, query, ['id', 'jobId'], ['id', 'jobId']) && dispatch({
              type: `${query?.jobType === '1' && !(query?.isCorrect || query?.studentCorrect) ? 'findAllWaitingCorrectQuestions' : 'findCorrectionLists'}`,
              payload: {
                userId: query.id === '0' ? undefined : query.id,
                jobId: query.jobId
              }
            })
          }
          lastQuery = query;
        })
      }
    },
    effects: {},
    reducers: {
      findAllWaitingCorrectQuestionsSuccess(state, action) {
        return {...state, findCorrectionLists: action.result, loading: false};
      }
    }
  }, {
    getWorkListsByUserId,
    findStudentListsByJobId,//通过任务获取学生列表
    findCorrectionLists,
    correctionQuestion,
    confirmCorrectionComplete,
    getNotCompleteStudentInfo,
    findAllWaitingCorrectQuestions,//获取所有待批阅的题目
  }
)

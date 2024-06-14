/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/8/25
 *@Modified By:
 */
import Model from 'dva-model';
import {AssignTask as namespace} from '@/utils/namespace';
import queryString from 'query-string'
import {existObj} from '@/utils/utils'
import {
  getWorkLists,//获取布置任务列表
  addNewWork,//布置任务
  getPaperLists,//查询试卷列表
  getStudentLists,//获取学生
  getDayWorkLists,//获取日历
  findQuestionByKnowId,//通过章节知识点获取课后习题
  getPaperList,//数据入库查询
} from '@/services/assignTask'

export default Model({
    namespace,
    state: {},
    subscriptions: {
      setup({dispatch, history}) {
        history.listen(location => {
          const query = existObj(location) ? queryString.parse(location.search) : {}
          if (location.pathname === '/assignTask') {
            dispatch({
              type: 'getWorkLists',
              payload: {
                paperTypeIds: query.paperType || '',
                page: query.p || 1,
                size: 10
              }
            })
          }
        })
      }
    },
    effects: {},
    reducers: {
      getWorkListsSuccess(state, action) {
        return {...state, getWorkLists: action.result, loading: false};
      }
    }
  }, {
    getWorkLists,
    addNewWork,
    getPaperLists,
    getStudentLists,
    getDayWorkLists,
    findQuestionByKnowId,
    getPaperList
  }
)

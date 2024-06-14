/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/12/9
 *@Modified By:
 */
import Model from 'dva-model';
import {TaskAllot as namespace} from '@/utils/namespace';
import {getLocationObj,dealTimestamp} from '@/utils/utils'
import {
  initTaskAllocation,//初始化任务分配
  taskAllocation,//任务分配提交
  countTask,//任务分配列表
  getTaskDetail,//任务详情
} from '@/services/taskAllot'


export default Model({
    namespace,
    state: {},
    subscriptions: {
      setup({dispatch, history}) {
        history.listen(location => {
          const {pathname, query} = getLocationObj(location);
          if (pathname === namespace) {
            let date = new Date();
            dispatch({
              type: 'countTask',
              payload: {
                size: 10,
                page: query.p || 1,
                yearMonth: query.yearMonth || dealTimestamp(date,'YYYY-MM')
              }
            })
          }
        });
      },
    },
    effects: {},

    reducers: {}
  }, {
    initTaskAllocation,
    taskAllocation,
    countTask,//任务分配列表
    getTaskDetail
  }
)

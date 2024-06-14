/**
 *@Author:xiongwei
 *@Description:报告Modal
 *@Date:Created in  2020/09/01
 *@Modified By:
 */

import Model from 'dva-model';
import {TopicManageModal as namespace} from '@/utils/namespace';
import {
  studentScoreStatistics,//学生得分统计
} from '@/services/topicManage'
import queryString from 'query-string';
export default Model({
    namespace,
    state: {
      studentScoreStatistics:{},
    },
    subscriptions: {
      setup({dispatch, history}) {
        history.listen(location => {
            const {pathname, search} = location;
          const query = queryString.parse(search);
          
          if (pathname === '/testReport' && query.jobId) {
            //学生得分统计
            // dispatch({
            //   type: 'studentScoreStatistics',
            //   payload: {
            //     jobId: query.jobId,
            //     page:1,
            //     size:query.s||10,
            //     rankType:query.rankType||-1,
            //     rankWay:query.rankWay||'desc'//	desc:升序；asc:降序
            //   }
            // });
          }
        });
      },
    },
    effects: {},
    reducers: {
    }
  }, {
    studentScoreStatistics,//学生得分统计
  }
)
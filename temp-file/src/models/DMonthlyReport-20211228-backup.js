/**
 * 代理明细
 * @author:熊伟
 * @date:2021年07月8日
 * @version:v1.0.0
 * */

import Model from 'dva-model';
import {DMonthlyReport as namespace} from '@/utils/namespace';
import {
  findMonthlyAgentReportInfoByUserId,
} from '@/services/DMonthlyReport'
import queryString from 'query-string';
export default Model({
    namespace,
    state: {},
    subscriptions: {
      setup({dispatch, history}) {
        history.listen(location => {
          const {pathname, search} = location;
          const query = queryString.parse(search);
          const {areaCode = []} = query || {};
          // const areaL = areaCode.length;
          if (pathname === namespace) {
            dispatch({
                type:'findMonthlyAgentReportInfoByUserId',
                payload:{
                  agentSalaryType:query.type||1,
                  startShareDate:query.startShareDate||null,
                  endShareDate:query.endShareDate||null,
                  page:query.p||1,
                  size:query.s||10
                }
            })
            
          }
        });
      },
    },
    effects: {},

    reducers: {
      /*赋值 state里的值 区分 方便各个组件使用*/
      saveState(state, {payload}) {
        return {...state, ...payload};
      },

    }
  }, {
    findMonthlyAgentReportInfoByUserId,
  }
)
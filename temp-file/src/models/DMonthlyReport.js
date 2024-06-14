/**
 * 代理明细
 * @author:熊伟
 * @date:2021年07月8日
 * @version:v1.0.0
 * @updateAuthor:张江
 * @updateVersion:v1.0.1
 * @updateDate:2021年12月28日
 * @description 更新描述:根据新需求改版
 * */

import Model from 'dva-model';
import { DMonthlyReport as namespace } from '@/utils/namespace';
import {
  getSubAgentReport,//获取名下二级代理商分销月报统计 （一二级代理商模式）
  getAgentShareOrders,//获取代理商直接用户的订单详情 （一二级代理商模式）
  getAgentReportByUserId,//获取指定代理商月报统计 （一二级代理商模式）
} from '@/services/DMonthlyReport'
import queryString from 'query-string';
export default Model({
  namespace,
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const { type = 3 } = query || {};
        // {
        //   name: '直接用户',
        //     id: 3
        // },
        // {
        //   name: '二级代理',
        //     id: 4
        // },
        if (pathname === namespace) {
          dispatch({
            type: type == 3 ? 'getAgentShareOrders' : 'getSubAgentReport',
            payload: {
              agentSalaryType: query.type || 3,
              startShareDate: query.startShareDate || null,
              endShareDate: query.endShareDate || null,
              page: query.p || 1,
              size: query.s || 10,
              month: query.month || undefined
            }
          })
          dispatch({
            type: 'getAgentReportByUserId',
            payload: {
              month: query.month || undefined
            },
          })
        }
      });
    },
  },
  effects: {},

  reducers: {
    /*赋值 state里的值 区分 方便各个组件使用*/
    saveState(state, { payload }) {
      return { ...state, ...payload };
    },

  }
}, {
  getSubAgentReport,//获取名下二级代理商分销月报统计 （一二级代理商模式）
  getAgentShareOrders,//获取代理商直接用户的订单详情 （一二级代理商模式）
  getAgentReportByUserId,//获取指定代理商月报统计 （一二级代理商模式）,
}
)
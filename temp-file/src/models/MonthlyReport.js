/**
 *@Author:熊伟
 *@Description: 分销月报model
 *@Date:Created in  2020/9/02
 *@Modified By:
 */
import model from 'dva-model'
import queryString from 'query-string';
import { MonthlyReport as namespace } from "@/utils/namespace";
import { getTimestamp } from "@/utils/utils";
import {
  findCityByParentId,//根据父级id查询所有的“市”
  findAllProvinceInfo,//查询所有的“省”
  findMonthlySalesReport,//查询 - 销售月报
  findMonthlyAgentSalesReport,//查询 - 代理商分销月报
  findDistrictInfo,//通过市id查询县
} from '@/services/MonthlyReport';
export default model({
  state: {
  },
  namespace,
  subscriptions: {
    setup: ({ dispatch, history }) => {
    }

  },
  reducers: {
    findAllProvinceInfoSuccess(state, action) {
      return { ...state, AllProvinceInfo: action.result, loading: false };
    },
    findCityByParentIdSuccess(state, action) {
      return { ...state, findCityByParentId: action.result, loading: false };
    },
    findMonthlySalesReportSuccess(state, action) {
      return { ...state, monthlySalesReport: action.result, loading: false };
    },
    findMonthlyAgentSalesReportSuccess(state, action) {
      return { ...state, monthlyAgentSalesReport: action.result, loading: false };
    },
    resetMonthlyAgentSalesReport(state, action) {
      return { ...state, monthlyAgentSalesReport: null, loading: false };
    },
  }
}, {
  findCityByParentId,//根据父级id查询所有的“市”
  findAllProvinceInfo,//查询所有的“省”
  findMonthlySalesReport,//查询 - 销售月报
  findMonthlyAgentSalesReport,//查询 - 代理商分销月报
  findDistrictInfo,//通过市id查询县

})
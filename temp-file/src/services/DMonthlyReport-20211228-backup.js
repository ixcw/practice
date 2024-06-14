/**
 * 代理明细
 * @author:熊伟
 * @date:2021年07月8日
 * @version:v1.0.0
 * */

import request from '@/utils/request';
import { GET, POST } from '@/utils/const';


/**
***分销月报***
* @param data
* @return {Promise<any>}
*/
export async function findMonthlyAgentReportInfoByUserId(data) {
  return request('/auth/web/v1/monthly/findMonthlyAgentReportInfoByUserId', { data, method: POST});
}




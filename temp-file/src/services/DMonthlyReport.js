/**
 * 分销月报
 * @author:熊伟
 * @date:2021年07月8日
 * @version:v1.0.0
 * @updateAuthor:张江
 * @updateVersion:v1.0.1
 * @updateDate:2021年12月28日
 * @description 更新描述:根据新需求改版
 * */

import request from '@/utils/request';
import { GET, POST } from '@/utils/const';


/**
***获取名下二级代理商分销月报统计 （一二级代理商模式）***
* @param data
* @return {Promise<any>}
*/
export async function getSubAgentReport(data) {
  return request('/auth/web/v1/monthly/getSubAgentReport', { data, method: POST });
}

/**
***获取代理商直接用户的订单详情 （一二级代理商模式）***
* @param data
* @return {Promise<any>}
*/
export async function getAgentShareOrders(data) {
  return request('/auth/web/v1/monthly/getAgentShareOrders', { data, method: POST });
}

/**
***获取指定代理商月报统计 （一二级代理商模式）***
* @param data
* @return {Promise<any>}
*/
export async function getAgentReportByUserId(data) {
  return request('/auth/web/v1/monthly/getAgentReportByUserId', { data, method: POST });
}



/**
 * 分销月报
 * @author:熊伟
 * @date:2020年7月2日
 * @version:v1.0.0
 * */
import { GET, POST } from '@/utils/const'
// import requestUpload from '@/utils/requestUpload';
import request from '@/utils/request'
/**
 * 获取所有的“省”份列表
 * @param data 请求参数
 * @returns {*}
 */
export function findAllProvinceInfo(data) {
  return request('/auth/web/v1/monthly/findAllProvinceInfo', { data, method: POST })
}
/**
 * 根据父级id查询所有的“市”
 * @param data 请求参数
 * @returns {*}
 */
export function findCityByParentId(data) {
  return request('/auth/web/v1/monthly/findCityByParentId', { data, method: POST })
}
/**
* 查询 - 销售月报
* @param data 请求参数
* @returns {*}
*/
export function findMonthlySalesReport(data) {
  return request('/auth/web/v1/monthly/findMonthlySalesReport', { data, method: POST })
}
/**
* 查询 - 代理商分销月报
* @param data 请求参数
* @returns {*}
*/
export function findMonthlyAgentSalesReport(data) {
  return request('/auth/web/v1/monthly/findMonthlyAgentSalesReport', { data, method: POST })
}
/**
*** 通过市级ID获取县 ***
* @param data
* @return {Promise<any>}
*/
export async function findDistrictInfo(data) {
  return request('/auth/web/v1/index/findDistrictInfo', { data, method: POST });
}
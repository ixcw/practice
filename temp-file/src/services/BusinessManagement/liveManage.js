/**
 * 直播管理服务
* @author: 张江 
* @date: 2022年04月25日
 * @version:v1.0.0
 * */
import { GET, POST } from '@/utils/const'
import request from '@/utils/request'
import requestUpload from "@/utils/requestUpload";


/**
 * 分页获取直播列表
 * @param data 请求参数
 * @returns {*}
 */
export function getPageList(data) {
  return request('/auth/api/v1/gLive/pageList', { data, method: GET })
}


/**
 * 保存直播
 * @param data 请求参数
 * @returns {*}
 */
export function saveLive(data) {
  return request('/auth/api/v1/gLive/save', { data, method: POST, contentType: 'application/json' })
}

/**
 * 修改直播
 * @param data 请求参数
 * @returns {*}
 */
export function updateLive(data) {
  return request(`/auth/api/v1/gLive/update`, { data, method: POST, contentType: 'application/json' })
}

/**
 * 删除直播
 * @param data 请求参数
 * @returns {*}
 */
export function deleteLive(data) {
  return request(`/auth/api/v1/gLive/delete`, { data, method: POST })
}


/**
 * 分页获取直播观众列表
 * @param data 请求参数
 * @returns {*}
 */
export function getPageListViewer(data) {
  return request('/auth/api/v1/gLive/pageListViewer', { data, method: GET })
}

/**
 * 添加班级观众
 * @param data 请求参数
 * @returns {*}
 */
export function addClassViewer(data) {
  return request(`/auth/api/v1/gLive/addClassViewer`, { data, method: POST })
}

/**
 * 开始直播
 * @param data 请求参数
 * @returns {*}
 */
export function startLive(data) {
  return request(`/auth/api/v1/gLive/start`, { data, method: POST })
}

/**
 * 结束直播
 * @param data 请求参数
 * @returns {*}
 */
export function stopLive(data) {
  return request(`/auth/api/v1/gLive/stop`, { data, method: POST })
}


/**
 * 查询商品列表
 * @param data
 * @returns {Promise<unknown>}
 */
export async function getListCurrentGoods(data) {
  return request('/auth/pay/v1/goods/listCurrentGoods', { data, method: GET })
}

/**
 * 测试直播
 * @param data 请求参数
 * @returns {*}
 */
export function testLive(data) {
  return request(`/auth/api/v1/gLive/test`, { data, method: POST })
}

/**
 * 直播详情
 * @param data 请求参数
 * @returns {*}
 */
export function getLiveDetail(data) {
  return request(`/auth/api/v1/live/getDetail`, { data, method: GET })
}


/**
 * 分页获取直播列表
 * @param data 请求参数
 * @returns {*}
 */
export function getPageListByUser(data) {
  return request(`/auth/api/v1/live/pageList`, { data, method: GET })
}


/**
 * 观看(仅是计数)
 * @param data 请求参数
 * @returns {*}
 */
export function playToCount(data) {
  return request(`/auth/api/v1/live/play`, { data, method: POST })
}

/**
 * 管理端直播详情
 * @param data 请求参数
 * @returns {*}
 */
export function getMangeLiveDetail(data) {
  return request(`/auth/api/v1/gLive/getDetail`, { data, method: GET })
}


/**
 * 免费预约直播
 * @param data 请求参数
 * @returns {*}
 */
export function liveFreeJoin(data) {
  return request(`/auth/api/v1/live/freeJoin`, { data, method: POST })
}
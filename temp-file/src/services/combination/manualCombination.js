/**
* 手动组题服务
* @author:张江
* @date:2020年08月29日
* @version:v1.0.0
* */
import request from "@/utils/request";
import {POST} from "@/utils/const";

/**
 * 获取手动组题筛选面板数据
 * @param data：请求参数
 * @returns {Promise<void>}
 */
export async function getGroupCenterConditions(data) {
  return request('/auth/web/v1/groupTopic/getGroupCenterConditions', {method: POST, data})
}

/**
 * 手动组题，获取根据筛选条件获取题目列表
 * @param data
 * @returns {Promise<unknown>}
 */
export async function getTopicList(data) {
  return request('/auth/web/v1/groupTopic/groupTopiclist', {method: POST, data})
}

/**
 * 将题目添加到组题板
 * @param data
 * @returns {Promise<unknown>}
 */
export async function saveOptionQuestion(data) {
  return request('/auth/web/v1/groupTopic/saveOptionQuestion', {method: POST, data})
}

/**
 * 将题目从组题板移除
 * @param data
 * @returns {Promise<unknown>}
 */
export async function removeQuetion(data) {
  return request('/auth/web/v1/groupTopic/removeQuetion', {method: POST, data})
}

/**
 * 收藏题目
 * @param data
 * @returns {Promise<unknown>}
 */
export async function collectTopic(data) {
  return request('/auth/api/v1/userCollection/add', {method: POST, data})
}
/**
 * 取消收藏题目
 * @param data
 * @returns {Promise<unknown>}
 */
export async function cancleCollectTopic(data) {
  return request('/auth/api/v1/userCollection/remove', {method: POST, data})
}



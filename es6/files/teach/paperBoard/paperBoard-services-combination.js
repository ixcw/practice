/**
* 试题板服务
* @author:张江
* @date:2020年08月29日
* @version:v1.0.0
* */
import request from "@/utils/request";
import { POST } from "@/utils/const";

/**
 * 获取试题板题目列表
 * @param data
 * @returns {Promise<unknown>}
 */
export async function getGroupCenterPaperBoard(data) {
  return request('/auth/web/v1/groupTopic/getGroupCenterPaperBoard', { method: POST })
}

/**
 * 清空试题板题目列表
 * @param data
 * @returns {Promise<unknown>}
 */
export async function clearPaperBoard(data) {
  return request('/auth/web/v1/groupTopic/deleteTExamPaperDetailTemp', { method: POST, data })
}

/**
 * 确认组题完成
 * @param data
 * @returns {Promise<unknown>}
 */
export async function confirmPaperBoard(data) {
  return request('/auth/web/v1/groupTopic/saveQuestionGroup', {
    method: POST,
    data,
    contentType: 'application/json'
  })
}

/**
 * 查看组题分析
 * @param data
 * @returns {Promise<unknown>}
 */
export async function previewAnalysis(data) {
  return request('/auth/web/v1/groupTopic/topicGroupAnalyze', {
    method: POST,
    data,
    contentType: 'application/json'
  })
}

/**
 * 确认组题完成
 * @param data
 * @returns {Promise<unknown>}
 */
export async function remveTopic(data) {
  return request('/auth/web/v1/groupTopic/removeQuetion', {
    method: POST,
    data,
  })
}


/**
 * 给试题版上的题目设置分数
 * @param data
 * @returns {Promise<unknown>}
 */
export async function saveExamPaperDetailBoard(data) {
  return request('/auth/web/v1/groupTopic/updateExamPaperDetailBoard', {
    method: POST,
    data,
    contentType: 'application/json'
  })
}


/** ********************************************************* 试题板-相似题匹配 start author:张江 date:2021年02月01日 *************************************************************************/

/**
 * 试题板中心-题目匹配-列表
 * @param data
 * @return {Promise<any>}
 */
export async function getQuestionMates(data) {
  return request('/auth/web/v1/groupTopic/fetchQuestionMates', { data, method: POST })
}

/**
 * 题目匹配入临时表
 * @param data
 * @return {Promise<any>}
 */
export async function addQuestionMateInfo(data) {
  return request('/auth/web/v1/groupTopic/addQuestionMateInfo', { data, method: POST })
}

/**
 * 获取组织列表
 * @param data
 * @returns {Promise<unknown>}
 */
export async function findOrganizeInfoList(data) {
  return request('/auth/web/v1/organizeInfo/findOrganizeInfo', {
    method: POST,
    data,
    contentType: 'application/json'
  })
}

/** ********************************************************* 试题板-相似题匹配 end author:张江 date:2021年02月02日 *************************************************************************/
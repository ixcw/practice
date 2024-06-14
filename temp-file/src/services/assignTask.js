/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/8/25
 *@Modified By:
 */

import request from '@/utils/request'
import { GET, POST } from '@/utils/const'

/**
 ***获取布置任务列表***
 * @param data
 * @return {Promise<any>}
 */
export async function getWorkLists (data) {
  return request('/auth/web/v1/decorateWork/getWorkLists', { data, method: GET })
}


/**
 ***布置任务***
 * @param data
 * @return {Promise<any>}
 */
export async function addNewWork (data) {
  return request('/auth/web/v1/decorateWork/addWork', { data, method: POST, contentType: 'application/json' })
}

/**
 ***查询试卷列表***
 * @param data
 * @return {Promise<any>}
 */
export async function getPaperLists (data) {
  return request('/auth/web/v1/decorateWork/getPaperLists', { data, method: GET })
}


/**
 ***获取学生***
 * @param data
 * @return {Promise<any>}
 */
export async function getStudentLists (data) {
  return request('/auth/web/v1/decorateWork/getStudentLists', { data, method: GET })
}


/**
 ***获取任务日历***
 * @param data
 * @return {Promise<any>}
 */
export async function getDayWorkLists (data) {
  return request('/auth/web/v1/decorateWork/getDayWorkLists', { data, method: GET })
}

/**
 ***获通过章节知识点获取课后习题***
 * @param data
 * @return {Promise<any>}
 */
export async function findQuestionByKnowId (data) {
  return request('/auth/web/front/v1/decorateTask/findQuestionByKnowId', { data, method: POST })
}



/**
 ***数据入库查询***
 * @param data
 * @return {Promise<any>}
 */
export async function getPaperList (data) {
  return request('/auth/web/v1/decorateWork/getPaperList', { data, method: POST })
}




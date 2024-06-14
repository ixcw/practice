/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/9/3
 *@Modified By:
 */

import request from "@/utils/request";
import {GET, POST} from "@/utils/const";

/**
 * 通过任务获取学生列表
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentListsByJobId(data) {
  return request('/auth/web/v1/decorateWork/findStudentListsByJobId', {data, method: POST});
}


/**
 * 获取学生作答试卷
 * @param data
 * @returns {Promise<*>}
 */
export async function findCorrectionLists(data) {
  return request('/auth/web/v1/decorateWork/findCorrectionLists', {data, method: POST});
}


/**
 * 提交题目分数
 * @param data
 * @returns {Promise<*>}
 */
export async function correctionQuestion(data) {
  return request('/auth/web/v1/decorateWork/correctionQuestion', {data, method: POST});
}


/**
 * 提交题目分数
 * @param data
 * @returns {Promise<*>}
 */
export async function confirmCorrectionComplete(data) {
  return request('/auth/web/v1/decorateWork/confirmCorrectionComplete', {data, method: POST});
}


/**
 * 获取未完成学生
 * @param data
 * @returns {Promise<*>}
 */
export async function getNotCompleteStudentInfo(data) {
  return request('/auth/web/v1/decorateWork/getNotCompleteStudentInfo', {data, method: GET});
}

/**
 * 获取所有待批阅的题目
 * @param data
 * @returns {Promise<*>}
 */
export async function findAllWaitingCorrectQuestions(data) {
  return request('/auth/web/v1/decorateWork/findAllWaitingCorrectQuestions', { data, method: POST });
}



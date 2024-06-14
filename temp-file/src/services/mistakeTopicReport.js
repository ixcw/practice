/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2021/3/10
 *@Modified By:
 */

import request from '@/utils/request';
import { GET, POST } from '@/utils/const';


/**
 ***查询报告基本信息（基本信息及知识结构）***
 * @param data
 * @return {Promise<any>}
 */
export async function findClassErrorQuestionTask(data) {
  return request('/auth/web/front/v1/decorateTask/findClassErrorQuestionTask', { data, method: POST });
}


/**
 ***获取错题专练列表统计***
 * @param data
 * @return {Promise<any>}
 */
export async function findErrorTrainList(data) {
  return request('/auth/web/front/v1/decorateTask/findErrorTrainList', { data, method: POST });
}


/**
 ***获取答题分析统计详情***
 * @param data
 * @return {Promise<any>}
 */
export async function findClassAnalysisTableInfo(data) {
  return request('/auth/web/front/v1/decorateTask/findClassAnalysisTableInfo', { data, method: POST });
}

/**
 ***获取答题分析统计***
 * @param data
 * @return {Promise<any>}
 */
export async function findClassAnalysisTable(data) {
  return request('/auth/web/front/v1/decorateTask/findClassAnalysisTable', { data, method: POST });
}


/**
 ***获取错题专练列表统计详情***
 * @param data
 * @return {Promise<any>}
 */
export async function findErrorTrainInfoByUserId(data) {
  return request('/auth/web/front/v1/decorateTask/findErrorTrainInfoByUserId', { data, method: POST });
}

/**
 * 个人报告--错题分析
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentReportErrorQuestionAnalysis(data) {
  return request('/auth/web/v1/decorateWork/findStudentReportErrorQuestionAnalysis', { data, method: POST });
}

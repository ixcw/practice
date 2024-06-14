/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/9/28
 *@Modified By:
 */

import request from "@/utils/request";
import {GET, POST} from "@/utils/const";

/**
 * 获取学生得分
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentReportTotalScore(data) {
  return request('/auth/web/v1/decorateWork/findStudentReportTotalScore', {data, method: POST});
}

/**
 * 全班三分比较
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentTreeScoreCompare(data) {
  return request('/auth/web/v1/decorateWork/findStudentTreeScoreCompare', { data, method: POST });
}


/**
 * 卷面分析/知识点分析/题目分析
 * @param data
 * @returns {Promise<*>}
 */
export async function paperAnalysisDetails(data) {
  return request('/auth/web/front/v1/decorateTask/paperAnalysisDetails', { data, method: POST });
}

/**
 * 题型得分情况
 * @param data
 * @returns {Promise<*>}
 */
export async function questionTypeScore(data) {
  return request('/auth/web/front/v1/decorateTask/questionTypeScore', { data, method: POST });
}

/**
 * 知识点分析
 * @param data
 * @returns {Promise<*>}
 */
export async function findKnowledgePointAnalysis(data) {
  return request('/auth/web/front/v1/decorateTask/findKnowledgePointAnalysis', { data, method: POST });
}
/**
 * 个人考试报告---能力水平
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentAbilityLevel(data) {
  return request('/auth/web/v1/decorateWork/findStudentAbilityLevel', { data, method: POST });
}
/**
 * 个人考试报告----总分得分分布
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentReportTotalScoreDistribution(data) {
  return request('/auth/web/v1/decorateWork/findStudentReportTotalScoreDistribution', { data, method: POST });
}
/**
 * 个人考试报告---认知层次
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentCognitionLevel(data) {
  return request('/auth/web/v1/decorateWork/findStudentCognitionLevel', { data, method: POST });
}
/**
 * 个人考试报告---关键能力
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentKeyAbility(data) {
  return request('/auth/web/v1/decorateWork/findStudentKeyAbility', { data, method: POST });
}
/**
 * 个人考试报告---核心素养
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentKeyCompetencies(data) {
  return request('/auth/web/v1/decorateWork/findStudentKeyCompetencies', { data, method: POST });
}
/**
 * 知识结构;答题异常分析;考题参数分析;
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentPrivateReport(data) {
  return request('/auth/web/v1/decorateWork/findStudentPrivateReport', { data, method: POST });
}

/**
 * 个人考试报告----题目详情
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentResponseDetail(data) {
  return request('/auth/web/v1/decorateWork/findStudentResponseDetail', { data, method: POST });
}

/**
 * 个人报告--错题分析
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentReportErrorQuestionAnalysis(data) {
  return request('/auth/web/v1/decorateWork/findStudentReportErrorQuestionAnalysis', { data, method: POST });
}




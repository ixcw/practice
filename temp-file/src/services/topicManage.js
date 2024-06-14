/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/8/28
 *@Modified By:
 */


import request from "@/utils/request";
import { GET, POST } from "@/utils/const";

//----------------订阅及批改--------------

/**
 * 获取学生列表
 * @param data
 * @returns {Promise<*>}
 */
export async function getStudentLists(data) {
  return request('/auth/web/v1/decorateWork/getStudentLists', { data, method: GET });
}

/**
 * 获取用户任务信息
 * @param data
 * @returns {Promise<*>}
 */
export async function getWorkListsByUserId(data) {
  return request('/auth/web/v1/decorateWork/getWorkListsByUserId', { data, method: GET });
}

/**
 * 获取科目信息
 * @param data
 * @returns {Promise<*>}
 */
export async function getSubjectInfo(data) {
  return request('/auth/web/v1/importQuestion/getSubjectInfo', { data, method: GET });
}


//--------------------------------------------------学生个人报告
/**
 * 题目解析
 * @param data
 * @returns {Promise<*>}
 */
export async function findQuestionAnalysisInfo(data) {
  return request('/auth/web/v1/decorateWork/findQuestionAnalysisInfo', { data, method: POST });
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
 * 总分评价
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentReportTotalScore(data) {
  return request('/auth/web/v1/decorateWork/findStudentReportTotalScore', { data, method: POST });
}

//--------------------------------------------------班级报告
/**
 * 总得分分布
 * @param data
 * @returns {Promise<*>}
 */
export async function findClassReportTotalScoreDistribution(data) {
  return request('/auth/web/v1/decorateWork/findClassReportTotalScoreDistribution', { data, method: POST });
}
/**
 * 主观题分析
 * @param data
 * @returns {Promise<*>}
 */
export async function findClassReportSubjectiveAnalysis(data) {
  return request('/auth/web/v1/decorateWork/findClassReportSubjectiveAnalysis', { data, method: POST });
}

/**
 * 客观题分析
 * @param data
 * @returns {Promise<*>}
 */
export async function findClassReportObjectiveAnalysis(data) {
  return request('/auth/web/v1/decorateWork/findClassReportObjectiveAnalysis', { data, method: POST });
}

/**
 * 总分三分比较
 * @param data
 * @returns {Promise<*>}
 */
export async function findClassReportTreeScore(data) {
  return request('/auth/web/v1/decorateWork/findClassReportTreeScore', { data, method: POST });
}
/**
 * 总得分率
 * @param data
 * @returns {Promise<*>}
 */
export async function findClassReportTotalScoreRate(data) {
  return request('/auth/web/v1/decorateWork/findClassReportTotalScoreRate', { data, method: POST });
}
/**
 * 任务完成情况
 * @param data
 * @returns {Promise<*>}
 */
export async function jobCompleteSituation(data) {
  return request('/auth/web/front/v1/decorateTask/jobCompleteSituation', { data, method: POST });
}
/**
 * 班级报告-学生得分统计
 * @param data
 * @returns {Promise<*>}
 */
export async function studentScoreStatistics(data) {
  return request('/auth/web/front/v1/decorateTask/studentScoreStatistics', { data, method: POST });
}
/**
 * 班级报告-题型分析统计
 * @param data
 * @returns {Promise<*>}
 */
export async function questionCategoryScore(data) {
  return request('/auth/web/front/v1/decorateTask/questionCategoryScore', { data, method: POST });
}

/**
 * 班级报告-考题参数分析
 * @param data
 * @returns {Promise<*>}
 */
export async function findExemQuestionDataAnalysis(data) {
  return request('/auth/web/front/v1/decorateTask/findExemQuestionDataAnalysis', { data, method: POST });
}

/**
 * 班级报告 -- 能力水平
 * @param data
 * @returns {Promise<*>}
 */
export async function findExemQuestionDataAbility(data) {
  return request('/auth/web/front/v1/decorateTask/findExemQuestionDataAbility', { data, method: POST });
}

/**
 * 班级报告 -- 认知层次
 * @param data
 * @returns {Promise<*>}
 */
export async function findExemReportCognInfo(data) {
  return request('/auth/web/front/v1/decorateTask/findExemReportCognInfo', { data, method: POST });
}
/**
 * 班级报告 -- 关键能力
 * @param data
 * @returns {Promise<*>}
 */
export async function findExemReporTabilityInfo(data) {
  return request('/auth/web/front/v1/decorateTask/findExemReporTabilityInfo', { data, method: POST });
}
/**
 * 班级报告 -- 核心素养
 * @param data
 * @returns {Promise<*>}
 */
export async function findExemReportCompInfo(data) {
  return request('/auth/web/front/v1/decorateTask/findExemReportCompInfo', { data, method: POST });
}


/**
 * 班级报告 -- 知识结构
 * @param data
 * @returns {Promise<*>}
 */
export async function findExemQuestionKnowStructure(data) {
  return request('/auth/web/front/v1/decorateTask/findExemQuestionKnowStructure', { data, method: POST });
}



/**
 * 查询这个商品是否已经购买
 * @param data
 * @returns {Promise<*>}
 */
export async function checkIsBuy(data) {
  return request('/auth/pay/v1/goods/info/isBuy', { data, method: POST });
}

/**
 * 班级报告--班级学生失分名单查询
 * @param data
 * @returns {Promise<*>}
 */
export async function findExemReportStudentInfoByExcepId(data) {
  return request('/auth/web/front/v1/decorateTask/findExemReportStudentInfoByExcepId', { data, method: POST });
}

/**
 * 班级报告--获取未完成作答学生名单
 * @param data
 * @returns {Promise<*>}
 */
export async function getNotCompleteStudentInfo(data) {
  return request('/auth/web/v1/decorateWork/getNotCompleteStudentInfo', { data, method: GET });
}

/**
 * 个人报告--错题分析
 * @param data
 * @returns {Promise<*>}
 */
export async function findStudentReportErrorQuestionAnalysis(data) {
  return request('/auth/web/v1/decorateWork/findStudentReportErrorQuestionAnalysis', { data, method: POST });
}




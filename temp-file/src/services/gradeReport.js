/**
 * 年级报告
 * @author:熊伟
 * @date:2021年05月11日
 * @version:v1.0.0
 * */

import request from '@/utils/request';
import requestUpload from '@/utils/requestUpload';
import { GET, POST } from '@/utils/const';

/**
***统计考生参考情况***
* @param data
* @return {Promise<any>}
*/
export async function findGradeReportStudentCount(data) {
  return request('/auth/web/v1/decorateWork/findGradeReportStudentCount', { data, method: POST });
}
/**
***三分比较/成绩竞争力***
* @param data
* @return {Promise<any>}
*/
export async function findGradeReportTreeScore(data) {
    return request('/auth/web/v1/decorateWork/findGradeReportTreeScore', { data, method: POST });
  }
/**
***同校同年级同届班级信息查询***
* @param data
* @return {Promise<any>}
*/
export async function findGradeReportClassInfo(data) {
  return request('/auth/web/v1/decorateWork/findGradeReportClassInfo', { data, method: GET });
}
/**
***考试年级报告---班级能力水平***
* @param data
* @return {Promise<any>}
*/
export async function findGradeReporteClassAbility(data) {
  return request('/auth/web/v1/decorateWork/findGradeReporteClassAbility', { data, method: POST });
}
/**
***考试年级报告---总分分布***
* @param data
* @return {Promise<any>}
*/
export async function findGradeExamReportScore(data) {
  return request('/auth/web/front/v1/decorateTask/findGradeExamReportScore', { data, method: POST });
}
/**
***考试年级报告---学生得分统计***
* @param data
* @return {Promise<any>}
*/
export async function findExamScore(data) {
  return request('/auth/web/front/v1/decorateTask/findExamScore', { data, method: POST });
}
/**
***考试年级报告--考题细目表***
* @param data
* @return {Promise<any>}
*/
export async function findGradeReportQuestionDetail(data) {
  return request('/auth/web/v1/decorateWork/findGradeReportQuestionDetail', { data, method: POST });
}
/**
***考试年级报告--得分率分布***
* @param data
* @return {Promise<any>}
*/
export async function getClassReportTotalScoreRate(data) {
  return request('/auth/web/front/v1/decorateTask/getClassReportTotalScoreRate', { data, method: POST });
}

/**
***----考题细目表---详情***
* @param data
* @return {Promise<any>}
*/
export async function findGradeReportExamClassDetailByQuestion(data) {
  return request('/auth/web/v1/decorateWork/findGradeReportExamClassDetailByQuestion', { data, method: POST });
}

/**
***----年级报告——认知层次***
* @param data
* @return {Promise<any>}
*/
export async function findExamReportCognize(data) {
  return request('/auth/web/front/v1/decorateTask/findExamReportCognize', { data, method: POST });
}

/**
***----年级报告——关键能力***
* @param data
* @return {Promise<any>}
*/
export async function findExamReportKeyAbility(data) {
  return request('/auth/web/front/v1/decorateTask/findExamReportKeyAbility', { data, method: POST });
}

/**
***----年级报告——核心素养***
* @param data
* @return {Promise<any>}
*/
export async function findExamReportCompetence(data) {
  return request('/auth/web/front/v1/decorateTask/findExamReportCompetence', { data, method: POST });
}











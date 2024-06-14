/**
 * 学生数据
 * @author:田忆
 * @date:2023年05月017日
 * @version:v1.0.0
 * */

import request from '@/utils/request';
import { GET, POST, PUT } from '@/utils/const';
import newRequest from '@/utils/newRequest';
import requestUpload from '@/utils/requestUpload'; //上传接口
import { func } from 'prop-types';


// 统计学生完善人数
export async function getStatisticsStudentNumber(data) {
  return request('/auth/web/v1/familyMes/queryStudentAssocCount', { data, method: GET });
}
// 分页查询学生列表
export async function postStudentPage(data) {
  return request('/auth/web/v1/familyMes/queryStudentListMes', { data, method: POST, contentType: 'application/json' });
}
// 字典接口
export async function getDictItems(data) {
  return request('/auth/system/v1/common/getDictItems', { data, method: GET });
}
// 批量加载多个字典组
export async function getBatchLoadDictGroups(data) {
  return request('/auth/system/v1/common/batchLoadDictGroups', { data, method: GET });
}
//班主任所管理的班级
export async function getTeacherManegeClassList(data) {
  return request('/auth/web/v1/familyMes/queryTeacherManageClassMes', { data, method: GET });
}
//获取当前年纪，学籍，班级信息
export async function getGradeStatusClass(data) {
  return request('/auth/web/v1/familyMes/queryDradeCatalogue', { data, method: GET })
}
// 加载地域树（籍贯下拉框）
export async function getNativeTree(data) {
  return request('/auth/system/v1/common/getNativeTree', { data, method: GET });
}
//新建学生基础信息
export async function newStudentData(data) {
  return request('/auth/web/v1/familyMes/createStudentMes', { data, method: POST, contentType: 'application/json' });
}
//新建学生基础信息
export async function studying(data) {
  return request('/auth/web/v1/questionMonitor/getStudyInfo', { data, method: GET });
}
//新建学生在线信息
export async function AtSchoolStudent(data) {
  return request('/auth/web/v1/familyMes/addStudentOnSchoolMes', { data, method: POST, contentType: 'application/json' });
}

//请求学生详情数据
export async function studentDetails(data) {
  return request('/auth/web/v1/familyMes/queryStudentDetailsMes', { data, method: GET });
}
//根据年份查看体检报告
export async function medicalExamination(data) {
  return request('/auth/web/v1/familyMes/queryCheckReport', { data, method: GET });
}

//导出数据
export async function deriveData(data) {
  return request('/auth/web/front/v1/WorkerDataCenter/exportWorkerBath', { data, method: POST, contentType: 'application/json', responseType: 'blob' })
}

//请求审核记录
export async function approvedMemo(data) {
  return request('/auth/web/v1/familyMes/queryVerifilyRecord', { data, method: GET })
}
//修改详情
export async function putStudent(data) {
  return request('/auth/web/v1/familyMes/updateStudentDetailsMes', { data, method: PUT, contentType: 'application/json' })
}

//提交未审核驳回
export async function assessorStudent(data) {
  return request('/auth/web/v1/familyMes/updateStudentExamineMes', { data, method: PUT, contentType: 'application/json' })
}
//根据年级变动班级
export async function gradeLinkageClass(data) {
  return request('/auth/web/v1/familyMes/queryGradeAndClass', { data, method: GET })
}

//变动接口
export async function variationStudent(data) {
  return request('/auth/web/v1/familyMes/studentChangeAdjust', { data, method: PUT, contentType: 'application/json' })
}

//修改记录
export async function amendData(data) {
  return request('/auth/web/v1/familyMes/queryAttributeUpdateRecord', { data, method: GET })
}

//根据班级年级获取
export async function spoceGangedClass(data) {
  return request('/auth/web/v1/familyMes/queryDradeCatalogueByCondition', { data, method: GET })
}
//一键督促完善学生信息
export async function pushFinishStudentMes(data) {
  return request('/auth/web/v1/familyMes/pushFinishStudentMes', { data, method: GET })
}
//学生批量迁移
export async function studentMessageBatchAdjust(data) {
  return request('/auth/web/v1/familyMes/studentMessageBatchAdjust', { data, method: POST, contentType: 'application/json' })
}
//获取当前学校的学级，学段，年级，班级
export async function spoceGradeClass(data) {
  return request('/auth/web/v1/familyMes/queryTreeCatalogue', { data, method: GET })
}
//批量迁移获取所有学生
export async function queryAllStudentMessage(data) {
  return request('/auth/web/v1/familyMes/queryAllStudentMessage', { data, method: POST, contentType: 'application/json' })
}
/**
***获取验证码***
* @param data
* @return {Promise<any>}
*/
export async function getVerificationCode(data) {
  return newRequest('/auth/api/v1/login/sms/retake', { data, method: POST })
}

/**
***验证码校验***
* @param data
* @return {Promise<any>}
*/
export async function verificationCode(data) {
  return newRequest('/auth/web/front/v1/login/validateCode', { data, method: POST })
}

/**
***删除学生数据***
* @param data
* @return {*}
*/
export async function deleteStudentMes(data) {
	return newRequest('/auth/web/v1/familyMes/deleteStudentMes', { data, method: POST,contentType: 'application/json'})
}


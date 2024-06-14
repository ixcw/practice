/**
 * 首页服务
 * @author:张江
 * @date:2020年08月21日
 * @version:v1.0.0
 * */

import request from '@/utils/request'
import requestUpload from '@/utils/requestUpload'
import { GET, POST } from '@/utils/const'

/**
***获取知识点***
* @param data
* @return {Promise<any>}
*/
export async function getIndexListTreeKnowledge (data) {
  return request('/auth/web/front/v1/login/indexListTreeKnowledge', { data, method: POST })
}


/**
***根据知识点查询题目***
* @param data
* @return {Promise<any>}
*/
export async function getQuestionByKnowledge (data) {
  return request('/auth/web/front/v1/login/findQuestionByKnowledge', { data, method: POST })
}


/**
***根据知识点分页获取套题或者套卷***
* @param data
* @return {Promise<any>}
*/
export async function pageListIndexPaper (data) {
  return request('/auth/web/front/v1/login/pageListIndexPaper', { data, method: POST })
}

/**
***根据知识点id查询微课信息 / 获取热门微课***
* @param data
* @return {Promise<any>}
*/
export async function getQuestionVideoList (data) {
  return request('/auth/web/front/v1/login/findQuestionVideo', { data, method: POST })
}

/**
***根据班级获取班级最新报告***
* @param data
* @return {Promise<any>}
*/
export async function getClassNewReportList (data) {
  return request('/auth/web/front/v1/index/getClassReport', { data, method: POST })
}

/**
***根据学生查询学习任务***
* @param data
* @return {Promise<any>}
*/
export async function getLearningTasksList (data) {
  return request('/auth/web/front/v1/index/findLearningTasks', { data, method: POST })
}

/**
***教师--微课上传至腾讯云点播***
* @param data
* @return {Promise<any>}
*/
export async function uploadVideo (data) {
  return requestUpload('/auth/web/front/v1/question/uploadVideo', { data, method: POST })
}

/**
***教师--获取班级列表信息***
* @param data
* @return {Promise<any>}
*/
export async function getMyClassInfoList (data) {
  return request('/auth/web/front/v1/user/findMyClassInfo', { data, method: POST })
}

/**
***教师--加入班级***
* @param data
* @return {Promise<any>}
*/
export async function userAddClassInfo (data) {
  return request('/auth/web/front/v1/user/userAddClassInfo', { data, method: POST })
}

/**
***教师--试题版统计***
* @param data
* @return {Promise<any>}
*/
export async function getTestQuestionEdition (data) {
  return request('/auth/web/front/v1/index/getTestQuestionEdition', { data, method: POST })
}

// /**
// ***学生-切换班级***
// * @param data
// * @return {Promise<any>}
// */
// export async function studentSwitchClass(data) {
//   return request('/auth/api/v1/user/switchClass', { data, method: POST });
// }

/**
***用户(学生/家长)-切换班级***
* @param data
* @return {Promise<any>}
*/
export async function userSwitchClass (data) {
  return request('/auth/web/v1/teacher/teacherSwitchClass', { data, method: POST })
}

/**
*** 我的相关课程***
* @param data
* @return {Promise<any>}
*/
export async function findRelatedCourse (data) {
  return request('/auth/web/front/v1/index/findRelatedCourse ', { data, method: POST })
}

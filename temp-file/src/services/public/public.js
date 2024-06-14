/**
 * 公共
 * @author:熊伟
 * @date:2020年8月22日
 *
 * 公共服务
 * @author:张江
 * @date:2020年08月20日
 * @version:v1.0.0
 * */

import request from '@/utils/request';
import { GET, POST } from '@/utils/const';

/**
***获取角色***
* @param data
* @return {Promise<any>}
*/
export async function getRoleInfoByPlatformId(data) {
  return request('/auth/web/front/v1/login/findRolesByPlatformId', { data, method: GET });
}


/**
***根据学段获取科目***
* @param data
* @return {Promise<any>}
*/
export async function findStudyOrVersion(data) {
  return request('/auth/web/front/v1/login/findStudyOrVersion', { data, method: POST });
}

/**
***开放获取省市县地址信息***
* @param data
* @return {Promise<any>}
*/
export async function findAreaInfosOpen(data) {
  return request('/auth/web/front/v1/login/findAreaInfosOpen', { data, method: POST });
}

/**
***根据地区id获取学校***
* @param data
* @return {Promise<any>}
*/
export async function findSchoolByAreaIdsOpen(data) {
  return request('/auth/web/front/v1/login/findSchoolByAreaIdsOpen', { data, method: POST });
}

/**
***获取学段***
* @param data
* @return {Promise<any>}
*/
export async function getStudyList(data) {
    return request('/auth/web/front/v1/login/findStudy', { data, method: POST });
}

/**
***获取科目信息或者版本信息***
* @param data
* @return {Promise<any>}
*/
export async function getStudyOrVersionList(data) {
    return request('/auth/web/front/v1/login/findStudyOrVersion', { data, method: POST });
}

/**
*** 获取年级信息 ***
* @param data
* @return {Promise<any>}
*/
export async function getGradeList(data) {
  return request('/auth/web/v1/importQuestion/getGradeInfo', { data, method: GET });
}
/**
*** 根据学段获取年级信息 ***
* @param data
* @return {Promise<any>}
*/
export async function getGradeInfos(data) {
  return request('/auth/web/front/v1/login/getGradeInfos', { data, method: POST });
}

/**
*** 获取学段和年级 ***
* @param data
* @return {Promise<any>}
*/
export async function getStudyAndGradeList(data) {
  return request('/auth/web/v1/class/findStudyAndGrades', { data, method: POST });
}


/**
*** 根据班级口令查询科目信息 ***
* @param data
* @return {Promise<any>}
*/
export async function getSubjectByClassCode(data) {
  return request('/auth/web/front/v1/index/findSubjectByClassCode', { data, method: POST });
}

/**
 * 拉取学段及科目
 * @param data
 * @returns {Promise<unknown>}
 */
export async function findStudyAndSubjects(data) {
  return request('/auth/api/v1/user/findStudyAndSubjects', {method: POST, data})
}



/**
 *** 获取省市县地址信息 ***
 * @param data
 * @return {Promise<any>}
 */
export async function getAreaInfoList(data) {
  return request('/auth/web/v1/index/findAreaInfos', { data, method: POST });
}


/**
 *** 通过区域id获取学校列表 ***
 * @param data
 * @return {Promise<any>}
 */
export async function getSchoolListByAreaId(data) {
  return request('/auth/web/v1/index/findSchoolByAreaIds', { data, method: POST });
}

/**
 * 获取所有的“省”份列表
 * @param data 请求参数
 * @returns {*}
 */
export function getAllProvinceInfo(data) {
  return request('/auth/web/v1/monthly/findAllProvinceInfo', { data, method: POST })
}

export function getPicture(data) {
  return request('/captcha/get', { data, method: POST,contentType:'application/json' } );
}
export function reqCheck(data) {
  return request('/captcha/check', { data, method: POST,contentType:'application/json' });
}

/**
*** 获取年级信息 ***
* @param data
* @return {Promise<any>}
*/
export async function getSchoolGrades(data) {
  return request('/auth/system/v1/common/getSchoolGrades', { data, method: GET });
}

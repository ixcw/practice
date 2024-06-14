/*
Author:韦靠谱
Description:老师数据
Date:2023/05/06
*/
import request from '@/utils/request';
import newRequest from '@/utils/newRequest';
import requestUpload from '@/utils/requestUpload'; //上传接口
import { GET, POST } from '@/utils/const';


// 字典接口
export async function getDictItems(data) {
    return request('/auth/system/v1/common/getDictItems', { data, method: GET });
}
// 批量加载多个字典组
export async function getBatchLoadDictGroups(data) {
    return request('/auth/system/v1/common/batchLoadDictGroups', { data, method: GET });
}
// 加载地域树（籍贯下拉框）
export async function getNativeTree(data) {
    return request('/auth/system/v1/common/getNativeTree', { data, method: GET });
}
// 获取学段列表
export async function getStudies(data) {
    return request('/auth/system/v1/common/getStudies', { data, method: GET });
}
// 获取部门列表
export async function getOrgs(data) {
    return request('/auth/system/v1/common/getOrgs', { data, method: GET });
}
// 获取部门职务列表
export async function getPosts(data) {
    return request('/auth/system/v1/common/getPosts', { data, method: GET });
}
// 获取科目列表
export async function getSubjects(data) {
    return request('/auth/system/v1/common/getSubjects', { data, method: GET });
}
// 主页面人数统计
export async function getStatTeachers(data) {
    return request('/auth/web/v1/datacenter/teacher/statTeachers', { data, method: GET });
}




// 批量导入教师Excel数据（上传Excel文件接口）
export async function uploadTeacherBatchImport(data) {
    return newRequest('/auth/web/v1/datacenter/teacher/batchImport', { data, method: POST,contentType: 'application/octet-stream',responseType:'stream' });
}
// 分页查询教师列表
export async function postTeacherPage(data) {
    return request('/auth/web/v1/datacenter/teacher/page', { data, method: POST });
}
// 添加/修改教师
export async function postTeacherSaveOrUpdate(data) {
    return request('/auth/web/v1/datacenter/teacher/saveOrUpdate', { data, method: POST,contentType: 'application/json' });
}
// 查询教师详情
export async function getTeacherDetail(data) {
    return request('/auth/web/v1/datacenter/teacher/detail', { data, method: POST });
}
// 新增或修改岗位变动记录
export async function getTeacherChangePost(data) {
    return request('/auth/web/v1/datacenter/teacher/changePost', { data, method: POST,contentType: 'application/json' });
}
// 查询岗位变动记录
export async function getTeacherListChangeRecords(data) {
    return request('/auth/web/v1/datacenter/teacher/listChangeRecords', { data, method: POST});
}
// 查询教师修改记录
export async function getTeacherListModifyRecords(data) {
    return request('/auth/web/v1/datacenter/teacher/listModifyRecords', { data, method: POST });
}
// 一键督促完善信息
export async function getTeacherDoUrge(data) {
    return request('/auth/web/v1/datacenter/teacher/doUrge', { data, method: POST });
}
// 保存审核结果
export async function postTeacherSaveExamineResult(data) {
    return request('/auth/web/v1/datacenter/teacher/saveExamineResult', { data, method: POST });
}
// 查询教师审核记录
export async function postTeacherListExamineRecord(data) {
    return request('/auth/web/v1/datacenter/teacher/listExamineRecord', { data, method: POST });
}
// 上传图片
export async function postUploadImage(data) {
    return request('/auth/web/front/v1/upload/uploadImage', { data, method: POST,contentType: 'multipart/form-data' });
}
// 下载教师导入模板（完整版）
export async function postDownloadTeacherTemple(data) {
    return request('/auth/web/v1/datacenter/teacher/downloadTeacherTemple', { data, method: POST });
}




/**
 * 找到老师所配置的科目
 * @param data
 * @returns {*}
 */
export function findTeacherSubjectInfo(data) {
    return request('auth/web/v1/teacher/findTeacherSubjectInfo',{data, method: POST})
  }

  /**
 * 删除教师所教的科目
 * @param data
 * @returns {*}
 */
export function deleteTeacherSubject(data) {
    return request('/auth/web/v1/teacher/deleteTeacherSubject',{data, method: POST})
  }

  /**
*** 获取科目信息 ***
* @param data
* @return {Promise<any>}
*/
export async function getSubjectList(data) {
    return request('/auth/web/v1/importQuestion/getSubjectInfo', { data, method: GET });
  }

  /**
 * 查询班级
 * @param data
 * @returns {*}
 */
export function findClassList(data) {
    return request('/auth/web/v1/teacher/findClassList',{data, method: POST})
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
 * 配置教师
 * @param data
 * @returns {*}
 */
export function configTeacher(data) {
    return request('/auth/web/v1/teacher/configTeacher',{data, method: POST})
}

  /**
 * 配置教师 (科目支持多选)
 * @param data
 * @returns {*}
 */
export function configTeacherSubjects(data) {
  return request('/auth/web/v1/teacher/configTeacherSubjects', { data, method: POST, contentType: 'application/json' })
}

/**
 * 获取班级下的班主任
 * @param data
 * @returns {*}
 */
export function getClassLeader(data) {
    return request('/auth/web/v1/teacher/getClassLeader',{data, method: GET})
  }

  /**
 * 获取班主任列表
 * @param data
 * @returns {*}
 */
export function getClassLeaderList(data) {
    return request('/auth/web/v1/teacher/getClassLeaderList',{data, method: GET})
  }

  /**
 * 配置班主任
 * @param data
 * @returns {*}
 */
export function configClassLeader(data) {
    return request('/auth/web/v1/teacher/configClassLeader',{data, method: POST})
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
***批量删除教师数据***
* @param data
* @return {*}
*/
export async function bathDeleteByIdCards(data) {
	return newRequest('/auth/web/v1/datacenter/teacher/bathDeleteByIdCards', { data, method: POST })
}

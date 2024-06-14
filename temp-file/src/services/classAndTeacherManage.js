/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/6/22
 *@Modified By:
 */
import request from "@/utils/request";

import { POST, GET } from "@/utils/const";
import newRequest from "@/utils/newRequest";

//======================================================教师管理==================================================

/**
 * 查询教师列表
 * @param data
 * @returns {*}
 */
export function findTeacherList(data) {
  return request("/auth/web/v1/teacher/findTeacherList", {
    data,
    method: POST,
  });
}

/**
 * 添加教师
 * @param data
 * @returns {*}
 */
export function addTeacher(data) {
  return request("/auth/web/v1/teacher/addTeacher", { data, method: POST });
}

/**
 * 查询班级
 * @param data
 * @returns {*}
 */
export function findClassList(data) {
  return request("/auth/web/v1/teacher/findClassList", { data, method: POST });
}

/**
 * 配置教师
 * @param data
 * @returns {*}
 */
export function configTeacher(data) {
  return request("/auth/web/v1/teacher/configTeacher", { data, method: POST });
}

/**
 * 修改教师信息
 * @param data
 * @returns {*}
 */
export function updateTeacher(data) {
  return request("auth/web/v1/teacher/updateTeacher", { data, method: POST });
}

/**
 * 找到老师所配置的科目
 * @param data
 * @returns {*}
 */
export function findTeacherSubjectInfo(data) {
  return request("auth/web/v1/teacher/findTeacherSubjectInfo", {
    data,
    method: POST,
  });
}

/**
 * 删除教师所教的科目
 * @param data
 * @returns {*}
 */
export function deleteTeacherSubject(data) {
  return request("/auth/web/v1/teacher/deleteTeacherSubject", {
    data,
    method: POST,
  });
}

/**
 * 获取班主任列表
 * @param data
 * @returns {*}
 */
export function getClassLeaderList(data) {
  return request("/auth/web/v1/teacher/getClassLeaderList", {
    data,
    method: GET,
  });
}

/**
 * 配置班主任
 * @param data
 * @returns {*}
 */
export function configClassLeader(data) {
  return request("/auth/web/v1/teacher/configClassLeader", {
    data,
    method: POST,
  });
}

/**
 * 获取班级下的班主任
 * @param data
 * @returns {*}
 */
export function getClassLeader(data) {
  return request("/auth/web/v1/teacher/getClassLeader", { data, method: GET });
}

//======================================================班级管理==================================================

/**
 * 获取班级
 * @param data
 * @returns {*}
 */
export function findClassInfoBys(data) {
  return request("/auth/web/v1/class/findClassInfoBys", {
    data,
    method: POST,
    contentType: "application/json",
  });
}

/**
 * 保存班级信息
 * @param data
 * @returns {*}
 */
export function saveClassInfos(data) {
  return request("/auth/web/v1/class/saveClassInfos", {
    data,
    method: POST,
    contentType: "application/json",
  });
}

/**
 * 保存班级信息
 * @param data
 * @returns {*}
 */
export function getClassCommandInfo(data) {
  return request("/auth/web/v1/class/getClassCommandInfo", {
    data,
    method: POST,
  });
}

/**
 * 获取班级班主任及任课教师配置信息
 * @param data
 * @returns {*}
 */
export function getSubjectConfig(data) {
  return request("/auth/web/v1/class/getSubjectConfig", { data, method: GET });
}

/**
 * 配置班级班主任及任课教师时获取教师列表
 * @param data
 * @returns {*}
 */
export function listTeachers(data) {
  return request("/auth/web/v1/class/listTeachers", { data, method: GET });
}

/**
 * 配置班级班主任及任课教师信息
 * @param data
 * @returns {*}
 */
export function saveSubjectConfig(data) {
  return request("/auth/web/v1/class/saveSubjectConfig", {
    data,
    method: POST,
    contentType: "application/json",
  });
}

/**
 * 获取当前学段信息
 * @param data
 * @returns {*}
 */
export function getStudies(data) {
  return request("/auth/system/v1/common/getSchoolStudies", {
    data,
    method: GET,
  });
}

/**
 * 界别列表
 * @param data
 * @returns {*}
 */
export function listThGrades(data) {
  return request("/auth/web/v1/class/listThGrades", {
    data,
    method: GET,
  });
}

/**
 * 生成班级预览
 * @param data
 * @returns {*}
 */
export function previewList(data) {
  return request("/auth/web/v1/class/preview", {
    data,
    method: POST,
    contentType: "application/json",
  });
}

/**
 * 获取年级
 * @param data
 * @returns {*}
 */
export function getSchoolGrades(data) {
  return request("/auth/system/v1/common/getSchoolGrades", {
    data,
    method: GET,
  });
}
/**
 * 批量生成班级-保存
 * @param data
 * @returns {*}
 */
export function batchGenerate(data) {
  return request("/auth/web/v1/class/batchGenerate", {
    data,
    method: POST,
    contentType: "application/json",
  });
}

/**
 ***获取验证码***
 * @param data
 * @return {Promise<any>}
 */
export function getVerificationCode(data) {
  return newRequest("/auth/api/v1/login/sms/retake", { data, method: POST });
}

/**
 ***验证码校验***
 * @param data
 * @return {Promise<any>}
 */
export function verificationCode(data) {
  return newRequest("/auth/web/front/v1/login/validateCode", {
    data,
    method: POST,
  });
}

/**
 * 批量删除
 * @param data
 * @returns {*}
 */
export function batchDelete(data) {
  return request("/auth/web/v1/class/batchDelete", {
    data,
    method: POST,
  });
}

/**
 * 一键升段-预览
 * @param data
 * @returns {*}
 */
export function previewClassList(data) {
  return request("/auth/web/v1/class/upgrade/preview", {
    data,
    method: GET,
  });
}

/**
 * 一键升段-提交
 * @param data
 * @returns {*}
 */
export function submitClassList(data) {
  return newRequest("/auth/web/v1/class/upgrade/submit", {
    data,
    method: POST,
    contentType: "application/json",
  });
}

/**
 * 获取院系列表
 * @param data
 * @returns {*}
 */
export function getSchoolCollagesList(data) {
  return newRequest("/auth/system/v1/common/getSchoolCollages", {
    data,
    method: GET,
  });
}

/**
 * 获取专业列表
 * @param data
 * @returns {*}
 */
export function getSchoolMajorsList(data) {
  return newRequest("/auth/system/v1/common/getSchoolMajors", {
    data,
    method: GET,
  });
}

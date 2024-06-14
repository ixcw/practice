/**
 * 学校数据
 * @author:shihaigui
 * date:2023年5月12日
 * */


import request from '@/utils/request'
import requestUpload from '@/utils/requestUpload'//上传接口
import { GET, POST } from '@/utils/const'


//批量加载多个字典组
export async function getCommonBatchLoadDictGroups (data) {
  return request('/auth/system/v1/common/batchLoadDictGroups', { data, method: GET, })
}
//获取学段列表
export async function getCommonStudies (data) {
  return request('/auth/system/v1/common/getStudies', { data, method: GET, })
}

//获取子地域列表
export async function getAreaChildren (data) {
  return request('/auth/system/v1/common/getAreaChildren', { data, method: GET, })
}

//获取除开专升本与大学的所有学段
export async function getfindSectionStudy (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/findSectionStudy', { data, method: GET, })
}
//查询学校基础信息
export async function basicInformation (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/basicInformation', { data, method: GET, })
}
//保存学校基础信息
export async function saveSchoolInfo (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/saveSchoolInfo', { data, method: POST,contentType: 'application/json' })
}

//查询上级直属管理机构
export async function getSuperiorsOrgan (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/getSuperiorsOrgan', { data, method: GET })
}

//查询学校设施
export async function historyFacility (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/historyFacility', { data, method: GET })
}
//保存学校设施
export async function saveSchoolFacility (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/saveSchoolFacility', { data, method: POST, contentType: 'application/json' })
}
//获取学校荣誉
export async function getSchoolHonor (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/getSchoolHonor', { data, method: GET })
}
//保存学校荣誉
export async function saveSchoolHonour (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/saveSchoolHonour', { data, method: POST,contentType: 'application/json'})
}
//修改学校荣誉
export async function deleteSchoolHonour (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/deleteSchoolHonour', { data, method: POST,contentType: 'application/json' })
}


//查询学校教师规模
export async function historyTeacherScale (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/historyTeacherScale', { data, method: GET, })
}
//添加教师规模
export async function saveTeacherScale (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/saveTeacherScale', { data, method: POST, })
}


//查询学校项目情况
export async function historySchoolProject (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/historySchoolProject', { data, method: GET, })
}
//修改学校项目情况
export async function updateSchoolProject (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/updateSchoolProject', { data, method: POST,contentType:'application/json' })
}
//添加保存学校项目
export async function saveSchoolProject (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/saveSchoolProject', { data, method: POST,contentType:'application/json' })
}
//查询小学升学率
export async function getPrimaryEnrollmentRate (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/getPrimaryEnrollmentRate', { data, method: GET, })
}
//添加小学升学率
export async function savePrimaryEnrollmentRate (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/savePrimaryEnrollmentRate', { data, method: POST, contentType: 'application/json' })
}


//查询初中升学率信息
export async function getJuniorEnrollmentRate (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/getJuniorEnrollmentRate', { data, method: GET, })
}
//添加初中升学率信息
export async function saveJuniorEnrollmentRate (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/saveJuniorEnrollmentRate', { data, method: POST, contentType: 'application/json' })
}

//查询高中升学率
export async function getSeniorEnrollmentRate (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/getSeniorEnrollmentRate', { data, method: GET, })
}
//添加高中升学率
export async function saveSeniorEnrollmentRate (data) {
  return request('/auth/web/v1/schoolInformation/informationInput/saveSeniorEnrollmentRate', { data, method: POST,contentType: 'application/json' })
}







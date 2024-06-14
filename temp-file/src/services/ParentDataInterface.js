/**
 * 家长数据
 * @author:shihaigui
 * date:2023年5月12日
 * */

import request from '@/utils/request'
import newRequest from '@/utils/newRequest';
import requestUpload from '@/utils/requestUpload'//上传接口
import { GET, POST, PUT} from '@/utils/const'

//分页查询家长信息
export async function queryFamilyListMes (data) {
  return request('/auth/web/v1/familyMes/queryFamilyListMes', { data, method: POST,contentType: 'application/json' })
}

//获取家长详情信息
export async function queryFamilyDetailsMes (data) {
  return request('/auth/web/v1/familyMes/queryFamilyDetailsMes', { data, method: POST,contentType: 'application/x-www-form-urlencoded' })
}

//字典接口
export async function getDictItems (data) {
  return request('/auth/system/v1/common/getDictItems', { data, method: GET })
}

// 加载地域树（籍贯下拉框）
export async function getNativeTree(data) {
  return request('/auth/system/v1/common/getNativeTree', { data, method: GET });
}

//批量加载多个字典组
export async function batchLoadDictGroups (data) {
  return request('/auth/system/v1/common/batchLoadDictGroups', { data, method: GET })
}

//批量导入学生家长信息
export async function importFamilyMes (data) {
  return request('/auth/web/v1/familyMes/importFamilyMes', { data, method: POST,contentType: 'multipart/form-data' })
}

//统计班级家长人数
export async function countParentNum (data) {
  return request('/auth/web/v1/familyMes/countParentNum', { data, method: GET })
}

// 一键督促完善信息
export async function getTeacherDoUrges(data) {
  return request('/auth/web/v1/datacenter/teacher/doUrge', { data, method: POST,contentType: 'application/x-www-form-urlencoded'});
}

// 主页面人数统计
// export async function getStatTeachers(data) {
//   return request('/auth/web/v1/datacenter/teacher/statTeachers', { data, method: GET });
// }

// 新建家长基础信息
export async function addFamilyMes(data) {
  return request('/auth/web/v1/familyMes/addFamilyMes', { data, method: PUT,contentType: 'application/x-www-form-urlencoded' });
}

//查询校级平台或班主任所管理全部家长的班级和年级信息
export async function queryFamilyClassMesAndGradeMes(data) {
  return request('/auth/web/v1/familyMes/queryFamilyClassMesAndGradeMes', { data, method: GET });
}

//获取当前年纪，学籍，班级信息
export async function getGradeStatusClass(data) {
  return request('/auth/web/v1/familyMes/queryDradeCatalogue', { data, method: GET })
}

//查询新建家长关联学生的列表
export async function queryStudentAssocLietMes(data) {
  return request('/auth/web/v1/familyMes/queryStudentAssocLietMes', { data, method: GET })
}

//查询学级，学段，年级，班级
export async function queryTreeCatalogueMes(data) {
  return request('/auth/web/v1/familyMes/queryTreeCatalogue', { data, method: GET })
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

//批量删除家长数据
export async function deleteFamilyMes(data) {
	return newRequest('/auth/web/v1/familyMes/deleteFamilyMes', { data, method: POST })
}

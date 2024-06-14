/*
Author:石海贵
Description:资助管理
Date:2023/10/16
*/
import newRequest from "@/utils/newRequest";
import requestUpload from "@/utils/requestUpload"; //上传接口
import { GET, POST,DELETE } from "@/utils/const";






// 获取年级班级目录
export async function postqueryCatalog(data) {
	return newRequest('/auth/web/v1/studentSupport/queryCatalog', { data, method: GET, })
}
// 批量加载多个字典组
export async function getBatchLoadDictGroups(data) {
	return newRequest('/auth/system/v1/common/batchLoadDictGroups', { data, method: GET });
}
// 查询资助信息
export async function postQuerySupportStudentMes(data) {
	return newRequest('/auth/web/v1/studentSupport/querySupportStudentMes', { data, method: POST,contentType: 'application/json' })
}
// 查询学生信息
export async function getquerystudentMes(data) {
	return newRequest('/auth/web/v1/studentSupport/querystudentMes', { data, method: GET, })
}
// 新增添加资助信息
export async function postAddSupportStudentMes(data) {
	return newRequest('/auth/web/v1/studentSupport/addSupportStudentMes', { data, method: POST,contentType: 'application/json' })
}
// 修改受阻学生信息
export async function postupdateSupportMes(data) {
	return newRequest('/auth/web/v1/studentSupport/updateSupportMes', { data, method: POST,contentType: 'application/json' })
}
// 删除资助学生信息
export async function DeletedeleteSupportMes(data) {
	return newRequest('/auth/web/v1/studentSupport/deleteSupportMes', { data, method: DELETE, })
}
// 批量导入资助信息
export async function postimportSupportMes(data) {
	return newRequest('/auth/web/v1/studentSupport/importSupportMes', { data, method: POST,ContentType:'multipart/form-data' })
}
// 批量导出资助信息
export async function postexportSupport(data) {
	return newRequest('/auth/web/v1/studentSupport/exportSupport', { data, method: POST,ContentType:'application/json' })
}
// 下载批量导入模板
export async function getexportSupport(data) {
	return newRequest('/auth/web/v1//auth/web/v1/studentSupport/downloadStuAndFamilyMesTemple/exportSupport', { data, method: GET, })
}
// 统计资助信息
export async function poststatisticsSupportMes(data) {
	return newRequest('/auth/web/v1/studentSupport/statisticsSupportMes', { data, method: POST, })
}


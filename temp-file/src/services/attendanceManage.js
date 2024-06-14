/*
Author:韦靠谱
Description:考勤管理
Date:2023/09/18
*/
import newRequest from "@/utils/newRequest";
import requestUpload from "@/utils/requestUpload"; //上传接口
import { GET, POST } from "@/utils/const";

// 查看所有课节
export async function getFindAllSection(data) {
	return newRequest('/auth/web/v1/attendance/record/findAllSection', { data, method: GET })
}
// 教师记录考勤
export async function postInsertClassAttendanceRecord(data) {
	return newRequest('/auth/web/v1/attendance/record/insertClassAttendanceRecord', { data, method: POST,contentType: 'application/json' })
}
// 查看班级记录详情
export async function postFindDetail(data) {
	return newRequest('/auth/web/v1/attendance/record/findDetail', { data, method: POST, contentType: 'application/json' })
}
// 分页查询历史考勤记录
export async function postPageFindAttendanceRecord(data) {
	return newRequest('/auth/web/v1/attendance/record/pageFindAttendanceRecord', { data, method: POST, contentType: 'application/json' })
}
// 导出历史考勤记录
export async function postExportAttendanceRecord(data) {
	return newRequest('/auth/web/v1/attendance/record/exportAttendanceRecord', { data, method: POST, contentType: 'application/json' })
}
// 班级记录-请假详情
export async function getFindDetailById(data) {
	return newRequest('/auth/web/v1/attendance/record/findDetailById', { data, method: GET })
}
// 获取班级信息
export async function postFindMyClassInfo(data) {
	return newRequest('/auth/web/front/v1/user/findMyClassInfo', { data, method: POST })
}

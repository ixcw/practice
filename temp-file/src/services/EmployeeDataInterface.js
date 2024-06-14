/*
Author:韦靠谱
Description:职工数据
Date:2023/05/014
*/
import request from '@/utils/request';
import newRequest from '@/utils/newRequest'
import requestUpload from '@/utils/requestUpload'; //上传接口
import { GET, POST } from '@/utils/const';

// 上传文件接口
// export async function uploadPictures(data) {
//     return requestUpload('auth/....', { data, method: POST, contentType: 'multipart/form-data' });
// }

// 批量加载多个字典组
export async function getCommonBatchLoadDictGroups(data) {
    return request('/auth/system/v1/common/batchLoadDictGroups', { data, method:GET });
}
// 加载地域树（籍贯下拉框）
export async function getCommonGetNativeTree(data) {
    return request('/auth/system/v1/common/getNativeTree', { data, method:GET });
}
// 获取部门列表
export async function getCommonGetOrgs(data) {
    return request('/auth/system/v1/common/getOrgs', { data, method:GET });
}
// 获取部门职务列表
export async function getCommonGetPosts(data) {
    return request('/auth/system/v1/common/getPosts', { data, method:GET });
}
// 首页人数统计
export async function getWorkerDataCenterStatWorkers(data) {
    return request('/auth/web/front/v1/WorkerDataCenter/statWorkers', { data, method:GET });
}



// 查询职工基础信息
export async function getWorkerDataCenterFindWorkerInfo(data) {
    return request('/auth/web/front/v1/WorkerDataCenter/findWorkerInfo', { data, method:GET });
}
// 查询修改记录
export async function getWorkerDataCenterFindUpdateRecord(data) {
    return request('/auth/web/front/v1/WorkerDataCenter/findUpdateRecord', { data, method:GET });
}
// 查询审核记录
export async function getWorkerDataCenterFindAuditRecord(data) {
    return request('/auth/web/front/v1/WorkerDataCenter/findAuditRecord', { data, method:GET });
}
// 分页查询职工基础信息列表
export async function postWorkerDataCenterFindWorkerList(data) {
    return request('/auth/web/front/v1/WorkerDataCenter/findWorkerList', { data, method:POST });
}
// 新增/修改职工数据
export async function postWorkerDataCenterInsertOrUpdateWorker(data) {
    return request('/auth/web/front/v1/WorkerDataCenter/insertOrUpdateWorker', { data, method:POST,contentType: 'application/json' });
}
// excel批量导入职工数据
export async function postWorkerDataCenterImportExcel(data) {
    return request('/auth/web/front/v1/WorkerDataCenter/importExcel', { data, method:POST});
}
// 批量导出职工信息excel
export async function postWorkerDataCenterExportWorkerBath(data) {
    return request('/auth/web/front/v1/WorkerDataCenter/exportWorkerBath', { data, method:POST,contentType: 'application/json'});
}
// 审核职工信息--------驳回
export async function postWorkerDataCenterAuditWorkerInfo(data) {
    return request('/auth/web/front/v1/WorkerDataCenter/auditWorkerInfo', { data, method:POST });
}
// 审核职工信息--------通过
export async function postWorkerDataCenterAuditWorkerInfoPass(data) {
    return request('/auth/web/front/v1/WorkerDataCenter/auditWorkerInfo', { data, method:POST,});
}
// 新增/修改变动记录
export async function postWorkerDataCenterInsertOrUpdatePostChange(data) {
    return request('/auth/web/front/v1/WorkerDataCenter/insertOrUpdatePostChange', { data, method:POST });
}
// 查询变动记录
export async function getWorkerDataCenterFindPostChangeModify(data) {
    return request('/auth/web/front/v1/WorkerDataCenter/findPostChangeModify', { data, method:GET });
}
// 一键督促完善
export async function getWorkerDataCenterUrgePerfect(data) {
    return request('/auth/web/front/v1/WorkerDataCenter/urgePerfect', { data, method:GET });
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
***批量删除职工数据***
* @param data
* @return {*}
*/
export async function bathDeleteByIdCards(data) {
	return newRequest('/auth/web/front/v1/WorkerDataCenter/bathDeleteByIdCards', { data, method: POST })
}
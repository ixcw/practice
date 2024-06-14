import request from '@/utils/request';
import requestUpload from '@/utils/requestUpload';

import { GET, POST } from '@/utils/const';


/**
 * 查询学校通知列表
 * @param data
 * @returns {Promise<unknown>}
 */
export async function schoolMessage(data) {
    return request('/auth/web/v1/schoolMessage/list', { data, method: POST });
}
/**
 * 新建/修改通知
 * @param data
 * @returns {Promise<unknown>}
 */
export async function schoolMessageSave(data) {
    return request('/auth/web/v1/schoolMessage/save', { data, method: POST });
}

/**
* 查看学校通知详情
* @param data
* @returns {Promise<unknown>}
*/
export async function checkSchoolMessage(data) {
    return request('/auth/web/v1/schoolMessage/detail', { data, method: POST });
}
/**
* 上传图片
* @param data
* @returns {Promise<unknown>}
*/
export async function uploadPictures(data) {
    return requestUpload('auth/api/v1/user/uploadPictures', { data, method: POST, contentType: 'multipart/form-data' });
}
/**
* 上传文件
* @param data
* @returns {Promise<unknown>}
*/
export async function uploadFile(data) {
    return requestUpload('/auth/web/v1/index/uploadFile', { data, method: POST, contentType: 'multipart/form-data' });
}

/**
* 发送通知
* @param data
* @returns {Promise<unknown>}
*/
export async function sendSchoolMessage(data) {
    return request('/auth/web/v1/schoolMessage/push', { data, method: POST });
}

/**
* 兴建并发送通知
* @param data
* @returns {Promise<unknown>}
*/
export async function saveAndPushMessage(data) {
    return request('/auth/web/v1/schoolMessage/saveAndPush', { data, method: POST });
}

/**
* 删除通知
* @param data
* @returns {Promise<unknown>}
*/
export async function deleteMessage(data) {
    return request('/auth/web/v1/schoolMessage/delete', { data, method: POST });
}

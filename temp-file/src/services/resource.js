import request from '@/utils/request';
import { GET} from '@/utils/const';


/**
 * 获取资源上传token
 * @param data
 * @returns {Promise<unknown>}
 */
export async function getUploadToken(data) {
  return request('/auth/api/v1/resource/uploadToken', { data, method: GET });
}

/**
 * 获取视频vod上传token
 * @param data
 * @returns {Promise<unknown>}
 */
export async function getVideoUploadToken() {
  return request('/auth/api/v1/resource/video/uploadToken', { method: GET });
}

/**
 *@Author:xiongwei
 *@Description:
 *@Date:Created in  2020/9/15
 *@Modified By:
 */


import request from "@/utils/request";
import {GET,POST} from "@/utils/const";

//----------------订阅及批改--------------

/**
 * 获取单个视频详细信息
 * @param data
 * @returns {Promise<*>}
 */
export async function findQuestionVideoById(data) {
  return request('/auth/web/front/v1/index/findQuestionVideoById', { data, method: POST });
}
/**
 * 根据视频id获取题目id查询相关视频
 * @param data
 * @returns {Promise<*>}
 */
export async function findQuestionVideoByQuestionId(data) {
    return request('/auth/web/front/v1/index/findQuestionVideoByQuestionId', { data, method: POST });
  }
/**
 * 获取单个视频信息(包含课程及题目微课)
 * @param data
 * @returns {Promise<*>}
 */
export async function findVideoById(data) {
  return request('/auth/web/front/v1/video/findVideoById', { data, method: GET });
}

/**
 *  根据视频id获取题目id查询相关视频
 * @param data
 * @returns {Promise<*>}
 */
export async function findRelatedCourseById(data) {
  return request('/auth/web/front/v1/index/findRelatedCourseById', { data, method: POST });
}

/**
 *  根据视频id获取播放量
 * @param data
 * @returns {Promise<*>}
 */
export async function updateVideoNumById(data) {
  return request('/auth/web/front/v1/video/updateVideoNumById', { data, method: GET });
}

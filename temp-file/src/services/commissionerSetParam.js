/**
 * 题库专家四要素设参
 * @author:张江
 * @date:2020年11月26日
 * @version:v1.0.0
 * */

import request from '@/utils/request';
import { GET, POST } from '@/utils/const';

/**
***查询分配的知识点列表***
* @param data
* @return {Promise<any>}
*/
export async function getExpertUserJobKnowList(data) {
  return request('/auth/web/front/v1/question/findExpertUserJobKnowList', { data, method: POST });
}

/**
***统计设参总量***
* @param data
* @return {Promise<any>}
*/
export async function countUserKnowJob(data) {
  return request('/auth/web/front/v1/question/countUserKnowJob', { data, method: POST });
}

/**
***统计任务下上传微课总量***
* @param data
* @return {Promise<any>}
*/
export async function countUserKnowJobVideo(data) {
  return request('/auth/web/front/v1/question/countUserKnowJobVideo', { data, method: POST });
}

/**
* 设参题目列表
* @param data
* @return {Promise<any>}
*/
export async function getUserKnowJobQuestionList(data) {
  return request('/auth/web/front/v1/question/findUserKnowJobQuestionList', { data, method: POST });
}

/**
* 查询题目详细信息-带微课
* @param data
* @return {Promise<any>}
*/
export async function getQuestionDetailAndSmallClass(data) {
  return request('/auth/web/front/v1/question/findQuestionDetailAndSmallClass', { data, method: POST });
}

/**
* 修改视频名称
* @param data
* @return {Promise<any>}
*/
export async function updateSmallClassName(data) {
  return request('/auth/web/front/v1/question/updateSmallClassName', { data, method: POST });
}
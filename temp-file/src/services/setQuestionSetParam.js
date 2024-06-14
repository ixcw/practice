/**
 * 套题设参
 * @author:张江
 * @date:2021年02月06日
 * @version:v1.0.0
 * */

import request from '@/utils/request';
import {GET, POST} from '@/utils/const';

/**
 * 根据条件查询套卷内所有题目
 * @param data
 * @return {Promise<any>}
 */
export async function getExamPaperQuestionListByPaperId(data) {
  return request('/auth/web/front/v1/question/findExamPaperQuestionListByPaperId', {data, method: POST});
}

/**
 ***根据条件查询所有的套题***
 * @param data
 * @return {Promise<any>}
 */
export async function getExamPaperBySubjectId(data) {
  return request('/auth/web/front/v1/question/findExamPaperBySubjectId', {data, method: POST});
}

/**
 ***根据id修改套卷状态（确实完成设参）***
 * @param data
 * @return {Promise<any>}
 */
export async function determineExamPaperQuestion(data) {
  return request('/auth/web/front/v1/question/determineExamPaperQuestion', {data, method: POST});
}


/**
 ***添加错题纠错记录***
 * @param data
 * @return {Promise<any>}
 */
export async function addErrorQuestionInfo(data) {
  return request('/auth/web/v1/questionMonitor/addErrorQuestionInfo', {data, method: POST});
}

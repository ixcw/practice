/**
 * 题库管理服务
 * @author:张江
 * @date:2019年11月23日
 * @version:v1.0.0
 * */

import request from '@/utils/request';
import requestUpload from '@/utils/requestUpload';
import { GET, POST } from '@/utils/const';


/** 
***查询导题任务***
* @param data
* @return {Promise<any>}
*/
export async function getWorkList(data) {
  return request('/auth/web/v1/importQuestion/findWorkInfo', { data, method: POST });
}

/**
*** 获取年级信息 ***
* @param data
* @return {Promise<any>}
*/
export async function getGradeList(data) {
  return request('/auth/web/v1/importQuestion/getGradeInfo', { data, method: GET });
}

/**
*** 获取科目信息 ***
* @param data
* @return {Promise<any>}
*/
export async function getSubjectList(data) {
  return request('/auth/web/v1/importQuestion/getSubjectInfo', { data, method: GET });
}

/** 
*** 查询最高级知识点 ***
* @param data
* @return {Promise<any>}
*/
export async function getHighestKnowledge(data) {
  return request('/auth/web/v1/importQuestion/findHighestKnowledge', { data, method: POST });
}

/** 
*** 获取题型信息 ***
* @param data
* @return {Promise<any>}
*/
export async function getCategoryList(data) {
  return request('/auth/web/v1/importQuestion/getCategoryInfo', { data, method: GET });
}

/**
* 定版
* @param data
* @return {Promise<any>}
*/
export async function fixedEdition(data) {
  return request('/auth/web/v1/importQuestion/hasRole/fixedEdition', { data, method: POST });
}

/**
* 根据任务查询该任务下的题目信息
* @param data
* @return {Promise<any>}
*/
export async function getQuestionListByWork(data) {
  return request('/auth/web/v1/importQuestion/findQuestionInfoByWork', { data, method: POST });
}

/** 
* 修改导入任务参数 
* @param data
* @return {Promise<any>}
*/
export async function updateWorkParam(data) {
  return request('/auth/web/v1/importQuestion/updateWorkParam', { data, method: POST });
}

/**
 * 导入word 解析题目信息
 * @param data
 * @return {Promise<any>}
 */
export async function importQuestionBank(data) {
  return requestUpload('/auth/web/v1/importQuestion/importQuestionBank', { data, method: POST })
}

/**
 * 根据大知识点id查询旗下知识点信息
 * @param data
 * @return {Promise<any>}
 */
export async function getKnowledgeDetailsByPid(data) {
  return request('/auth/web/v1/importQuestion/findKnowledgeDetailsByPid', { data, method: POST })
}

/**
 * 修改题目知识点属性
 * @param data
 * @return {Promise<any>}
 */
export async function updateQuestionKnowle(data) {
  return request('/auth/web/v1/importQuestion/updateQuestionKnowle', { data, method: POST })
}

/**
 * 修改题目难度
 * @param data
 * @return {Promise<any>}
 */
export async function updateQuestionDifficulty(data) {
  return request('/auth/web/v1/importQuestion/updateQuestionDifficulty', { data, method: POST })
}

/**
 * 完成任务
 * @param data
 * @return {Promise<any>}
 */
export async function completeJob(data) {
  return request('/auth/web/v1/importQuestion/completeJob', { data, method: POST })
}

/**
 * 修改题目信息
 * @param data
 * @return {Promise<any>}
 */
export async function updateQuestionInfo(data) {
  return request('/auth/web/v1/importQuestion/updateQuestionInfo', { data, method: POST })
}


/** ********************************************************* 题库管理审核 start author:张江 date:2019年12月17日 *************************************************************************/

/**
 * 获取题目错误类信息
 * @param data
 * @return {Promise<any>}
 */
export async function getQuestionErrorMessage(data) {
  return request('/auth/web/v1/importQuestion/getQuestionErrorMessage', { data, method: GET })
}

/**
 * 驳回 ：添加错误试题信息
 * @param data
 * @return {Promise<any>}
 */
export async function addErrorQuestion(data) {
  return request('/auth/web/v1/importQuestion/hasRole/addErrorQuestion', { data, method: POST })
}

/**
 * 查询驳回错题信息
 * @param data
 * @return {Promise<any>}
 */
export async function getErrorQuestion(data) {
  return request('/auth/web/v1/importQuestion/findErrorQuestion', { data, method: POST })
}

/**
 * 确认驳回错题信息 修改完毕
 * @param data
 * @return {Promise<any>}
 */
export async function updateErrorQuestionStatus(data) {
  return request('/auth/web/v1/importQuestion/updateErrorQuestionStatus', { data, method: POST })
}

/**
 * 取消驳回
 * @param data
 * @return {Promise<any>}
 */
export async function cancelQuestionErro(data) {
  return request('/auth/web/v1/importQuestion/hasRole/cancelQuestionErro', { data, method: POST })
}

/**
 * 标记通过
 * @param data
 * @return {Promise<any>}
 */
export async function passQuestion(data) {
  return request('/auth/web/v1/importQuestion/hasRole/passQuestion', { data, method: POST })
}

/**
 * 再次驳回
 * @param data
 * @return {Promise<any>}
 */
export async function noPassQuestion(data) {
  return request('/auth/web/v1/importQuestion/hasRole/noPassQuestion', { data, method: POST })
}

/** ********************************************************* 题库管理审核 end author:张江 date:2019年12月18日 *************************************************************************/


/**
 * 修改题目的图片信息
 * @param data
 * @return {Promise<any>}
 */
export async function updateQuestionImg(data) {
  return requestUpload('/auth/web/v1/importQuestion/updateQuestionImg', { data, method: POST })
}


/** ********************************************************* 版本题库管理 start author:张江 date:2020年08月11日 *************************************************************************/

/**
 * 获取版本信息
 * @param data
 * @return {Promise<any>}
 */
export async function getTextbookVersion(data) {
  return request('/auth/web/v1/importQuestion/findTextbookVersion', { data, method: POST })
}


/**
 * 获取版本知识点信息
 * @param data
 * @return {Promise<any>}
 */
export async function getVersionKnowledgePoints(data) {
  return request('/auth/web/v1/importQuestion/findVersionKnowledgePoints', { data, method: POST })
}


/** ********************************************************* 版本题库管理 end author:张江 date:2020年08月11日 *************************************************************************/


/** ********************************************************* 题库管理 核心素养 关键能力 认知层次 start author:张江 date:2020年09月05日 *************************************************************************/


/**
 * 根据科目筛选关键能力
 * @param data
 * @return {Promise<any>}
 */
export async function getQuestionAbilityList(data) {
  return request('/auth/web/front/v1/question/getQuestionAbility', { data, method: POST })
}


/**
 * 根据科目筛选核心素养
 * @param data
 * @return {Promise<any>}
 */
export async function getQuestionCompetenceList(data) {
  return request('/auth/web/front/v1/question/getQuestionCompetence', { data, method: POST })
}


/**
 * 根据科目筛选认知层次
 * @param data
 * @return {Promise<any>}
 */
export async function getCognitionLevelList(data) {
  return request('/auth/web/front/v1/question/getCognitionLevel', { data, method: POST })
}


/** ********************************************************* 题库管理 核心素养 关键能力 认知层次 end author:张江 date:2020年09月05日 *************************************************************************/




/** ********************************************************* 题库-修改题目图片 start author:张江 date:2020年11月11日 *************************************************************************/

/**
 * 修改题目信息前查询题目信息
 * @param data
 * @return {Promise<any>}
 */
export async function getQuestionAllInfoById(data) {
  return request('/auth/web/v1/importQuestion/findQuestionAllInfoById', { data, method: POST })
}


/**
 * 根据id修改题目图片，包括（题材、题干、选项/小题、答案、解析）
 * @param data
 * @return {Promise<any>}
 */
export async function updateQuestionAllImgById(data) {
  return request('/auth/web/v1/importQuestion/updateQuestionAllImgById', { data, method: POST, contentType: 'application/json' })
}

/**
 * 修改题目的图片信息（上传或者更新）
 * @param data
 * @return {Promise<any>}
 */
export async function uploadQuestionImg(data) {
  return requestUpload('/auth/web/v1/importQuestion/uploadQuestionImg', { data, method: POST })
}


/**
 * 根据文件名称删除七牛云服务器文件
 * @param data
 * @return {Promise<any>}
 */
export async function deleteQiNiuImgByFileName(data) {
  return request('/auth/web/v1/importQuestion/deleteQiNiuImgByFileName', { data, method: POST })
}

/** ********************************************************* 题库-修改题目图片 end author:张江 date:2020年11月11日 *************************************************************************/

/** ********************************************************* 数据入库-修改分数 start author:张江 date:2021年05月07日 *************************************************************************/

/**
 * 修改题目分数
 * @param data
 * @return {Promise<any>}
 */
export async function updateQuestionScore(data) {
  return request('/auth/web/v1/importQuestion/updateQuestionScore', { data, method: POST })
}

/** ********************************************************* 数据入库-修改分数 end author:张江 date:2021年05月07日 *************************************************************************/


/** ********************************************************* 题库管理 知识维度查询 start author:张江 date:2022年05月20日 *************************************************************************/

/**
 * 知识维度查询
 * @param data
 * @return {Promise<any>}
 */
export async function getKnowledgeDimension(data) {
  return request('/auth/web/front/v1/dKnowledgDimension/getKnowledgeDimension', { data, method: GET })
}

/** ********************************************************* 题库管理 知识维度查询 end author:张江 date:2022年05月20日 *************************************************************************/

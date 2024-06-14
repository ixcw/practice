/**
* 我的组题服务
* @author:张江
* @date:2020年08月29日
* @version:v1.0.0
* */
import request from "@/utils/request";
import requestUpload from '@/utils/requestUpload';
import {POST,GET} from "@/utils/const";

/**
 * 获取组卷记录
 * @param data
 * @returns {Promise<unknown>}
 */
export async function getHistory(data) {
  return request('/auth/web/v1/groupTopic/getMineQuestionGroup', {data, method: POST})
}

/**
 * 重新编辑试卷
 * @param data
 * @returns {Promise<unknown>}
 */
export async function editPaper(data) {
  return request('/auth/web/v1/groupTopic/editMineQuestionGroup', {data, method: POST})
}


/**
 * 通过题组id获取题目列表
 * @param data
 * @returns {Promise<unknown>}
 */
export async function getQuetionInfoByPaperId(data) {
  return request('/auth/web/v1/lattice/findQuetionInfoByPaperId', { data, method: POST })
}

/**
 * 通过题组id获取题目批阅信息
 * @param data
 * @returns {Promise<unknown>}
 */
export async function getInstructionPaperPreview(data) {
  return request(`/v1/df/web/instruction/paperPreview/${data.paperId}`, { data, method: POST })
}



/**
 * 导入试卷的pdf版 或者答题卡
 * @param data
 * @returns {Promise<unknown>}
 */
export async function importPdfFile(data) {
  return requestUpload('/auth/web/v1/lattice/importFile', { data, method: POST })
}

/**
 * 获取校本题库记录
 * @param data
 * @returns {Promise<unknown>}
 */
export async function getQuestionLists(data) {
  return request('/auth/web/v1/groupTopic/getQuestionLists', { data, method: POST })
}

/**
 * 开始铺设
 * @param data 请求参数
 * @returns {*}
 */
export function newLatticeMake(data) {
  return request('/auth/web/v1/pumaPaper/puma', { data, method: POST, contentType: 'application/json' })
}


/**
 * 保存单个区域参数
 * @param data
 * @returns {Promise<unknown>}
 */
export async function saveSingleDataAreaParams(data) {
  return request('/auth/web/v1/pumaPaper/saveSingleDataAreaParams', { data, method: POST, contentType: 'application/json' })
}


// 调用渲染服务的接口-桌面端下载导出pdf 2021年10月12日 张江 start
/**
 * 桌面端下载导出pdf
 * @param data
 * @returns {Promise<unknown>}
 */
export async function downloadExportPDF(data) {
  return request('/renderserver/qGroupRender/questions2pdfOut', { data, method: GET })
}
// 调用渲染服务的接口-桌面端下载导出pdf 2021年10月12日 张江 end

// 首页加入我的题组 2022年01月25日 张江 start
/**
 * 首页试卷添加到我的题组
 * @param data
 * @returns {Promise<unknown>}
 */
export async function addPaperToQuestionGroup(data) {
  return request('/auth/web/front/v1/login/addPaperToQuestionGroup', { data, method: POST })
}
// 首页加入我的题组 2022年01月25日 张江 end
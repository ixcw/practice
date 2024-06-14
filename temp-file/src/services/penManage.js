/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2021/6/18
 *@Modified By:
 */
import request from '@/utils/request';
import {GET, POST} from '@/utils/const';
import requestUpload from '@/utils/requestUpload'

/**
 ***单个新增修改点阵笔信息**
 * @param data
 * @return {Promise<any>}
 */
export async function insertOrUpdatePenInformation(data) {
  return request('/auth/web/v1/LatticePen/insertOrUpdatePenInformation', {data, method: POST});
}

/**
 ***点阵笔信息列表查询**
 * @param data
 * @return {Promise<any>}
 */
export async function findPenList(data) {
  return request('/auth/web/v1/LatticePen/findPenList', {data, method: GET});
}


/**
 ***根据Id逻辑删除笔信息**
 * @param data
 * @return {Promise<any>}
 */
export async function deletePenInformationById(data) {
  return request('/auth/web/v1/LatticePen/deletePenInformationById', {data, method: GET});
}


/**
 ***批量导入点阵笔信息**
 * @param data
 * @return {Promise<any>}
 */
export async function batchPenInformation(data) {
  return requestUpload('/auth/web/v1/LatticePen/batchPenInformation', {data, method: POST});
}



/**
 ***下载通用答题卡**
 * @param data
 * @return {Promise<any>}
 */
export async function getConnectionCard(data) {
  return request('/auth/web/v1/desktop/getConnectionCard', {data, method: POST});
}

/**
 ***教室列表查询**
 * @param data
 * @return {Promise<any>}
 */
export async function findRoomInfo(data) {
  return request('/auth/web/v1/LatticePen/findRoomInfo', {data, method: GET});
}


/**
 ***新增/修改教室信息**
 * @param data
 * @return {Promise<any>}
 */
export async function insertOrUpdateRoomInfo(data) {
  return request('/auth/web/v1/LatticePen/insertOrUpdateRoomInfo', {data, method: POST});
}

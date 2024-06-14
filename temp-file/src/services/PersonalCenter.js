/**
 * 个人中心
 * @author:熊伟
 * @date:2019年9月2日
 * @version:v1.0.0
 * */

import request from '@/utils/request';
import { GET, POST } from '@/utils/const';
/**
***获取班级列表***
* @param data
* @return {Promise<any>}
*/
export async function findMyClassInfo(data) {
    return request('/auth/web/front/v1/user/findMyClassInfo', { data, method: POST });
  }
/**
***加入班级***
* @param data
* @return {Promise<any>}
*/
export async function userAddClassInfo(data) {
  return request('/auth/web/front/v1/user/userAddClassInfo', { data, method: POST });
}
/**
***修改用户信息***
* @param data
* @return {Promise<any>}
*/
export async function updateUserInfo(data) {
  return request('/auth/api/v1/user/updateUserInfo', { data, method: POST });
}
/**
***获取电子邮件验证码***
* @param data
* @return {Promise<any>}
*/
export async function getSendEmail(data) {
  return request('/auth/web/front/v1/user/getSendEmail', { data, method: POST });
}
/**
***用户绑定电子邮箱***
* @param data
* @return {Promise<any>}
*/
export async function userBindEmail(data) {
  return request('/auth/web/front/v1/user/userBindEmail', { data, method: POST });
}
/**
***更换账号***
* @param data
* @return {Promise<any>}
*/
export async function updateUserAccount(data) {
  return request('/auth/api/v1/user/updateUserAccount', { data, method: POST });
}
/**
***验证邮箱并且修改登录密码***
* @param data
* @return {Promise<any>}
*/
export async function userCheckEmailUpdatePwd(data) {
  return request('/auth/web/front/v1/user/userCheckEmailUpdatePwd', { data, method: POST });
}
/**
***用户题目收藏列表***
* @param data
* @return {Promise<any>}
*/
export async function findUserPaperCollect(data) {
  return request('/auth/web/front/v1/user/findUserPaperCollect', { data, method: POST });
}

/**
 ***添加或取消收藏***
 * @param data
 * @return {Promise<any>}
 */
export async function collect(data) {
  return request('/auth/api/v1/userCollection/collect', { data, method: POST });
}

/**
 ***添加收藏***
 * @param data
 * @return {Promise<any>}
 */
export async function addCollection(data) {
  return request('/auth/api/v1/userCollection/add', { data, method: POST });
}

/**
 ***取消收藏***
 * @param data
 * @return {Promise<any>}
 */
export async function removeCollection(data) {
  return request('/auth/api/v1/userCollection/remove', { data, method: POST });
}

/**
 ***分页查询已收藏微课列表***
 * @param data
 * @return {Promise<any>}
 */
export async function pageListQuestionVideo(data) {
  return request('/auth/api/v1/userCollection/pageListQuestionVideo', { data, method: POST });
}


/**
 ***分页查询已收藏试卷列表***
 * @param data
 * @return {Promise<any>}
 */
export async function pageListPaper(data) {
  return request('/auth/api/v1/userCollection/pageListPaper', { data, method: POST });
}

/**
 ***分页查询已收藏题目列表***
 * @param data
 * @return {Promise<any>}
 */
export async function pageListQuestion(data) {
  return request('/auth/api/v1/userCollection/pageListQuestion', { data, method: POST });
}


/**
***用户获取自己的微课***
* @param data
* @return {Promise<any>}
*/
export async function findMyQuestionVideo(data) {
  return request('/auth/web/front/v1/user/findMyQuestionVideo', { data, method: POST });
}
/**
 * 将题目添加到组题板
 * @param data
 * @returns {Promise<unknown>}
 */
export async function saveOptionQuestion(data) {
  return request('/auth/web/v1/groupTopic/saveOptionQuestion', {method: POST, data})
}

/**
 * 邀请好友的收益
 * @param data
 * @returns {Promise<unknown>}
 */
export async function getRevenues(data) {
  return request('/auth/web/front/v1/user/getRevenues', {method: POST, data})
}

/**
 * 个人分销月报
 * @param data
 * @returns {Promise<unknown>}
 */
export async function getOrderByInviteCode(data) {
  return request('/auth/web/front/v1/user/getOrderByInviteCode', {method: POST, data})
}


/**
 * 获取分享图片地址
 * @param data
 * @returns {Promise<unknown>}
 */
export async function genInvitePoster(data) {
  return request('/auth/api/v1/user/genInvitePoster', {method: POST, data})
}
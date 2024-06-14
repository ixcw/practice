/**
 * 支付中心服务
 * @author:张江
 * @date:2021年01月22日
 * @version:v1.0.0
 * */

import request from '@/utils/request';
import { GET, POST } from '@/utils/const';


/**
***会员中心获取学段列表***
* @param data
* @return {Promise<any>}
*/
export async function getStudyListInGoods(data) {
  return request('/auth/api/v1/user/study', { data, method: GET });
}


/**
***会员中心获取会员商品的列表***
* @param data
* @return {Promise<any>}
*/
export async function getGoodsList(data) {
  return request('/auth/pay/v1/goods/study/goods', { data, method: POST });
}


/**
***微信预支付***
* @param data
* @return {Promise<any>}
*/
export async function weixinPaySign(data) {
  return request('/auth/pay/v1/weChat/pc/weChatPay', { data, method: POST });
}

/**
***微信支付查单接口,同步订单状态***
* @param data
* @return {Promise<any>}
*/
export async function getOrderInfoStatus(data) {
  return request('/auth/pay/v1/weChat/findOrderInfo', { data, method: POST });
}

/**
***支付宝预支付***
* @param data
* @return {Promise<any>}
*/
export async function aliPaySign(data) {
  return request('/auth/pay/v1/alipay/pcAliPaySign', { data, method: POST });
}

/**
 ***支付宝预支付***
 * @param data
 * @return {Promise<any>}
 */
export async function isBuyGoods(data) {
  return request('/auth/pay/v1/goods/info/isBuy', { data, method: POST });
}

/**
 ***我的会员***
 * @param data
 * @return {Promise<any>}
 */
export async function getUserMemberInfo(data) {
  return request('/auth/web/front/v1/user/findUserMemberInfo', { data, method: GET });
}


/**
 ***获取订单状态***
 * @param data
 * @return {Promise<any>}
 */
export async function getOrderStatus(data) {
  return request('/auth/web/v1/order/status', { data, method: GET });
}

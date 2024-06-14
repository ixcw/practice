/**
* 自动组题服务
* @author:张江
* @date:2020年08月29日
* @version:v1.0.0
* */
import request from "@/utils/request";
import {POST} from "@/utils/const";

/**
 * 自动组题操作（就是分数和题型以及题数确定后，后台根据算法将题放到试题板的接口）
 * @param data
 * @returns {Promise<void>}
 */
export async function genAutomaticQuestion(data) {
  return request('/auth/web/v1/automaticQuestion/genAutomaticQuestion', {data, method: POST,contentType:'application/json'})
}

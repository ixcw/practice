/**
 * 微课列表
 * @author:熊伟
 * @date:2021年11月11日
 * @version:v1.0.0
 * */

import request from '@/utils/request';
import { GET, POST } from '@/utils/const';
/**
*** 我的相关课程***
* @param data
* @return {Promise<any>}
*/
export async function findRelatedCourse(data) {
    return request('/auth/web/front/v1/index/findRelatedCourse ', { data, method: POST });
  }
/**
*** 获取科目(根据当前班级获取科目)***
* @param data
* @return {Promise<any>}
*/
export async function getSubjectList(data) {
    return request('/auth/web/front/v1/user/getSubjectList ', { data, method: POST });
  }
     
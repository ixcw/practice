/**
 * 代理明细
 * @author:熊伟
 * @date:2021年07月8日
 * @version:v1.0.0
 * */

import request from '@/utils/request';
import { GET, POST } from '@/utils/const';


/**
***统计代理商总数、学校总数、总代理费和平台总收入***
* @param data
* @return {Promise<any>}
*/
export async function countNumber(data) {
  return request('/auth/web/v1/agentUserInfos/countNumber', { data, method: GET});
}
/**
***代理商查询(代理明细)***
* @param data
* @return {Promise<any>}
*/
export async function findAgentUser(data) {
    return request('/auth/web/v1/agentUserInfos/findAgentUser', { data, method: GET});
  }
/**
***  区县代理***
* @param data
* @return {Promise<any>}
*/
export async function findAgentUserByParentId(data) {
    return request('/auth/web/v1/agentUserInfos/findAgentUserByParentId', { data, method: GET});
  }
/**
***  推荐代理***
* @param data
* @return {Promise<any>}
*/
export async function findAgentUserByInviteCode(data) {
  return request('/auth/web/v1/agentUserInfos/findAgentUserByInviteCode', { data, method: GET});
}
 /**
***  代理的学校或机构***
* @param data
* @return {Promise<any>}
*/
export async function findSchoolByCityId(data) {
  return request('/auth/web/v1/agentUserInfos/findSchoolByCityId', { data, method: GET});
} 

//----------------------------------------------------修改后接口--------------------------------------------

 /**
***  代理明细统计***
* @param data
* @return {Promise<any>}
*/
export async function agentStatistics(data) {
  return request('/auth/web/v1/agentUserInfos/agentStatistics', { data, method: POST});
} 

 /**
***  直接用户列表***
* @param data
* @return {Promise<any>}
*/
export async function directUserList(data) {
  return request('/auth/web/v1/agentUserInfos/directUserList', { data, method: POST});
}

 /**
***  二级代理列表***
* @param data
* @return {Promise<any>}
*/
export async function agentUsersByParentId(data) {
  return request('/auth/web/v1/agentUserInfos/agentUsersByParentId', { data, method: POST});
}

 /**
***  学校或机构***
* @param data
* @return {Promise<any>}
*/
export async function schoolByUserIdList(data) {
  return request('/auth/web/v1/agentUserInfos/schoolByUserIdList', { data, method: POST});
}


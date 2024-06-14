/**
 * 权限登录服务
 * @author:张江
 * @date:2019年11月19日
 * @version:v1.0.0
 * */

import request from '@/utils/request';
import { GET, POST } from '@/utils/const';
import isToDesktopCache from "@/caches/isToDesktop";//是否是桌面端记录缓存

/**
***获取验证码***
* @param data
* @return {Promise<any>}
*/
export async function saveRegisterUserInfo(data) {
  return request('/auth/web/front/v1/login/saveRegisterUserInfo', { data, method: POST });
}

/** 
***登录***
* @param data
* @return {Promise<any>}
*/
export async function loginWeb(data) {
  // /auth/web / v1 / login / loginWebUser
  return request('/auth/web/v1/login/loginWebUser', { data, method: POST, contentType: 'application/x-www-form-urlencoded' });
}

/**
***获取验证码***
* @param data
* @return {Promise<any>}
*/
export async function getVerificationCode(data) {
  return request('/auth/api/v1/login/sms/retake', { data, method: POST });
}

/**
***验证码校验***
* @param data
* @return {Promise<any>}
*/
export async function verificationCode(data) {
  return request('/auth/web/front/v1/login/validateCode', { data, method: POST });
}

/**
***保存新密码***
* @param data
* @return {Promise<any>}
*/
export async function setNewPassword(data) {
  return request('/auth/web/front/v1/login/save/newPassword', { data, method: POST });
}
/**
***获取菜单***
* @param data
* @return {Promise<any>}
*/
export async function getMenuList(data) {
  return request('/auth/web/front/v1/login/findTreeMenus', { data, method: POST });
}

/**
***获取按钮***
* @param data
* @return {Promise<any>}
*/
export async function getButtonList(data) {
  return request('/auth/web/front/v1/login/findButton', { data, method: POST });
}

/**
***获取用户信息***
* @param data
* @return {Promise<any>}
*/
export async function getUserInfo(data) {
  const isToDesktop = isToDesktopCache();
  if (isToDesktop){
    window.desktopNewWindow('refreshUserInfo', '');//2021年07月08日 张江 执行桌面端方法 切换班级时刷新桌面端获取用户信息
  }
  return request('/auth/api/v1/user/info', { data, method: GET });
}

/**
***登录行为验证***
* @param data
* @return {Promise<any>}
*/
export async function actionVerify(data) {
  return request('/auth/web/v1/login/actionVerify', { data, method: POST });
}

//2021年08月27日

/**
***完善注册信息***
* @param data
* @return {Promise<any>}
*/
export async function saveStudentGrade(data) {
  return request('/auth/web/front/v1/user/saveStudentGrade', { data, method: POST });
}

/**
***完善注册信息后刷新token***
* @param data
* @return {Promise<any>}
*/
export async function userAccessToken(data) {
  return request('/auth/web/front/v1/user/accessToken', { data, method: POST });
}

/**
***获取角色列表(前台后台通用)***
* @param data
* @return {Promise<any>}
*/
export async function listRoles(data) {
  return request('/auth/api/v1/user/listRoles', { data, method: GET });
}

/**
***切换角色(前台后台通用)***
* @param data
* @return {Promise<any>}
*/
export async function switchRole(data) {
  return request('/auth/api/v1/user/switchRole', { data, method: POST });
}
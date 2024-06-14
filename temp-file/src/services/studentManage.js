/**
 * 学生管理服务
 * @author:张江
 * @date:2020年09月09日
 * @version:v1.0.0
 * */

import request from '@/utils/request';
import requestUpload from '@/utils/requestUpload';
import { GET, POST } from '@/utils/const';


/** 
***查询班级列表***
* @param data
* @return {Promise<any>}
*/
export async function getStudentClassList(data) {
  return request('/auth/web/v1/class/findClassInfoBys', { data, method: POST, contentType: 'application/json' });
}


/** 
***通过班级ID，查找班级下面的学生***
* @param data
* @return {Promise<any>}
*/
export async function getStudentList(data) {
  return request('/auth/web/v1/student/getStudentInfoByClass', { data, method: POST });
}


/** 
***保存/修改一个学生信息***
* @param data
* @return {Promise<any>}
*/
export async function saveStudentInfo(data) {
  return request('/auth/web/v1/student/saveStudentInfos', { data, method: POST, contentType: 'application/json' });
}

/** 
***从班级中剔除学生,这里只删除学生在班级中的信息***
* @param data
* @return {Promise<any>}
*/
export async function deleteClassStudentInfo(data) {
  return request('/auth/web/v1/student/deleteClassStudentInfos', { data, method: POST, contentType: 'application/json' });
}

/** 
***保存班级信息***
* @param data
* @return {Promise<any>}
*/
export async function saveClassInfo(data) {
  return request('/auth/web/v1/class/saveClassInfos', { data, method: POST, contentType: 'application/json' });
}

/**
***批量导入学生***
* @param data
* @return {Promise<any>}
*/
export async function batchImportStudentList(data) {
  return requestUpload('/auth/web/v1/student/batchImportStudents', { data, method: POST })
}

/**
***迁移学生***
* @param data
* @return {Promise<any>}
*/
export async function saveStudentTransferInfo(data) {
  return request('/auth/web/v1/student/saveStudentTransferInfo', { data, method: POST, contentType: 'application/json' })
}


/** ********************************************************* 链接卡 start author:张江 date:2021年09月27日 *************************************************************************/

/**
 * 开始制作连接卡
 * @param data
 * @return {Promise<any>}
 */
export async function generationConnectionCard(data) {
  return request('/auth/web/v1/desktop/generationConnectionCard', { data, method: POST })
}


/**
 * 查询制作的连接卡信息列表
 * @param data
 * @return {Promise<any>}
 */
export async function getConnectionCardList(data) {
  // return request('/auth/web/v1/desktop/findConnectionCard', { data, method: POST })
  return request('/auth/web/v1/desktop/listConnectionCards', { data, method: GET })
}

/** ********************************************************* 链接卡 end author:张江 date:2021年09月27日 *************************************************************************/


/** ********************************************************* 学生分组 start author:xiongwei date:2021年09月24日 *************************************************************************/
/**
 * 查询分组 
 * @param data
 * @return {Promise<any>}
 */
export async function findStudentGroup(data) {
  return request('/auth/web/front/v1/user/findStudentGroup', { data, method: GET })
}


/**
 * 保存学生分组 
 * @param data
 * @return {Promise<any>}
 */
export async function saveStudentsGroup(data) {
  return request('/auth/web/front/v1/user/saveStudentsGroup', { data, method: POST, contentType: 'application/json' })
}
/** ********************************************************* 学生分组 end author:xiongwei date:2021年09月24日 *************************************************************************/
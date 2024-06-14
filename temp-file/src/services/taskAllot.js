/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  12/15/2020
 *@Modified By:
 */
import request from '@/utils/request';
import { GET, POST } from '@/utils/const';

/**
 ***任务分配提交**
 * @param data
 * @return {Promise<any>}
 */
export async function taskAllocation(data) {
  return request('/auth/web/v1/questionExpert/TaskAllocation', { data, method: POST });
}

/**
 ***任务分配知识点和初始化***
 * @param data
 * @return {Promise<any>}
 */
export async function initTaskAllocation(data) {
  return request('/auth/web/v1/questionExpert/initTaskAllocation', { data, method: GET});
}

/**
 ***任务分配列表***
 * @param data
 * @return {Promise<any>}
 */
export async function countTask(data) {
  return request('/auth/web/v1/questionExpert/countTask', { data, method: POST});
}


/**
 ***任务详情***
 * @param data
 * @return {Promise<any>}
 */
export async function getTaskDetail(data) {
  return request('/auth/web/v1/questionExpert/getTaskDetail', { data, method: GET});
}

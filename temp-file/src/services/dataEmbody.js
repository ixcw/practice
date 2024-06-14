/**
 *@Author:ChaiLong
 *@Description:数据人库
 *@Date:Created in  2021/5/12
 *@Modified By:
 */
import request from '@/utils/request';
import requestUpload from '@/utils/requestUpload';
import { GET, POST } from '@/utils/const';


/**
 ***添加考试任务***
 * @param data
 * @return {Promise<any>}
 */
export async function addExamJob(data) {
  return request('/auth/web/v1/importQuestion/addExamJob', { data, method: POST });
}

/**
 ***添加考试任务***
 * @param data
 * @return {Promise<any>}
 */
export async function findMakingSystemData(data) {
  return request('/auth/web/front/v1/making/system/findMakingSystemData', { data, method: POST });
}


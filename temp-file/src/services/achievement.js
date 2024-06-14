/**
 * 学生数据
 * @author:田忆
 * @date:2023年09月21日
 * @version:v1.0.0
 * */

import request from '@/utils/newRequest';
import { GET, POST } from '@/utils/const';

// 成果统计
export async function getAchievementManageStatistics(data) {
  return request('/auth/web/v1/AchievementManage/achievementManageStatistics', { data, method: GET });
}

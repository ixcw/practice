/**
 * 学生数据
 * @author:田忆
 * @date:2023年05月017日
 * @version:v1.0.0
 * */

import { Achievement as namespace } from "../utils/namespace";
import { getAchievementManageStatistics } from "@/services/achievement";

export default {
  //命名
  namespace,
  //状态
  state: {},

  //异步操作
  effects: {
    //成果数据统计
    *achievementManageStatisticsApi({ payload,callback }, { call, put, select }) {
      const response  = yield call(getAchievementManageStatistics, payload);
      callback(response )
    },
  },
  reducers: {

  },
};

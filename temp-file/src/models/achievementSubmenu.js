/**
 * 学生数据
 * @author:田忆
 * @date:2023年05月017日
 * @version:v1.0.0
 * */
import model from "dva-model";
import { AchievementSubmenu as namespace } from "../utils/namespace";
import {
  getAchievementList,
  getGradeId,
  teacherGroup, // 获取教研组
  batchLoadDictGroups, // 查询字典数据
  getParticipantStudentName, // 根据届别查询学生
  getParticipantTeacherName, // 根据组id
  addAchievements, // 添加与修改
  deleteAchievementDetails, // 删除
  achievementDetails, // 详情
  getAchievementShow, // 图列展示
  findAchiTypeAndNum, // 成果数量
} from "@/services/achievementSubmenu";


export default model(
  {
    //命名
    namespace,
    //状态
    state: {
      visible: false, //修改添加弹框的显示状态
      data: null, // 弹框需要的数据
      detailsVisible: false, // 详情弹框
    },

    //异步操作
    effects: {
      //成果数据统计
      *getAchievementListApi({ payload, callback }, { call, put, select }) {
        const response = yield call(getAchievementList, payload);
        callback(response);
      },
      //成果数据统计
      *getGradeIdApi({ payload, callback }, { call, put, select }) {
        const response = yield call(getGradeId, payload);
        callback(response);
      },
    },

    //同步操作
    reducers: {
      showModal(state, action) {
        return {
          ...state,
          visible: true,
          data: action.payload,
        };
      },
      hideModal(state) {
        return {
          ...state,
          visible: false,
          data: null,
        };
      },
      detailsShowModal(state, action) {
        return {
          ...state,
          detailsVisible: true,
          data: action.payload,
        };
      },
      detailsHideModal(state) {
        return {
          ...state,
          detailsVisible: false,
          data: null,
        };
      },
    },
  },
  {
    teacherGroup,
    batchLoadDictGroups,
    getParticipantStudentName, // 根据届别查询学生
    getParticipantTeacherName, // 根据组id，
    addAchievements,
    deleteAchievementDetails,
    achievementDetails,
    getAchievementShow,
    findAchiTypeAndNum,
  }
);

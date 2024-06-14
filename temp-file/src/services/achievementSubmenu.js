/**
 * 学生数据
 * @author:田忆
 * @date:2023年09月21日
 * @version:v1.0.0
 * */

import request from "@/utils/newRequest";
import { GET, POST, DELETE } from "@/utils/const";

// 成果列表
export async function getAchievementList(data) {
  return request("/auth/web/v1/AchievementManage/getAchievementList", {
    data,
    method: POST,
    contentType: "application/json",
  });
}

// 获取届别
export async function getGradeId(data) {
  return request("/auth/web/v1/AchievementManage/gradeId", {
    data,
    method: GET,
  });
}

// 获取教研组

export async function teacherGroup(data) {
  return request("/auth/web/v1/AchievementManage/teacherGroup", {
    data,
    method: GET,
  });
}
// 字典查询
export async function batchLoadDictGroups(data) {
  return request("/auth/system/v1/common/batchLoadDictGroups", {
    data,
    method: GET,
  });
}
// 获取学生
export async function getParticipantStudentName(data) {
  return request("/auth/web/v1/AchievementManage/getStudentName", {
    data,
    method: GET,
  });
}
// 获取老师
export async function getParticipantTeacherName(data) {
  return request("/auth/web/v1/AchievementManage/getTeacherName", {
    data,
    method: GET,
  });
}

// 添加与修改老师
export async function addAchievements(data) {
  return request("/auth/web/v1/AchievementManage/addAchievements", {
    data,
    method: POST,
    contentType: "application/json",
  });
}

//删除成果
export async function deleteAchievementDetails(data) {
  return request("/auth/web/v1/AchievementManage/deleteAchievementDetails", {
    data,
    method: POST,
  });
}

// 查看成果详情
export async function achievementDetails(data) {
  return request("/auth/web/v1/AchievementManage/achievementDetails", {
    data,
    method: GET,
  });
}

// 图列展示

export async function getAchievementShow(data) {
  return request("/auth/web/v1/AchievementManage/getAchievementShow", {
    data,
    method: POST,
    contentType: "application/json",
  });
}

//成果数量
export async function findAchiTypeAndNum(data) {
  return request("/auth/web/v1/AchievementManage/findAchiTypeAndNum", {
    data,
    method: POST,
    contentType: "application/json",
  });
}

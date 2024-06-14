/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/6/22
 *@Modified By:
 */
import model from "dva-model";
import { ClassAndTeacherManage as namespace } from "@/utils/namespace";
import queryString from "query-string";
import userInfoCache from "@/caches/userInfo";
import {
  //----------------教师管理----------
  findTeacherList, //查询教师列表
  addTeacher, //添加单个教师
  findClassList, //查询班级
  configTeacher, //配置教师
  updateTeacher, //修改教师信息
  findTeacherSubjectInfo, //找到老师所配置的科目
  deleteTeacherSubject, //删除教师所教某个科目
  getClassLeaderList, //获取班主任列表
  configClassLeader, //配置班主任
  getClassLeader, //获取当前班级的班主任

  //----------------班级管理----------
  findClassInfoBys, //查询班级列表
  saveClassInfos, //保存班级信息
  getClassCommandInfo, //获取口令信息
  getSubjectConfig, //获取班级班主任及任课教师配置信息
  listTeachers, //配置班级班主任及任课教师时获取教师列表
  saveSubjectConfig, //配置班级班主任及任课教师信息
  getStudies, // 获取当前学段
  listThGrades, // 界别列表
  previewList, //生成班级预览
  getSchoolGrades, //获取学校年级
  batchGenerate, //批量生成班级-保存
  getVerificationCode, //获取验证码
  verificationCode, //验证码校验
  batchDelete, //批量删除
  previewClassList, //一键升段-预览
  submitClassList, // 一键升段-提交
  getSchoolCollagesList,//获取院系列表
  getSchoolMajorsList, //获取专业列表
} from "@/services/classAndTeacherManage";
import { queryParamIsChange, doHandleYear } from "@/utils/utils";
let lastQuery = undefined;
export default model(
  {
    state: {
      findClassList: [],
      findTeacherList: [],
    },
    namespace,
    subscriptions: {
      setup: ({ dispatch, history }) => {
        history.listen((location) => {
          let { pathname, search } = location;
          const query = queryString.parse(search) || {};

          //----------------------教师管理-----------------
          if (pathname === "/teacherManage") {
            const userInfo = userInfoCache(); //用户信息
            //获取当前班级的班主任
            if (query.classId && query.classId !== "-1") {
              dispatch({
                type: "getClassLeader",
                payload: {
                  classId: query.classId,
                },
              });
            }
            //获取教师列表
            if (userInfo && userInfo.schoolId) {
              queryParamIsChange(lastQuery, query, ["classId", "p"], []) &&
                dispatch({
                  type: "findTeacherList",
                  payload: {
                    classId:
                      (query.classId && parseInt(query.classId, 10)) ||
                      undefined,
                    schoolId: userInfo.schoolId,
                    spoceId: query.spoceId || doHandleYear(),
                    gradeId: query.gradeId,
                    userName: query.userName,
                    userAccount: query.userAccount,
                    page: query.p || 1,
                    size: 10,
                  },
                });
            }

            //获取班级列表
            queryParamIsChange(lastQuery, query, ["spoceId", "gradeId"]) &&
              dispatch({
                type: "findClassList",
                payload: {
                  spoceId: query.spoceId || doHandleYear(),
                  gradeId: query.gradeId || 15,
                  schoolId: userInfo.schoolId || 1,
                },
              });
          }

          //----------------------班级管理-----------------
          if (pathname === "/classManage") {
            const userInfo = userInfoCache(); //用户信息
            //获取班级列表
            queryParamIsChange(lastQuery, query, ["p", "spoceId", "gradeId"]) &&
              dispatch({
                type: "findClassInfoBys",
                payload: {
                  page: query.p || 1,
                  size: 10,
                  studyYear: query.spoceId || doHandleYear(),
                  gradeId: query.gradeId ? query.gradeId : null,
                  schoolId: userInfo.schoolId || 1,
                },
              });
          }
        });
      },
    },
    reducers: {
      findTeacherListSuccess(state, action) {
        return { ...state, getTeacherList: action.result, loading: false };
      },
      findClassListSuccess(state, action) {
        const addAction = [
          { id: 0, name: "全部教师" },
          { id: -1, name: "待分配" },
        ];
        return {
          ...state,
          findClassList: [...addAction, ...action.result],
          loading: false,
        };
      },
    },
  },
  {
    findTeacherList,
    addTeacher,
    findClassList,
    configTeacher,
    updateTeacher,
    findTeacherSubjectInfo,
    deleteTeacherSubject,
    getClassLeaderList,
    configClassLeader,
    getClassLeader,
    findClassInfoBys,
    saveClassInfos,
    getClassCommandInfo,
    getSubjectConfig,
    listTeachers,
    saveSubjectConfig,
    getStudies,
    listThGrades,
    previewList,
    getSchoolGrades,
    batchGenerate,
    getVerificationCode, //获取验证码
    verificationCode, //验证码校验
    batchDelete, //批量删除
    previewClassList,
    submitClassList,
    getSchoolCollagesList,
    getSchoolMajorsList
  }
);

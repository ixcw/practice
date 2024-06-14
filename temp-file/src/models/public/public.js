/**
 * 公共服务models
 * @author:张江
 * @date:2020年08月20日
 * @version:v1.0.0
 * */
import Model from "dva-model";
import queryString from "query-string";
import { Public as namespace } from "@/utils/namespace";
import {
  getStudyList, //获取学段
  getStudyOrVersionList, //获取学段信息或者版本信息
  getSchoolListByAreaId, //通过区域id获取学校列表
  getRoleInfoByPlatformId, //获取角色列表
  findStudyOrVersion, //根据学段获取科目
  findAreaInfosOpen, //开放获取省市县地址信息
  findSchoolByAreaIdsOpen, //根据地区id获取学校
  getGradeList, // 获取年级信息
  getGradeInfos, //根据学段获取年级信息
  getStudyAndGradeList, //获取学段和年级
  getSubjectByClassCode, //根据班级口令查询科目信息
  findStudyAndSubjects, //拉取学段科目
  getAreaInfoList, //区域
  getAllProvinceInfo, //获取所有的“省”份列表
  getSchoolGrades, //获取当前学校的年级
} from "@/services/public/public";
import effect from "dva-model/effect";
import studyInfoCache from "@/caches/studyInfo";
import studyAndGradeListCache from "@/caches/studyAndGradeList";
import StudyAndSubjectsListCache from "@/caches/StudyAndSubjectsList";
import gradeListCache from "@/caches/gradeList";
import provinceListCache from "@/caches/provinceList";

export default Model(
  {
    namespace,
    // subscriptions: {
    //   setup({ dispatch, history }) {
    //     history.listen(location => {
    //       if (location.pathname === '/register') {
    //         const {search,pathname}=location;
    //         const query=queryString.parse(search)
    //           dispatch({
    //             type:'',
    //             payload:{
    //               areaId:query.areaId?query.areaId:0
    //             }
    //           })
    //       }
    //     })
    //   },
    // },
    effects: {
      // 获取年级列表
      *getAllProvinceList(action, saga) {
        yield saga.call(
          effect(
            getAllProvinceInfo,
            "getAllProvinceListSuccess",
            provinceListCache
          ),
          action,
          saga
        );
      },
      *getStudyList(action, saga) {
        yield saga.call(
          effect(getStudyList, "getStudyListSuccess", studyInfoCache),
          action,
          saga
        );
      },

      // 获取学段与年级
      *getStudyAndGradeList(action, saga) {
        yield saga.call(
          effect(
            getStudyAndGradeList,
            "getStudyAndGradeListSuccess",
            studyAndGradeListCache
          ),
          action,
          saga
        );
      },

      // 获取年级列表
      *getGradeList(action, saga) {
        yield saga.call(
          effect(getGradeList, "getGradeListSuccess", gradeListCache),
          action,
          saga
        );
      },

      *getVersionList(action, saga) {
        yield saga.call(
          effect(getStudyOrVersionList, "getVersionListSuccess"),
          action,
          saga
        );
      },

      *getAuthSubjectList(action, saga) {
        yield saga.call(
          effect(getStudyOrVersionList, "getAuthSubjectListSuccess"),
          action,
          saga
        );
      },
      *getStudyAndSubjectsList(action, saga) {
        yield saga.call(
          effect(
            findStudyAndSubjects,
            "findStudyAndSubjectsSuccess",
            StudyAndSubjectsListCache
          ),
          action,
          saga
        );
      },
    },
    reducers: {
      /*赋值 state里的值 区分 方便各个组件使用*/
      saveState(state, { payload }) {
        return { ...state, ...payload };
      },

      getStudyListSuccess(state, action) {
        return { ...state, studyList: action.result, loading: false };
      },
      // 根据权限获取科目
      getAuthSubjectListSuccess(state, action) {
        return { ...state, authSubjectList: action.result, loading: false };
      },
      // 根据学段筛选获取科目
      getStudyOrVersionListSuccess(state, action) {
        return { ...state, subjectList: action.result, loading: false };
      },
      // 根据科目获取版本列表
      getVersionListSuccess(state, action) {
        return { ...state, versionList: action.result, loading: false };
      },

      //通过区域id获取学校列表
      getSchoolListByAreaIdSuccess(state, action) {
        return { ...state, schoolList: action.result, loading: false };
      },

      //获取角色列表
      getRoleInfoByPlatformIdSuccess(state, action) {
        return { ...state, roleList: action.result, loading: false };
      },

      //获取科目列表
      findStudyOrVersionSuccess(state, action) {
        return { ...state, subjectIdList: action.result, loading: false };
      },
      //获取学校列表
      findSchoolByAreaIdsOpenSuccess(state, action) {
        return { ...state, schoolList: action.result, loading: false };
      },
      //获取年级信息列表
      getGradeListSuccess(state, action) {
        return { ...state, gradeList: action.result, loading: false };
      },
      //根据学段获取年级信息
      getGradeInfosSuccess(state, action) {
        return { ...state, gradeInfos: action.result, loading: false };
      },
      //获取学段和年级
      getStudyAndGradeListSuccess(state, action) {
        return { ...state, studyAndGradeList: action.result, loading: false };
      },

      //根据班级口令查询科目列表
      getSubjectByClassCodeSuccess(state, action) {
        return { ...state, selectSubjectList: action.result, loading: false };
      },
      //获取学段及其科目
      findStudyAndSubjectsSuccess(state, action) {
        return {
          ...state,
          StudyAndSubjectsList: action.result,
          loading: false,
        };
      },
      //获取所有的“省”份列表
      getAllProvinceListSuccess(state, action) {
        return { ...state, allProvinceList: action.result, loading: false };
      },
    },
  },
  {
    // getStudyList,//获取学段
    getStudyOrVersionList, //获取学段信息或者版本信息
    getSchoolListByAreaId, //通过区域id获取学校列表
    getRoleInfoByPlatformId, //获取角色列表
    findStudyOrVersion, //根据学段获取科目
    findAreaInfosOpen, //开放获取省市县地址信息
    findSchoolByAreaIdsOpen, //根据地区id获取学校
    // getGradeList,// 获取年级信息
    getGradeInfos, //根据学段获取年级信息
    // getStudyAndGradeList,//获取学段和年级
    getSubjectByClassCode, //根据班级口令查询科目信息
    findStudyAndSubjects, //拉取学段科目
    getAreaInfoList, //区域
    getAllProvinceInfo, //获取所有的“省”份列表
    getSchoolGrades
  }
);

/**
 * shihaigui
 * @author:学校数据 Models
 * date:2023年05月12日
 * */

import { School as namespace } from '../utils/namespace'
import { getloctionObj } from '../utils/utils'

import {
  basicInformation,//查询学校基础信息
  saveSchoolInfo,//保存学校基础信息
  getSuperiorsOrgan,//查询上级管理直属机构
  historyFacility,//查询学校设施
  saveSchoolFacility,//保存学校设施
  getSchoolHonor,//获取学校荣誉
  saveSchoolHonour,//保存学校荣誉
  deleteSchoolHonour,//修改学校荣誉
  historyTeacherScale,//查询学校教师规模
  saveTeacherScale,//添加学校教师规模
  getCommonBatchLoadDictGroups,//批量加载多个字典组
  // getCommonStudies,//获取学段列表
  getfindSectionStudy,//获取除开专升本与大学的所有学段
  getAreaChildren,//获取子地域列表
  historySchoolProject,//查询学校项目情况
  saveSchoolProject,//添加学校项目
  updateSchoolProject,//修改学校项目情况
  getPrimaryEnrollmentRate,//查询小学升学率
  savePrimaryEnrollmentRate,//添加小学升学率信息
  getJuniorEnrollmentRate,//查询初中升学率
  saveJuniorEnrollmentRate,//添加初中升学率信息
  getSeniorEnrollmentRate,//查询高中升学率
  saveSeniorEnrollmentRate,//添加高中升学率信息

}
  from '../services/SchoolDataInterface.js'

export default {
  // 命名

  namespace,

  //状态
  state: {
    ShowLearningSection: []
  },

  //监听路由的变化，鼠标，键盘，服务器连接变化等，做出不同响应

  subscriptions: {

  },
  //异步操作
  effects: {

    //批量加载多个字典组
    *getCommonBatchLoadDictGroupsApi ({ payload }, { call, put, select }) {
      const data = yield call(getCommonBatchLoadDictGroups, payload)
      yield put({ type: 'getCommonBatchLoadDictGroups', payload: data.result })

    },
    //获取学段列表
    // *getCommonStudiesApi ({ payload }, { call, put, select }) {
    //   const data = yield call(getCommonStudies, payload)
    //   yield put({ type: 'getCommonStudies', payload: data.result })
    // },
    //获取除开专升本与大学的所有学段
    *getfindSectionStudyApi ({ payload }, { call, put, select }) {
      const data = yield call(getfindSectionStudy, payload)
      yield put({ type: 'getfindSectionStudy', payload: data.result })
    },
    //获取子地域列表---省
    *getProvinceApi ({ payload }, { call, put, select }) {
      const data = yield call(getAreaChildren, payload)
      yield put({ type: 'getProvince', payload: data.result })
    },
    //获取子地域列表---市
    *getThecityApi ({ payload }, { call, put, select }) {
      const data = yield call(getAreaChildren, payload)
      yield put({ type: 'getThecity', payload: data.result })
    },
    //获取子地域列表---县
    *getCountyApi ({ payload }, { call, put, select }) {
      const data = yield call(getAreaChildren, payload)
      yield put({ type: 'getCounty', payload: data.result })
    },


    //查询学校基础信息
    *basicInformationApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(basicInformation, payload)
      callback(data)
    },
    //保存学校基础信息
    *saveSchoolInfoApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(saveSchoolInfo, payload)
      callback(data)
    },
    //查询上级管理直属机构
    *getSuperiorsOrganApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(getSuperiorsOrgan, payload)
      callback(data)
    },

    //查询学校设施
    *historyFacilityApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(historyFacility, payload)
      callback(data)
    },
    //保存学校设施
    *saveSchoolFacilityApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(saveSchoolFacility, payload)
      callback(data)
    },
    //获取学校荣誉
    *getSchoolHonorApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(getSchoolHonor, payload)
      callback(data)
    },
    //保存学校荣誉
    *saveSchoolHonourApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(saveSchoolHonour, payload)
      callback(data)
    },
    //修改学校荣誉
    *deleteSchoolHonourApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(deleteSchoolHonour, payload)
      callback(data)
    },

    //查询学校教师规模
    *historyTeacherScaleApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(historyTeacherScale, payload)
      callback(data)
    },
    //添加学校教师规模
    *saveTeacherScaleApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(saveTeacherScale, payload)
      callback(data)
    },


    //查询学校项目情况
    *historySchoolProjectApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(historySchoolProject, payload)
      callback(data)
    },
    //添加学校项目情况
    *saveSchoolProjectApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(saveSchoolProject, payload)
      callback(data)
    },
    //修改学校项目情况
    *updateSchoolProjectApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(updateSchoolProject, payload)
      callback(data)
    },

    //查询小学升学率
    *getPrimaryEnrollmentRateApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(getPrimaryEnrollmentRate, payload)
      callback(data)
    },
    //添加小学升学率信息
    *savePrimaryEnrollmentRateApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(savePrimaryEnrollmentRate, payload)
      callback(data)
    },

    //查询初中升学率
    *getJuniorEnrollmentRateApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(getJuniorEnrollmentRate, payload)
      callback(data)
    },
    //添加初中升学率信息
    *saveJuniorEnrollmentRateApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(saveJuniorEnrollmentRate, payload)
      callback(data)
    },


    //查询高中升学率
    *getSeniorEnrollmentRateApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(getSeniorEnrollmentRate, payload)
      callback(data)
    },
    //添加高中升学率
    *saveSeniorEnrollmentRateApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(saveSeniorEnrollmentRate, payload)
      callback(data)
    },
  },


  //同步操作
  reducers: {
    savestate (state, action) {
      return { ...state, ...action.payload }
    },
    //批量加载多个字典组
    getCommonBatchLoadDictGroups (state, action) {
      const nationOptions = action.payload?.find((item) => item.dictCode === 'DICT_NATION')?.dictItems?.map(item => { return { value: item.itemValue - 0, label: item.itemText } })
      const sexOptions = action.payload?.find((item) => item.dictCode === 'DICT_SEX')?.dictItems?.map(item => { return { value: item.itemValue - 0, label: item.itemText } })
      const workOptions = action.payload?.find((item) => item.dictCode === 'DICT_WORK')?.dictItems?.map(item => { return { value: item.itemValue - 0, label: item.itemText } })
      const eduOptions = action.payload?.find((item) => item.dictCode === 'DICT_EDU')?.dictItems?.map(item => { return { value: item.itemValue - 0, label: item.itemText } })
      const eduNatureOptions = action.payload?.find((item) => item.dictCode === 'DICT_NATURE')?.dictItems?.map(item => { return { value: item.itemValue - 0, label: item.itemText } })
      const PhysicalExaminationOptions = action.payload?.find((item) => item.dictCode === 'DICT_PHYS_RESULT')?.dictItems?.map(item => { return { value: item.itemValue - 0, label: item.itemText } })
      const honorTypeOptions = action.payload?.find((item) => item.dictCode === "DICT_HONOR")?.dictItems?.map((item) => { return { value: item.itemValue - 0, label: item.itemText } })
      const SchoolStatusOptions = action.payload?.find((item) => item.dictCode === "DICT_STUDY_STATUS")?.dictItems?.map((item) => { return { value: item.itemValue - 0, label: item.itemText } })

      return { ...state, nationOptions, honorTypeOptions, sexOptions, workOptions, eduOptions, eduNatureOptions, PhysicalExaminationOptions, SchoolStatusOptions }
    },
    //获取子地域列表---省
    getProvince (state, action) {
      const provinceOptions = action.payload?.map(item => { return { value: item.id - 0, label: item.name } })
      return { ...state, provinceOptions }
    },
    //获取子地域列表---市
    getThecity (state, action) {
      const ThecityOptions = action.payload?.map(item => { return { value: item.id - 0, label: item.name } })
      return { ...state, ThecityOptions }
    },
    //获取子地域列表---县
    getCounty (state, action) {
      const CountyOptions = action.payload?.map(item => { return { value: item.id - 0, label: item.name } })
      return { ...state, CountyOptions }
    },



    //获取学段列表
    // getCommonStudies (state, action) {
    //   const StudiesOptions = action.payload?.map(item => { return { value: item.id, label: item.name } })
    //   return { ...state, StudiesOptions }
    // },
    //获取除开专升本与大学的所有学段
    getfindSectionStudy (state, action) {
      const findSectionStudyOptions = action.payload?.map(item => { return { value: item.id, label: item.name } })
      return { ...state, findSectionStudyOptions }
    },


  }




}






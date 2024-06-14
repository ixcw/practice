/**
 * 学生数据
 * @author:田忆
 * @date:2023年05月017日
 * @version:v1.0.0
 * */

import { StudentData as namespace } from '../utils/namespace';
import {
  getStatisticsStudentNumber,
  postStudentPage,
  getBatchLoadDictGroups,
  getTeacherManegeClassList,
  getGradeStatusClass,
  getNativeTree,
  newStudentData,
  studying,
  AtSchoolStudent,
  studentDetails,
  medicalExamination,
  deriveData,
  approvedMemo,
  putStudent,
  assessorStudent,
  gradeLinkageClass,
  variationStudent,
  amendData,
  spoceGangedClass,
  pushFinishStudentMes,
  studentMessageBatchAdjust,
  spoceGradeClass,
  queryAllStudentMessage,
  getVerificationCode, //获取验证码
	verificationCode, //验证码校验
  deleteStudentMes//删除学生
} from '@/services/studentDataInterface'


export default {
  //命名
  namespace,
  //状态
  state: {},

  //异步操作
  effects: {
    // 学生人数统计
    *getStudentStatistics({ payload, callback }, { call, put, select }) {
      const res = yield call(getStatisticsStudentNumber, payload);
      callback(res)
    },
    // 分页查询学生列表
    *getStudentPageList({ payload, callback }, { call, put, select }) {
      const data = yield call(postStudentPage, payload);
      callback(data)
    },
    // 批量加载多个字典组
    *getDictionaryDictGroups({ payload }, { call, put, select }) {
      const data = yield call(getBatchLoadDictGroups, payload);
      // console.log(data,'字典')
      yield put({ type: 'DictionaryDictGroups', payload: data.result });
    },
    //获取当前班主任管理的班级列表
    *getTeacherManegeClass({ payload, callback }, { call, put, select }) {
      const data = yield call(getTeacherManegeClassList, payload);
      // console.log(data,'班级列表')
      callback(data)
    },
    //获取当前年级学籍班级信息
    *getGrateStatusClassData({ payload, callback }, { call }) {
      const data = yield call(getGradeStatusClass, payload);
      callback(data)
    },
    // 加载地域树（籍贯下拉框）
    *getDictionaryAddress({ payload }, { call, put, select }) {
      const data = yield call(getNativeTree, payload);
      yield put({ type: 'DictionaryAddress', payload: data.result });
    },
    //新建学生信息
    *getNewStudentData({ payload, callback }, { call }) {
      const data = yield call(newStudentData, payload)
      callback(data)
    },
    
    //学段信息
    *getStudying({ payload, callback }, { call }) {
      const data = yield call(studying, payload)
      callback(data)
    },
    // 获取验证码
		*getVerificationCodeApi({ payload, callback }, { call, put, select }) {
			const response = yield call(getVerificationCode, payload)
			callback(response)
		},
		// 验证码校验
		*verificationCodeApi({ payload, callback }, { call, put, select }) {
			const response = yield call(verificationCode, payload)
			callback(response)
		},
    //删除学生
    *deleteStudentMesApi({ payload, callback }, { call }) {
      const data = yield call(deleteStudentMes, payload)
      callback(data)
    },
    //学校在校信息
    *postAtSchoolStudent({ payload, callback }, { call }) {
      const data = yield call(AtSchoolStudent, payload)
      callback(data)
    },
    *getStudentDetails({ payload, callback }, { call, put }) {
      const data = yield call(studentDetails, payload)
      callback(data)
    },
    *getMedicalExamination({ payload, callback }, { call, put }) {
      const data = yield call(medicalExamination, payload)
      callback(data)
    },
    *postDeriveData({ payload, callback }, { call, put }) {
      const data = yield call(deriveData, payload)
      callback(data)
    },
    *getApprovedMemo({ payload, callback }, { call, put }) {
      const data = yield call(approvedMemo, payload)
      callback(data)
    },
    *putStudentData({ payload, callback }, { call, put }) {
      const data = yield call(putStudent, payload)
      callback(data)
    },
    *putAssessorStudent({ payload, callback }, { call, put }) {
      const data = yield call(assessorStudent, payload)
      callback(data)
    },
    *getGradeLinkageClass({ payload, callback }, { call, put }) {
      const data = yield call(gradeLinkageClass, payload)
      callback(data)
    },
    *putVariationStudent({ payload, callback }, { call, put }) {
      const data = yield call(variationStudent, payload)
      callback(data)
    },
    *getAmendData({ payload, callback }, { call, put }) {
      const data = yield call(amendData, payload)
      callback(data)
    },
    *getSpoceGangedClass({ payload, callback }, { call, put }) {
      const data = yield call(spoceGangedClass, payload)
      callback(data)
    },
    *getPushFinishStudentMes({ payload, callback }, { call, put }) {
      const data = yield call(pushFinishStudentMes, payload)
      callback(data)
    },
    *postStudentMessageBatchAdjust({ payload, callback }, { call, put }) {
      const data = yield call(studentMessageBatchAdjust, payload)
      callback(data)
    },
    *getSpoceGradeClass({ payload, callback }, { call, put }) {
      const data = yield call(spoceGradeClass, payload)
      callback(data)
    },
    *getQueryAllStudentMessage({ payload, callback }, { call, put }) {
      const data = yield call(queryAllStudentMessage, payload)
      callback(data)
    },





  },
  reducers: {
    DictionaryDictGroups(state, action) {
      return { ...state, DictionaryDictGroups: action.payload };
    },
    DictionaryAddress(state, action) {
      // 地址内容处理 （省-市-县）
      const ProvinceCityAddressOptions = action.payload?.map(item => {
        return {
          value: item.id,
          label: item.name,
          children: item.children?.map(item2 => {
            return {
              value: item2.id,
              label: item2.name,
              children: item2.children?.map(item3 => {
                return {
                  value: item3.id,
                  label: item3.name,
                }
              })
            }
          })
        }
      })

      // 地址内容处理 （省）
      const CityAddressOptions = action.payload?.map(item => { return { value: item.id, label: item.name } })

      const CityAddressOptionsText = action.payload?.map(item => { return { value: item.name, label: item.name } })

      return { ...state, ProvinceCityAddressOptions, CityAddressOptions, CityAddressOptionsText };

    },
  }
}

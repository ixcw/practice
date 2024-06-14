/*
Author:韦靠谱
Description:老师数据models
Date:2023/05/06
*/

import { TeacherData as namespace } from '../utils/namespace';
import { getLocationObj } from '@/utils/utils'
import {
	getDictItems, //字典接口
	getBatchLoadDictGroups, //批量加载多个字典组
	postTeacherPage, //分页查询教师列表
	postTeacherSaveOrUpdate, // 添加/修改教师
	uploadTeacherBatchImport, //批量导入教师Excel数据（上传Excel文件接口）
	getNativeTree, //加载地域树（籍贯下拉框）
	getStudies, //获取学段列表
	getOrgs, //获取部门列表
	getPosts, //获取部门职务列表
	getTeacherDetail, //查询教师详情
	getSubjects, //获取科目列表
	getTeacherChangePost, //新增或修改岗位变动记录
	getTeacherListChangeRecords, //查询岗位变动记录
	getStatTeachers, //主页面人数统计
	getTeacherListModifyRecords, //查询教师修改记录
	getTeacherDoUrge, //一键督促完善信息
	postTeacherSaveExamineResult, //保存审核结果
	postTeacherListExamineRecord, //查询教师审核记录
	postUploadImage, //上传图片
	findTeacherSubjectInfo, //找到老师所配置的科目
	deleteTeacherSubject, //删除教师所教某个科目
	getSubjectList, //获取科目信息
	findClassList, //查询班级
	getStudyAndGradeList, //获取学段和年级
	configTeacher, //配置教师
	configTeacherSubjects, //配置教师 （科目支持多选）
	getClassLeader, //获取班级下的班主任
	getClassLeaderList, //获取班主任列表
	configClassLeader, //配置班主任
	postDownloadTeacherTemple, //下载教师导入模板（完整版）
	getVerificationCode, //获取验证码
	verificationCode, //验证码校验
	bathDeleteByIdCards //批量删除教师数据
} from '@/services/TeacherDataInterface'

export default {
	//命名
	namespace,
	//状态
	state: {},
	//监听路由的变化、鼠标、键盘、服务器连接变化等，做出不同响应
	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(pathname => {})
		}
	},
	//异步操作
	effects: {
		//一键督促完善信息
		*getTeacherDoUrgeApi({ payload, callback }, { call, put, select }) {
			const data = yield call(getTeacherDoUrge, payload)
			callback(data.result)
		},
		// 分页查询教师列表
		*getTeacherPageList({ payload, callback }, { call, put, select }) {
			const data = yield call(postTeacherPage, payload)
			callback(data.result)
		},
		// 批量导入教师Excel数据
		*uploadTeacherBatchImportApi({ payload, callback }, { call, put, select }) {
			const data = yield call(uploadTeacherBatchImport, payload)
			callback(data)
		},
		// 批量加载多个字典组
		*getDictionaryDictGroups({ payload }, { call, put, select }) {
			const data = yield call(getBatchLoadDictGroups, payload)
			yield put({ type: 'DictionaryDictGroups', payload: data.result })
		},
		// 加载地域树（籍贯下拉框）
		*getDictionaryAddress({ payload }, { call, put, select }) {
			const data = yield call(getNativeTree, payload)
			yield put({ type: 'DictionaryAddress', payload: data.result })
		},
		// 获取学段列表
		*getSchoolStudies({ payload }, { call, put, select }) {
			const data = yield call(getStudies, payload)
			yield put({ type: 'SchoolStudies', payload: data.result })
		},
		// 获取部门列表
		*getSchoolOrgs({ payload }, { call, put, select }) {
			const data = yield call(getOrgs, payload)
			yield put({ type: 'SchoolOrgs', payload: data.result })
		},
		// 获取部门职务列表
		*getSchoolPosts({ payload }, { call, put, select }) {
			const data = yield call(getPosts, payload)
			yield put({ type: 'SchoolPosts', payload: data.result })
		},
		*getSchoolPostsApi({ payload, callback }, { call, put, select }) {
			const data = yield call(getPosts, payload)
			callback(data)
		},
		// 获取科目列表
		*getSchoolSubjects({ payload }, { call, put, select }) {
			const data = yield call(getSubjects, payload)
			yield put({ type: 'SchoolSubjects', payload: data.result })
		},
		*getSchoolSubjectsApi({ payload, callback }, { call, put, select }) {
			const data = yield call(getSubjects, payload)
			callback(data)
		},
		// 主页面人数统计
		*getStatTeacherStatistics({ payload, callback }, { call, put, select }) {
			const data = yield call(getStatTeachers, payload)
			callback(data)
		},
		// 查询教师修改记录
		*getTeacherListModifyRecordsApi({ payload, callback }, { call, put, select }) {
			const data = yield call(getTeacherListModifyRecords, payload)
			callback(data)
		},

		// 添加/修改教师
		*postTeacherAddOrModify({ payload, callback }, { call, put, select }) {
			const data = yield call(postTeacherSaveOrUpdate, payload)
			callback(data)
		},
		// 查看教师详情
		*viewTeacherDetail({ payload, callback }, { call, put, select }) {
			const response = yield call(getTeacherDetail, payload)
			callback(response)
		},
		// 查看教师详情------------------
		*viewTeacherDetailApi({ payload }, { call, put, select }) {
			const response = yield call(getTeacherDetail, payload)
			yield put({ type: 'getTeacherDetail', payload: response.result })
			const { resolve } = payload
			resolve(response)
		},
		// 新增或修改岗位变动记录
		*viewTeacherChangePost({ payload, callback }, { call, put, select }) {
			const response = yield call(getTeacherChangePost, payload)
			callback(response)
		},
		// 查询岗位变动记录
		*viewTeacherListChangeRecords({ payload, callback }, { call, put, select }) {
			const response = yield call(getTeacherListChangeRecords, payload)
			callback(response)
		},
		//保存审核结果
		*postTeacherSaveExamineResultApi({ payload, callback }, { call, put, select }) {
			const response = yield call(postTeacherSaveExamineResult, payload)
			callback(response)
		},
		//查询教师审核记录
		*postTeacherListExamineRecordApi({ payload, callback }, { call, put, select }) {
			const response = yield call(postTeacherListExamineRecord, payload)
			callback(response)
		},
		//上传图片
		*postUploadImageApi({ payload, callback }, { call, put, select }) {
			const response = yield call(postUploadImage, payload)
			callback(response)
		},
		//找到老师所配置的科目
		*findTeacherSubjectInfoApi({ payload, callback }, { call, put, select }) {
			const response = yield call(findTeacherSubjectInfo, payload)
			callback(response)
		},
		//删除教师所教某个科目
		*deleteTeacherSubjectApi({ payload, callback }, { call, put, select }) {
			const response = yield call(deleteTeacherSubject, payload)
			callback(response)
		},
		//获取科目信息
		*getSubjectListApi({ payload, callback }, { call, put, select }) {
			const response = yield call(getSubjectList, payload)
			callback(response)
		},
		//查询班级
		*findClassListApi({ payload, callback }, { call, put, select }) {
			const response = yield call(findClassList, payload)
			callback(response)
		},
		//获取学段和年级
		*getStudyAndGradeListApi({ payload, callback }, { call, put, select }) {
			const response = yield call(getStudyAndGradeList, payload)
			callback(response)
		},
		//配置教师
		*configTeacherApi({ payload, callback }, { call, put, select }) {
			const response = yield call(configTeacher, payload)
			callback(response)
		},
		//配置教师 （科目支持多选）
		*configTeacherSubjectsApi({ payload, callback }, { call, put, select }) {
			const response = yield call(configTeacherSubjects, payload)
			callback(response)
		},
		//获取班级下的班主任
		*getClassLeaderApi({ payload, callback }, { call, put, select }) {
			const response = yield call(getClassLeader, payload)
			callback(response)
		},
		//获取班主任列表
		*getClassLeaderListApi({ payload, callback }, { call, put, select }) {
			const response = yield call(getClassLeaderList, payload)
			callback(response)
		},
		//配置班主任
		*configClassLeaderApi({ payload, callback }, { call, put, select }) {
			const response = yield call(configClassLeader, payload)
			callback(response)
		},
		//下载教师导入模板（完整版）
		*postDownloadTeacherTempleApi({ payload, callback }, { call, put, select }) {
			const response = yield call(postDownloadTeacherTemple, payload)
			callback(response)
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
		// 批量删除教师数据
		*bathDeleteByIdCardsApi({ payload, callback }, { call, put, select }) {
			const response = yield call(bathDeleteByIdCards, payload)
			callback(response)
		}
	},
	//同步操作
	reducers: {
		saveState(state, action) {
			return { ...state, ...action.payload }
		},
		getTeacherDetail(state, action) {
			return { ...state, getTeacherDetail: action.payload }
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
									label: item3.name
								}
							})
						}
					})
				}
			})
			// 地址内容处理 （省）
			const CityAddressOptions = action.payload?.map(item => {
				return { value: item.id, label: item.name }
			})
			const CityAddressOptionsText = action.payload?.map(item => {
				return { value: item.name, label: item.name }
			})
			return { ...state, ProvinceCityAddressOptions, CityAddressOptions, CityAddressOptionsText }
		},

		SchoolStudies(state, action) {
			const SchoolStudiesOptions = action.payload?.map(item => {
				return { value: item.id, label: item.name }
			})
			return { ...state, SchoolStudiesOptions }
		},
		SchoolOrgs(state, action) {
			const SchoolOrgsOptions = action.payload?.map(item => {
				return { value: item.id, label: item.name }
			})
			return { ...state, SchoolOrgsOptions }
		},
		SchoolPosts(state, action) {
			const SchoolPostsOptions = action.payload?.map(item => {
				return { value: item.id, label: item.name }
			})
			return { ...state, SchoolPostsOptions }
		},
		SchoolSubjects(state, action) {
			const SchoolSubjectsOptions = action.payload?.map(item => {
				return { value: item.name, label: item.name }
			})
			const SchoolSubjectsIdOptions = action.payload?.map(item => {
				return { value: item.id, label: item.name }
			})
			return { ...state, SchoolSubjectsOptions, SchoolSubjectsIdOptions }
		},

		DictionaryDictGroups(state, action) {
			const nationOptions = action.payload
				?.find(item => item.dictCode === 'DICT_NATION')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const sexOptions = action.payload
				?.find(item => item.dictCode === 'DICT_SEX')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const titleOptions = action.payload
				?.find(item => item.dictCode === 'DICT_TITLE')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const postInfoOptions = action.payload
				?.find(item => item.dictCode === 'DICT_POST_INFO')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const marriageOptions = action.payload
				?.find(item => item.dictCode === 'DICT_MARRIAGE')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const politOptions = action.payload
				?.find(item => item.dictCode === 'DICT_POLIT')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const unitMethodOptions = action.payload
				?.find(item => item.dictCode === 'DICT_UNIT_METHOD')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const eduOptions = action.payload
				?.find(item => item.dictCode === 'DICT_EDU')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const eduNatureOptions = action.payload
				?.find(item => item.dictCode === 'DICT_NATURE')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const mandarinLevelOptions = action.payload
				?.find(item => item.dictCode === 'DICT_MANDARIN_LEVEL')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const postOptions = action.payload
				?.find(item => item.dictCode === 'DICT_POST')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const physResultOptions = action.payload
				?.find(item => item.dictCode === 'DICT_PHYS_RESULT')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const relationOptions = action.payload
				?.find(item => item.dictCode === 'DICT_RELATION')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const workOptions = action.payload
				?.find(item => item.dictCode === 'DICT_WORK')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const trainOptions = action.payload
				?.find(item => item.dictCode === 'DICT_TRAIN')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const achievementOptions = action.payload
				?.find(item => item.dictCode === 'DICT_ACHV_LEVEL')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const honorLevelOptions = action.payload
				?.find(item => item.dictCode === 'DICT_HONOR')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const honorTypeOptions = action.payload
				?.find(item => item.dictCode === 'DICT_HONOUR_TYPE')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const trainLevelOptions = action.payload
				?.find(item => item.dictCode === 'DICT_TRAIN_LEVEL')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const degreeLevelOptions = action.payload
				?.find(item => item.dictCode === 'DICT_DEGREE')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const degreeTypeOptions = action.payload
				?.find(item => item.dictCode === 'DICT_DEGREE_TYPE')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const studyYearOptions = action.payload
				?.find(item => item.dictCode === 'DICT_STUDY_YEAR')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const teacherTypeOptions = action.payload
				?.find(item => item.dictCode === 'DICT_TEACHER_TYPE')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const postFunctionOptions = action.payload
				?.find(item => item.dictCode === 'DICT_POST_FUNCTION')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const postTypeOptions = action.payload
				?.find(item => item.dictCode === 'DICT_POST_TYPE')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const specTeacherOptions = action.payload
				?.find(item => item.dictCode === 'DICT_SPEC_TEACHER')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const docTypeOptions = action.payload
				?.find(item => item.dictCode === 'DICT_DOC_TYPE')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})

			return {
        ...state,
        achievementOptions,
        honorLevelOptions,
        honorTypeOptions,
        trainLevelOptions,
        trainOptions,
        workOptions,
        relationOptions,
        nationOptions,
        sexOptions,
        titleOptions,
        postInfoOptions,
        marriageOptions,
        politOptions,
        unitMethodOptions,
        eduOptions,
        eduNatureOptions,
        mandarinLevelOptions,
        postOptions,
        physResultOptions,
        degreeLevelOptions,
        degreeTypeOptions,
        studyYearOptions,
        teacherTypeOptions,
        postFunctionOptions,
        postTypeOptions,
        specTeacherOptions,
        docTypeOptions
      }
		}
	}
}

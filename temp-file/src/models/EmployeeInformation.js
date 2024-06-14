/*
Author:韦靠谱
Description:职工数据models
Date:2023/05/014
*/

import { EmployeeData as namespace } from '../utils/namespace';
import {
	getCommonBatchLoadDictGroups, //批量加载多个字典组
	getCommonGetNativeTree, //加载地域树（籍贯下拉框）
	getCommonGetOrgs, //获取部门列表
	getCommonGetPosts, //获取部门职务列表
	postWorkerDataCenterFindWorkerList, //分页查询职工基础信息列表
	postWorkerDataCenterInsertOrUpdateWorker, //新增/修改职工数据
	getWorkerDataCenterStatWorkers, //首页人数统计
	postWorkerDataCenterImportExcel, //excel批量导入职工数据
	postWorkerDataCenterExportWorkerBath, //批量导出职工信息excel
	getWorkerDataCenterFindWorkerInfo, //查询职工基础信息
	getWorkerDataCenterFindAuditRecord, //查询审核记录
	postWorkerDataCenterAuditWorkerInfo, //审核职工信息----驳回
	postWorkerDataCenterInsertOrUpdatePostChange, //新增/修改变动记录
	getWorkerDataCenterFindPostChangeModify, //查询变动记录
	getWorkerDataCenterFindUpdateRecord, //查询修改记录
	postWorkerDataCenterAuditWorkerInfoPass, //审核职工信息----通过
	getWorkerDataCenterUrgePerfect, //一键督促完善
	getVerificationCode, //获取验证码
	verificationCode, //验证码校验
	bathDeleteByIdCards //批量删除职工数据
} from '@/services/EmployeeDataInterface'

export default {
	//命名
	namespace,
	//状态
	state: {},
	//异步操作
	effects: {
		//批量加载多个字典组
		*getCommonBatchLoadDictGroupsApi({ payload }, { call, put, select }) {
			const data = yield call(getCommonBatchLoadDictGroups, payload)
			yield put({ type: 'getCommonBatchLoadDictGroups', payload: data.result })
		},
		//加载地域树（籍贯下拉框）
		*getCommonGetNativeTreeApi({ payload }, { call, put, select }) {
			const data = yield call(getCommonGetNativeTree, payload)
			yield put({ type: 'getCommonGetNativeTree', payload: data.result })
		},
		//获取部门列表
		*getCommonGetOrgsApi({ payload }, { call, put, select }) {
			const data = yield call(getCommonGetOrgs, payload)
			yield put({ type: 'getCommonGetOrgs', payload: data.result })
		},
		//获取部门职务列表
		*getCommonGetPostsApi({ payload }, { call, put, select }) {
			const data = yield call(getCommonGetPosts, payload)
			yield put({ type: 'getCommonGetPosts', payload: data.result })
		},
		*getCommonGetPostsOldApi({ payload, callback }, { call, put, select }) {
			const data = yield call(getCommonGetPosts, payload)
			yield put({ type: 'getCommonGetOldPosts', payload: data.result })
		},
		//查询职工基础信息
		*getWorkerDataCenterFindWorkerInfoApi({ payload }, { call, put, select }) {
			const data = yield call(getWorkerDataCenterFindWorkerInfo, payload)
			yield put({ type: 'getWorkerDataCenterFindWorkerInfo', payload: data.result })
			const { resolve } = payload
			resolve(data)
		},

		//分页查询职工基础信息列表
		*postWorkerDataCenterFindWorkerListApi({ payload, callback }, { call, put, select }) {
			const data = yield call(postWorkerDataCenterFindWorkerList, payload)
			callback(data)
		},
		//新增/修改职工数据
		*postWorkerDataCenterInsertOrUpdateWorkerApi({ payload, callback }, { call, put, select }) {
			const data = yield call(postWorkerDataCenterInsertOrUpdateWorker, payload)
			callback(data)
		},
		//首页人数统计
		*getWorkerDataCenterStatWorkersApi({ payload, callback }, { call, put, select }) {
			const data = yield call(getWorkerDataCenterStatWorkers, payload)
			callback(data)
		},
		//excel批量导入职工数据
		*postWorkerDataCenterImportExcelApi({ payload, callback }, { call, put, select }) {
			const data = yield call(postWorkerDataCenterImportExcel, payload)
			callback(data)
		},
		//批量导出职工信息excel
		*postWorkerDataCenterExportWorkerBathApi({ payload, callback }, { call, put, select }) {
			const data = yield call(postWorkerDataCenterExportWorkerBath, payload)
			callback(data)
		},
		//查询审核记录
		*getWorkerDataCenterFindAuditRecordApi({ payload, callback }, { call, put, select }) {
			const data = yield call(getWorkerDataCenterFindAuditRecord, payload)
			callback(data)
		},
		//审核职工信息-------驳回
		*postWorkerDataCenterAuditWorkerInfoApi({ payload, callback }, { call, put, select }) {
			const data = yield call(postWorkerDataCenterAuditWorkerInfo, payload)
			callback(data)
		},
		//审核职工信息-------通过
		*postWorkerDataCenterAuditWorkerInfoPassApi({ payload, callback }, { call, put, select }) {
			const data = yield call(postWorkerDataCenterAuditWorkerInfoPass, payload)
			callback(data)
		},
		//新增/修改变动记录
		*postWorkerDataCenterInsertOrUpdatePostChangeApi({ payload, callback }, { call, put, select }) {
			const data = yield call(postWorkerDataCenterInsertOrUpdatePostChange, payload)
			callback(data)
		},
		//查询变动记录
		*getWorkerDataCenterFindPostChangeModifyApi({ payload, callback }, { call, put, select }) {
			const data = yield call(getWorkerDataCenterFindPostChangeModify, payload)
			callback(data)
		},
		*getWorkerDataCenterFindChangeModifyApi({ payload }, { call, put, select }) {
			const data = yield call(getWorkerDataCenterFindPostChangeModify, payload)
			yield put({ type: 'getWorkerDataCenterFindChangeModify', payload: data })
		},

		//查询修改记录
		*getWorkerDataCenterFindUpdateRecordApi({ payload, callback }, { call, put, select }) {
			const data = yield call(getWorkerDataCenterFindUpdateRecord, payload)
			callback(data)
		},
		//一键督促完善
		*getWorkerDataCenterUrgePerfectApi({ payload, callback }, { call, put, select }) {
			const data = yield call(getWorkerDataCenterUrgePerfect, payload)
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
		// 批量删除职工数据
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
		getCommonBatchLoadDictGroups(state, action) {
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
			const workOptions = action.payload
				?.find(item => item.dictCode === 'DICT_WORK')
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
			const relationOptions = action.payload
				?.find(item => item.dictCode === 'DICT_RELATION')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const PhysicalExaminationOptions = action.payload
				?.find(item => item.dictCode === 'DICT_PHYS_RESULT')
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
			const PrincipalJobOptions = action.payload
				?.find(item => item.dictCode === 'HIGH_JOB')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			const postOptions = action.payload
				?.find(item => item.dictCode === 'DICT_POST')
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
			const physResultOptions = action.payload
				?.find(item => item.dictCode === 'DICT_PHYS_RESULT')
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
				physResultOptions,
				nationOptions,
				relationOptions,
				sexOptions,
				workOptions,
				eduOptions,
				eduNatureOptions,
				PhysicalExaminationOptions,
				postFunctionOptions,
				postTypeOptions,
				PrincipalJobOptions,
				postOptions,
				degreeLevelOptions,
				degreeTypeOptions,
				studyYearOptions,
				docTypeOptions
			}
		},
		getCommonGetNativeTree(state, action) {
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
			return { ...state, ProvinceCityAddressOptions, CityAddressOptions }
		},
		getCommonGetOrgs(state, action) {
			const SchoolOrgsOptions = action.payload?.map(item => {
				return { value: item.id, label: item.name }
			})
			return { ...state, SchoolOrgsOptions }
		},
		getCommonGetPosts(state, action) {
			const SchoolPostsOptions = action.payload?.map(item => {
				return { value: item.id, label: item.name }
			})
			return { ...state, SchoolPostsOptions }
		},
		getCommonGetOldPosts(state, action) {
			const SchoolOldPostsOptions = action.payload?.map(item => {
				return { value: item.id, label: item.name }
			})
			return { ...state, SchoolOldPostsOptions }
		},
		getWorkerDataCenterFindWorkerInfo(state, action) {
			return { ...state, getWorkerDataCenterFindWorkerInfo: action.payload }
		},
		getWorkerDataCenterFindChangeModify(state, action) {
			return { ...state, getWorkerDataCenterFindChangeModify: action.payload }
		}
	},
	//监听路由的变化、鼠标、键盘、服务器连接变化等，做出不同响应
	subscriptions: {}
}
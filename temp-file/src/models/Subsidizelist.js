/*
Author:石海贵
Description:资助管理models
Date:2023/10/16
*/

import { Subsidizelist as namespace } from '../utils/namespace'
import {
	postQuerySupportStudentMes,// 查询资助信息
	postAddSupportStudentMes,//新增添加资助信息
	postupdateSupportMes,//修改受助学生信息
	postqueryCatalog,//获取年级和班级目录
	getquerystudentMes,//查询学生信息
	DeletedeleteSupportMes,//删除学生资助信息
	postimportSupportMes,//批量导入资助信息
	postexportSupport,//批量导出资助信息
	getexportSupport,//下载资助导入模板信息
	getBatchLoadDictGroups,//批量加载多个字典组
	poststatisticsSupportMes//统计资助信息
} from '@/services/Subsidizelist'





export default {
	//命名
	namespace,
	//状态
	state: {},
	//异步操作
	effects: {
		//查询资助信息
		*querySupportStudentMesApi ({ payload, callback }, { call, put, select }) {
			const data = yield call(postQuerySupportStudentMes, payload)
			yield put({ type: 'PostQuerySupportStudentMes', payload: data.result.data.records })
			callback(data)
		},
		//获取年级班级目录
		*queryCatalogApi ({ payload, callback }, { call, put, select }) {
			const data = yield call(postqueryCatalog, payload)
			yield put({ type: 'GradeDirectoryOptions', payload: data.result.data.studyList })
		},
   // 批量加载多个字典组
   *getDictionaryDictGroups({ payload }, { call, put, select }) {
	   const data = yield call(getBatchLoadDictGroups, payload)
	   yield put({ type: 'DictionaryDictGroups', payload: data.result })
   },

		//查询学生信息
		*querystudentMesApi ({ payload, callback }, { call, put, select }) {
			const data = yield call(getquerystudentMes, payload)
			yield put({ type: 'AidedStudentOptions', payload: data.result.data })
			callback(data)
		},
		//统计资助信息
		*statisticsSupportMesApi ({ payload, callback }, { call, put, select }) {
			const data = yield call(poststatisticsSupportMes, payload)
			callback(data)
		},

		//新增添加资助信息
		*addSupportStudentMesApi ({ payload, callback }, { call, put, select }) {
			const data = yield call(postAddSupportStudentMes, payload)
			callback(data)
		},
		//修改受助学生信息
		*updateSupportMesApi ({ payload, callback }, { call, put, select }) {
			const data = yield call(postupdateSupportMes, payload)
			callback(data)
		},
		//删除学生资助信息
		*deleteSupportMesApi ({ payload, callback }, { call, put, select }) {
			const data = yield call(DeletedeleteSupportMes, payload)
			callback(data)
		},
		//批量导入资助信息
		*postimportSupportMesApi ({ payload, callback }, { call, put, select }) {
			const data = yield call(postimportSupportMes, payload)
			callback(data)
		},
		//批量导出资助信息
		*postexportSupportApi ({ payload, callback }, { call, put, select }) {
			const data = yield call(postexportSupport, payload)
			callback(data)
		},
		//批量导出资助信息
		*getexportSupportApi ({ payload, callback }, { call, put, select }) {
			const data = yield call(getexportSupport, payload)
			callback(data)
		}
	},
	//同步操作
	reducers: {
		//查询资助的信息
		DictionaryDictGroups (state, action) {
			// (资助类型) 处理成下拉框可用格式
			const supportTypeOptions = action.payload.data?.find(item => item.dictCode === 'DICT_SUPPORT_TYPE')
				?.dictItems?.map(item => {
					return { value: item.itemValue - 0, label: item.itemText }
				})
			// (贫困类型) 处理成下拉框可用格式
			const poorTypeOptions = action.payload.data?.find(item => item.dictCode === 'DICT_POOR_TYPE')
			?.dictItems?.map(item => {
				return { value: item.itemValue - 0, label: item.itemText }
			})

			return { ...state,poorTypeOptions,supportTypeOptions }
		},
		GradeDirectoryOptions(state, action) {
			// 年级班级内容处理 （年级-班级）
			const GradeDirectoryOptions = action.payload?.map(item => {
				return {
					value: item.id,
					label: item.name,
					children: item.stuGradeList?.map(itemOne => {
						return {
							value: itemOne.id,
							label: itemOne.name,
							children: itemOne.stuCalssList?.map(itemTo => {
								return {
									value: itemTo.id,
									label: itemTo.name,
								}
							})
						}
					})
				}
			})

			// 年级内容处理（届级）
			const gradeOptions = action.payload?.map(item => {
				return { value: item.id, label: item.name }
			})
			return { ...state, GradeDirectoryOptions, gradeOptions }
		},


		AidedStudentOptions(state, action) {
			console.log(action)
			// 查询学生信息
			const AidedStudentOptions = action.payload?.map(item => {
				return {
				
				}
			})
			return { ...state, AidedStudentOptions,}
		},
	},
	//监听路由的变化、鼠标、键盘、服务器连接变化等，做出不同响应
	subscriptions: {}
}

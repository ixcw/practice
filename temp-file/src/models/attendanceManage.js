/*
Author:韦靠谱
Description:考勤管理models
Date:2023/05/014
*/

import { Attendance as namespace } from '../utils/namespace'
import {
	getFindAllSection, //查看所有课节
	postInsertClassAttendanceRecord, // 教师记录考勤
	postFindDetail, //查看班级记录详情
	postPageFindAttendanceRecord, //分页查询历史考勤记录
	getFindDetailById, //班级记录-请假详情
	postFindMyClassInfo //获取班级信息
} from '@/services/attendanceManage'

export default {
	//命名
	namespace,
	//状态
	state: {},
	//异步操作
	effects: {
		//查看所有课节
		*getFindAllSectionApi({ payload, callback }, { call, put, select }) {
			const data = yield call(getFindAllSection, payload)
			yield put({ type: 'getFindAllSection', payload: data.result.data })
		},
		//教师记录考勤
		*postInsertClassAttendanceRecordApi({ payload, callback }, { call, put, select }) {
			const data = yield call(postInsertClassAttendanceRecord, payload)
			callback(data)
		},
		//查看班级记录详情
		*postFindDetailApi({ payload, callback }, { call, put, select }) {
			const data = yield call(postFindDetail, payload)
			callback(data)
		},
		//分页查询历史考勤记录
		*postPageFindAttendanceRecordApi({ payload, callback }, { call, put, select }) {
			const data = yield call(postPageFindAttendanceRecord, payload)
			callback(data)
		},
		//班级记录-请假详情
		*getFindDetailByIdApi({ payload, callback }, { call, put, select }) {
			const data = yield call(getFindDetailById, payload)
			callback(data)
		},
		//获取班级信息
		*postFindMyClassInfoApi({ payload, callback }, { call, put, select }) {
			const data = yield call(postFindMyClassInfo, payload)
			yield put({ type: 'postFindMyClassInfo', payload: data.result.data })
		}
	},
	//同步操作
	reducers: {
		//查看所有课节
		getFindAllSection(state, action) {
			// 处理成下拉框可用格式
			const FindAllSectionOptions = action.payload?.map(item => {
				return {
					value: item.id,
					label: item.sectionName,
					schoolid: item.schoolId,
					sectionno: item.sectionNo,
					endtime: item.endTime,
					starttime: item.startTime
				}
			})
			return { ...state, FindAllSectionOptions }
		},
		//获取班级信息
		postFindMyClassInfo(state, action) {
			// 处理成下拉框可用格式
			const processedIds = [] // 用于保存已经添加的id
			const ClassInfoOptions = action.payload?.reduce((options, item) => {
				if (!processedIds.includes(item.id)) {
					// 判断id是否已经添加过
					processedIds.push(item.id) // 将id添加到已处理数组中
					options.push({
						value: item.id,
						label: item.name
					}) // 将当前数据添加到ClassInfoOptions数组中
				}
				return options
			}, []) // 初始值设为一个空数组

			return { ...state, ClassInfoOptions }
		}
	},
	//监听路由的变化、鼠标、键盘、服务器连接变化等，做出不同响应
	subscriptions: {}
}

/**
 * 按节次查看
 * @author 韦靠谱
 * @date 2023/9/27
 * @since 1.0.0
 * @Modified
 */
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { Col, Row, DatePicker, Space, Button,Empty, Descriptions, Select, Menu, Spin } from 'antd'
import { Attendance as namespace } from '@/utils/namespace'
import userInfoCache from '@/caches/userInfo'
import styles from './index.less'

const AttendanceSwitch = props => {
	const { showComponent, setShowComponent, FindAllSectionOptions, dispatch, ClassInfoOptions } = props
	const loginUserInfo = userInfoCache() || {}
	const [loading, setLoading] = useState(false)
	const defaultDate = moment() // 获取当前日期
	const [findDetail, setFindDetail] = useState({}) //班级记录详情
	const [AbsenceRecord, setAbsenceRecord] = useState([]) //缺勤原因记录
	const [InquireArgument, setInquireArgument] = useState({}) //获取班级记录详情接口传参

	// 限制可选择的时间
	const disabledDate = current => {
		return current && current > moment().endOf('day')
	}
	// 记录考勤
	const handleClick = () => {
		setShowComponent({ ...showComponent, add: true })
	}
	// 切换查看方式
	const onSwitchHandleClick = () => {
		setShowComponent({ ...showComponent, switch: !showComponent.switch })
	}

	useEffect(() => {
		getFindDetail(InquireArgument)
	}, [InquireArgument])

	/**
	 * 获取班级记录详情
	 * @param	ymd 	时间戳	string	必传	课节所在时间戳
	 * @param	classId		班级id	number	必传	班级id
	 * @param	section		课节编号	number	非必传	(不传为查询app学生请假情况)
	 * @param	value		其他参数	Object	修改查询条件
	 */
	const getFindDetail = (value, classId = loginUserInfo?.classId, ymd = defaultDate.startOf('day').valueOf()) => {
		setAbsenceRecord([])
		setFindDetail({})
		setLoading(true)
		dispatch({
			type: namespace + '/postFindDetailApi',
			payload: { classId, ymd, ...value },
			callback: res => {
				if (res.result?.code === 200) {
					const appRecordList = res.result.data?.appRecordList
					const webRecordClassDetail = res.result.data?.webRecord?.classDetail
					const absenceRecord = appRecordList ? (webRecordClassDetail ? appRecordList.concat(webRecordClassDetail) : appRecordList) : webRecordClassDetail ? webRecordClassDetail : []
					setAbsenceRecord(absenceRecord)
					setFindDetail(res.result.data)
				}
				setLoading(false)
			}
		})
	}

	// 班级下拉框
	const handleClassIdChange = value => {
		setInquireArgument({ ...InquireArgument, classId: value })
	}
	// 时间下拉框
	const handleDatePickerChange = date => {
		setInquireArgument({ ...InquireArgument, ymd: date.startOf('day').valueOf() })
	}
	// 节次下拉框
	const handleSectionChange = value => {
		console.log(value)
		setInquireArgument({ ...InquireArgument, section: value.value })
	}

	const newClassList = FindAllSectionOptions?.map(item => {
		return (
			<Menu.Item
				key={item.value}
				style={{
					height: '48px',
					marginRight: '8px',
					// color:'#fff',
					// background: "#2F78FF",
					borderRadius: '6px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
					border: '1px solid #E1E2E5'
				}}
				onClick={() => handleSectionChange(item)}>
				{item.label}
			</Menu.Item>
		)
	})

	return (
		<div id={styles['attendanceSwitch']}>
			<div className={styles.container}>
				{/* 上部分内容 */}
				<div className={styles.top}>
					<div className={styles.xue}></div>
					<div className={styles.sheng}>历史考勤记录</div>
					<div className={`${styles['my-div']}`}>
						<div>
							{window.$PowerUtils.judgeButtonAuth(window.location.hash.replace(/^#/, ''), '编辑') ? (
								<Button type='primary' onClick={handleClick} className={styles.BtnSty}>
									记录考勤
								</Button>
							) : (
								''
							)}
						</div>
						<Button onClick={onSwitchHandleClick} className={styles.BtnSty2}>
							按人次查看
						</Button>
					</div>
				</div>

				{/* 中间部分内容 */}
				<div className={styles.middle}>
					<Row style={{ margin: '30px' }}>
						<Space style={{ marginRight: '15px' }}>
							班级名称：
							<Select
								placeholder='请选择班级'
								filterOption={(inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0}
								showSearch
								allowClear
								style={{ width: 200 }}
								onChange={handleClassIdChange}
								options={ClassInfoOptions}
								defaultValue={loginUserInfo?.classId}
							/>
						</Space>
						<Space>
							任课时间：
							<DatePicker disabledDate={disabledDate} defaultValue={defaultDate} allowClear placeholder='请选择' style={{ width: 200 }} onChange={handleDatePickerChange} />
						</Space>
					</Row>
					<Row>
						<Col span={3}>
							<Menu>{newClassList}</Menu>
						</Col>
						<Col span={21} style={{ padding: '0 4% 0 2%' }}>
							<Spin spinning={loading}>
								<Row style={{ margin: '20px 0 30px 0' }}>
									<Col offset={10} span={3}>
										<h1 style={{ fontWeight: 'bold', fontSize: '20px' }}>请假详情</h1>
									</Col>
								</Row>
								<Descriptions column={4}>
									<Descriptions.Item label='记录时间'>{findDetail?.webRecord?.createTime ? moment(findDetail.webRecord.createTime).format('YYYY年MM月DD日') : ''}</Descriptions.Item>
									<Descriptions.Item label='任课教师'>{findDetail?.webRecord?.teacherName}</Descriptions.Item>
									<Descriptions.Item label='上课时间'>{findDetail?.webRecord?.ymd ? moment(findDetail?.webRecord?.ymd).format('YYYY年MM月DD日') : ''}</Descriptions.Item>
									<Descriptions.Item label='班级名称'>{findDetail?.webRecord?.className}</Descriptions.Item>
									<Descriptions.Item label='节次'>{findDetail?.webRecord?.sectionText}</Descriptions.Item>
									<Descriptions.Item label='实到人数'>{findDetail?.webRecord?.realNum}</Descriptions.Item>
									<Descriptions.Item label='应到人数'>{findDetail?.webRecord?.totalNum}</Descriptions.Item>
									<Descriptions.Item label='缺勤人数'>{findDetail?.webRecord?.notAppearNum}</Descriptions.Item>
								</Descriptions>
								{Array.isArray(AbsenceRecord) && AbsenceRecord.length !== 0 ? (
									AbsenceRecord.map(item => (
										<div key={item.id} className={styles.leaveBox}>
											<Descriptions>
												<Descriptions.Item label='缺勤学生姓名'>{item.studentName}</Descriptions.Item>
												<Descriptions.Item span={item.isLeave === 1 ? 1 : 2} label='是否请假' contentStyle={{ color: '#2f78ff' }}>
													{item.isLeave === 1 ? '是' : '否'}
												</Descriptions.Item>
												{item.isLeave === 1 && (
													<>
														<Descriptions.Item label='请假类型' contentStyle={{ color: '#2f78ff' }}>
															{item.leaveType === 1 ? '事假' : item.leaveType === 2 ? '病假' : item.leaveType === 3 ? '其他' : item.leaveType === 4 ? '未请假' : '类型错误'}
														</Descriptions.Item>
														<Descriptions.Item label='请假时长'>{item.timeDuration}</Descriptions.Item>
														<Descriptions.Item label='请假时间' span={2}>
															{moment(item.ymdStart).format('YYYY年MM月DD日HH:mm') + ' —— ' + moment(item.ymdEnd).format('YYYY年MM月DD日HH:mm')}
														</Descriptions.Item>
														<Descriptions.Item label='请假原因' span={3}>
															{item.reason}
														</Descriptions.Item>
													</>
												)}
												{item.isLeave === 0 && (
													<Descriptions.Item label='联系家长' span={3}>
														{Array.isArray(item.connectionPeoples) && item.connectionPeoples.length !== 0
															? item.connectionPeoples.map((item, index) => (
																	<div span={8} key={index} style={{ color: '#2f78ff', marginRight: '20px' }}>
																		{item.name} {item.phone}
																	</div>
															  ))
															: <div style={{ color: '#2f78ff', marginRight: '20px' }}>该学生未完善家长联系方式</div> || (
																	<div style={{ color: '#2f78ff', marginRight: '20px' }}>该学生未完善家长联系方式</div>
															  )}
													</Descriptions.Item>
												)}
											</Descriptions>
										</div>
									))
								) : (
									<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
								)}
							</Spin>
						</Col>
					</Row>
				</div>
			</div>
		</div>
	)
}

const mapStateToProps = state => {
	return {
		FindAllSectionOptions: state[namespace].FindAllSectionOptions,
		ClassInfoOptions: state[namespace].ClassInfoOptions
	}
}

export default connect(mapStateToProps)(AttendanceSwitch)

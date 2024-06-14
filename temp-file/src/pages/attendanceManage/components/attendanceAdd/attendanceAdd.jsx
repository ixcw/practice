/**
 * 新增考勤（记录考勤）
 * @author 韦靠谱
 * @date 2023/9/27
 * @since 1.1.0
 * @Modified
 */
import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { Col, Row, DatePicker, Select, Descriptions, Empty, Button, message, Modal, Form, Input, Radio, Spin } from 'antd'
import moment from 'moment'
import { Attendance as namespace } from '@/utils/namespace'
import userInfoCache from '@/caches/userInfo'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import styles from './index.less'
const { TextArea } = Input

const AttendanceAdd = props => {
	const { dispatch, showComponent, setShowComponent, FindAllSectionOptions, ClassInfoOptions } = props
	const loginUserInfo = userInfoCache() || {}
	const [form] = Form.useForm()
	const defaultDate = moment() // 获取当前日期
	const [loading, setLoading] = useState(false)
	const [loadingDetail, setLoadingDetail] = useState(false)
	const [isLeaves, setIsLeaves] = useState({}) //请假状态
	const [selectedStudentIds, setSelectedStudentIds] = useState({}) //家长联系方式
	const [studentsOptions, setStudentsOptions] = useState([]) //缺勤学生名单
	const [findDetail, setFindDetail] = useState({}) //班级记录详情
	const [AbsenceRecord, setAbsenceRecord] = useState([]) //缺勤原因记录
	const [InquireArgument, setInquireArgument] = useState({}) //获取班级记录详情接口传参
	const [classSection, setClassSection] = useState({}) //课节节次详情
	const [dateString, setDateString] = useState(defaultDate) //选择时间
	const [deficiencyNum, setDeficiencyNum] = useState(null) //缺勤人数
	const [originDeficiencyNum, setOriginDeficiencyNum] = useState(null) //原始缺勤人数

	/**
	 * 获取班级记录详情
	 * @param {string}	ymd 	时间戳	必传	课节所在时间戳
	 * @param {number}	classId	班级id	必传	班级id
	 * @param {number}	section	课节编号	非必传	(不传为查询app学生请假情况)
	 * @param {Object}	value	其他参数	修改查询条件
	 */
	const getFindDetail = (value, classId = loginUserInfo?.classId, ymd = defaultDate.startOf('day').valueOf()) => {
		setAbsenceRecord([])
		setFindDetail({})
		setLoadingDetail(true)
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
					form.setFieldsValue({ realNum: res.result.data.webRecord?.realNum })
					setDeficiencyNum(res.result.data.webRecord?.notAppearNum ? res.result.data.webRecord?.notAppearNum : 0)
					setOriginDeficiencyNum(res.result.data.webRecord?.notAppearNum ? res.result.data.webRecord?.notAppearNum : 0)
					setStudentsOptions(
						res.result.data.students?.map(item => {
							return { value: item.studentId, label: item.studentName, connectionpeoples: item.connectionPeoples }
						})
					)
				}
				setLoadingDetail(false)
			}
		})
	}

	// 返回事件
	const onBack = () => {
		setShowComponent({ ...showComponent, add: !showComponent.add })
	}
	// 班级下拉框
	const handleClassIdChange = value => {
		setInquireArgument({ ...InquireArgument, classId: value })
		form.setFieldsValue({ realNum: null })
		form.setFieldsValue({ classDetail: null })
		setDeficiencyNum(0)
	}
	// 节次下拉框
	const handleSectionChange = option => {
		setClassSection(option)
		computeTime(option, dateString)
		form.setFieldsValue({ realNum: null })
		form.setFieldsValue({ classDetail: null })
		setInquireArgument({ ...InquireArgument, section: option.value })
	}
	// 实到人数输入框
	const handleRealNumChange = e => {

		if (/^[0-9]\d*$/.test(e.target.value)) {
			if (findDetail?.totalNum - e.target.value - originDeficiencyNum >= 0) {
				setDeficiencyNum(findDetail?.totalNum - e.target.value)
			} else {
				form.setFieldsValue({ realNum: null })
				setDeficiencyNum(originDeficiencyNum)
				message.error('实到人数不能大于应到人数！')
			}
		} else {
			form.setFieldsValue({ realNum: null })
			setDeficiencyNum(originDeficiencyNum)
			message.error('请输入正整数！')
		}
	}
	// 限制可选择的时间
	const disabledDate = current => {
		return current && current > moment().endOf('day')
	}

	/**
	 * 增加动态表单项
	 * @param	add	表单组件的 add 方法
	 */
	const addRecords = add => {
		const { classDetail } = form.getFieldsValue()
		if ((classDetail?.length || 0) < deficiencyNum - originDeficiencyNum) {
			add()
		} else if (deficiencyNum === 0) {
			message.error('该班该节课满勤！')
		} else {
			message.error('缺勤记录不能大于缺勤人数！')
		}
	}

	/**
	 * 删除动态表单项
	 * @param	index	动态表单下标
	 */
	const removeRecords = index => {
		setSelectedStudentIds(prevState => ({
			...prevState,
			[index]: null
		}))
	}

	/**
	 * 选择时间组件
	 * @param	date	moment时间对象
	 */
	const handleDatePickerChange = date => {
		setDateString(date)
		computeTime(classSection, date)
		setInquireArgument({ ...InquireArgument, ymd: date?.startOf('day')?.valueOf() })
	}

	/**
	 * 计算时间
	 * @param	section	节次对象
	 * @param	date	moment时间对象
	 */
	const computeTime = (section, date) => {
		if (Object.keys(section).length !== 0) {
			// 计算请假时长
			const startTime = moment(section.starttime, 'HH:mm')
			const endTime = moment(section.endtime, 'HH:mm')
			let duration
			if (startTime.isValid() && endTime.isValid()) {
				duration = moment.duration(endTime.diff(startTime)).asMinutes()
			} else {
				duration = '——'
			}
			// 计算请假时间
			const TimePeriod = date.format('YYYY年M月D日') + (section.starttime ? section.starttime : '') + '——' + date.format('YYYY年M月D日') + (section.endtime ? section.endtime : '')
			setClassSection({ ...section, duration, TimePeriod })
		}
	}

	/**
	 * 是否请假
	 * 根据是否请假展示请假理由获取家长联系方式
	 * @param	e 	事件对象	获取单选框的value值
	 * @param	index 	动态表单项下标
	 * @param	name 	动态表单项个数
	 */
	const handleRadioChange = (e, index, name) => {
		const selectedStudent = form.getFieldValue(['classDetail', name, 'studentName'])
		setIsLeaves(prevState => ({
			...prevState,
			[index]: e.target.value
		}))
		setSelectedStudentIds(prevState => ({
			...prevState,
			[index]: e.target.value !== 1 ? selectedStudent?.value : null
		}))
	}

	/**
	 * 缺勤学生姓名下拉框
	 * 展示家长联系方式
	 * @param	e 	事件对象	获取学生家长详情
	 * @param	index 	表单项下标
	 */
	const handleStudentNameChange = (e, index) => {
		setSelectedStudentIds(prevState => ({
			...prevState,
			// [index]: isLeaves[index] !== 1 ? e?.value : null
			[index]: e?.value
		}))
		if (Object.values(selectedStudentIds).includes(e.value)) {
			Modal.warning({ title: '警告通知', content: '缺勤学生姓名有重复，请确认！' })
		}
	}

	// 对下拉框选项进行模糊搜索
	const TitleFilterOption = (input, option) => {
		return (option?.label ? option?.label : '').toLowerCase().includes(input.toLowerCase())
	}

	// 表单成功
	const onFinish = values => {
		if (values?.classDetail === undefined || values?.classDetail === null) return message.error('您还没有添加缺勤记录！')
		if (values?.classDetail?.length !== deficiencyNum - originDeficiencyNum) return message.error('缺勤人数和缺勤记录不一致！')
		// const allValues = values?.classDetail.map(item => item.studentName.value)//过滤出缺勤的id用于判断是否有重复项
		// if (allValues.length !== new Set(allValues).size) Modal.warning({ title: '警告通知',content: '缺勤学生姓名有重复，请确认！'})
		setLoading(true)
		const modifyValues = {
			section: values.section.value,
			ymd: values.ymd?.startOf('day')?.valueOf(), //课节所属日期时间戳
			...(findDetail.totalNum && { totalNum: findDetail.totalNum }), //应到人数
			...(findDetail.webRecord && { id: findDetail.webRecord.id }), // 班级记录主表id
			classDetail:
				values['classDetail'] &&
				values['classDetail'].map(item => {
					return {
						classId: values.classId, //班级id
						isLeave: item.isLeave, //是否请假 1=是，0=否
						// ...(item.isLeave === 1 && { leaveType: item.leaveType }), //请假类型
						...(item.isLeave === 1 && { reason: item.reason }), //请假理由
						leaveType: item.isLeave === 1 ? item.leaveType : 4, //请假类型
						studentName: item.studentName.label, //学生姓名
						studentId: item.studentName.value, //学生id
						ymd: values.ymd?.startOf('day')?.valueOf() //请假时间
					}
				})
		}
		const { ...newValues } = { ...values, ...modifyValues }
		dispatch({
			type: namespace + '/postInsertClassAttendanceRecordApi',
			payload: newValues,
			callback: res => {
				if (res.result?.code === 200) {
					message.success('添加考勤记录成功')
					form.resetFields()
					getFindDetail(InquireArgument)
					form.setFieldsValue({
						section: { key: values.section.value, label: values.section.label, value: values.section.value }
					})
					setLoading(false)
				}
				setLoading(false)
			}
		})
	}

	useEffect(() => {
		getFindDetail(InquireArgument)
	}, [InquireArgument])

	return (
		<div id={styles['attendanceAdd']}>
			<div className={styles.container}>
				<Row justify='space-between' className={styles.title}>
					<Col span={10} className={styles.titleLeft}>
						记录考勤
					</Col>
					<Col span={2}>
						<Button onClick={onBack} className={styles.titleBtn}>
							返回
						</Button>
					</Col>
				</Row>

				<Form name='basic' form={form} initialValues={{ ymd: defaultDate, classId: loginUserInfo?.classId }} onFinish={onFinish} autoComplete='off' style={{ marginTop: '30px' }}>
					<Form.Item label='选择时间' name='ymd' rules={[{ required: true }]}>
						<DatePicker disabledDate={disabledDate} onChange={handleDatePickerChange} />
					</Form.Item>
					<Row>
						<Col span={6}>
							<Form.Item label='班级名称' name='classId' rules={[{ required: true }]}>
								<Select onChange={handleClassIdChange} options={ClassInfoOptions} />
							</Form.Item>
						</Col>
						<Col span={6} offset={2}>
							<Form.Item label='节次' name='section' rules={[{ required: true }]}>
								<Select onChange={(_, option) => handleSectionChange(option)} labelInValue={true} options={FindAllSectionOptions} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							<Form.Item label='实到人数' name='realNum' rules={[{ required: true }]}>
								<Input onChange={handleRealNumChange} type='text' suffix='人' />
							</Form.Item>
						</Col>
						<Col span={6} offset={2}>
							<Row>
								<Col span={10}>应到人数：{findDetail?.totalNum ? findDetail.totalNum : '0'}人</Col>
								<Col span={10} offset={4}>
									缺勤人数：{deficiencyNum}人
								</Col>
							</Row>
						</Col>
					</Row>
					<Row>
						<Col span={2}>缺勤原因记录：</Col>
						<Col span={18}>
							<Spin spinning={loadingDetail}>
								{Array.isArray(AbsenceRecord) && AbsenceRecord.length !== 0 ? (
									AbsenceRecord.map(item => (
										<div key={item.id} className={styles.middle}>
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
															? item.connectionPeoples.map((item2, index) => (
																	<div span={8} key={index} style={{ color: '#2f78ff', marginRight: '20px' }}>
																		{item2.name} {item2.phone}
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
							<Form.List name='classDetail'>
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, ...restField }) => (
											<div key={key} className={styles.middle}>
												<Row justify='space-around' align='middle'>
													<Col span={22}>
														<Row gutter={[12, 0]}>
															<Col span={10}>
																<Form.Item label='缺勤学生姓名' name={[name, 'studentName']} rules={[{ required: true }]}>
																	<Select
																		onChange={e => handleStudentNameChange(e, key)}
																		options={studentsOptions}
																		showSearch
																		optionFilterProp='label'
																		filterOption={TitleFilterOption}
																		labelInValue={true}
																		placeholder='请选择姓名'
																	/>
																</Form.Item>
															</Col>
															<Col span={10} offset={4}>
																<Form.Item label='是否请假' name={[name, 'isLeave']} rules={[{ required: true }]}>
																	<Radio.Group onChange={e => handleRadioChange(e, key, name)}>
																		<Radio value={1}> 是 </Radio>
																		<Radio value={0}> 否 </Radio>
																	</Radio.Group>
																</Form.Item>
															</Col>
														</Row>
														{isLeaves[key] === 1 || isLeaves[key] == null ? (
															<>
																<Form.Item label='请假类型' name={[name, 'leaveType']} rules={[{ required: true }]}>
																	<Radio.Group>
																		<Radio value={1}> 事假 </Radio>
																		<Radio value={2}> 病假 </Radio>
																		<Radio value={3}> 其他 </Radio>
																	</Radio.Group>
																</Form.Item>
																<Row style={{ marginBottom: '20px' }}>
																	<Col span={8}>请假时长：{(classSection?.duration ? classSection?.duration : '——') + '分钟'}</Col>
																	<Col span={16}>请假时间：{classSection?.TimePeriod}</Col>
																</Row>
															</>
														) : null}
														{isLeaves[key] === 1 || isLeaves[key] == null ? (
															<Form.Item label='请假原因' name={[name, 'reason']}>
																<TextArea rows={4} placeholder='请输入原因' />
															</Form.Item>
														) : (
															<Row style={{ marginBottom: '20px' }}>
																<Col span={3}>联系家长：</Col>
																<Col span={21}>
																	<Row>
																		{(Array.isArray(studentsOptions) &&
																			(studentsOptions.filter(item => selectedStudentIds[key] === item.value)[0]?.connectionpeoples?.length !== 0 ? (
																				studentsOptions
																					.filter(item => selectedStudentIds[key] === item.value)[0]
																					?.connectionpeoples?.map((item, index) => (
																						<Col span={6} key={index} style={{ color: '#2f78ff' }}>
																							{item.name} {item.phone}
																						</Col>
																					))
																			) : (
																				<div style={{ color: '#2f78ff', marginRight: '20px' }}>该学生未完善家长联系方式</div>
																			))) || <div style={{ color: '#2f78ff', marginRight: '20px' }}>该学生未完善家长联系方式</div>}
																	</Row>
																</Col>
															</Row>
														)}
													</Col>
													<Col span={1} offset={1}>
														<MinusCircleOutlined
															onClick={() => {
																removeRecords(key)
																remove(name)
															}}
														/>
													</Col>
												</Row>
											</div>
										))}
										<Form.Item wrapperCol={{ span: 24 }}>
											<Button type='dashed' onClick={() => addRecords(add)} block icon={<PlusOutlined />} style={{ height: '50px' }}>
												添加缺勤记录
											</Button>
										</Form.Item>
									</>
								)}
							</Form.List>
						</Col>
					</Row>
					<Form.Item>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<Button onClick={() => onBack()} style={{ marginRight: '40px' }}>
								取消
							</Button>
							<Button loading={loading} type='primary' htmlType='submit'>
								确定
							</Button>
						</div>
					</Form.Item>
				</Form>
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

export default connect(mapStateToProps)(AttendanceAdd)

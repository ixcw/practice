/*
Author:韦靠谱
Description:职工变动
Date:2023/05/17
Modified By:
*/

import React, { useState, useEffect } from 'react'
import { Modal, Tabs, Button, Spin, Row, Col, message, notification, Input, Empty, Form, Radio, Checkbox, DatePicker, Select, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'
import { connect } from 'dva'
import { EmployeeData as namespace } from '@/utils/namespace'
import styles from './EmployeeChange.less'
const { Option } = Select

function EmployeeChange(props) {
	const { EmployeeChangeOpen, DetailLoading, getTeacherList,ListDataPageSize, AllScreening,ListDataCurrentPage, SchoolOldPostsOptions, showEmployeeChange, SchoolPostsOptions, SchoolOrgsOptions, getWorkerDataCenterFindWorkerInfo, dispatch } = props

	// 变动类型单选按钮的默认值
	const [ChangeTypeValue, setChangeTypeValue] = useState(null)
	const [Office, setOffice] = useState(false)
	const [Duty, setDuty] = useState(false)
	const [loading, setLoading] = useState(false)
	const [Demission, setDemission] = useState(false)
	const [DefaultCheckboxValue, setDefaultCheckboxValue] = useState([])
	const [ChangeRecordResult, setChangeRecordResult] = useState([])
	const [basicForm] = Form.useForm()
	const [RecordModifyForm] = Form.useForm()

	/**
	 * 变动后处室
	 * @param {number}	orgId 	处室id
	 */
	const handleDepartmentChange = orgId => {
		RecordModifyForm.setFieldsValue({ postId: null })
		basicForm.setFieldsValue({ postId: null })
		dispatch({
			type: namespace + '/getCommonGetPostsApi',
			payload: { orgId }
		})
	}

	/**
	 * 变动前处室
	 * @param {number}	orgId 	处室id
	 */
	const handleOldDepartmentChange = orgId => {
		RecordModifyForm.setFieldsValue({ oldPostId: null })
		basicForm.setFieldsValue({ oldPostId: null })
		dispatch({
			type: namespace + '/getCommonGetPostsOldApi',
			payload: { orgId }
		})
	}

	/**
	 * 获取变动记录数据
	 */
	const ChangeData = () => {
		setLoading(true)
		dispatch({
			type: namespace + '/getWorkerDataCenterFindPostChangeModifyApi',
			payload: {
				userId: getWorkerDataCenterFindWorkerInfo?.workerId
			},
			callback: res => {
				setChangeRecordResult(res.result)
				setLoading(false)
			}
		})
	}

	/**
	 * 变动类型单选按钮事件
	 */
	const onChangeTypeValue = e => {
		setChangeTypeValue(e.target.value)
		if (e.target.value == '4') {
			setDemission(true)
		} else {
			setDemission(false)
		}
	}

	useEffect(() => {
		if (EmployeeChangeOpen) {
            // ChangeData()
			dispatch({
				type: namespace + '/getCommonGetPostsApi',
				payload: { orgId: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.orgId }
			})
			dispatch({
				type: namespace + '/getCommonGetPostsOldApi',
				payload: { orgId: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.orgId }
			})
		} else {
			basicForm.resetFields()
		}
	}, [EmployeeChangeOpen])

	// 判断变动记录是否存在决定设置变动前的默认值
	// useEffect(() => {
	// 	if (EmployeeChangeOpen && ChangeRecordResult?.length === 0) {
	// 		basicForm.setFieldsValue({
	// 			oldOrgId: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.orgId,
	// 			oldPostId: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.postId
	// 		})
	// 	} else {
	// 		basicForm.resetFields()
	// 	}
	// }, [ChangeRecordResult])

	// 开始时间不能大于结束时间---start----
	const [StartDatePicker, setStartDatePicker] = useState(null)
	const [EndDatePicker, setEndDatePicker] = useState(null)
	const onStartDatePicker = value => {
		!value ? setStartDatePicker(null) : setStartDatePicker(new Date(Date.parse(value?.format()))?.getTime())
	}
	const onEndDatePicker = value => {
		!value ? setEndDatePicker(null) : setEndDatePicker(new Date(Date.parse(value?.format()))?.getTime())
	}
	const disabledStartDate = Value => {
		const startValue = new Date(Date.parse(Value.format())).getTime()
		if (!startValue || !EndDatePicker) {
			return false
		}
		return startValue.valueOf() > EndDatePicker.valueOf()
	}
	const disabledEndDate = Value => {
		const endValue = new Date(Date.parse(Value.format())).getTime()
		if (!endValue || !StartDatePicker) {
			return false
		}
		return StartDatePicker.valueOf() >= endValue.valueOf()
	}
	// 开始时间不能大于结束时间---end----

	// 调整类型
	const onChangeTypeAdjust = checkedValues => {
		setDefaultCheckboxValue(checkedValues)
		setOffice(checkedValues.includes('OfficeAdjust'))
		setDuty(checkedValues.includes('PositionAdjust'))
	}

	// 新增变动
	const onFinish = values => {
		setLoading(true)
		if (values.flag == '4') {
			dispatch({
				type: namespace + '/postWorkerDataCenterInsertOrUpdatePostChangeApi',
				payload: {
					flag: 4,
					userId: getWorkerDataCenterFindWorkerInfo?.workerId,
					reason: values.reason,
					leavePostDate: values['leavePostDate'] && values['leavePostDate'].format('YYYY/MM/DD')
				},
				callback: res => {
					if (res?.err?.code !== 601) {
						message.success('职工变动修改成功！')
						setLoading(false)
						showEmployeeChange(false)
						setChangeTypeValue(null)
						setDefaultCheckboxValue([])
						setChangeRecordResult([])
						setStartDatePicker(null)
						setEndDatePicker(null)
						getTeacherList(ListDataCurrentPage, ListDataPageSize, AllScreening)
					} else {
						setLoading(false)
					}
				}
			})
		} else {
			dispatch({
				type: namespace + '/postWorkerDataCenterInsertOrUpdatePostChangeApi',
				payload: {
					...values,
					...{
						userId: getWorkerDataCenterFindWorkerInfo?.workerId,
						startDate: values['startDate'] && values['startDate'].format('YYYY/MM/DD'),
						endDate: values['endDate'] && values['endDate'].format('YYYY/MM/DD'),
						leavePostDate: values['leavePostDate'] && values['leavePostDate'].format('YYYY/MM/DD')
					}
				},
				callback: res => {
					if (res?.err?.code !== 601) {
						message.success('职工变动修改成功！')
						setLoading(false)
						showEmployeeChange(false)
						setChangeTypeValue(null)
						setDefaultCheckboxValue([])
						setChangeRecordResult([])
						setStartDatePicker(null)
						setEndDatePicker(null)
						getTeacherList(ListDataCurrentPage, ListDataPageSize, AllScreening)
					}
				}
			})
		}
	}

	// 变动记录
	const onChangeRecordFinish = values => {
		setChangeRecordResult([])
		dispatch({
			type: namespace + '/getWorkerDataCenterFindPostChangeModifyApi',
			payload: {
				...values,
				...{
					userId: getWorkerDataCenterFindWorkerInfo?.workerId,
					startTime: values['startTime'] && values['startTime'].format('YYYY/MM/DD'),
					endTime: values['endTime'] && values['endTime'].format('YYYY/MM/DD')
				}
			},
			callback: res => {
				if (res.result && res.result.length > 0) {
					setChangeRecordResult(res.result)
				}
			}
		})
	}

	// 标签页切换
	const onChangeTabs = key => {
		if (key == 'ChangeRecord') {
			setStartDatePicker(null)
			setEndDatePicker(null)
			setChangeRecordResult([])
			ChangeData()
		}
	}

	// 变动记录修改
	const [isRecordModifyModalOpen, setIsRecordModifyModalOpen] = useState(false)
	const [RecordModifyData, setRecordModifyData] = useState(null)
	// 打开修改窗口
	const showRecordModifyModal = value => {
		dispatch({
			type: namespace + '/getCommonGetPostsApi',
			payload: { orgId: value?.orgId }
		})
		dispatch({
			type: namespace + '/getCommonGetPostsOldApi',
			payload: { orgId: value?.oldOrgId }
		})
		setRecordModifyData(value)
		setStartDatePicker(value.startDate)
		setEndDatePicker(value.endDate)
		RecordModifyForm.setFieldsValue({
			id: value?.id,
			userId: value?.userId,
			flag: value?.flag,
			startDate: value.startDate && moment(value.startDate),
			endDate: value.endDate && moment(value.endDate),
			leavePostDate: value.flag == 4 ? value.startDate && moment(value.startDate) : null,
			oldOrgId: value?.oldOrgId,
			orgId: value?.orgId,
			oldPostId: value?.oldPostId,
			postId: value?.postId,
			reason: value?.reason
		})
		setIsRecordModifyModalOpen(true)
	}
	// 确认修改记录数据
	const handleRecordModifyOk = () => {
		setLoading(true)
		RecordModifyForm.validateFields()
			.then(values => {
				dispatch({
					type: namespace + '/postWorkerDataCenterInsertOrUpdatePostChangeApi',
					payload: {
						...values,
						...{
							id: RecordModifyData?.id,
							userId: RecordModifyData?.userId,
							startDate: values['startDate'] && values['startDate'].format('YYYY/MM/DD'),
							endDate: values['endDate'] && values['endDate'].format('YYYY/MM/DD'),
							leavePostDate: values['leavePostDate'] && values['leavePostDate'].format('YYYY/MM/DD')
						}
					},
					callback: res => {
						if (res.result === null) {
							notification.success({ description: '变动记录修改成功！' })
							setLoading(false)
							setRecordModifyData(null)
							setStartDatePicker(null)
							setEndDatePicker(null)
							setIsRecordModifyModalOpen(false)
							ChangeData()
						} else {
							setLoading(false)
						}
					}
				})
			})
			.catch(info => {})
	}
	// 变动记录修改弹窗关闭
	const handleRecordModifyCancel = () => {
		setIsRecordModifyModalOpen(false)
		setRecordModifyData(null)
		setStartDatePicker(null)
		setEndDatePicker(null)
	}

	return (
		<>
			<Modal
				title='职工变动'
				visible={EmployeeChangeOpen}
				onCancel={() => {
					showEmployeeChange(false)
					setDefaultCheckboxValue([])
					setChangeRecordResult([])
					setChangeTypeValue(null)
				}}
				destroyOnClose={true}
				footer={null}
				width={700}
				bodyStyle={{ padding: '0 24px 24px 24px' }}>
				<Tabs defaultActiveKey='1' onChange={onChangeTabs} className={styles['EmployeeChange']}>
					<Tabs.TabPane tab='新增变动' key='NewChange'>
						<Spin spinning={DetailLoading}>
							<Form name='basic' autoComplete='off' form={basicForm} preserve={false} onFinish={onFinish}>
								<Row>
									<Col span={4} />
									<Col span={16}>
										<div style={{ marginTop: '15px' }}>职工姓名：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.userName}</div>
										<div style={{ margin: '12px 0' }}>职工性别：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.sexText}</div>
										{/* <div style={{ margin: '12px 0', fontWeight: 'bold' }}>变动前处室：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.orgName}</div>
										<div style={{ margin: '12px 0', fontWeight: 'bold' }}>变动前职务：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.post}</div> */}
										<div style={{ marginBottom: '12px' }}>职工账号：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.phone}</div>
										<Form.Item label='变动类型' name='flag'>
											<Radio.Group value={ChangeTypeValue} onChange={onChangeTypeValue}>
												<Row>
													<Radio value={2}>轮岗</Radio>
													<Radio value={1}>兼职</Radio>
													<Radio value={4}>离职</Radio>
												</Row>
											</Radio.Group>
										</Form.Item>
										{!!ChangeTypeValue && !Demission && (
											<Space>
												调整类型:
												<Checkbox.Group onChange={onChangeTypeAdjust} defaultValue={DefaultCheckboxValue}>
													<Row gutter={[24, 16]}>
														<Col span={12}>
															<Checkbox value={'OfficeAdjust'}>处室调整</Checkbox>
														</Col>
														<Col span={12}>
															<Checkbox value={'PositionAdjust'}>职务调整</Checkbox>
														</Col>
													</Row>
												</Checkbox.Group>
											</Space>
										)}
										{!!ChangeTypeValue && (
											<div className={styles['miniBox']}>
												{!Demission && DefaultCheckboxValue?.length > 0 && (
													<>
														<Form.Item label='开始时间' name='startDate' rules={[{ required: true }]}>
															<DatePicker onChange={onStartDatePicker} disabledDate={disabledStartDate} style={{ width: '100%' }} />
														</Form.Item>
														<Form.Item label='截止时间' name='endDate' rules={[{ required: true }]}>
															<DatePicker onChange={onEndDatePicker} disabledDate={disabledEndDate} style={{ width: '100%' }} />
														</Form.Item>
													</>
												)}
												{!Demission && Office && DefaultCheckboxValue?.length > 0 && (
													<>
														{/* <div style={{ marginBottom: '15px' }}>当前处室：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.orgName ? getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.orgName : '无'}</div> */}
														<Form.Item label='变动前处室' name='oldOrgId' rules={[{ required: DefaultCheckboxValue.includes('OfficeAdjust') }]}>
															<Select options={SchoolOrgsOptions} onChange={handleOldDepartmentChange} />
														</Form.Item>
														<Form.Item label='变动后处室' name='orgId' rules={[{ required: DefaultCheckboxValue.includes('OfficeAdjust') }]}>
															<Select options={SchoolOrgsOptions} onChange={handleDepartmentChange} />
														</Form.Item>
													</>
												)}
												{!Demission && Duty && DefaultCheckboxValue.length > 0 && (
													<>
														{/* <div style={{ marginBottom: '15px' }}>当前职务：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.post ? getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.post : '无'}</div> */}
														<Form.Item label='变动前职务' name='oldPostId' rules={[{ required: DefaultCheckboxValue.includes('PositionAdjust') }]}>
															<Select options={SchoolOldPostsOptions} />
														</Form.Item>
														<Form.Item label='变动后职务' name='postId' rules={[{ required: DefaultCheckboxValue.includes('PositionAdjust') }]}>
															<Select options={SchoolPostsOptions} />
														</Form.Item>
													</>
												)}
												{Demission && (
													<>
														<Form.Item label='离职时间' name='leavePostDate' rules={[{ required: true }]}>
															<DatePicker style={{ width: '100%' }} />
														</Form.Item>
														<Form.Item label='离职原因' name='reason'>
															<Input />
														</Form.Item>
													</>
												)}
											</div>
										)}
									</Col>
									<Col span={4} />
								</Row>
								{ChangeTypeValue !== null && (
									<Form.Item wrapperCol={{ offset: 10, span: 16 }}>
										<Button loading={loading} type='primary' htmlType='submit' style={{ marginTop: '15px' }}>
											完成
										</Button>
									</Form.Item>
								)}
							</Form>
						</Spin>
					</Tabs.TabPane>
					<Tabs.TabPane tab='变动记录' key='ChangeRecord'>
						<Form name='ChangeRecord' onFinish={onChangeRecordFinish}>
							<Space>
								<Form.Item label='变动类型' name='changeType'>
									<Select style={{ width: '100px', marginRight: '6px' }}>
										<Option value='1'>兼职</Option>
										<Option value='2'>轮岗</Option>
										<Option value='4'>离职</Option>
									</Select>
								</Form.Item>
								<Form.Item label='时间' name='startTime'>
									<DatePicker onChange={onStartDatePicker} disabledDate={disabledStartDate} />
								</Form.Item>
								<Form.Item label='至' name='endTime'>
									<DatePicker onChange={onEndDatePicker} disabledDate={disabledEndDate} />
								</Form.Item>
								<Form.Item>
									<Button htmlType='submit' icon={<SearchOutlined />}>
										搜索
									</Button>
								</Form.Item>
							</Space>
						</Form>
						<Spin spinning={loading}>
							{ChangeRecordResult?.length > 0 &&
								ChangeRecordResult?.map((item, index) => {
									return (
										<div className={styles['miniBox']} key={index}>
											<Row>
												<Col span={11}>
													<p>
														{item?.flag == 4 ? '离职时间' : '开始时间'}：
														{item?.startDate && new Date(item?.startDate).getFullYear() + '年' + (new Date(item?.startDate).getMonth() + 1) + '月' + new Date(item?.startDate).getDate() + '日'}
													</p>
													<p>变动类型：{item?.flagText}</p>
													{item?.orgName && <p>变动前处室：{item?.oldOrgName}</p>}
													{item?.postName && <p>变动前职务：{item?.oldPostName}</p>}
												</Col>
												<Col span={11} offset={2}>
													{item?.flag != 4 && (
														<p>
															截止时间：{item?.endDate && new Date(item?.endDate).getFullYear() + '年' + (new Date(item?.endDate).getMonth() + 1) + '月' + new Date(item?.endDate).getDate() + '日'}
														</p>
													)}
													{item?.flag != 4 && (
														<p>
															调整类型：{item?.orgName && '【处室调整】'}
															{item?.postName && '【职务调整】'}
														</p>
													)}
													{item?.orgName && <p>变动后处室：{item?.orgName}</p>}
													{item?.postName && <p>变动后职务：{item?.postName}</p>}
												</Col>
											</Row>
											{item?.flag === 4 ? <p>离职原因：{item?.reason}</p> : null}
											<Button
												onClick={() => {
													showRecordModifyModal(item)
												}}
												type='dashed'
												block>
												编辑
											</Button>
										</div>
									)
								})}
							{ChangeRecordResult?.length <= 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
						</Spin>
						<Modal title='变动记录修改' confirmLoading={loading} centered={true} width={650} visible={isRecordModifyModalOpen} onOk={handleRecordModifyOk} onCancel={handleRecordModifyCancel}>
							<Form name='RecordModify' form={RecordModifyForm} autoComplete='off'>
								<Row>
									<Col span={24}>
										<Form.Item label='变动类型' name='flag'>
											<Radio.Group disabled>
												<Radio value={2}>轮岗</Radio>
												<Radio value={1}>兼职</Radio>
												<Radio value={4}>离职</Radio>
											</Radio.Group>
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={[16, 8]}>
									<Col span={12}>
										<Form.Item label={RecordModifyData?.flag == 4 ? '离职时间' : '开始时间'} name={RecordModifyData?.flag == 4 ? 'leavePostDate' : 'startDate'}>
											<DatePicker onChange={onStartDatePicker} disabledDate={disabledStartDate} style={{ width: '100%' }} />
										</Form.Item>
										{RecordModifyData?.orgName && (
											<Form.Item label='变动前处室' name='oldOrgId'>
												<Select options={SchoolOrgsOptions} onChange={handleOldDepartmentChange} />
											</Form.Item>
										)}
										{RecordModifyData?.postName && (
											<Form.Item label='变动前职务' name='oldPostId'>
												<Select options={SchoolOldPostsOptions} />
											</Form.Item>
										)}
									</Col>
									<Col span={12}>
										{RecordModifyData?.flag != 4 && (
											<Form.Item label='截止时间' name='endDate'>
												<DatePicker onChange={onEndDatePicker} disabledDate={disabledEndDate} style={{ width: '100%' }} />
											</Form.Item>
										)}
										{RecordModifyData?.orgName && (
											<Form.Item label='变动后处室' name='orgId'>
												<Select options={SchoolOrgsOptions} onChange={handleDepartmentChange} />
											</Form.Item>
										)}
										{RecordModifyData?.postName && (
											<Form.Item label='变动后职务' name='postId'>
												<Select options={SchoolPostsOptions} />
											</Form.Item>
										)}
									</Col>
								</Row>
								<Row>
									<Col span={24}>
										{RecordModifyData?.flag == 4 && (
											<Form.Item label='离职原因' name='reason'>
												<Input />
											</Form.Item>
										)}
									</Col>
								</Row>
							</Form>
						</Modal>
					</Tabs.TabPane>
				</Tabs>
			</Modal>
		</>
	)
}

const mapStateToProps = state => {
	return {
		getWorkerDataCenterFindWorkerInfo: state[namespace].getWorkerDataCenterFindWorkerInfo,
		SchoolOrgsOptions: state[namespace].SchoolOrgsOptions,
		SchoolPostsOptions: state[namespace].SchoolPostsOptions,
		SchoolOldPostsOptions: state[namespace].SchoolOldPostsOptions
	}
}

export default connect(mapStateToProps)(EmployeeChange)

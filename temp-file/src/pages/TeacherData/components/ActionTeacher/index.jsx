/**
 *@Author:韦靠谱
 *@Description: 配置教师
 *@Date:Created in  2023/9/1
 *@Modified By:
 */
import React, { useState, useEffect, useImperativeHandle } from 'react'
import { Button, Modal, Popconfirm, message, Empty, Form, Select, Spin, Alert, DatePicker } from 'antd'
import { connect } from 'dva'
import { TeacherData as namespace } from '@/utils/namespace'
import userInfoCaches from '@/caches/userInfo'
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import userInfoCache from '@/caches/userInfo'
import styles from './index.less'

const ActionTeacher = props => {
	const { dispatch, GradeCodes, ClassGradeLists, ListDataCurrentPage, getTeacherList,ListDataPageSize, AllScreening } = props
	const loginUserInfo = userInfoCache() || {}
	const [form] = Form.useForm()
	const userInfo = userInfoCaches()
	const [isActionTeacherOpen, setIsActionTeacherOpen] = useState(false)
	const [isChildrenOpen, setIsChildrenOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [subjectLoading, setSubjectLoading] = useState(false)
	const [TeacherInfo, setTeacherInfo] = useState({})
	const [SubjectInfo, setSubjectInfo] = useState([])
	const [SubjectList, setSubjectList] = useState([])  //科目列表
	const [ClassGradeList, setClassGradeList] = useState([]) //班级列表
	const [StudyAndGradeList, setStudyAndGradeList] = useState([]) //学段和年级列表
	const [YearCode, setYearCode] = useState(null) //年级
	const [GradeCode, setGradeCode] = useState(null) //学届

	useEffect(() => {
		if (!isActionTeacherOpen) return
		setClassGradeList(ClassGradeLists.filter(option => option.value != -1))
		setGradeCode(GradeCodes)
		setLoading(true)
		dispatch({
			type: namespace + '/findTeacherSubjectInfoApi',
			payload: {
				schoolId: userInfo.schoolId,
				teacherId: TeacherInfo.id
			},
			callback: res => {
				setSubjectInfo(res.result || [])
				setLoading(false)
			}
		})

		// 获取学段和年级
		dispatch({
			type: namespace + '/getStudyAndGradeListApi',
			payload: {
				studyId: loginUserInfo.studyIds
			},
			callback: res => {
				if (res.result && res.result.length > 0) {
					const transformedArray = res.result.map(item => {
						return {
							label: item.studyName,
							options: item.gradeList.map(grade => {
								return {
									label: grade.gradeName,
									value: grade.gradeId.toString()
								}
							})
						}
					})
					setStudyAndGradeList(transformedArray)
				}
			}
		})
	}, [isActionTeacherOpen, TeacherInfo.id])

	useEffect(() => {
		//请求班级列表
		if (YearCode && GradeCode) {
			dispatch({
				type: namespace + '/findClassListApi',
				payload: {
					spoceId: YearCode,
					gradeId: GradeCode,
					schoolId: loginUserInfo.schoolId
				},
				callback: res => {
					setClassGradeList(
						res.result?.map(item => {
							return {
								value: item.id - 0,
								label: item.name
							}
						})
					)
				}
			})
		}
	}, [YearCode, GradeCode])

	// 对下拉框选项进行模糊搜索
	const TitleFilterOption = (input, option) => {
		return (option?.label ? option?.label : '').toLowerCase().includes(input.toLowerCase())
	}

	// 配置弹窗---start---
	useImperativeHandle(props.innerRef, () => ({
		showActionTeacher
	}))
	const showActionTeacher = params => {
		setTeacherInfo(params)
		setIsActionTeacherOpen(true)
	}
	const handleCancel = () => {
		setIsActionTeacherOpen(false)
		setSubjectInfo([])
		getTeacherList(ListDataCurrentPage, ListDataPageSize, AllScreening)
	}
	// 配置弹窗---end---

	// 配置子弹窗---start---
	const showChildren = () => {
		if (GradeCodes) {
			dispatch({
				//科目
				type: namespace + '/getSubjectListApi',
				payload: {
					gradeId: GradeCodes
				},
				callback: res => {
					setSubjectList(
						res.result?.map(item => {
							return {
								value: item.id - 0,
								label: item.name,
								gradeid: item.gradeId,
								schoolid: item.schoolId,
								spoceid: item.spoceId
							}
						}) || []
					)
				}
			})
		}
		setIsChildrenOpen(true)
	}
	const handleChildrenOk = () => {
		form.validateFields().then(values => {
			setSubjectLoading(true)
			dispatch({
				type: namespace + '/configTeacherSubjectsApi',
				payload: {
					schoolId: userInfo.schoolId,
					classId: values.classId,
					teacherId: TeacherInfo.id,
					subjectIds: values.subjectId
				},
				callback: () => {
					setSubjectList([])
					setClassGradeList([])
					setYearCode(null)
					setGradeCode(null)
					setSubjectLoading(false)
					dispatch({
						type: namespace + '/findTeacherSubjectInfoApi',
						payload: {
							schoolId: userInfo.schoolId,
							teacherId: TeacherInfo.id
						},
						callback: res => {
							setSubjectInfo(res.result || [])
						}
					})
					setIsChildrenOpen(false)
					form.resetFields()
				}
			})
		})
	}
	const handleChildrenCancel = () => {
		form.resetFields()
		setIsChildrenOpen(false)
		setSubjectList([])
		setClassGradeList([])
		setYearCode(null)
		setGradeCode(null)
	}
	// 配置子弹窗---end---

	//删除当前科目
	const deleteSbj = res => {
		dispatch({
			type: namespace + '/deleteTeacherSubjectApi',
			payload: { id: res.id },
			callback: () => {
				message.success('删除成功')
				dispatch({
					type: namespace + '/findTeacherSubjectInfoApi',
					payload: {
						schoolId: userInfo.schoolId,
						teacherId: TeacherInfo.id
					},
					callback: res => {
						setSubjectInfo(res.result || [])
					}
				})
			}
		})
	}
	//年级下拉事件
	const handleGradeChange = value => {
		form.setFieldsValue({ classId: null, subjectId: [] })
		setClassGradeList([])
		setGradeCode(value)
			dispatch({
				//科目
				type: namespace + '/getSubjectListApi',
				payload: {
					gradeId: value
				},
				callback: res => {
					setSubjectList(
						res.result?.map(item => {
							return {
								value: item.id - 0,
								label: item.name,
								gradeid: item.gradeId,
								schoolid: item.schoolId,
								spoceid: item.spoceId
							}
						}) || []
					)
				}
			})
	}
	//学届下拉事件
	const handleYearChange = (date, dateString) => {
		form.setFieldsValue({ classId: null })
		setClassGradeList([])
		setYearCode(dateString)
	}

	return (
		<>
			<Modal title={`任课老师：${TeacherInfo.userName}`} footer={null} width={750} visible={isActionTeacherOpen} onCancel={handleCancel}>
				<Spin spinning={loading}>
					<div className={styles['teacherInfoDrawerFather']}>
						<div className={styles['propertys']}>
							{SubjectInfo.length
								? SubjectInfo.map((item, index) => (
										<div key={item.id} className={styles['propertyList']}>
											<div className={styles['property']}>
												<div className={styles['class']}>{item.className}</div>
												<div className={styles['sbj']}>{item.subjectName}</div>
											</div>
											<Popconfirm
												placement='top'
												title={'确认删除当前科目？'}
												onConfirm={() => {
													deleteSbj(item)
												}}
												okText='是'
												cancelText='否'>
												<CloseCircleOutlined className={styles['delete']} />
											</Popconfirm>
										</div>
								  ))
								: ''}
						</div>
						{SubjectInfo.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
					</div>
				</Spin>
				<Button type='primary' size='large' block onClick={showChildren} icon={<PlusOutlined />}>
					添加班级&nbsp;科目
				</Button>

				<Modal title='选择班级与科目' destroyOnClose={true} visible={isChildrenOpen} confirmLoading={subjectLoading} onOk={handleChildrenOk} onCancel={handleChildrenCancel}>
					<Alert
						message='温馨提示'
						description={
							<>
								<div>如果班级下拉框暂无数据。</div>
								<div>1、您选择的年级下无班级数据，请前往班级添加！</div>
							</>
						}
						type='warning'
						showIcon
						style={{ margin: '0 0 20px 0' }}
					/>
					学届：
					<DatePicker onChange={handleYearChange} picker='year' style={{ width: '100%', margin: '10px 0 15px 0' }} />
					年级：
					<Select onChange={handleGradeChange} style={{ width: '100%', margin: '10px 0 15px 0' }} options={StudyAndGradeList} allowClear />
					<Form form={form} layout='vertical' name='form_in_modal' initialValues={{ modifier: 'public' }}>
						<Form.Item name='classId' label='班级' rules={[{ required: true }]}>
							<Select placeholder='请选择班级' showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={ClassGradeList} style={{ width: '100%' }} allowClear />
						</Form.Item>
						<Form.Item name='subjectId' label='科目' rules={[{ required: true }]}>
							<Select placeholder='请选择科目' mode="multiple" showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={SubjectList} style={{ width: '100%' }} allowClear />
						</Form.Item>
					</Form>
				</Modal>
			</Modal>
		</>
	)
}
const mapStateToProps = state => {
	return {}
}
export default connect(mapStateToProps)(ActionTeacher)

/*
Author:韦靠谱
Description:教师变动
Date:2023/05/11
*/


import React, { useEffect, useState, useRef, memo } from 'react'
import { Modal, Tabs, Form, Radio, notification, Col, Spin, Row, Button, Empty, Input, Select, Space, DatePicker, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'dva'
import { TeacherData as namespace } from '@/utils/namespace'
import styles from './TeacherModification.less'
const { RangePicker } = DatePicker;
const { Option } = Select;

function TeacherModification(props) {
  const { TeacherModificationOpen, showTeacherModification, ListDataCurrentPage, getTeacherList,ListDataPageSize, AllScreening, setTeacherDetailId, SchoolSubjectsIdOptions, dispatch, TeacherDetailId, SchoolStudiesOptions, SchoolOrgsOptions, SchoolPostsOptions, SchoolSubjectsOptions } = props;
  const [TeacherDetail, setTeacherDetail] = useState({})
  const [ChangeTypeValue, setChangeTypeValue] = useState(null);
  const [Office, setOffice] = useState(false);
  const [Duty, setDuty] = useState(false);
  const [Stage, setStage] = useState(false);
  const [loading, setLoading] = useState(true)
  const [Subject, setSubject] = useState(false);
  const [Demission, setDemission] = useState(false);
  const [Pumping, setPumping] = useState(false);
  const [DefaultCheckboxValue, setDefaultCheckboxValue] = useState([]);
  const [ChangeRecordResult, setChangeRecordResult] = useState([]);
  const [SchoolOldPosts, setSchoolOldPosts] = useState([]);
  const [SchoolOldSubjectsId, setSchoolOldSubjectsId] = useState([]);
  const [RecordModifyForm] = Form.useForm()
  const [basicForm] = Form.useForm()

  useEffect( () => {
    if (TeacherModificationOpen && !!TeacherDetailId) {
			setLoading(true)
			dispatch({
				type: namespace + '/viewTeacherDetail',
				payload: { id: TeacherDetailId },
				callback: res => {
					if (res) {
						setTeacherDetail(res?.result)
						setLoading(false)
						dispatch({
							type: namespace + '/getSchoolPosts',
							payload: { orgId: res?.result?.orgId }
						})
						dispatch({
							type: namespace + '/getSchoolSubjects',
							payload: { studyId: res?.result?.studyId }
						})
						dispatch({
							type: namespace + '/getSchoolPostsApi',
							payload: { orgId: res?.result?.orgId },
							callback: res => {
								if (Reflect.has(res, 'result')) {
									setSchoolOldPosts(res.result)
								}
							}
						})
						dispatch({
							type: namespace + '/getSchoolSubjectsApi',
							payload: { studyId: res?.result?.studyId },
							callback: res => {
								if (Reflect.has(res, 'result')) {
									setSchoolOldSubjectsId(res.result)
								}
							}
						})
					}
				}
			})
		}
  }, [TeacherModificationOpen])

  // 获取变动记录数据
  const ChangeData = () => {
    setLoading(true)
    dispatch({
      type: namespace + "/viewTeacherListChangeRecords",
      payload: { userId: TeacherDetail?.id },
      callback: (res) => {
        setChangeRecordResult(res.result)
        setLoading(false)
      }
    })
  }

  // useEffect(() => { if (!!TeacherDetailId && !!TeacherDetail) { ChangeData() } }, [TeacherDetail])

  // 判断变动记录是否存在决定设置变动前的默认值
  // useEffect(() => {
  //   if (ChangeRecordResult?.length == 0) {
  //     basicForm.setFieldsValue({
  //       oldOrgId: TeacherDetail?.orgId,
  //       oldPostId: TeacherDetail?.postId,
  //       oldStudyId: TeacherDetail?.studyId,
  //       oldSubjectId: TeacherDetail?.subjectId,
  //     })
  //   } else { basicForm.resetFields() }
  // }, [ChangeRecordResult])

  useEffect(() => { if (!TeacherModificationOpen) { basicForm.resetFields() } }, [TeacherModificationOpen])

  const handleDepartmentChange = (id) => {
    RecordModifyForm.setFieldsValue({ postId: null })
    basicForm.setFieldsValue({ postId: null })
    dispatch({
      type: namespace + "/getSchoolPosts",
      payload: { orgId: id }
    })
  };
  const handleStudiesChange = (id) => {
    RecordModifyForm.setFieldsValue({ subjectId: null })
    basicForm.setFieldsValue({ subjectId: null })
    dispatch({
      type: namespace + "/getSchoolSubjects",
      payload: { studyId: id }
    })
  };
  const handleOldDepartmentChange = (orgId) => {
    RecordModifyForm.setFieldsValue({ oldPostId: null })
    basicForm.setFieldsValue({ oldPostId: null })
    dispatch({
      type: namespace + "/getSchoolPostsApi",
      payload: { orgId },
      callback: (res) => {
        if (Reflect.has(res, 'result')) {
          setSchoolOldPosts(res.result)
        }
      }
    })
  };
  const handleOldStudiesChange = (studyId) => {
    RecordModifyForm.setFieldsValue({ oldSubjectId: null })
    basicForm.setFieldsValue({ oldSubjectId: null })
    dispatch({
      type: namespace + "/getSchoolSubjectsApi",
      payload: { studyId },
      callback: (res) => {
        if (Reflect.has(res, 'result')) {
          setSchoolOldSubjectsId(res.result)
        }
      }
    })
  };
  const SchoolOldPostsOptions = SchoolOldPosts.length >= 0 && SchoolOldPosts?.map(item => { return { value: item.id, label: item.name } })
  const SchoolOldSubjectsIdOptions = SchoolOldSubjectsId.length >= 0 && SchoolOldSubjectsId?.map(item => { return { value: item.id, label: item.name } })

  const onChangeTypeValue = (e) => {
    setChangeTypeValue(e.target.value);
    // 离职
    if (e.target.value == '4') {
      setDemission(true)
    } else {
      setDemission(false)
    }
    // 抽用
    if (e.target.value == '3') {
      setPumping(true)
    } else {
      setPumping(false)
    }
  };

  // 开始时间不能大于结束时间
  const [StartDatePicker, setStartDatePicker] = useState(null)
  const [EndDatePicker, setEndDatePicker] = useState(null)
  const onStartDatePicker = (value) => { !value ? setStartDatePicker(null) : setStartDatePicker(new Date(Date.parse(value?.format()))?.getTime()) }
  const onEndDatePicker = (value) => { !value ? setEndDatePicker(null) : setEndDatePicker(new Date(Date.parse(value?.format()))?.getTime()) }
  const disabledStartDate = (Value) => {
    const startValue = new Date(Date.parse(Value.format())).getTime()
    if (!startValue || !EndDatePicker) {
      return false;
    }
    return startValue.valueOf() > EndDatePicker.valueOf();
  }
  const disabledEndDate = (Value) => {
    const endValue = new Date(Date.parse(Value.format())).getTime()
    if (!endValue || !StartDatePicker) {
      return false;
    }
    return StartDatePicker.valueOf() >= endValue.valueOf();
  }

  // 调整类型
  const onChangeTypeAdjust = (checkedValues) => {
    setDefaultCheckboxValue(checkedValues)
    setOffice(checkedValues.includes('OfficeAdjust'))
    setDuty(checkedValues.includes('PositionAdjust'))
    setStage(checkedValues.includes('StageAdjust'))
    setSubject(checkedValues.includes('SubjectAdjust'))
  };

  // 新增变动
  const onFinish = (values) => {
    setLoading(true)
    dispatch({
      type: namespace + "/viewTeacherChangePost",
      payload: {
        ...values, ...{
          userId: TeacherDetail?.id,
          startDate: values['startDate'] && Date.parse(values['startDate'].format()),
          endDate: values['endDate'] && Date.parse(values['endDate'].format())
        }
      },
      callback: (res) => {
        if (res.result === null) {
          notification.success({
            description: '教师变动修改成功！'
          });
          setLoading(false)
          console.log(AllScreening)
          getTeacherList(ListDataCurrentPage, ListDataPageSize, AllScreening)
          showTeacherModification(false)
          setDefaultCheckboxValue([])
          setChangeTypeValue(null)
          setTeacherDetailId(null)
          setStartDatePicker(null)
          setEndDatePicker(null)
        } else { setLoading(false) }
      }
    })

  };
  // 变动记录
  const onChangeRecordFinish = (values) => {
    setChangeRecordResult([])
    dispatch({
      type: namespace + "/viewTeacherListChangeRecords",
      payload: {
        ...values, ...{
          userId: TeacherDetail?.id,
          startTime: values['startTime'] && values['startTime'].format('YYYY/MM/DD'),
          endTime: values['endTime'] && values['endTime'].format('YYYY/MM/DD')
        }
      },
      callback: (res) => {
        if (res.result && res.result.length > 0) {
          setChangeRecordResult(res.result)
        }
      }
    })
  };

  // 标签页切换
  const onChangeTabs = (key) => {
    if (key == 'ChangeRecord') {
      setChangeRecordResult([])
      ChangeData()
    }
  };

  // 变动记录修改
  const [isRecordModifyModalOpen, setIsRecordModifyModalOpen] = useState(false);
  const [RecordModifyData, setRecordModifyData] = useState(null);

  const fetchSchoolPostData = (oldOrgId) => {
    return new Promise((resolve) => {
      dispatch({
        type: namespace + "/getSchoolPostsApi",
        payload: { orgId: oldOrgId },
        callback: (res) => {
        if (Reflect.has(res, 'result')) {
          resolve(res.result)
        }
      }
      })
    })
  }
  const fetchSchoolSubjectData = (oldStudyId) => {
    return new Promise((resolve) => {
      dispatch({
        type: namespace + "/getSchoolSubjectsApi",
        payload: { studyId: oldStudyId },
        callback: (res) => {
        if (Reflect.has(res, 'result')) {
          resolve(res.result)
        }
      }
      })
    })
  }
  // 打开修改变动记录窗口
  const showRecordModifyModal = async (value) => {
    setIsRecordModifyModalOpen(true);
    setLoading(true)
    dispatch({
      type: namespace + "/getSchoolPosts",
      payload: { orgId: value?.orgId }
    })
    dispatch({
      type: namespace + "/getSchoolSubjects",
      payload: { studyId: value?.studyId }
    })
    setSchoolOldSubjectsId(await fetchSchoolSubjectData(value?.oldStudyId))
    setSchoolOldPosts(await fetchSchoolPostData(value?.oldOrgId))
    RecordModifyForm.setFieldsValue({
      id: value?.id,
      userId: value?.userId,
      flag: value?.flag,
      startDate: value.startDate && moment((value.startDate)),
      endDate: value.endDate && moment((value.endDate)),
      oldOrgId: value?.oldOrgId,
      orgId: value?.orgId,
      oldPostId: value?.oldPostId,
      postId: value?.postId,
      oldStudyId: value?.oldStudyId,
      studyId: value?.studyId,
      oldSubjectId: value?.oldSubjectId,
      subjectId: value?.subjectId,
      reason: value?.reason,
    })
    setRecordModifyData(value)
    setStartDatePicker(value.startDate)
    setEndDatePicker(value.endDate)
    setLoading(false)
  };
  // 确认修改记录数据
  const handleRecordModifyOk = () => {
    RecordModifyForm.validateFields().then((values) => {
      setLoading(true)
      dispatch({
        type: namespace + "/viewTeacherChangePost",
        payload: {
          ...values, ...{
            id: RecordModifyData?.id,
            userId: RecordModifyData?.userId,
            startDate: values['startDate'] && Date.parse(values['startDate'].format()),
            endDate: values['endDate'] && Date.parse(values['endDate'].format())
          }
        },
        callback: (res) => {
          if (res.result === null) {
            notification.success({
              description: '变动记录修改成功！'
            });
            setLoading(false)
            setRecordModifyData(null)
            setStartDatePicker(null)
            setEndDatePicker(null)
            setIsRecordModifyModalOpen(false)
            ChangeData()
          } else { setLoading(false) }
        }
      })
    }).catch((info) => { });
  };
  // 变动记录修改弹窗关闭
  const handleRecordModifyCancel = () => {
    setIsRecordModifyModalOpen(false);
    setRecordModifyData(null)
    setStartDatePicker(null)
    setEndDatePicker(null)
  };
  // 变动弹窗关闭
  const onCancel = () => {
    showTeacherModification(false);
    setChangeRecordResult([]);
    setChangeTypeValue(null);
    setDefaultCheckboxValue([])
    setStartDatePicker(null)
    setEndDatePicker(null)
  }

  return (
    <>
      <Modal title="教师变动" visible={TeacherModificationOpen} width={700} onCancel={onCancel} preserve={false} destroyOnClose={true} footer={null} bodyStyle={{ padding: '0 24px 24px 24px' }}>
        <Tabs defaultActiveKey="1" className={styles['TeacherModification']} onChange={onChangeTabs}>
          <Tabs.TabPane tab="新增变动" key="NewChange">
            <Form name="basic" form={basicForm} autoComplete="off" onFinish={onFinish} >
              <Row>
                <Col span={4} />
                <Col span={16}>
                  <Spin spinning={loading}>
                    <div style={{ marginTop: '15px' }}>教师姓名：{TeacherDetail?.userName}</div>
                    <div style={{ margin: '12px 0' }}>教师性别：{TeacherDetail?.sexText}</div>
                    {/* <div style={{ margin: '12px 0', fontWeight: 'bold' }}>变动前处室：{TeacherDetail?.orgName}</div>
                    <div style={{ margin: '12px 0', fontWeight: 'bold' }}>变动前职务：{TeacherDetail?.postName}</div>
                    <div style={{ margin: '12px 0', fontWeight: 'bold' }}>变动前学段：{TeacherDetail?.studyName}</div>
                    <div style={{ margin: '12px 0', fontWeight: 'bold' }}>变动前科目：{TeacherDetail?.subjectName}</div> */}
                    <div style={{ marginBottom: '12px' }}>教师账号：{TeacherDetail?.phone}</div>
                  </Spin>
                  <Form.Item label="变动类型" name="flag">
                    <Radio.Group value={ChangeTypeValue} onChange={onChangeTypeValue}>
                      <Radio value={2}>轮岗</Radio>
                      <Radio value={1}>兼职</Radio>
                      <Radio value={3}>抽用</Radio>
                      <Radio value={4}>离职</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {!!ChangeTypeValue && !Pumping && !Demission && <Space>调整类型:
                    <Checkbox.Group onChange={onChangeTypeAdjust} defaultValue={DefaultCheckboxValue}>
                      <Row gutter={[24, 16]}>
                        <Col span={12}><Checkbox value={'OfficeAdjust'}>处室调整</Checkbox></Col>
                        <Col span={12}><Checkbox value={'StageAdjust'}>学段调整</Checkbox></Col>
                      </Row>
                      <Row gutter={[24, 0]}>
                        <Col span={12}><Checkbox value={'PositionAdjust'}>职务调整</Checkbox></Col>
                        <Col span={12}><Checkbox value={'SubjectAdjust'}>科目调整</Checkbox></Col>
                      </Row>
                    </Checkbox.Group>
                  </Space>}
                  {!!ChangeTypeValue &&
                    <div className={styles['miniBox']}>
                      {!Pumping && !Demission && DefaultCheckboxValue.length > 0 && <>
                        <Form.Item label="开始时间" name="startDate" rules={[{ required: true }]}><DatePicker onChange={onStartDatePicker} disabledDate={disabledStartDate} style={{ width: '100%' }} /></Form.Item>
                        <Form.Item label="截止时间" name="endDate" rules={[{ required: true }]}><DatePicker onChange={onEndDatePicker} disabledDate={disabledEndDate} style={{ width: '100%' }} /></Form.Item>
                      </>
                      }
                      {!Pumping && !Demission && Office && DefaultCheckboxValue.length > 0 && <>
                        {/* <div style={{ marginBottom: '15px' }}>当前处室：{TeacherDetail?.orgName ? TeacherDetail?.orgName : '无'}</div> */}
                        <Form.Item label="变动前处室" name="oldOrgId" rules={[{ required: DefaultCheckboxValue.includes("OfficeAdjust") }]} ><Select options={SchoolOrgsOptions} onChange={handleOldDepartmentChange} /></Form.Item>
                        <Form.Item label="变动后处室" name="orgId" rules={[{ required: DefaultCheckboxValue.includes("OfficeAdjust") }]} ><Select options={SchoolOrgsOptions} onChange={handleDepartmentChange} /></Form.Item>
                      </>}
                      {!Pumping && !Demission && Duty && DefaultCheckboxValue.length > 0 && <>
                        {/* <div style={{ marginBottom: '15px' }}>当前职务：{TeacherDetail?.postName ? TeacherDetail?.postName : '无'}</div> */}
                        <Form.Item label="变动前职务" name="oldPostId" rules={[{ required: DefaultCheckboxValue.includes("PositionAdjust") }]}><Select options={SchoolOldPostsOptions} /></Form.Item>
                        <Form.Item label="变动后职务" name="postId" rules={[{ required: DefaultCheckboxValue.includes("PositionAdjust") }]}><Select options={SchoolPostsOptions} /></Form.Item>
                      </>}
                      {!Pumping && !Demission && Stage && DefaultCheckboxValue.length > 0 && <>
                        {/* <div style={{ marginBottom: '15px' }}>当前学段：{TeacherDetail?.studyName ? TeacherDetail?.studyName : '无'}</div> */}
                        <Form.Item label="变动前学段" name="oldStudyId" rules={[{ required: DefaultCheckboxValue.includes("StageAdjust") }]}><Select options={SchoolStudiesOptions} onChange={handleOldStudiesChange} /></Form.Item>
                        <Form.Item label="变动后学段" name="studyId" rules={[{ required: DefaultCheckboxValue.includes("StageAdjust") }]}><Select options={SchoolStudiesOptions} onChange={handleStudiesChange} /></Form.Item>
                      </>}
                      {!Pumping && !Demission && Subject && DefaultCheckboxValue.length > 0 && <>
                        {/* <div style={{ marginBottom: '15px' }}>当前学科：{TeacherDetail?.subjectName ? TeacherDetail?.subjectName : '无'}</div> */}
                        <Form.Item label="变动前学科" name="oldSubjectId" rules={[{ required: DefaultCheckboxValue.includes("SubjectAdjust") }]}><Select options={SchoolOldSubjectsIdOptions} /></Form.Item>
                        <Form.Item label="变动后学科" name="subjectId" rules={[{ required: DefaultCheckboxValue.includes("SubjectAdjust") }]}><Select options={SchoolSubjectsIdOptions} /></Form.Item>
                      </>}
                      {Pumping && <>
                        <Form.Item label="开始时间" name="startDate" rules={[{ required: true }]}><DatePicker onChange={onStartDatePicker} disabledDate={disabledStartDate} style={{ width: '100%' }} /></Form.Item>
                        <Form.Item label="截止时间" name="endDate" rules={[{ required: true }]}><DatePicker onChange={onEndDatePicker} disabledDate={disabledEndDate} style={{ width: '100%' }} /></Form.Item>
                        <Form.Item label="抽用原因" name="reason" rules={[{ required: true }]}><Input /></Form.Item>
                      </>
                      }
                      {!Pumping && Demission && <>
                        <Form.Item label="离职时间" name="startDate" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
                        <Form.Item label="离职原因" name="reason"><Input /></Form.Item>
                      </>}
                    </div>
                  }
                </Col>
                <Col span={4} />
              </Row>
              {ChangeTypeValue !== null &&
                <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                  <Button loading={loading} type="primary" htmlType="submit" style={{ marginTop: '15px' }}>完成</Button>
                </Form.Item>
              }
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane tab="变动记录" key="ChangeRecord">
            <Form name="ChangeRecord" onFinish={onChangeRecordFinish}>
              <Space>
                <Form.Item label="变动类型" name="changeType">
                  <Select allowClear style={{ width: '100px', marginRight: '6px' }}>
                    <Option value="1">兼职</Option>
                    <Option value="2">轮岗</Option>
                    <Option value="3">抽用</Option>
                    <Option value="4">离职</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="时间" name="startTime"><DatePicker onChange={onStartDatePicker} disabledDate={disabledStartDate} /></Form.Item>
                <Form.Item label="至" name="endTime"><DatePicker onChange={onEndDatePicker} disabledDate={disabledEndDate} /></Form.Item>
                <Form.Item >
                  <Button htmlType="submit" icon={<SearchOutlined />}>搜索</Button>
                </Form.Item>
              </Space>
            </Form>
            <Spin spinning={loading}>
              {ChangeRecordResult.length > 0 &&
                ChangeRecordResult?.map((item, index) => {
                  return (
                    <div className={styles['miniBox']} key={index}>
                      <Row>
                        <Col span={11}>
                          <p>{item?.flag == 4 ? '离职时间' : '开始时间'}：{item?.startDate && new Date(item?.startDate).getFullYear() + '年' + (new Date(item?.startDate).getMonth() + 1) + '月' + new Date(item?.startDate).getDate() + '日'}</p>
                        </Col>
                        <Col span={11} offset={2}>
                          {item?.flag != 4 && <p>截止时间：{item?.endDate && new Date(item?.endDate).getFullYear() + '年' + (new Date(item?.endDate).getMonth() + 1) + '月' + new Date(item?.endDate).getDate() + '日'}</p>}
                        </Col>
                      </Row>
                      <Row><Col span={11}>{item?.flag != 4 && <p>变动类型：{item?.flagText}</p>}</Col>
                        <Col span={11} offset={2}>{item?.flag != 3 && item?.flag != 4 && <p>调整类型：{item?.orgName && '【处室调整】'}{item?.postName && '【职务调整】'}{item?.studyName && '【学段调整】'}{item?.subjectName && '【科目调整】'}</p>}</Col></Row>
                      <Row><Col span={11}>{item?.orgName && <p>变动前处室：{item?.oldOrgName}</p>}</Col>
                        <Col span={11} offset={2}>{item?.orgName && <p>变动后处室：{item?.orgName}</p>}</Col></Row>
                      <Row><Col span={11}>{item?.postName && <p>变动前职务：{item?.oldPostName}</p>}</Col>
                        <Col span={11} offset={2}>{item?.postName && <p>变动后职务：{item?.postName}</p>}</Col></Row>
                      <Row><Col span={11}>{item?.studyName && <p>变动前学段：{item?.oldStudyName}</p>}</Col>
                        <Col span={11} offset={2}>{item?.studyName && <p>变动后学段：{item?.studyName}</p>}</Col></Row>
                      <Row><Col span={11}>{item?.subjectName && <p>变动前科目：{item?.oldSubjectName}</p>}</Col>
                        <Col span={11} offset={2}>{item?.subjectName && <p>变动后科目：{item?.subjectName}</p>}</Col></Row>
                      {item?.flag === 3 ? <p>抽用原因：{item?.reason}</p> : item?.flag === 4 ? <p>离职原因：{item?.reason}</p> : null}
                      <Button onClick={() => { showRecordModifyModal(item) }} type="dashed" block>编辑</Button>
                    </div>
                  )
                })}
              {ChangeRecordResult.length <= 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </Spin>
            <Modal title="变动记录修改" confirmLoading={loading} centered={true} width={650} visible={isRecordModifyModalOpen} onOk={handleRecordModifyOk} onCancel={handleRecordModifyCancel}>
              <Spin spinning={loading}>
                <Form name="RecordModify" form={RecordModifyForm} autoComplete="off" >
                  <Row>
                    <Col span={24}>
                      <Form.Item label="变动类型" name="flag">
                        <Radio.Group disabled>
                          <Radio value={2}>轮岗</Radio>
                          <Radio value={1}>兼职</Radio>
                          <Radio value={3}>抽用</Radio>
                          <Radio value={4}>离职</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Form.Item label={RecordModifyData?.flag == 4 ? '离职时间' : '开始时间'} name="startDate" >
                        <DatePicker onChange={onStartDatePicker} disabledDate={disabledStartDate} style={{ width: '100%' }} />
                      </Form.Item>
                      {RecordModifyData?.orgName && <Form.Item label="变动前处室" name="oldOrgId" >
                        <Select options={SchoolOrgsOptions} onChange={handleOldDepartmentChange} />
                      </Form.Item>}
                      {RecordModifyData?.postName && <Form.Item label="变动前职务" name="oldPostId" >
                        <Select options={SchoolOldPostsOptions} />
                      </Form.Item>}
                      {RecordModifyData?.studyName && <Form.Item label="变动前学段" name="oldStudyId" >
                        <Select options={SchoolStudiesOptions} onChange={handleOldStudiesChange} />
                      </Form.Item>}
                      {RecordModifyData?.subjectName && <Form.Item label="变动前科目" name="oldSubjectId" >
                        <Select options={SchoolOldSubjectsIdOptions} />
                      </Form.Item>}
                    </Col>
                    <Col span={12}>
                      {RecordModifyData?.flag != 4 && <Form.Item label="截止时间" name="endDate" >
                        <DatePicker onChange={onEndDatePicker} disabledDate={disabledEndDate} style={{ width: '100%' }} />
                      </Form.Item>}
                      {RecordModifyData?.orgName && <Form.Item label="变动后处室" name="orgId" >
                        <Select options={SchoolOrgsOptions} onChange={handleDepartmentChange} />
                      </Form.Item>}
                      {RecordModifyData?.postName && <Form.Item label="变动后职务" name="postId" >
                        <Select options={SchoolPostsOptions} />
                      </Form.Item>}
                      {RecordModifyData?.studyName && <Form.Item label="变动后学段" name="studyId" >
                        <Select options={SchoolStudiesOptions} onChange={handleStudiesChange} />
                      </Form.Item>}
                      {RecordModifyData?.subjectName && <Form.Item label="变动后科目" name="subjectId" >
                        <Select options={SchoolSubjectsIdOptions} />
                      </Form.Item>}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      {RecordModifyData?.flag == 3 && <Form.Item label="抽用原因" name="reason" ><Input /></Form.Item>}
                      {RecordModifyData?.flag == 4 && <Form.Item label="离职原因" name="reason"><Input /></Form.Item>}
                    </Col>
                  </Row>
                </Form>
              </Spin>
            </Modal>
          </Tabs.TabPane>
        </Tabs >
      </Modal >
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    SchoolStudiesOptions: state[namespace].SchoolStudiesOptions,
    SchoolOrgsOptions: state[namespace].SchoolOrgsOptions,
    SchoolPostsOptions: state[namespace].SchoolPostsOptions,
    SchoolSubjectsIdOptions: state[namespace].SchoolSubjectsIdOptions,
    SchoolSubjectsOptions: state[namespace].SchoolSubjectsOptions,
  }
}

export default memo(connect(mapStateToProps)(TeacherModification))
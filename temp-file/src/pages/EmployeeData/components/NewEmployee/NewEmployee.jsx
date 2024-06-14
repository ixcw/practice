/*
Author:韦靠谱
Description:新建职工账号
Date:2023/04/24
Modified By:
*/


import React, { useEffect, useState, memo } from 'react'
import { Button, Modal, Tabs, Form, Input, Col, Row, Cascader, Select, DatePicker, message, notification } from 'antd';
import { MinusCircleOutlined, PlusOutlined, TrademarkCircleOutlined } from '@ant-design/icons';
import { phoneReg, IdCardReg } from '@/utils/const'
import { connect } from 'dva'
import moment from 'moment';
import { EmployeeData as namespace } from '@/utils/namespace'
import styles from './NewEmployee.less'
const { RangePicker } = DatePicker;
const { Option } = Select;

function NewEmployee(props) {
  const {
    NewEmployeeOpen,
    showNewEmployee,
    getTeacherList,
    docTypeOptions,
    relationOptions,
    getCenterStatWorkers,
    dispatch,
    sexOptions,
    nationOptions,
    eduNatureOptions,
    degreeLevelOptions,
    degreeTypeOptions,
    studyYearOptions,
    eduOptions,
    workOptions,
    ProvinceCityAddressOptions,
    CityAddressOptions,
    SchoolOrgsOptions,
    SchoolPostsOptions,
    postFunctionOptions,
    postTypeOptions,
    PrincipalJobOptions,
    postOptions
  } = props
  const [IdCardAge, setIdCardAge] = useState(null)
  const [loading, setLoading] = useState(false)
  const [docTypeValue, setDocTypeValue] = useState(1) //证件类型  1身份证 2护照...
  const [basicForm] = Form.useForm()

  const handleDepartmentChange = orgId => {
    basicForm.setFieldsValue({ baseInfo: { postId: null } })
    dispatch({
      type: namespace + '/getCommonGetPostsApi',
      payload: { orgId }
    })
  }

  // 职工创建提示
  const openNotificationWithIcon = type => {
    notification[type]({
      message: '新建职工提示',
      description: '您完成一名职工账号的新建！'
    })
  }

  // 证件类型下拉框
  const handleDocTypeChange = value => {
    setDocTypeValue(value)
    // 清空年龄、身份证号、民族、籍贯
      basicForm.setFieldsValue({baseInfo: { age: null, identityCard: null, nationId: null, areaId: null }})
  }

  // 根据身份证计算年龄
    const handleIdentityCardChange = event => {
      if (docTypeValue !== 1) return
      // 如果证件类型为身份证，再进行计算
      event.persist()
      const UUserCard = event.target.value
      if (UUserCard.match(IdCardReg)) {
        const date = `${UUserCard.substring(6, 10)}/${UUserCard.substring(10, 12)}/${UUserCard.substring(12, 14)}`
        setIdCardAge(moment().diff(date, 'years'))
      } else {
        setIdCardAge(null)
      }
    }
  useEffect(() => {
    setIdCardAge(IdCardAge)
    basicForm.setFieldsValue({ baseInfo: { age: IdCardAge } })
  }, [IdCardAge])

  // 限制可选择的时间
  const disabledDate = current => {
    return current && current > moment().endOf('day')
  }

  // 开始时间不能大于结束时间
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

  // 对下拉框选项进行模糊搜索
  const TitleFilterOption = (input, option) => {
    return (option?.label ? option?.label : '').toLowerCase().includes(input.toLowerCase())
  }

  const handleOk = () => {
    basicForm
      .validateFields()
      .then(values => {
        setLoading(true)
        const modifyValues = {
          baseInfo: {
            ...values.baseInfo,
            ...(docTypeValue !== 1 && { birthday: values['baseInfo']['birthday'].format('YYYY-MM-DD') }),
            areaId: values['baseInfo']['areaId'] && values['baseInfo']['areaId'][values.baseInfo.areaId.length - 1],
            entryTime: values['baseInfo']['entryTime'] && Date.parse(values['baseInfo']['entryTime'].format())
          },
          familyDtos:
            values['familyDtos'] &&
            values['familyDtos'].filter(item => {
              return item.name
            }),
          educationDtos:
            values['educationDtos'] &&
            values['educationDtos']
              .map(item => {
                return {
                  nature: item.nature,
                  education: item.education,
                  major: item.major,
                  degreeType: item.degreeType && item.degreeType.value,
                  degreeLevel: item.degreeLevel && item.degreeLevel.value,
                  studyYear: item.studyYear,
                  schoolName: item.schoolName,
                  startTime: item.startEndTime?.length > 0 && item.startEndTime[0].format('YYYY-MM-DD'),
                  endTime: item.startEndTime?.length > 0 && item.startEndTime[1].format('YYYY-MM-DD')
                }
              })
              .filter(item => {
                return item.education
              })
        }
          const { ...newValues } = { ...values, ...modifyValues }

        dispatch({
          type: namespace + '/postWorkerDataCenterInsertOrUpdateWorkerApi',
          payload: newValues,
          callback: res => {
            if (res.err && res?.err?.code == 601) {
              // 错误提示
              setLoading(false)
            } else {
              openNotificationWithIcon('success')
              setLoading(false)
              showNewEmployee(false)
              getTeacherList()
              getCenterStatWorkers()
              setStartDatePicker(null)
              setEndDatePicker(null)
            }
          }
        })
          
      })
      .catch(info => {
        info.errorFields && message.error('还有 ' + info.errorFields.length + ' 个必填项未填写！')
      })
  }

    const handleCancel = () => {
    setLoading(false)
    showNewEmployee(false)
    setStartDatePicker(null)
    setEndDatePicker(null)
  }

  return (
    <>
      <Modal
        title='新建职工账号'
        confirmLoading={loading}
        visible={NewEmployeeOpen}
        width={700}
        destroyOnClose={true}
        onOk={handleOk}
        onCancel={handleCancel}
        bodyStyle={{ padding: '0 24px 24px 24px' }}>
        <Tabs defaultActiveKey='1' className={styles['NewEmployee']}>
          <Tabs.TabPane tab='基本信息' key='BasicInformation'>
            <Form name='basic' autoComplete='off' form={basicForm} preserve={false}>
              <Row>
                <Col span={12}>
                  <Form.Item label='职工姓名' name={['baseInfo', 'userName']} rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='职工性别' name={['baseInfo', 'sex']} rules={[{ required: true }]} labelCol={{ span: 8 }}>
                    <Select options={sexOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label='证件类型' name={['baseInfo', 'docType']} rules={[{ required: true }]}>
                    <Select options={docTypeOptions} onChange={handleDocTypeChange} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='证件号码'
                    name={['baseInfo', 'identityCard']}
                    rules={[{ required: true }, { pattern: docTypeValue === 1 ? IdCardReg : null, message: '请输入正确的身份证号码！' }]}
                    labelCol={{ span: 8 }}>
                    <Input
                      onChange={event => {
                        handleIdentityCardChange(event)
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label='民族' name={['baseInfo', 'nationId']}>
                    <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={nationOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {docTypeValue === 1 ? (
                    <Form.Item label='年龄' name={['baseInfo', 'age']} labelCol={{ span: 8 }}>
                      <Input disabled type='number' />
                    </Form.Item>
                  ) : (
                    <Form.Item label='出生日期' name={['baseInfo', 'birthday']} rules={[{ required: true }]} labelCol={{ span: 8 }}>
                      <DatePicker disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100%' }} />
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Form.Item label='籍贯' name={['baseInfo', 'areaId']}>
                <Cascader showSearch optionfilterprop='label' filterOption={TitleFilterOption} options={ProvinceCityAddressOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
              </Form.Item>
              <Row>
                <Col span={11}>
                  <Form.Item label='所在处室' name={['baseInfo', 'orgId']} rules={[{ required: true, message: '请选择职工所在部门!' }]}>
                    <Select
                      showSearch
                      optionFilterProp='label'
                      filterOption={TitleFilterOption}
                      options={SchoolOrgsOptions}
                      onChange={handleDepartmentChange}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    />
                  </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item label='职务' name={['baseInfo', 'postId']} rules={[{ required: true, message: '请选择职工职务!' }]}>
                    <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={SchoolPostsOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label='主要工作' name={['baseInfo', 'hightJob']} rules={[{ required: true }]}>
                <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={PrincipalJobOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
              </Form.Item>
              <Form.Item label='专业技术或工勤技能职务' name={['baseInfo', 'postFunction']} rules={[{ required: true }]}>
                <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={postFunctionOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
              </Form.Item>
              <Row>
                <Col span={11}>
                  <Form.Item label='岗位类别' name={['baseInfo', 'postType']} rules={[{ required: true }]}>
                    <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={postTypeOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item label='岗位等级' name={['baseInfo', 'postLevel']} rules={[{ required: TrademarkCircleOutlined }]}>
                    <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={postOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item label='联系电话' name={['baseInfo', 'phone']} rules={[{ required: true }, { pattern: phoneReg, message: '请输入正确手机号！' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item label='入职时间' name={['baseInfo', 'entryTime']}>
                    <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item label='紧急联系人' name={['baseInfo', 'urgentName']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item label='紧急联系电话' name={['baseInfo', 'urgentPhone']} rules={[{ pattern: phoneReg, message: '请输入正确手机号！' }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label='家庭住址' name={['baseInfo', 'address']}>
                <Input />
              </Form.Item>
              {/* <Row>
                                <Col span={11}>
                                    <Form.Item label="最高学历" name={["baseInfo", "maxEduc"]}>
                                        <Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={eduOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                    </Form.Item>
                                </Col>
                                <Col span={11} offset={2} >
                                    <Form.Item label="最高学历性质" name={["baseInfo", "educType"]} >
                                        <Select options={eduNatureOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                    </Form.Item>
                                </Col>
                            </Row> */}

              <Form.List name='educationDtos' initialValue={[{}]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} className={styles['miniBox']}>
                        <Row justify='space-around' align='middle'>
                          <Col span={key !== 0 ? 22 : 24}>
                            <Row>
                              <Col span={24}>
                                <Form.Item label='时间' name={[name, 'startEndTime']} labelCol={{ span: 3 }}>
                                  <RangePicker getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: key !== 0 ? '505px' : '550px' }} />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row>
                              <Col span={13}>
                                <Form.Item label='学历层次' name={[name, 'education']}>
                                  <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={eduOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                </Form.Item>
                              </Col>
                              <Col span={10} offset={1}>
                                <Form.Item label='学历性质' name={[name, 'nature']}>
                                  <Select options={eduNatureOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row>
                              <Col span={13}>
                                <Row>
                                  <Col span={14}>
                                    <Form.Item label='学位' name={[name, 'degreeType']} labelCol={{ span: 9 }}>
                                      <Select
                                        labelInValue={true}
                                        showSearch
                                        optionFilterProp='label'
                                        filterOption={TitleFilterOption}
                                        options={degreeTypeOptions}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={10}>
                                    <Form.Item name={[name, 'degreeLevel']}>
                                      <Select
                                        labelInValue={true}
                                        showSearch
                                        optionFilterProp='label'
                                        filterOption={TitleFilterOption}
                                        options={degreeLevelOptions}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Col>
                              <Col span={11}>
                                <Form.Item label='学制' name={[name, 'studyYear']} labelCol={{ span: 7 }}>
                                  <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={studyYearOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item label='毕业院校' name={[name, 'schoolName']}>
                              <Input />
                            </Form.Item>
                            <Row>
                              <Col span={24}>
                                <Form.Item label='所学专业' name={[name, 'major']}>
                                  <Input />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                          {key !== 0 && (
                            <Col span={1} offset={1}>
                              <MinusCircleOutlined onClick={() => remove(name)} />
                            </Col>
                          )}
                        </Row>
                      </div>
                    ))}
                    <Form.Item wrapperCol={{ span: 24 }}>
                      <Button
                        type='dashed'
                        onClick={() => {
                          add()
                          setStartDatePicker(null)
                          setEndDatePicker(null)
                        }}
                        block
                        icon={<PlusOutlined />}
                        style={{ height: '100px' }}>
                        添加学历信息
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab='家庭信息' key='FamilyInformation'>
            <Form name='basic' autoComplete='off' form={basicForm} preserve={false}>
              <div>
                <Form.List name='familyDtos' initialValue={[{}]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className={styles['miniBox']}>
                          <Row justify='space-around' align='middle'>
                            <Col span={key !== 0 ? 22 : 24}>
                              <Row gutter={[12, 0]}>
                                <Col span={13}>
                                  <Form.Item label='姓名' name={[name, 'name']}>
                                    <Input />
                                  </Form.Item>
                                  <Form.Item label='工作省份' name={[name, 'workProvince']}>
                                    <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={CityAddressOptions} />
                                  </Form.Item>
                                </Col>
                                <Col span={10} offset={1}>
                                  <Form.Item label='与职工关系' name={[name, 'relation']}>
                                    <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={relationOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                  </Form.Item>
                                  <Form.Item label='工作情况' name={[name, 'workType']}>
                                    <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={workOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Form.Item label='身份证号' name={[name, 'familyIdentityCard']} rules={[{ required: false }, { pattern: IdCardReg, message: '请输入正确的身份证号码！' }]}>
                                <Input />
                              </Form.Item>

                              <Form.Item label='学历层次' name={[name, 'education']}>
                                <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={eduOptions} />
                              </Form.Item>
                            </Col>
                            {key !== 0 && (
                              <Col span={1} offset={1}>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                              </Col>
                            )}
                          </Row>
                        </div>
                      ))}
                      <Form.Item wrapperCol={{ span: 24 }}>
                        <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />} style={{ height: '100px' }}>
                          添加家庭信息
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </>
  )
}


const mapStateToProps = (state) => {
    return {
        sexOptions: state[namespace].sexOptions,
        nationOptions: state[namespace].nationOptions,
        eduNatureOptions: state[namespace].eduNatureOptions,
        eduOptions: state[namespace].eduOptions,
        workOptions: state[namespace].workOptions,
        ProvinceCityAddressOptions: state[namespace].ProvinceCityAddressOptions,
        CityAddressOptions: state[namespace].CityAddressOptions,
        SchoolOrgsOptions: state[namespace].SchoolOrgsOptions,
        SchoolPostsOptions: state[namespace].SchoolPostsOptions,
        relationOptions: state[namespace].relationOptions,
        postFunctionOptions: state[namespace].postFunctionOptions,
        postTypeOptions: state[namespace].postTypeOptions,
        PrincipalJobOptions: state[namespace].PrincipalJobOptions,
        postOptions: state[namespace].postOptions,
        degreeLevelOptions: state[namespace].degreeLevelOptions,
        degreeTypeOptions: state[namespace].degreeTypeOptions,
        studyYearOptions: state[namespace].studyYearOptions,
        docTypeOptions: state[namespace].docTypeOptions,
    }
}

export default memo(connect(mapStateToProps)(NewEmployee))
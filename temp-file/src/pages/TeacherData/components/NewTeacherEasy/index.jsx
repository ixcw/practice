/*
Author:韦靠谱
Description:新建教师账号（极简版）
Date:2023/05/05
*/
import React, { useState } from 'react'
import { Modal, Form, Input, notification, Select, DatePicker } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import { TeacherData as namespace } from '@/utils/namespace'
import { phoneReg, IdCardReg } from '@/utils/const'

const NewTeacherEasy = (props) => {
  const { dispatch, StatTeacherStatisticsApi, NewTeacherEasyOpen, showNewTeacherEasy, getTeacherList, sexOptions, docTypeOptions } = props

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [docTypeValue, setDocTypeValue] = useState(1) //证件类型  1身份证 2护照...

  const handleOk = () => {
    setLoading(true)
    form
      .validateFields()
      .then(values => {
        dispatch({
          type: namespace + '/postTeacherAddOrModify',
          payload: { ...values, ...(docTypeValue !== 1 && { birthday: values['birthday'].format('YYYY-MM-DD') }) },
          callback: res => {
            if (res.err && res?.err?.code == 601) {
              setLoading(false)
            } else {
              notification.success({
                message: '新建教师提示',
                description: '您完成一名教师账号的新建！'
              })
              setLoading(false)
              showNewTeacherEasy(false)
              getTeacherList()
              StatTeacherStatisticsApi()
              form.resetFields() //清空表单
            }
          }
        })
      })
      .catch(info => {
        setLoading(false)
      })
  }

  const handleCancel = () => {
    showNewTeacherEasy(false)
  }

  // 证件类型下拉框
  const handleDocTypeChange = value => {
    setDocTypeValue(value)
    form.setFieldsValue({ identityCard: null, birthday:null })
  }

  // 限制可选择的时间
  const disabledDate = current => {
    return current && current > moment().endOf('day')
  }

  return (
    <Modal title='快速创建教师账号' confirmLoading={loading} visible={NewTeacherEasyOpen} onOk={handleOk} onCancel={handleCancel}>
      <Form form={form} layout='vertical' name='form_in_modal' initialValues={{ modifier: 'public' }}>
        <Form.Item name='userName' label='姓名' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name='sex' label='性别' rules={[{ required: true }]}>
          <Select options={sexOptions} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name='phone' label='联系电话' rules={[{ required: true }, { pattern: phoneReg, message: '请输入正确的电话号码！' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='证件类型' name='docType' rules={[{ required: true }]}>
          <Select options={docTypeOptions} onChange={handleDocTypeChange} getPopupContainer={triggerNode => triggerNode.parentNode} />
        </Form.Item>
        <Form.Item name='identityCard' label='证件号码' rules={[{ required: true }, { pattern: docTypeValue === 1 ? IdCardReg : null, message: '请输入正确的身份证号码！' }]}>
          <Input />
        </Form.Item>
        {docTypeValue !== 1 && (
          <Form.Item label='出生日期' name='birthday' rules={[{ required: true }]}>
            <DatePicker disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100%' }} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

const mapStateToProps = (state) => {
    return {
      sexOptions: state[namespace].sexOptions,
      docTypeOptions: state[namespace].docTypeOptions
    }
}

export default connect(mapStateToProps)(NewTeacherEasy)
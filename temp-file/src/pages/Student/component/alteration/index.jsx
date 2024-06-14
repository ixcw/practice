import React from 'react'

import { connect } from 'dva'
import { StudentData as namespace } from '@/utils/namespace'
import { useEffect, useState, memo } from 'react';
import { Modal, Tabs, Form, Row, Col, Select, Input, Button, DatePicker, Cascader, notification, message, Radio, Spin } from 'antd';


function index(props) {
  const { dispatch, alterationOpen, showAlteration, alterationAccount } = props;
  const [loading, setLoading] = useState(false)
  const [radioValue, setRadioValue] = useState('apple')
  const [detailsData, setDetailsData] = useState({}) // 存储信息

  const [gradeClass, setGradeClass] = useState({})
  const [gradeOptions, setGradeOptions] = useState([]) // 存储年级下拉列表
  const [checkoutType, setCheckoutType] = useState(false)  // 控制显示隐藏
  const [classOptions, setClassOptions] = useState([]) // 存储班级下拉框

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ changeGrade: null, changeClass: null, startTime: null })
    setClassOptions([])

    if (alterationAccount !== null && alterationOpen) {
      console.log(alterationAccount, "这是传过来的")
      setLoading(true)
      dispatch({
        type: namespace + "/getGradeLinkageClass",
        payload: { spoce: alterationAccount.spoce,  },
        callback: (res) => {
          console.log(res, '学级学段班级联动')
          setLoading(false)
          setGradeClass(res.result)
          setGradeOptions(res?.result?.map(item => {
            return {
              label: item.name,
              value: item.name
            }

          }))

        }
      })

    }

  }, [alterationOpen])
  useEffect(() => {
    form.setFieldsValue({
      name: alterationAccount?.name,
      sex: alterationAccount?.sex,
      account: alterationAccount?.account,
      classData: alterationAccount?.gradeName + alterationAccount?.className,

      Radio: '',
    })

  }, [alterationAccount])

  const sexOptions = [
    {
      label: '男',
      value: 0
    },
    {
      label: '女',
      value: 1
    },
  ]

  //点击完成
  const onFinish = (value) => {
    console.log(value, "这是点击完成时")
    const formData = {
      studentId: alterationAccount.userId,
      classId: value.changeClass,
      operateDate: value.startTime._d.getTime(),
      oldName: value.classData,
      newName: value.changeGrade + classOptions.filter(item => item.value == value.changeClass)[0].label,
      operate: value.Radio

    }
    console.log(formData, '要提交的数据')
    dispatch({
      type: namespace + "/putVariationStudent",
      payload: formData,
      callback: (res) => {
        console.log(res)
        console.log('提交')
        if (res.result) {

          showAlteration(!alterationOpen)
          openNotificationWithIcon('success')
          setCheckoutType(false)
        }
      }
    })

  }
  //点击转班还是跳级
  const radioChange = (e) => {
    console.log(e, "这是点击的")

    setRadioValue(e.target.value);
    setCheckoutType(true)
    if (e.target.value == "转班") {
      const tem = gradeClass?.filter(item => item.name == alterationAccount.gradeName).map(item => {
        return {
          label: item.name,
          value: item.name
        }
      })
      setGradeOptions(tem)
    }
    if (e.target.value == "跳级") {
      const tem = gradeClass?.map(item => {
        return {
          label: item.name,
          value: item.name
        }
      })
      setGradeOptions(tem)
    }
  }
  //点击年级变动班级
  const gradeChange = (e) => {
    console.log(e)
    // console.log(detailsData.sex.split("-"))
    console.log(gradeClass.filter(item => item.name == e)[0].classList.map(item => {
      return {
        label: item.anotherName,
        value: item.id
      }

    }).filter((item, index, self) =>
      index === self.findIndex(obj =>
        JSON.stringify(obj) === JSON.stringify(item)
      )
    ))
    setClassOptions(gradeClass.filter(item => item.name == e)[0].classList.map(item => {
      return {
        label: item.anotherName,
        value: item.id
      }

    }).filter((item, index, self) =>
      index === self.findIndex(obj =>
        JSON.stringify(obj) === JSON.stringify(item)
      )
    )
    )
  }
  useEffect(() => {

    form.setFieldsValue({ changeGrade: '' })
    form.setFieldsValue({ changeClass: '' })
  }, [radioValue])

  // 变动成功提示
  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: '变动学生信息提示',
      description: '您变动了一名学生的信息！',
    });
  };

  return (
    <div>
      <Modal title="学生变动" visible={alterationOpen} width={450} footer={null} destroyOnClose={true} onCancel={() => { showAlteration(!alterationOpen); setCheckoutType(false); form.setFieldsValue({ changeGrade: null, changeClass: null }) }} bodyStyle={{ padding: '0 24px 24px 24px', }} style={{ textAlign: "center" }} >
        <Spin spinning={loading}>
          <Form name="form" form={form} onFinish={onFinish} autoComplete="off" >
            <Row gutter={[12, 0]} style= {{marginTop:"20px"}}>
              <Col span={12}>
                <Form.Item label="学生姓名" name="name" >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="学生性别" name="sex"  >
                  <Select options={sexOptions} getCalendarContainer={triggerNode => triggerNode.parentNode} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="学籍号" name="account"  >
              <Input disabled />
            </Form.Item>
            <Form.Item label="变动类型" name='Radio' >
              <Radio.Group onChange={radioChange} defaultChecked={false}  >
                <Radio value="转班"> 转班 </Radio>
                <Radio value="跳级"> 跳级 </Radio>
              </Radio.Group>
            </Form.Item>
            {checkoutType ? (
              <div>
                <Form.Item label="选择时间" name='startTime' rules={[{ required: true, message: '请选择時間' }]}>
                  <DatePicker />
                </Form.Item>
                <Form.Item label="当前班级信息" name="classData"  >
                  <Input />
                </Form.Item>
                <Row gutter={[12, 0]}>
                  <Col span={12}>
                    <Form.Item label="变动后年级" name="changeGrade" rules={[{ required: true, message: '请选择' }]} >
                      <Select options={gradeOptions} onChange={gradeChange} getCalendarContainer={triggerNode => triggerNode.parentNode} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="变动后班级" name="changeClass" rules={[{ required: true, message: '请选择' }]} >
                      <Select options={classOptions} getCalendarContainer={triggerNode => triggerNode.parentNode} />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ) : (null)}



            <Form.Item>
              <Button type="primary" htmlType="submit">
                完成
              </Button>
            </Form.Item>
          </Form>

        </Spin>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    StudentDetailsData: state[namespace].StudentDetailsData
  }
}
export default memo(connect(mapStateToProps)(index))

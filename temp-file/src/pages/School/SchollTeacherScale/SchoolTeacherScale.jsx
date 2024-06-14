/**
 * 学校教师规模
 * @author:shihaigui
 * date:2023年04月26日
 * */

import React, { useEffect, useState } from "react"
import styles from "./SchoolTeacherScale.less"
import { Col, Row, Button, Select, Input, Form, Space, DatePicker, notification, message, } from "antd"
import { connect } from "dva"
import moment from "moment"
import { School as namespace } from "../../../utils/namespace"
import { } from "@ant-design/icons"

function SchoolTeacherScale (props) {
  const [schoolTeacherScaleForm] = Form.useForm()
  const [YearData, setYeardata] = useState(null)
  const [YearSynchronizationData, setYearSynchronizationData] = useState([])
  const { dispatch } = props

  // 限制可选择的时间
  const disabledDate = (current) => { return current && current > moment().endOf('day') }



  //同步年份转换
  const FellowTeacher = (value) => {
    setYeardata(value?.format("YYYY"))
    if (value) {
      SynchronizationYear(value?.format("YYYY"))
    } else {
      schoolTeacherScaleForm.resetFields()
    }
  }

  const SynchronizationYear = (value) => {
    dispatch({
      type: namespace + "/historyTeacherScaleApi",
      payload: { year: value },
      callback: (res) => {
        if (res.result == null) {
          message.error("您属于第一次新建，请手动补充数据")
          return
        } else {
          setYearSynchronizationData(res?.result)
        }

      },
    })
  }

  // useEffect(() => {
  //   //查询学校教师规模
  //   dispatch({
  //     type: namespace + "/historyTeacherScaleApi",
  //     payload: { schoolId: 88 },
  //     callback: (res) => {
  //       if (res) {
  //       }
  //     },
  //   })
  // }, [])


  //同步学校教师规模数据的处理
  useEffect(() => {
    schoolTeacherScaleForm.setFieldsValue({
      oneTeacherNum: YearSynchronizationData?.oneTeacherNum,
      twoTeacherNum: YearSynchronizationData?.twoTeacherNum,
      threeTeacherNum: YearSynchronizationData?.threeTeacherNum,
      seniorTeacherNum: YearSynchronizationData?.seniorTeacherNum,
      isSeniorTeacherNum: YearSynchronizationData?.isSeniorTeacherNum,
      unitSeniorTeacherNum: YearSynchronizationData?.unitSeniorTeacherNum,
      specialTeacherNum: YearSynchronizationData?.specialTeacherNum,
      fullSpecialTeacherNum: YearSynchronizationData?.fullSpecialTeacherNum,
      jobSpecialTeacherNum: YearSynchronizationData?.jobSpecialTeacherNum,
      normalTeacherNum: YearSynchronizationData?.normalTeacherNum,
      fullNormalTeacherNum: YearSynchronizationData?.fullNormalTeacherNum,
      jobNormalTeacherNum: YearSynchronizationData?.jobNormalTeacherNum,
      highTeacherNum: YearSynchronizationData?.highTeacherNum,
      fullHighTeacherNum: YearSynchronizationData?.fullHighTeacherNum,
      jobHighTeacherNum: YearSynchronizationData?.jobHighTeacherNum,
      collegeTeacherNum: YearSynchronizationData?.collegeTeacherNum,
      fullCollegeTeacherNum: YearSynchronizationData?.fullCollegeTeacherNum,
      jobCollegeTeacherNum: YearSynchronizationData?.jobCollegeTeacherNum,
      undergTeacherNum: YearSynchronizationData?.undergTeacherNum,
      fullUndergTeacherNum: YearSynchronizationData?.fullUndergTeacherNum,
      jobUndergTeacherNum: YearSynchronizationData?.jobUndergTeacherNum,
      masterTeacherNum: YearSynchronizationData?.masterTeacherNum,
      fullMasterTeacherNum: YearSynchronizationData?.fullMasterTeacherNum,
      jobMasterTeacherNum: YearSynchronizationData?.jobMasterTeacherNum,
      drTeacherNum: YearSynchronizationData?.drTeacherNum,
      fullDrTeacherNum: YearSynchronizationData?.fullDrTeacherNum,
      jobDrTeacherNum: YearSynchronizationData?.jobDrTeacherNum,
      teacherRate: YearSynchronizationData?.teacherRate,
    })
  }, [YearSynchronizationData])

  const [loading, setLoading] = useState(false)
  // 保存学校教师规模
  const onFinish = () => {
    schoolTeacherScaleForm.validateFields()
      .then((value) => {
        dispatch({
          type: namespace + "/saveTeacherScaleApi",
          payload: { ...value, year: value["year"].format("YYYY") },
          callback: (res) => {
            if (res.result === "保存成功") {
              message.success("保存学校教师规模成功")
              setLoading(false)
              // 保存成功后清空输入框的内容
              schoolTeacherScaleForm.resetFields()
            } else {
              setLoading(false)
              message.error("保存学校教师规模失败")
            }
          },
        })
      })
      .catch((info) => { })
  }


  //校验输入框不能输入小数点
  const handleInputChange = (e) => {
    let value = e.target.value
    // 去除小数点
    value = value.replace(/\./g, '')
    // 去除加减号
    value = value.replace(/[+-]/g, '')
    e.target.value = value

  }




  return (
    <>
      <div>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "15px"
          }}
        >
          学校教师规模
        </span>
      </div>

      <div>

        <div>
          <Form
            name="schoolTeacherScale"
            onFinish={onFinish}
            form={schoolTeacherScaleForm}
            autoComplete="off"
            preserve={false}
            style={{ marginLeft: "20px", marginTop: "20px" }}
          >
            <Row>
              <Col span={6} style={{ fontWeight: 700 }}>
                <Form.Item label="新建年份" name="year" rules={[{
                  required: true,
                  message: '请选择新建年份!',
                },
                ]} >
                  <DatePicker picker="year" disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} />
                </Form.Item>
              </Col>
              <Col span={9} offset={9}>
                <span style={{ fontWeight: "700" }}>请选择需要查询的数据年份: </span>
                <DatePicker picker="year" onChange={FellowTeacher} />
              </Col>
              {/* <Col span={1}>
                <Button type="primary" onClick={SynchronizationYear}>同步 </Button>
              </Col> */}

            </Row>
            <div className={styles["TeacherScale"]}><span style={{ fontWeight: "800", marginLeft: "10px" }}> 教师配备情况：</span>
            </div>
            <Row>
              <Col span={6}>
                <Form.Item label="一级教师人数" name="oneTeacherNum"
                  rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                  <Input addonAfter="人" onKeyDown={handleInputChange} />
                </Form.Item>
              </Col>
              <Col span={6} offset={2}>
                <Form.Item label="二级教师人数" name="twoTeacherNum"
                  rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                  <Input addonAfter="人" onKeyDown={handleInputChange} />
                </Form.Item>
              </Col>
              <Col span={6} offset={2}>
                <Form.Item label="三级教师人数" name="threeTeacherNum"
                  rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                  <Input addonAfter="人" onKeyDown={handleInputChange} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item label="高级教师人数" name="seniorTeacherNum"
                  rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                  <Input addonAfter="人" onKeyDown={handleInputChange} />
                </Form.Item>
              </Col>
              <Col span={6} offset={2}>
                <Form.Item label="正高级教师人数" name="isSeniorTeacherNum"
                  rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                  <Input addonAfter="人" onKeyDown={handleInputChange} />
                </Form.Item>
              </Col>

              <Col span={7} offset={2}>
                <Form.Item label="基层认定高级教师" name="unitSeniorTeacherNum"
                  rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                  <Input addonAfter="人" onKeyDown={handleInputChange} />
                </Form.Item>
              </Col>
            </Row>
            <div className={styles["TeacherPeople"]}>
              <span style={{ fontWeight: "800", marginLeft: "10px" }}>各学历教师人数情况：</span>
            </div>
            <div>
              <Row>
                <Col span={7}>
                  <Form.Item label="中专学历教师总人数" name="specialTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                  <Form.Item label="全日制学历教师数量" name="fullSpecialTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>

                <Col span={7} offset={1}>
                  <Form.Item label="非全日制学历教师数量" name="jobSpecialTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <Form.Item label="中师学历教师总人数" name="normalTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                  <Form.Item label="全日制学历教师数量" name="fullNormalTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>

                <Col span={7} offset={1}>
                  <Form.Item label="非全日制学历教师数量" name="jobNormalTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <Form.Item label="高中学历教师总人数" name="highTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                  <Form.Item label="全日制学历教师数量" name="fullHighTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>

                <Col span={7} offset={1}>
                  <Form.Item label="非全日制学历教师数量" name="jobHighTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <Form.Item label="大专学历教师总人数" name="collegeTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]} >
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                  <Form.Item label="全日制学历教师数量" name="fullCollegeTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                  <Form.Item label="非全日制学历教师数量" name="jobCollegeTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <Form.Item label="本科学历教师总人数" name="undergTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                  <Form.Item label="全日制学历教师数量" name="fullUndergTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]} >
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>

                <Col span={7} offset={1}>
                  <Form.Item label="非全日制学历教师数量" name="jobUndergTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <Form.Item label="硕士学历教师总人数" name="masterTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]} >
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                  <Form.Item label="全日制学历教师数量" name="fullMasterTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                  <Form.Item label="非全日制学历教师数量" name="jobMasterTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <Form.Item label="博士学历教师总人数" name="drTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                    <Input addonAfter="人" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                  <Form.Item label="全日制学历教师数量" name="fullDrTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]} >

                    <Input addonAfter="人" onKeyDown={handleInputChange} />

                  </Form.Item>
                </Col>

                <Col span={7} offset={1}>
                  <Form.Item label="非全日制学历教师数量" name="jobDrTeacherNum"
                    rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>

                    <Input addonAfter="人" onKeyDown={handleInputChange} />

                  </Form.Item>
                </Col>
              </Row>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: "700",
                  marginTop: "20px"
                }}
              >
                <Row>
                  <Col span={17}>
                    <Form.Item label="教师学历合格率" name="teacherRate" rules={[{
                      required: true,
                      message: '请输入内容!',
                    },
                    ]}>
                      <Input addonAfter="%" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}
const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(SchoolTeacherScale)

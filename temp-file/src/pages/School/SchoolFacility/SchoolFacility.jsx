/**
 * 学校设施情况
 * @author:shihaigui
 * date:2023年04月26日
 * */

import React, { useEffect, useState } from "react"
import { Col, Row, Button, Select, Input, Form, DatePicker, Space, notification, message, } from "antd"
import moment from "moment"
import { connect } from "dva"
import { School as namespace } from "../../../utils/namespace"
import styles from "./SchoolFacility.less"

function SchoolFacility (props) {
  const [schoolFacilityForm] = Form.useForm()
  const [YearData, setYeardata] = useState(null)
  const [loading, setLoading] = useState(false)
  const [YearSynchronizationData, setYearSynchronizationData] = useState([])
  const { dispatch } = props


  // 限制可选择的时间
  const disabledDate = (current) => { return current && current > moment().endOf('day') }

  //同步年份数据
  const Cofacility = (value) => {
    setYeardata(value?.format("YYYY"))
    if (value) {
      Synchronizationyear(value?.format("YYYY"))
    } else {
      schoolFacilityForm.resetFields()
    }
  }

  const Synchronizationyear = (value) => {
    dispatch({
      type: namespace + "/historyFacilityApi",
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
  //   //查询学校设施情况
  //   dispatch({
  //     type: namespace + "/historyFacilityApi",
  //     callback: (res) => {
  //       if (res) {
  //       }
  //     },
  //   })
  // }, [])

  // 保存成功记录数据
  const onFinish = () => {
    schoolFacilityForm.validateFields()
      .then((value) => {
        const otherRoomList = [{ name: value.name, num: value.num }]
        const { name, num, ...newValues } = { ...value, otherRoomList }
        dispatch({
          type: namespace + "/saveSchoolFacilityApi",
          payload: { ...newValues, year: value["year"]?.format("YYYY") },
          callback: (res) => {
            if (res.result === "保存成功") {
              message.success("保存学校设施成功！")
              setLoading(false)
              // 保存成功后清除表单内容
              schoolFacilityForm.resetFields()
            } else {
              setLoading(false)
              message.error("保存学校设施失败！")
            }
          },
        })
      })
      .catch((info) => { })
  }


  //同步学校设施数据的处理
  useEffect(() => {
    schoolFacilityForm.setFieldsValue({
      badmCourtNum: YearSynchronizationData?.badmCourtNum,
      baskeParkNum: YearSynchronizationData?.baskeParkNum,
      generalRoomNum: YearSynchronizationData?.generalRoomNum,
      totalArea: YearSynchronizationData?.totalArea,
      buildArea: YearSynchronizationData?.buildArea,
      greenArea: YearSynchronizationData?.greenArea,
      classNetwork: YearSynchronizationData?.classNetwork,
      teacherNetwork: YearSynchronizationData?.teacherNetwork,
      monitorNetwork: YearSynchronizationData?.monitorNetwork,
      teacherComputerNum: YearSynchronizationData?.teacherComputerNum,
      studentComputerNum: YearSynchronizationData?.studentComputerNum,
      magazineTypeNum: YearSynchronizationData?.magazineTypeNum,
      bookNum: YearSynchronizationData?.bookNum,
      physicsRoomNum: YearSynchronizationData?.physicsRoomNum,
      chemistryRoomNum: YearSynchronizationData?.chemistryRoomNum,
      biologyRoomNum: YearSynchronizationData?.biologyRoomNum,
      computerRoomNum: YearSynchronizationData?.computerRoomNum,
      musicRoomNum: YearSynchronizationData?.musicRoomNum,
      classRoomNum: YearSynchronizationData?.classRoomNum,
      mediaRoomNum: YearSynchronizationData?.mediaRoomNum,
      mediaRoomRate: YearSynchronizationData?.mediaRoomRate,
      fourParkNum: YearSynchronizationData?.fourParkNum,
      oneParkNum: YearSynchronizationData?.oneParkNum,
      tenisTableNum: YearSynchronizationData?.tenisTableNum,
      seatsNum: YearSynchronizationData?.seatsNum,
      berthNum: YearSynchronizationData?.berthNum,
      name: YearSynchronizationData?.otherRoomList && YearSynchronizationData?.otherRoomList.length > 0 && YearSynchronizationData?.otherRoomList[0]?.name,
      num: YearSynchronizationData?.otherRoomList && YearSynchronizationData?.otherRoomList.length > 0 && YearSynchronizationData?.otherRoomList[0]?.num,
    })
  }, [YearSynchronizationData])

  //校验输入框不能输入小数点和负数
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
          style={{ display: "flex", justifyContent: "center", fontWeight: "650", fontSize: "15px" }} >学校设施情况</span>
      </div>

      <div>
        <Form
          name="schoolFacility"
          onFinish={onFinish}
          form={schoolFacilityForm}
          autoComplete="off"
          preserve={false}
        >
          <Row gutter={[0, 33]}>
            <Col span={6} style={{ fontWeight: 700 }}>
              <Form.Item label="新建年份" name="year" rules={[{
                required: true,
                message: '请选择新建年份!',
              },
              ]}>
                <DatePicker picker="year" disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} />
              </Form.Item>
            </Col>
            <Col span={9} offset={9}>
              <span style={{ fontWeight: "700" }}>请选择需要查询的数据年份: </span>
              <DatePicker picker="year" onChange={Cofacility} />

            </Col>
            {/* <Col span={1}>
              <Button type="primary" onClick={Synchronizationyear}>同步</Button>
            </Col> */}
          </Row>
          <div className={styles["General"]}>
            <span style={{ fontWeight: "800", marginLeft: "10px" }}>
              总概况:
            </span>
          </div>
          <div>
            <Row>
              <Col span={5}>
                <Form.Item label="校园总面积" name="totalArea" rules={[{
                  required: true,
                  message: '请输入内容!',
                },
                {
                  validator: (_, value) => {
                    if (value && value !== '-' && !/^\d+(\.\d+)?$/.test(value)) {
                      return Promise.reject(new Error('请输入有效的数字!'))
                    }
                    return Promise.resolve()
                  },
                },
                ]}>
                  <Input addonAfter="亩" />
                </Form.Item>
              </Col>
              <Col span={5} offset={3}>
                <Form.Item label="校舍建筑面积" name="buildArea" rules={[{
                  required: true,
                  message: '请输入内容!',
                },
                {
                  validator: (_, value) => {
                    if (value && value !== '-' && !/^\d+(\.\d+)?$/.test(value)) {
                      return Promise.reject(new Error('请输入有效的数字!'))
                    }
                    return Promise.resolve()
                  },
                },
                ]}>
                  <Input addonAfter="亩" />
                </Form.Item>
              </Col>
              <Col span={6} offset={4}>
                <Form.Item label="校园绿化面积" name="greenArea" rules={[{
                  required: true,
                  message: '请输入内容!',
                },
                {
                  validator: (_, value) => {
                    if (value && value !== '-' && !/^\d+(\.\d+)?$/.test(value)) {
                      return Promise.reject(new Error('请输入有效的数字!'))
                    }
                    return Promise.resolve()
                  },
                },
                ]}>
                  <Input addonAfter="亩" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item label="校园班级网络是否全覆盖" name="classNetwork" rules={[{
                  required: true,
                  message: '请选择内容!',
                },
                ]}>
                  <Select
                    style={{
                      width: 60,
                    }}
                    options={[
                      {
                        value: "是",
                      },
                      {
                        value: "否",
                      },
                    ]}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={8} offset={1}>
                <Form.Item label="校园教师办公网络是否全覆盖" name="teacherNetwork" rules={[{
                  required: true,
                  message: '请选择内容!',
                },
                ]}>
                  <Select
                    style={{
                      width: 60,
                    }}
                    options={[
                      {
                        value: "是",
                      },
                      {
                        value: "否",
                      },
                    ]}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={7} offset={1}>
                <Form.Item label="校园安全监控是否全覆盖" name="monitorNetwork" rules={[{
                  required: true,
                  message: '请选择内容!',
                },
                ]}>
                  <Select
                    style={{
                      width: 60,
                    }}
                    options={[
                      {
                        value: "是",
                      },
                      {
                        value: "否",
                      },
                    ]}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item label="每位教师拥有计算机数量" name="teacherComputerNum" rules={[{
                  required: true,
                  message: '请输入内容!',
                },
                ]}>
                  <Input
                    addonAfter="台/人"
                    onKeyDown={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} offset={1}>
                <Form.Item label="每百位学生拥有计算机数量" name="studentComputerNum"
                  rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]} >
                  <Input addonAfter="台/100人" onKeyDown={handleInputChange} />
                </Form.Item>
              </Col>
              <Col span={5} offset={1}>
                <Form.Item label="报刊杂志种类" name="magazineTypeNum" rules={[{
                  required: true,
                  message: '请输入内容!',
                },
                ]}>
                  <Input addonAfter="种" onKeyDown={handleInputChange} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={5}>
                <Form.Item label="图书数量" name="bookNum" rules={[{
                  required: true,
                  message: '请输入内容!',
                },
                ]}>
                  <Input addonAfter="册" onKeyDown={handleInputChange} />
                </Form.Item>
              </Col>
            </Row>

            <div className={styles["Classroom"]}>
              <span style={{ fontWeight: "800", marginLeft: "10px" }}>各类教室数量情况：</span>
            </div>
            <div>
              <Row>
                <Col span={6}>
                  <Form.Item label="物理教室数量" name="physicsRoomNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="间" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={6} offset={2}>
                  <Form.Item label="化学教室数量" name="chemistryRoomNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="间" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={6} offset={3}>
                  <Form.Item label="生物教室数量" name="biologyRoomNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="间" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Form.Item label="通用技术教室数量" name="generalRoomNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="间" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={7} offset={2}>
                  <Form.Item label="计算机网络教室数量" name="computerRoomNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="间" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={6} offset={2}>
                  <Form.Item label="音乐美术教室数量" name="musicRoomNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="间" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={7}>
                  <Form.Item label="其他功能性教室名称" name="name" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                  <Form.Item label="其他功能性教室数量" name="num" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="间" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={6} offset={2}>
                  <Form.Item label="普通教室数量" name="classRoomNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="间" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={6}>
                  <Form.Item label="多媒体教室数量" name="mediaRoomNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="间" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={7} offset={2}>
                  <Form.Item label="多媒体教室占总教室比例" name="mediaRoomRate" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="%" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className={styles["Movement"]}>
              <span style={{ fontWeight: "800", marginLeft: "10px" }}>运动场地情况：</span>
            </div>
            <div>
              <Row>
                <Col span={8}>
                  <Form.Item label="400米环形跑道足球运动场数量" name="fourParkNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="个" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                  <Form.Item label="100米直跑足球场数量" name="oneParkNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="个" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={5} offset={1}>
                  <Form.Item label="篮球场地数量" name="baskeParkNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="个" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Form.Item label="乒乓球台数量" name="tenisTableNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="个" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
                <Col span={5} offset={3}>
                  <Form.Item label="羽毛球场数量" name="badmCourtNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="个" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div className={styles["Facility"]}>
              <span style={{ fontWeight: "800", marginLeft: "10px" }}>其他设施情况：</span>
            </div>
            <div>
              <Row>
                <Col span={7}>
                  <Form.Item label="学校提供就餐餐位数" name="seatsNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="个" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>

                <Col span={7} offset={2}>
                  <Form.Item label="学校提供住宿床位数" name="berthNum" rules={[{
                    required: true,
                    message: '请输入内容!',
                  },
                  ]}>
                    <Input addonAfter="个" onKeyDown={handleInputChange} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}
const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(SchoolFacility)

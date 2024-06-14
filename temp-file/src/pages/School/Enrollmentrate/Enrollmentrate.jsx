/**
 * 升学率
 * @author:shihaigui
 * date:2023年04月26日
 * */

import React, { useEffect, useState } from "react"
import { Col, Row, Button, Select, Input, Form, Table, Space, DatePicker, message, Spin, } from "antd"
import moment from "moment"
import { connect } from "dva"
import { School as namespace } from "../../../utils/namespace"
import styles from "./Enrollmentrate.less"
function Enrollmentrate (props) {
  const [smallForm] = Form.useForm()
  const [highForm] = Form.useForm()
  const [IntheForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [PrimarySchoolUpgrade, setPrimarySchoolUpgrade] = useState([])
  const [JuniorHighSchoolUpgrade, setJuniorHighSchoolUpgrade] = useState([])
  const [SeniorHighSchoolUpgrade, setSeniorHighSchoolUpgrade] = useState([])
  // const [EnrollmentRate, setEnrollmentRate] = useState([])

  const { dispatch } = props

  // 限制可选择的时间
  const disabledDate = (current) => { return current && current > moment().endOf('day') }


  useEffect(() => {
    //查询小学升学率
    dispatch({
      type: namespace + "/getPrimaryEnrollmentRateApi",
      payload: { schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId },
      callback: (res) => {
        if (res) {
          setPrimarySchoolUpgrade(res?.result)
        }
      },
    })
    //查询初中升学率
    dispatch({
      type: namespace + "/getJuniorEnrollmentRateApi",
      payload: { schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId },
      callback: (res) => {
        if (res) {
          setJuniorHighSchoolUpgrade(res?.result)
        }
      },
    })
    //查询高中升学率
    dispatch({
      type: namespace + "/getSeniorEnrollmentRateApi",
      payload: { schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId },
      callback: (res) => {
        if (res) {
          setSeniorHighSchoolUpgrade(res?.result)
        }
      },
    })
  }, [])

  // 添加保存小学升学率
  const Primaryschool = (value) => {

    const Small = [
      {
        "number": value?.juniorSchoolEntranceNum - 0,
        "schoolIndex": "zh02",//初中录取人数
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.juniorSchoolEntranceRate - 0,
        "schoolIndex": "zh03",//初中录取率
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.primaryDropoutRate - 0,
        "schoolIndex": "zh05",//小学辍学率
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.primarySchoolNum - 0,
        "schoolIndex": "zh01",//小学毕业总人数
        "year": value.year && value.year.format("YYYY")
      },
    ]
    dispatch({
      type: namespace + "/savePrimaryEnrollmentRateApi",
      payload: Small,
      callback: (res) => {
        if (res.result === "保存成功") {
          message.success("保存小学升学率成功！")
          // 保存成功后清空输入框的内容
          smallForm.resetFields()
          SmallSchool()
        } else {
          message.error("保存小学升学率失败！")
        }

      },
    })

  }
  // 添加保存初中升学率
  const JuniorHighSchool = (value) => {
    const Early = [
      {
        "number": value?.juniorDropoutRate - 0,
        "schoolIndex": "zh12",//学生辍学率
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.seniorEntranceRate - 0,
        "schoolIndex": "zh08",//高中录取率
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.secondaryVocationalNum - 0,
        "schoolIndex": "zh09",//中职录取人数
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.secondaryVocationalRate - 0,
        "schoolIndex": "zh10",//中职录取率
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.juniorSchoolNum - 0,
        "schoolIndex": "zh06",//毕业总人数
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.seniorEntranceNum - 0,
        "schoolIndex": "zh07",//高中录取人数
        "year": value.year && value.year.format("YYYY")
      },
    ]
    dispatch({
      type: namespace + "/saveJuniorEnrollmentRateApi",
      payload: Early,
      callback: (res) => {
        if (res.result === "保存成功") {
          message.success("保存初中升学率成功！")
          // 保存成功后清空输入框的内容
          IntheForm.resetFields()
          EarlySchool()
        } else {
          message.error("保存初中升学率失败！")
        }
      },
    })

  }


  // 添加保存高中升学率
  const SeniorHighSchool = (value) => {


    const High = [
      {
        "number": value?.seniorGraduationNum - 0,
        "schoolIndex": "zh13",//高中毕业总人数
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.collegeEntranceExaminationNum - 0,
        "schoolIndex": "zh14",//高考总人数
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.collegeEntranceNum - 0,
        "schoolIndex": "zh15",//大学录取人数
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.noAdmissionNum - 0,
        "schoolIndex": "zh16",//未被录取人数
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.collegeEntranceRate - 0,
        "schoolIndex": "zh17",//大学录取率
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.emphasisCollegeNum - 0,
        "schoolIndex": "zh18",//重点大学录取人数
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.emphasisCollegeRate - 0,
        "schoolIndex": "zh19",//重点大学录取率
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.keyUniversitiesNum - 0,
        "schoolIndex": "zh20",//一本大学录取人数
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.keyUniversitiesRate - 0,
        "schoolIndex": "zh21",//一本大学录取率
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.secondUniversitiesNum - 0,
        "schoolIndex": "zh22",//二本大学录取人数
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.secondUniversitiesRate - 0,
        "schoolIndex": "zh23",//二本大学录取率
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.tertiaryInstitutionNum - 0,
        "schoolIndex": "zh24",//大专院校录取人数
        "year": value.year && value.year.format("YYYY")
      },
      {
        "number": value?.tertiaryInstitutionRate - 0,
        "schoolIndex": "zh25",//大专院校录取率
        "year": value.year && value.year.format("YYYY")
      },
    ]
    dispatch({
      type: namespace + "/saveSeniorEnrollmentRateApi",
      payload: High,
      callback: (res) => {
        if (res.result === "保存成功") {
          message.success("保存高中升学率成功！")
          // 保存成功后清空输入框的内容
          highForm.resetFields()
          HighSchool()
        } else {
          message.reeor("保存高中升学率失败！")
        }
      },
    })
  }

  //查询小学过往记录
  const SmallSchool = (value) => {
    dispatch({
      type: namespace + "/getPrimaryEnrollmentRateApi",
      payload: { schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId, ...(value ? { year: value.format("YYYY") } : {}) },
      callback: (res) => {
        if (res) {
          setPrimarySchoolUpgrade(res?.result)
          setLoading(false)
        }
      },
    })
  }
  //查询初中过往记录
  const EarlySchool = (value) => {
    dispatch({
      type: namespace + "/getJuniorEnrollmentRateApi",
      payload: { schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId, ...(value ? { year: value.format("YYYY") } : {}) },
      callback: (res) => {
        if (res) {
          setJuniorHighSchoolUpgrade(res?.result)
          setLoading(false)
        }
      },
    })
  }
  //查询高中过往记录
  const HighSchool = (value) => {
    dispatch({
      type: namespace + "/getSeniorEnrollmentRateApi",
      payload: { schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId, ...(value ? { year: value.format("YYYY") } : {}) },
      callback: (res) => {
        if (res) {
          setSeniorHighSchoolUpgrade(res?.result)
          setLoading(false)
        }
      },
    })
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




  //小学升学率表格表头
  const PrimarySchoolUpgradeColumns = [
    {
      title: "年份",
      dataIndex: "year",
      key: "year",
      width: "130px",
    },
    {
      title: "毕业总人数",
      dataIndex: "primarySchoolNum",
      key: "primarySchoolNum",
      width: "130px",
    },
    {
      title: "初中录取人数",
      dataIndex: "juniorSchoolEntranceNum",
      key: "juniorSchoolEntranceNum",
      width: "130px",
    },
    {
      title: "初中录取率%",
      dataIndex: "juniorSchoolEntranceRate",
      key: "juniorSchoolEntranceRate",
      width: "130px",
    },
    {
      title: "学生辍学率%",
      dataIndex: "primaryDropoutRate",
      key: "primaryDropoutRate",
      width: "130px",
    },
  ]

  // 初中升学率表格表头
  const JuniorHighSchoolUpgradeColumns = [
    {
      title: "年份",
      dataIndex: "year",
      key: "year",
      width: "80px",
    },
    {
      title: "毕业总人数",
      dataIndex: "juniorSchoolNum",
      key: "juniorSchoolNum",
    },
    {
      title: "高中录取人数",
      dataIndex: "seniorEntranceNum",
      key: "seniorEntranceNum",
      width: "130px",
    },
    {
      title: "高中录取率%",
      dataIndex: "seniorEntranceRate",
      key: "seniorEntranceRate",
    },
    {
      title: "中职录取人数",
      dataIndex: "secondaryVocationalNum",
      key: "secondaryVocationalNum",
    },
    {
      title: "中职录取率%",
      dataIndex: "secondaryVocationalRate",
      key: "secondaryVocationalRate",
    },
    {
      title: "初中辍学率%",
      dataIndex: "juniorDropoutRate",
      key: "juniorDropoutRate",
    },
  ]

  //高中升学率表格表头
  const SeniorHighSchoolUpgradeColumns = [
    {
      title: "年份",
      width: 100,
      dataIndex: "year",
      key: "year",
      fixed: "left",
    },
    {
      title: "毕业总人数",
      width: 130,
      dataIndex: "seniorGraduationNum",
      key: "seniorGraduationNum",
    },
    {
      title: "参加高考总人数",
      dataIndex: "collegeEntranceExaminationNum",
      key: "collegeEntranceExaminationNum",

      width: 150,
    },
    {
      title: "大学录取人数",
      dataIndex: "collegeEntranceNum",
      key: "collegeEntranceNum",

      width: 150,
    },
    {
      title: "未被录取人数",
      dataIndex: "noAdmissionNum",
      key: "noAdmissionNum",
      width: 150,
    },
    {
      title: "大学录取率%",
      dataIndex: "collegeEntranceRate",
      key: "collegeEntranceRate",
      width: 150,
    },
    {
      title: "重点大学录取人数",
      dataIndex: "emphasisCollegeNum",
      key: "emphasisCollegeNum",
      width: 150,
    },
    {
      title: "重点大学录取率%",
      dataIndex: "emphasisCollegeRate",
      key: "emphasisCollegeRate",
      width: 150,
    },
    {
      title: "一本大学录取人数",
      dataIndex: "keyUniversitiesNum",
      key: "keyUniversitiesNum",
      width: 150,
    },
    {
      title: "一本大学录取率%",
      dataIndex: "keyUniversitiesRate",
      key: "keyUniversitiesRate",
      width: 150,
    },
    {
      title: "二本大学录取人数",
      dataIndex: "secondUniversitiesNum",
      key: "secondUniversitiesNum",
      width: 150,
    },
    {
      title: "二本大学录取率%",
      dataIndex: "secondUniversitiesRate",
      key: "secondUniversitiesRate",
      width: 150,
    },
    {
      title: "大专院校录取人数",
      dataIndex: "tertiaryInstitutionNum",
      key: "tertiaryInstitutionNum",
      width: 150,
    },
    {
      title: "大专院校录取率%",
      dataIndex: "tertiaryInstitutionRate",
      key: "tertiaryInstitutionRate",
      width: 150,
    },
  ]






  return (
    <>
      <div>
        <Row style={{ border: "1px solid gray" }}>
          <Col span={24}>
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "15px"
              }}
            >
              小学升学率
            </span>
            <div>
              <div >
                <div className={styles["EnrollmentRate"]}>
                  <span style={{ fontWeight: "700", marginLeft: "20px", marginTop: "30px", }}>
                    新建升学率：
                  </span>
                </div>

                <Form
                  name="small"
                  onFinish={Primaryschool}
                  form={smallForm}
                  autoComplete="off"
                  preserve={false}
                >
                  <Row style={{ marginLeft: "20px", marginTop: "30px" }}>
                    <Col span={6}>
                      <Form.Item label="年份" name="year" rules={[{
                        required: true,
                        message: '请选择新建年份!',
                      },
                      ]}>
                        <DatePicker picker="year" disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} />
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                      <Form.Item label="毕业总人数" name="primarySchoolNum" rules={[{
                        required: true,
                        message: '请输入内容!',
                      },
                      ]}>
                        <Input addonAfter="人" onKeyDown={handleInputChange} />
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                      <Form.Item label="初中录取人数" name="juniorSchoolEntranceNum" rules={[{
                        required: true,
                        message: '请输入内容!',
                      },
                      ]}>
                        <Input addonAfter="人" onKeyDown={handleInputChange} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "20px" }}>
                    <Col span={5}>
                      <Form.Item label="初中录取率" name="juniorSchoolEntranceRate" rules={[{
                        required: true,
                        message: '请输入内容!',
                      },
                      ]}>
                        <Input addonAfter="%" />
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={3}>
                      <Form.Item label="学生辍学率" name="primaryDropoutRate" rules={[{
                        required: true,
                        message: '请输入内容!',
                      },
                      ]}>
                        <Input addonAfter="%" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        保存
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
              <hr />
              <div className={styles["EnrollmentRate"]}>
                <span
                  style={{
                    fontWeight: "700",
                    marginLeft: "20px",
                    marginTop: "30px",
                  }}
                >
                  过往记录：
                </span>
              </div>
              <div>
                <Form>
                  <Row style={{ marginLeft: "20px", marginTop: "30px" }}>
                    <Col span={5}>
                      <Form.Item label="年份">
                        <DatePicker picker="year" onChange={SmallSchool} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Spin spinning={loading}>
                    <Table columns={PrimarySchoolUpgradeColumns} dataSource={PrimarySchoolUpgrade?.map((item, index) => { return { ...item, key: index } })} borderedpagination={false} pagination={false} />
                  </Spin>
                </Form>
              </div>
            </div>
          </Col>
        </Row>

        <div style={{ border: "1px solid gray", marginTop: "50px" }}>
          <Row>
            <Col span={24}>
              <div>

                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "15px"
                  }}
                >
                  初中升学率
                </span>


                <div>
                  <div >
                    <div className={styles["EnrollmentRate"]}>
                      <span
                        style={{
                          fontWeight: "700",
                          marginLeft: "20px",
                          marginTop: "30px",
                        }}
                      >
                        新建升学率：
                      </span>
                    </div>

                    <Form
                      name="Inthe"
                      onFinish={JuniorHighSchool}
                      form={IntheForm}
                      autoComplete="off"
                      preserve={false}
                    >
                      <Row style={{ marginLeft: "20px", marginTop: "30px" }}>
                        <Col span={6}>
                          <Form.Item label="年份" name="year"
                            rules={[{
                              required: true,
                              message: '请选择新建年份!',
                            },
                            ]}>
                            <DatePicker picker="year" disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} />
                          </Form.Item>
                        </Col>
                        <Col span={6} offset={2}>
                          <Form.Item label="毕业总人数" name="juniorSchoolNum"
                            rules={[{
                              required: true,
                              message: '请输入内容!',
                            },
                            ]}>
                            <Input addonAfter="人" onKeyDown={handleInputChange} />
                          </Form.Item>
                        </Col>
                        <Col span={6} offset={2}>
                          <Form.Item label="高中录取人数" name="seniorEntranceNum"
                            rules={[{
                              required: true,
                              message: '请输入内容!',
                            },
                            ]}>
                            <Input addonAfter="人" onKeyDown={handleInputChange} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row style={{ marginLeft: "20px" }}>
                        <Col span={6}>
                          <Form.Item label="高中录取率" name="seniorEntranceRate"
                            rules={[{
                              required: true,
                              message: '请输入内容!',
                            },
                            ]}>
                            <Input addonAfter="%" />
                          </Form.Item>
                        </Col>
                        <Col span={6} offset={2}>
                          <Form.Item label="中职录取人数" name="secondaryVocationalNum"
                            rules={[{
                              required: true,
                              message: '请输入内容!',
                            },
                            ]}>
                            <Input addonAfter="人" onKeyDown={handleInputChange} />
                          </Form.Item>
                        </Col>
                        <Col span={6} offset={2}>
                          <Form.Item label="中职录取率" name="secondaryVocationalRate"
                            rules={[{
                              required: true,
                              message: '请输入内容!',
                            },
                            ]}>
                            <Input addonAfter="%" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row style={{ marginLeft: "20px" }}>
                        <Col span={6}>
                          <Form.Item label="初中辍学率" name="juniorDropoutRate"
                            rules={[{
                              required: true,
                              message: '请输入内容!',
                            },
                            ]}>
                            <Input addonAfter="%" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "20px",
                        }}
                      >
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            保存
                          </Button>
                        </Form.Item>
                      </div>
                      <hr />
                      <div className={styles["EnrollmentRate"]}>
                        <span
                          style={{
                            fontWeight: "700",
                            marginLeft: "20px",
                            marginTop: "30px",
                          }}
                        >
                          过往记录：
                        </span>
                      </div>
                    </Form>
                  </div>

                  <div>
                    <Form>
                      <Row style={{ marginLeft: "20px", marginTop: "30px" }}>
                        <Col span={5}>
                          <Form.Item label="年份">
                            <DatePicker picker="year" onChange={EarlySchool} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Spin spinning={loading}>
                        <Table columns={JuniorHighSchoolUpgradeColumns} dataSource={JuniorHighSchoolUpgrade?.map((item, index) => { return { ...item, key: index } })} bordered pagination={false} />
                      </Spin>
                    </Form>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div>
          <Row style={{ border: "1px solid gray", marginTop: "50px" }}>
            <Col span={24}>

              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "15px"
                }}
              >
                高中升学率
              </span>


              <div>
                <div className={styles["EnrollmentRate"]}>
                  <span
                    style={{
                      fontWeight: "700",
                      marginLeft: "20px",
                      marginTop: "30px",
                    }}
                  >
                    新建升学率：
                  </span>
                </div>

                <Form
                  name="high"
                  onFinish={SeniorHighSchool}
                  form={highForm}
                  autoComplete="off"
                  preserve={false}
                >
                  <Row style={{ marginLeft: "20px", marginTop: "30px" }}>
                    <Col span={6}>
                      <Form.Item label="年份" name="year"
                        rules={[{
                          required: true,
                          message: '请选择新建年份!',
                        },
                        ]}>
                        <DatePicker picker="year" disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} />
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                      <Form.Item label="毕业总人数" name="seniorGraduationNum"
                        rules={[{
                          required: true,
                          message: '请输入内容!',
                        },
                        ]}>
                        <Input addonAfter="人" onKeyDown={handleInputChange} />
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                      <Form.Item label="参加高考总人数" name="collegeEntranceExaminationNum"
                        rules={[{
                          required: true,
                          message: '请输入内容!',
                        },
                        ]} >
                        <Input addonAfter="人" onKeyDown={handleInputChange} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "20px" }}>
                    <Col span={6}>
                      <Form.Item label="大学录取人数" name="collegeEntranceNum"
                        rules={[{
                          required: true,
                          message: '请输入内容!',
                        },
                        ]}>
                        <Input addonAfter="人" onKeyDown={handleInputChange} />
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                      <Form.Item label="未被录取人数" name="noAdmissionNum"
                        rules={[{
                          required: true,
                          message: '请输入内容!',
                        },
                        ]}>
                        <Input addonAfter="人" onKeyDown={handleInputChange} />
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                      <Form.Item label="大学录取率" name="collegeEntranceRate"
                        rules={[{
                          required: true,
                          message: '请输入内容!',
                        },
                        ]}>
                        <Input addonAfter="%" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "20px" }}>
                    <Col span={6}>
                      <Form.Item label="重点大学录取人数" name="emphasisCollegeNum"
                        rules={[{
                          required: true,
                          message: '请输入内容!',
                        },
                        ]}>
                        <Input addonAfter="人" onKeyDown={handleInputChange} />
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                      <Form.Item label="重点大学录取率" name="emphasisCollegeRate"
                        rules={[{
                          required: true,
                          message: '请输入内容!',
                        },
                        ]}>
                        <Input addonAfter="%" />
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                      <Form.Item label="一本大学录取人数" name="keyUniversitiesNum"
                        rules={[{
                          required: true,
                          message: '请输入内容!',
                        },
                        ]}>
                        <Input addonAfter="人" onKeyDown={handleInputChange} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "20px" }}>
                    <Col span={6}>
                      <Form.Item label="一本大学录取率" name="keyUniversitiesRate"
                        rules={[{
                          required: true,
                          message: '请输入内容!',
                        },
                        ]}>
                        <Input addonAfter="%" />
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                      <Form.Item label="二本大学人数" name="secondUniversitiesNum"
                        rules={[{
                          required: true,
                          message: '请输入内容!',
                        },
                        ]}>
                        <Input addonAfter="人" onKeyDown={handleInputChange} />
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                      <Form.Item label="二本大学录取率" name="secondUniversitiesRate"
                        rules={[{
                          required: true,
                          message: '请输入内容!',
                        },
                        ]}>
                        <Input addonAfter="%" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "20px" }}>
                    <Col span={6}>
                      <Form.Item label="大专院校录取人数" name="tertiaryInstitutionNum"
                        rules={[{
                          required: true,
                          message: '请输入内容!',
                        },
                        ]}>
                        <Input addonAfter="人" onKeyDown={handleInputChange} />
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                      <Form.Item label="大专院校录取率" name="tertiaryInstitutionRate"
                        rules={[{
                          required: true,
                          message: '请输入内容!',
                        },
                        ]}>
                        <Input addonAfter="%" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        保存
                      </Button>
                    </Form.Item>
                  </div>
                  <hr />
                  <div className={styles["EnrollmentRate"]}>
                    <span
                      style={{
                        fontWeight: "700",
                        marginLeft: "20px",
                        marginTop: "30px",
                      }}
                    >
                      过往记录：
                    </span>
                  </div>
                  <div>
                    <Row style={{ marginLeft: "20px", marginTop: "30px" }}>
                      <Col span={5}>
                        <Form.Item label="年份">
                          <DatePicker picker="year" onChange={HighSchool} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Spin spinning={loading}>
                      <Table columns={SeniorHighSchoolUpgradeColumns} dataSource={SeniorHighSchoolUpgrade?.map((item, index) => { return { ...item, key: index } })}
                        scroll={{
                          x: 1300,
                        }} pagination={false}
                      />
                    </Spin>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}
const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(Enrollmentrate)

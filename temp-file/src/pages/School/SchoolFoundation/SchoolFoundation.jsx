/**
 * 学校基础信息
 * @author:shihaigui
 * date:2023年04月25日
 * */

import React, { useEffect, useState } from "react"
import styles from "./SchoolFoundation.less"
import { connect } from "dva"
import moment from "moment"
import { School as namespace } from "../../../utils/namespace"
import { Col, Row, Button, Select, Input, Form, Checkbox, Space, DatePicker, notification, message, Radio, Alert, } from "antd"
import { EnvironmentFilled } from "@ant-design/icons"
function SchoolFoundation (props) {
  const [basicForm] = Form.useForm()
  const [YearData, setYeardata] = useState(null)
  const [SchoolTypeOptions, setSchoolTypeOptions] = useState([])
  const [YearSynchronizationData, setYearSynchronizationData] = useState([])
  const { dispatch, savestate, provinceOptions, ThecityOptions, CountyOptions, SchoolStatusOptions,findSectionStudyOptions } = props
  // StudiesOptions
  const [selectedOption, setSelectedOption] = useState([])
console.log(SchoolStatusOptions)
  // 限制可选择的时间
  const disabledDate = (current) => { return current && current > moment().endOf('day') }

  //查询上级直属管理机构
  const handleParentSchoolChange = (value, option) => {
    setSelectedOption(option)
  }

  //同步年份转换
  const meanwhile = (value) => {
    setYeardata(value?.format("YYYY"))
    if (value) {
      SynchronizationYear(value?.format("YYYY"))
    } else {
      basicForm.resetFields()
    }
  }
  //同步数据年份的数据处理
  const SynchronizationYear = (value) => {
    dispatch({
      type: namespace + "/basicInformationApi",
      payload: { year: value },
      callback: (res) => {
        if (res.result == null) {
          message.error("您属于第一次新建，请手动补充数据")
          return
        } else {
          basicForm.resetFields()
          setYearSynchronizationData(res?.result)
          setRadioOrCheckbox(res?.result?.historyBySchoolId?.studyPhaseId && (res?.result?.historyBySchoolId?.studyPhaseId)?.split(',')?.length > 1 ? 2 : 1)
          setSelectedOption({ value: res?.result?.historyBySchoolId?.parentSchoolId, label: res?.result?.historyBySchoolId?.parentSchoolName })
          // 获取子地域树列表---省
          if (res?.result?.schoolAreaBySchoolId?.provinceId) {
            dispatch({
              type: namespace + "/getProvinceApi",
              payload: { parentId: 0 },
            })
          }
          // 获取子地域树列表---市
          if (res?.result?.schoolAreaBySchoolId?.provinceId) {
            dispatch({
              type: namespace + "/getThecityApi",
              payload: { parentId: res?.result?.schoolAreaBySchoolId?.provinceId },
            })
          }
          // 获取子地域树列表---县
          if (res?.result?.schoolAreaBySchoolId?.cityId) {
            dispatch({
              type: namespace + "/getCountyApi",
              payload: { parentId: res?.result?.schoolAreaBySchoolId?.cityId },
            })
          }
          basicForm.setFieldsValue({
            historyBySchoolId: [
              {
                longitude: res?.result?.historyBySchoolId?.longitude,
                latitude: res?.result?.historyBySchoolId?.latitude,
                studyStatusName: SchoolStatusOptions?.filter(item => item.label == res?.result?.historyBySchoolId?.studyStatusName)[0]?.value,
                parentSchoolName: res?.result?.historyBySchoolId?.parentSchoolName,
                classNum: res?.result?.historyBySchoolId?.classNum,
                totalStudentNum: res?.result?.historyBySchoolId?.totalStudentNum,
                maxRoomNum: res?.result?.historyBySchoolId?.maxRoomNum,
                fullTeacherNum: res?.result?.historyBySchoolId?.fullTeacherNum,
                studyPhase: res?.result?.historyBySchoolId?.studyPhaseId?.split(',')?.length > 1 ? findSectionStudyOptions?.filter(item => (res?.result?.historyBySchoolId?.studyPhase?.split(','))?.includes(item.label))?.map(item => item.value) : res?.result?.historyBySchoolId?.studyPhaseId - 0
              },
            ],
            schoolAreaBySchoolId: [
              {
                province: res?.result?.schoolAreaBySchoolId?.provinceId,
                city: res?.result?.schoolAreaBySchoolId?.cityId,
                county: res?.result?.schoolAreaBySchoolId?.countyId,
                schoolName: res?.result?.schoolAreaBySchoolId?.schoolName,
                schoolAddress: res?.result?.schoolAreaBySchoolId?.schoolAddress,
              }
            ]
          })
        }
      },
    })
  }



  useEffect(() => {
    //查询学校基础信息
    // dispatch({
    //   type: namespace + "/basicInformationApi",
    //   payload: { },
    //   callback: (res) => {
    //     if (res) {
    //     }
    //   },
    // })

    //  查询上级直属管理机构
    dispatch({
      type: namespace + "/getSuperiorsOrganApi",
      payload: { schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId },
      callback: (res) => {
        if (res) {
          setSchoolTypeOptions(res.result != null || res.result != undefined ? res.result?.map(item => { return { value: item?.id - 0, label: item?.name } }) : [])
        }
      },
    })


    //批量加载多个字典组
    dispatch({
      type: namespace + "/getCommonBatchLoadDictGroupsApi",
      payload: { dictCodes: "DICT_STUDY_STATUS" },
    })

    // 获取学段列表
    // dispatch({
    //   type: namespace + "/getCommonStudiesApi",
    // })
    // 获取除开专升本与大学的所有学段
    dispatch({
      type: namespace + "/getfindSectionStudyApi",
    })
    // 获取子地域树列表---省
    dispatch({
      type: namespace + "/getProvinceApi",
      payload: { parentId: 0 },
    })
  }, [])

  // 保存学校基础信息
  const onFinish = (value) => {
    const newObj = {
      "areaId": value.schoolAreaBySchoolId[0].county,   //区域三级id
      "classNum": value.historyBySchoolId[0].classNum,   //学校班级数量
      "fullTeacherNum": value.historyBySchoolId[0].fullTeacherNum,  //专任教师总数
      "latitude": value.historyBySchoolId[0].latitude,   //纬度
      "longitude": value.historyBySchoolId[0].longitude,  //经度
      "maxRoomNum": value.historyBySchoolId[0].maxRoomNum,   //最大班额人数
      "parentSchoolId": selectedOption.value,  //上级直属管理机构id
      "parentSchoolName": selectedOption.label,  //上级直属管理机构名称
      "schoolAddress": value.schoolAreaBySchoolId[0].schoolAddress,  //学校详细位置
      "schoolName": value.schoolAreaBySchoolId[0].schoolName,  //学校名称
      "studyPhaseId": !Array.isArray(value.historyBySchoolId[0]?.studyPhase) ? [value.historyBySchoolId[0]?.studyPhase + ''] : value.historyBySchoolId[0]?.studyPhase?.map(String),  //学段
      // "studyPhaseId": value.historyBySchoolId[0]?.studyPhaseId,  //学段
      // "studyPhaseId": [StudiesOptions?.filter(item => item.value == value.historyBySchoolId[0]?.studyPhaseId[0])[0]?.label],  //学段
      "studyStatusName": SchoolStatusOptions?.filter(item => item.value == value.historyBySchoolId[0].studyStatusName)[0]?.label,  //学校状态
      "totalStudentNum": value.historyBySchoolId[0].totalStudentNum,  //在校学生总数
      "year": value.year?.format("YYYY"),//年份
    }
    dispatch({
      type: namespace + "/saveSchoolInfoApi",
      payload: newObj,
      callback: (res) => {
        console.log(res)
        if (res.result == "保存成功") {
          message.success("保存学校基础信息成功！")
          basicForm.resetFields()
        } else {
          message.error("保存学校基础信息失败！")

        }
      },
    })


  }

  //包含学段
  const onCheckboxChange = (value) => {

  }

  // 获取子地域树列表---市
  const onThecity = (value) => {
    dispatch({
      type: namespace + "/getThecityApi",
      payload: { parentId: value },
    })
  }

  // 获取子地域树列表---县
  const onCounty = (value) => {
    dispatch({
      type: namespace + "/getCountyApi",
      payload: { parentId: value },
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



  //清空地址下拉选择内容
  const handlePovinceChange = (value) => {
    setTimeout(() => {
      basicForm.setFieldsValue({
        schoolAreaBySchoolId: [
          {
            province: basicForm.getFieldsValue().schoolAreaBySchoolId[0]?.province,
            city: null,
            county: null,
            schoolName: basicForm.getFieldsValue().schoolAreaBySchoolId[0]?.schoolName,
            schoolAddress: basicForm.getFieldsValue().schoolAreaBySchoolId[0]?.schoolAddress,
          }
        ]
      })
    }, 0)
  }
  const handlecityChange = (value) => {
    setTimeout(() => {
      basicForm.setFieldsValue({
        schoolAreaBySchoolId: [
          {
            province: basicForm.getFieldsValue().schoolAreaBySchoolId[0]?.province,
            city: basicForm.getFieldsValue().schoolAreaBySchoolId[0]?.city,
            county: null,
            schoolName: basicForm.getFieldsValue().schoolAreaBySchoolId[0]?.schoolName,
            schoolAddress: basicForm.getFieldsValue().schoolAreaBySchoolId[0]?.schoolAddress,
          }
        ]
      })
    }, 0)
  }

  //学段单选的处理
  const [RadioOrCheckbox, setRadioOrCheckbox] = useState(1)
  const SelectDataonChange = (value) => {
    basicForm.setFieldsValue({
      historyBySchoolId: [
        {
          longitude: basicForm.getFieldsValue().historyBySchoolId[0]?.longitude,
          latitude: basicForm.getFieldsValue().historyBySchoolId[0]?.latitude,
          studyStatusName: basicForm.getFieldsValue().historyBySchoolId[0]?.studyStatusName,
          parentSchoolName: basicForm.getFieldsValue().historyBySchoolId[0]?.parentSchoolName,
          classNum: basicForm.getFieldsValue().historyBySchoolId[0]?.classNum,
          totalStudentNum: basicForm.getFieldsValue().historyBySchoolId[0]?.totalStudentNum,
          maxRoomNum: basicForm.getFieldsValue().historyBySchoolId[0]?.maxRoomNum,
          fullTeacherNum: basicForm.getFieldsValue().historyBySchoolId[0]?.fullTeacherNum,
          studyPhase: null
        },
      ]
    })
    setRadioOrCheckbox(value)
  }




  return (
    <>
      {/* 学校基础信息 */}
      <div>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "15px"
          }}
        >
          学校基础信息
        </span>
      </div>

      <div className={["centertop"]}>
        <div>
          <Form
            name="basicForm"
            onFinish={onFinish}
            autoComplete="off"
            form={basicForm}
            preserve={false}
          // style={{ marginLeft: "20px", marginTop: "20px" }}
          >
            <Row >
              <Col span={6} style={{ fontWeight: 700 }}>
                <Form.Item label="新建年份" name="year"
                  rules={[{
                    required: true,
                    message: '请选择新建年份!',
                  },
                  ]}>
                  <DatePicker picker="year" disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} />
                </Form.Item>
              </Col>
              <Col span={9} offset={9}>
                <span style={{ fontWeight: "700" }}>请选择需要查询的数据年份: </span>
                <DatePicker picker="year" onChange={meanwhile} />
              </Col>
              {/* <Col span={1}><Button type="primary" onClick={SynchronizationYear}> 同步</Button>
              </Col> */}
            </Row>
            <Row style={{ border: "1px dashed gray" }}>
              <Col>
                <Form.List name="schoolAreaBySchoolId" initialValue={[{}]}>
                  {(fields) => (
                    <>
                      {fields.map(({ name, key }) => (
                        <div key={key} style={{ marginLeft: "40px", marginTop: "20px" }}>
                          <Row>
                            <Col span={10} >
                              <Form.Item label="学校名称" name={[name, "schoolName"]}
                                rules={[{
                                  required: true,
                                  message: '请输入内容!',
                                },
                                ]}
                              >
                                <Input onKeyDown={handleInputChange} />
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <Form.Item label="学校详细位置" name={[name, "schoolAddress"]}
                                rules={[{
                                  required: true,
                                  message: '请输入内容!',
                                },
                                ]}>

                                <Input onKeyDown={handleInputChange} />

                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={9} >
                              <Form.Item label="学校所在区域" name={[name, "province"]} rules={[{ required: true }]} >
                                <Select
                                  options={provinceOptions}
                                  onSelect={onThecity}
                                  onChange={handlePovinceChange}
                                  style={{
                                    width: 200,
                                  }}
                                  allowClear
                                  showSearch
                                  optionFilterProp="label"
                                />
                              </Form.Item>
                            </Col>
                            <Col span={7}>
                              <Form.Item label="市" name={[name, "city"]}
                                rules={[{
                                  required: true,
                                  message: '请选择市级区域!',
                                },
                                ]}>
                                <Select
                                  options={ThecityOptions}
                                  onSelect={onCounty}
                                  onChange={handlecityChange}
                                  style={{
                                    width: 200,
                                  }}
                                  allowClear
                                  showSearch
                                  optionFilterProp="label"
                                />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item label="县/(区)" name={[name, "county"]}
                                rules={[{
                                  required: true,
                                  message: '请选择县/区级!',
                                },
                                ]}>
                                <Select
                                  options={CountyOptions}
                                  style={{
                                    width: 200,
                                  }}
                                  allowClear
                                  showSearch
                                  optionFilterProp="label"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>

                <Form.List name="historyBySchoolId" initialValue={[{}]}>
                  {(fields) => (
                    <>
                      {fields.map(({ name, key }) => (
                        <div key={key} style={{ marginLeft: "40px", marginTop: "20px" }}>
                          <Row style={{ marginTop: "20px" }}>
                            <Col span={5}>
                              <Form.Item label="经度" name={[name, "longitude"]}
                                rules={[{
                                  required: true,
                                  message: '请输入内容!',
                                },
                                ]}>

                                <Input />

                              </Form.Item>
                            </Col>
                            <EnvironmentFilled style={{ marginLeft: "10px", marginTop: "6px" }} />
                            <Col span={6} offset={1}>
                              <Form.Item label="纬度" name={[name, "latitude"]}
                                rules={[{
                                  required: true,
                                  message: '请输入内容!',
                                },
                                ]}>
                                <Input />
                              </Form.Item>
                            </Col>
                            <EnvironmentFilled style={{ marginLeft: "10px", marginTop: "6px" }} />
                            <Col span={7} offset={3}>
                              <Form.Item label="学校状态" name={[name, "studyStatusName"]}
                                rules={[{
                                  required: true,
                                  message: '请选择学校状态!',
                                },
                                ]}
                              >
                                <Select
                                  onChange={SelectDataonChange}
                                  options={SchoolStatusOptions}
                                  style={{
                                    width: 140,
                                  }}
                                  allowClear
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "20px" }}>
                            <Col span={24}>
                              {
                                RadioOrCheckbox != 1 &&
                                <Form.Item label="包含学段" name={[name, "studyPhase"]}
                                  rules={[{
                                    required: true,
                                    message: '请选择学段!',
                                  },
                                  ]}
                                >
                                  <Checkbox.Group options={findSectionStudyOptions} style={{ display: 'flex' }} />
                                </Form.Item>
                              }
                              {
                                RadioOrCheckbox == 1 &&
                                <Form.Item label="包含学段" name={[name, "studyPhase"]}
                                  rules={[{
                                    required: true,
                                    message: '请选择学段!',
                                  },
                                  ]}
                                >
                                  <Radio.Group options={findSectionStudyOptions} style={{ display: 'flex' }} />
                                </Form.Item>
                              }
                            </Col>
                            <Alert message={`温馨提示：当选择学校状态为单学段时，包含学段只能选择一个，若要多选请选择其它学校状态。`} type="warning" showIcon />
                          </Row>
                          <Row style={{ marginTop: "20px" }}>
                            <Col span={8}>
                              <Form.Item label="上级直属管理机构" name={[name, "parentSchoolName"]}
                                rules={[{
                                  required: true,
                                  message: '请选择上级机构!',
                                },
                                ]}
                              >
                                <Select
                                  options={SchoolTypeOptions}
                                  onChange={handleParentSchoolChange}
                                  style={{
                                    width: 140,
                                  }}
                                  allowClear
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6} offset={1}>
                              <Form.Item label="在校总人数" name={[name, "totalStudentNum"]}
                                rules={[{
                                  required: true,
                                  message: '请输入内容!',
                                },
                                ]}>

                                <Input addonAfter="人" onKeyDown={handleInputChange} />

                              </Form.Item>
                            </Col>
                            <Col span={6} offset={2}>
                              <Form.Item label="学校班级数量" name={[name, "classNum"]}
                                rules={[{
                                  required: true,
                                  message: '请输入内容!',
                                },
                                ]}>

                                <Input addonAfter="个" onKeyDown={handleInputChange} />

                              </Form.Item>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "20px" }}>
                            <Col span={6}>
                              <Form.Item label="最大班额人数" name={[name, "maxRoomNum"]}
                                rules={[{
                                  required: true,
                                  message: '请输入内容!',
                                },
                                ]}>

                                <Input addonAfter="人" onKeyDown={handleInputChange} />

                              </Form.Item>
                            </Col>
                            <Col span={6} offset={3}>
                              <Form.Item label="专任教师总数" name={[name, "fullTeacherNum"]}
                                rules={[{
                                  required: true,
                                  message: '请输入内容!',
                                },
                                ]}>

                                <Input addonAfter="人" onKeyDown={handleInputChange} />

                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              </Col>
            </Row>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginTop: "20px" }}>
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
  return {
    savestate: state[namespace].savestate,
    // StudiesOptions: state[namespace].StudiesOptions,
    findSectionStudyOptions: state[namespace].findSectionStudyOptions,
    ProvinceCityAddressOptions: state[namespace].ProvinceCityAddressOptions,
    SchoolStatusOptions: state[namespace].SchoolStatusOptions,
    provinceOptions: state[namespace].provinceOptions,
    ThecityOptions: state[namespace].ThecityOptions,
    CountyOptions: state[namespace].CountyOptions,
  }
}

export default connect(mapStateToProps)(SchoolFoundation)

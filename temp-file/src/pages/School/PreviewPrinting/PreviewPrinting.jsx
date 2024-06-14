/**
 * 学校概况
 * @author:shihaigui
 * date:2023年04月26日
 * */

import React, { useState, useRef, useEffect } from "react"
import { useReactToPrint } from "react-to-print"
import styles from "./PreviewPrinting.less"
import { connect } from "dva"
import moment from "moment"
import { School as namespace } from "../../../utils/namespace"
import { Col, Row, Button, Select, Input, Form, Space, Upload, Modal, message, Image, Alert, Empty, Pagination, DatePicker, Table } from "antd"
import accessTokenCache from "@/caches/accessToken"
import { PlusOutlined } from "@ant-design/icons"
const token = accessTokenCache() && accessTokenCache()
function PreviewPrinting (props) {
  const { dispatch } = props
  // const [previewOpen, setPreviewOpen] = useState(false)
  // const [previewImage, setPreviewImage] = useState("")
  // const [previewTitle, setPreviewTitle] = useState("")
  // const [fileList, setFileList] = useState([])
  // const [currentPage, setcurrentPage] = useState(1)
  // const [Datatotal, setDatatotal] = useState(0)
  const [schoolData, setschoolData] = useState({})
  const [FacilityData, setFacilityData] = useState({})
  const [TeacherData, setTeacherData] = useState({})
  const [HonorDetails, setHonorDetails] = useState({})
  const [ProjectData, setProjectData] = useState({})
  const [SmallData, setSmallData] = useState({})
  const [AarlyData, setAarlyData] = useState({})
  const [HighData, setHighData] = useState({})
  const currentYear = (new Date()).getFullYear()

  //   上传组件配置信息暂时隐藏
  // const UploadProps = {
  //   name: "file",
  //   listType: "picture-card",
  //   action: "/auth/web/front/v1/upload/uploadImage",
  //   headers: { Authorization: token },
  //   accept: ".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP",
  //   onChange ({ fileList: newFileList }) {
  //     setFileList(newFileList)
  //   },
  // }

  // const getBase64 = (file) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader()
  //     reader.readAsDataURL(file)
  //     reader.onload = () => resolve(reader.result)
  //     reader.onerror = (error) => reject(error)
  //   })

  // const handleCancel = () => setPreviewOpen(false)
  // const handlePreview = (file) => {
  //   setPreviewImage("")
  //   setPreviewImage(
  //     file.response?.data || file.thumbUrl || getBase64(file.originFileObj)
  //   )
  //   setPreviewTitle(file.name)
  //   setPreviewOpen(true)
  // }
  // const uploadButton = (
  //   <div>
  //     <PlusOutlined />
  //     <div style={{ marginTop: 8 }}>点击上传</div>
  //   </div>
  // )



  // useEffect(() => {

  //   //查询学校基础信息
  //   dispatch({
  //     type: namespace + "/basicInformationApi",
  //     payload: { year: currentYear },
  //     callback: (res) => {
  //       if (res) {
  //         setschoolData(res?.result) // 请求完成后返回的结果
  //       }
  //     },
  //   })


  //   //查询学校设施信息
  //   dispatch({
  //     type: namespace + "/historyFacilityApi",
  //     payload: { year: currentYear },
  //     callback: (res) => {
  //       if (res) {
  //         setFacilityData(res?.result) // 请求完成后返回的结果
  //       }
  //     },
  //   })

  //   //查询学校教师信息
  //   dispatch({
  //     type: namespace + "/historyTeacherScaleApi",
  //     payload: { year: currentYear },
  //     callback: (res) => {
  //       if (res) {
  //         setTeacherData(res?.result) // 请求完成后返回的结果
  //       }
  //     },
  //   })

  //   // 获取学校荣誉信息
  //   dispatch({
  //     type: namespace + "/getSchoolHonorApi",
  //     payload: { getTime: currentYear },
  //     callback: (res) => {
  //       if (res) {
  //         setHonorDetails(res?.result?.data)
  //       }
  //     },
  //   })


  //   //查询学校项目信息
  //   dispatch({
  //     type: namespace + "/historySchoolProjectApi",
  //     payload: { createDate: currentYear },
  //     callback: (res) => {
  //       if (res) {
  //         setProjectData(res?.result?.map((item, index) => { return { ...item, key: index } }))
  //       }
  //     },
  //   })

  //   //查询小学升学率信息
  //   dispatch({
  //     type: namespace + "/getPrimaryEnrollmentRateApi",
  //     payload: { schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId, year: currentYear },
  //     callback: (res) => {
  //       if (res) {
  //         setSmallData(res?.result?.[0])
  //       }
  //     },
  //   })
  //   //查询初中升学率信息
  //   dispatch({
  //     type: namespace + "/getJuniorEnrollmentRateApi",
  //     payload: { schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId, year: currentYear },
  //     callback: (res) => {
  //       if (res) {
  //         setAarlyData(res?.result?.[0])
  //       }
  //     },
  //   })
  //   //查询高中升学率信息
  //   dispatch({
  //     type: namespace + "/getSeniorEnrollmentRateApi",
  //     payload: { schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId, year: currentYear },
  //     callback: (res) => {
  //       if (res) {
  //         setHighData(res?.result?.[0])
  //       }
  //     },
  //   })

  // }, [])



  //
  //
  //
  //
  //

  //查询各个年份数据
  const printYearSchool = (value) => {

    if (value == null) return

    //查询学校基础信息
    dispatch({
      type: namespace + "/basicInformationApi",
      payload: { year: value.format("YYYY") },
      callback: (res) => {
        if (res) {
          setschoolData(res?.result)
        }
      },
    })

    //查询学校设施信息
    dispatch({
      type: namespace + "/historyFacilityApi",
      payload: { year: value.format("YYYY") },
      callback: (res) => {
        if (res) {
          setFacilityData(res?.result)
        }
      },
    })

    //查询学校教师信息
    dispatch({
      type: namespace + "/historyTeacherScaleApi",
      payload: { year: value.format("YYYY") },
      callback: (res) => {
        if (res) {
          setTeacherData(res?.result)
        }
      },
    })

    // 获取学校荣誉信息
    dispatch({
      type: namespace + "/getSchoolHonorApi",
      payload: { getTime: value.format("YYYY") },
      callback: (res) => {
        if (res) {
          setHonorDetails(res?.result?.data)
        }
      },
    })


    //查询学校项目信息
    dispatch({
      type: namespace + "/historySchoolProjectApi",
      payload: { createDate: value.format("YYYY") },
      callback: (res) => {
        if (res) {
          setProjectData(res?.result?.map((item, index) => { return { ...item, key: index } }))
        }
      },
    })

    //查询小学升学率信息
    dispatch({
      type: namespace + "/getPrimaryEnrollmentRateApi",
      payload: { schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId, year: value.format("YYYY") },
      callback: (res) => {
        if (res) {
          setSmallData(res?.result?.[0])
        }
      },
    })
    //查询初中升学率信息
    dispatch({
      type: namespace + "/getJuniorEnrollmentRateApi",
      payload: { schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId, year: value.format("YYYY") },
      callback: (res) => {
        if (res) {
          setAarlyData(res?.result?.[0])
        }
      },
    })
    //查询高中升学率信息
    dispatch({
      type: namespace + "/getSeniorEnrollmentRateApi",
      payload: { schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId, year: value.format("YYYY") },
      callback: (res) => {
        if (res) {
          setHighData(res?.result?.[0])
        }
      },
    })
  }


  //打印
  const printDom = useRef()
  const handlePrint = useReactToPrint({ content: () => printDom.current })


  // 提交
  // const previewSubmit = () => {
  //   console.log(fileList)
  // }

  // 项目情况表头
  const ProjectsituationUpgradeColumns = [
    {
      title: "录入时间",
      dataIndex: "createDate",
      key: "createDate",
      width: "140px",
    },
    {
      title: "拟建项目",
      dataIndex: "proposedProject",
      key: "proposedProject",
      width: "140px",
    },
    {
      title: "在建项目",
      dataIndex: "constProject",
      key: "constProject",
      width: "140px",
    },
    {
      title: "已建项目",
      dataIndex: "estabProject",
      key: "estabProject",
      width: "140px",
    },
    {
      title: "待建项目",
      dataIndex: "waitProject",
      key: "waitProject",
      width: "140px",
    },
    {
      title: "修缮建项目",
      dataIndex: "repairProject",
      key: "repairProject",
      width: "140px",
    },
  ]

// 限制可选择的时间
const disabledDate = (current) => { return current && current > moment().endOf('day') }

  return (
    <>
      <Col span={9} style={{fontWeight:800}}>
        <Form.Item label="请选择需要预览的年份">
          <DatePicker picker="year" onChange={printYearSchool} disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode}/>
        </Form.Item>
      </Col>
      <div>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "15px"
          }}
        >
          学校概况
        </span>
      </div>
      <div ref={printDom} className={styles["printPage"]}>
        <div className={styles["Basicinformation"]}>
          <div>
            <span
              style={{
                marginLeft: "20px",
                marginTop: "40px",
                display: "flex",
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              学校基础信息
            </span>
            <Row
              gutter={[0, 33]}
              style={{ marginLeft: "30px", marginTop: "30px" }}
            >
              <Col span={4}>年份：{schoolData?.historyBySchoolId?.year}</Col>
              <Col span={6} offset={4}>
                学校名称：{schoolData?.schoolAreaBySchoolId?.schoolName}
              </Col>
              <Col span={6} offset={3}>
                学校位置：{schoolData?.schoolAreaBySchoolId?.schoolAddress}
              </Col>
            </Row>
            <Row
              gutter={[0, 33]}
              style={{ marginLeft: "30px", marginTop: "30px" }}
            >
              <Col span={5}>学校所在区域：{schoolData?.schoolAreaBySchoolId?.province}</Col>
              <Col span={6} offset={3}>
                市：{schoolData?.schoolAreaBySchoolId?.city}
              </Col>
              <Col span={6} offset={3}>
                县/（区）：{schoolData?.schoolAreaBySchoolId?.county}
              </Col>
            </Row>
            <Row
              gutter={[0, 33]}
              style={{ marginLeft: "30px", marginTop: "30px" }}
            >
              <Col span={5}>经度：{schoolData?.historyBySchoolId?.longitude}</Col>

              <Col span={5} offset={3}>
                纬度：{schoolData?.historyBySchoolId?.latitude}
              </Col>
              <Col span={5} offset={4}>
                学校状态：{schoolData?.historyBySchoolId?.studyStatusName}
              </Col>
            </Row>
            <Row
              gutter={[0, 33]}
              style={{ marginLeft: "30px", marginTop: "30px" }}
            >
              <Col span={6}>包含学段：{schoolData?.historyBySchoolId?.studyPhase}</Col>
              <Col span={7} offset={2}>
                上级直属管理机构：{schoolData?.historyBySchoolId?.parentSchoolName}
              </Col>
              <Col span={4} offset={2}>
                在校总人数：{schoolData?.historyBySchoolId?.totalStudentNum}
              </Col>
            </Row>
            <Row
              gutter={[0, 33]}
              style={{ marginLeft: "30px", marginTop: "30px" }}
            >
              <Col span={5}>学校班级数量：{schoolData?.historyBySchoolId?.classNum}</Col>

              <Col span={5} offset={3}>
                最大班额人数：{schoolData?.historyBySchoolId?.maxRoomNum}
              </Col>
              <Col span={5} offset={4}>
                专任教师总数：{schoolData?.historyBySchoolId?.fullTeacherNum}
              </Col>
            </Row>
          </div>
        </div>
        <div className={styles["Generalinformation"]}>
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "800",
            }}
          >
            学校设施情况
          </span>

          <div>
            <div className={styles["Preview"]}>
              <span style={{ fontWeight: "800", marginLeft: "20px" }}>总概况</span>
            </div>
            <div>
              <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                <Col span={5}>校园总面积：{FacilityData?.totalArea}</Col>
                <Col span={5} offset={3}>
                  校舍建筑面积：{FacilityData?.buildArea}
                </Col>
                <Col span={5} offset={4}>
                  校园绿化面积：{FacilityData?.greenArea}
                </Col>
              </Row>
              <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                <Col span={7}>校园班级网络是否全覆盖：{FacilityData?.classNetwork}</Col>
                <Col span={7} offset={1}>
                  校园教师办公网络是否全覆盖：{FacilityData?.teacherNetwork}
                </Col>
                <Col span={7} offset={2}>
                  校园安全监控是否全覆盖：{FacilityData?.monitorNetwork}
                </Col>
              </Row>
              <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                <Col span={6}>每位教师拥有计算机数量：{FacilityData?.teacherComputerNum}</Col>
                <Col span={7} offset={2}>
                  每位学生拥有计算机数量：{FacilityData?.studentComputerNum}
                </Col>
                <Col span={5} offset={2}>
                  报刊杂志种类：{FacilityData?.magazineTypeNum}
                </Col>
              </Row>
              <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                <Col span={4}>图书数量：{FacilityData?.bookNum}</Col>
              </Row>
            </div>

            <div className={styles["Preview"]}>
              <span style={{ fontWeight: "800", marginLeft: "20px" }}>各类教室数量情况：</span>
            </div>

            <div>
              <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                <Col span={5}>物理教室数量：{FacilityData?.physicsRoomNum}</Col>
                <Col span={5} offset={3}>
                  化学教室数量：{FacilityData?.chemistryRoomNum}
                </Col>
                <Col span={5} offset={4}>
                  生物教室数量：{FacilityData?.biologyRoomNum}
                </Col>
              </Row>
              <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                <Col span={6}>通用技术教室数量：{FacilityData?.generalRoomNum}</Col>
                <Col span={6} offset={2}>
                  计算机网络教室数量：{FacilityData?.computerRoomNum}
                </Col>
                <Col span={5} offset={3}>
                  音乐美术教室数量：{FacilityData?.musicRoomNum}
                </Col>
              </Row>
              <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                <Col span={5}>其他功能性教室名称： {FacilityData && FacilityData.otherRoomList && FacilityData.otherRoomList.length > 0 && FacilityData.otherRoomList[0].name}</Col>
                <Col span={5} offset={3}>
                  其他功能性教室数量：{FacilityData && FacilityData.otherRoomList && FacilityData.otherRoomList.length > 0 && FacilityData.otherRoomList[0].num}
                </Col>
                <Col span={5} offset={4}>
                  普通教室数量：{FacilityData?.classRoomNum}
                </Col>
              </Row>
              <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                <Col span={5}>多媒体教室数量：{FacilityData?.mediaRoomNum}</Col>
                <Col span={6} offset={3}>
                  多媒体教室占总教室比例：{FacilityData?.mediaRoomRate}
                </Col>
              </Row>
            </div>

            <div className={styles["Preview"]}>
              <span style={{ fontWeight: "800", marginLeft: "20px" }}>运动场地情况：</span>
            </div>
            <div>
              <div>
                <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                  <Col span={6}>400米环形跑道足球运动场数量：{FacilityData?.fourParkNum}</Col>
                  <Col span={6} offset={2}>
                    100米直跑足球场数量：{FacilityData?.oneParkNum}
                  </Col>
                  <Col span={5} offset={3}>
                    篮球场地数量：{FacilityData?.baskeParkNum}
                  </Col>
                </Row>
                <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                  <Col span={6}>乒乓球台数量：{FacilityData?.tenisTableNum}</Col>
                  <Col span={5} offset={2}>
                    羽毛球场数量：{FacilityData?.badmCourtNum}
                  </Col>
                </Row>
              </div>
            </div>

            <div className={styles["Preview"]}>
              <span style={{ fontWeight: "800", marginLeft: "20px" }}>其他设施情况：</span>
            </div>
            <div>
              <div>
                <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                  <Col span={7}>学校提供就餐餐位数：{FacilityData?.seatsNum}</Col>

                  <Col span={7} offset={1}>
                    学校提供住宿床位数：{FacilityData?.berthNum}
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["teacher"]}>
          <div>
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              学校教师规模
            </span>
            <div>
              <div className={styles["Preview"]}>
                <span style={{ fontWeight: "800", marginLeft: "20px" }}> 教师配备情况：</span>
              </div>
              <div>
                <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                  <Col span={4}>一级教师人数：{TeacherData?.oneTeacherNum}</Col>
                  <Col span={5} offset={4}>
                    二级教师人数：{TeacherData?.twoTeacherNum}
                  </Col>
                  <Col span={5} offset={4}>
                    三级教师人数：{TeacherData?.threeTeacherNum}
                  </Col>
                </Row>
                <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                  <Col span={4}>高级教师人数：{TeacherData?.seniorTeacherNum}</Col>
                  <Col span={5} offset={4}>
                    正高级教师人数：{TeacherData?.isSeniorTeacherNum}
                  </Col>

                  <Col span={5} offset={4}>
                    基层认定高级教师：{TeacherData?.unitSeniorTeacherNum}
                  </Col>
                </Row>
                <div className={styles["Preview"]}>
                  <span style={{ fontWeight: "800", marginLeft: "20px" }}>各学历教师人数情况：</span>
                </div>
                <div>
                  <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                    <Col span={5}>中专学历教师总人数：{TeacherData?.specialTeacherNum}</Col>
                    <Col span={6} offset={3}>
                      全日制学历教师数量：{TeacherData?.fullSpecialTeacherNum}
                    </Col>

                    <Col span={6} offset={3}>
                      非全日制学历教师数量：{TeacherData?.jobSpecialTeacherNum}
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                    <Col span={6}>中师学历教师总人数：{TeacherData?.normalTeacherNum}</Col>
                    <Col span={5} offset={2}>
                      全日制学历教师数量：{TeacherData?.fullNormalTeacherNum}
                    </Col>

                    <Col span={6} offset={4}>
                      非全日制学历教师数量：{TeacherData?.jobNormalTeacherNum}
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                    <Col span={5}>高中学历教师总人数：{TeacherData?.highTeacherNum}</Col>
                    <Col span={5} offset={3}>
                      全日制学历教师数量：{TeacherData?.fullHighTeacherNum}
                    </Col>
                    <Col span={7} offset={4}>
                      非全日制学历教师数量：{TeacherData?.jobHighTeacherNum}
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                    <Col span={5}>大专学历教师总人数：{TeacherData?.collegeTeacherNum}</Col>
                    <Col span={6} offset={3}>
                      全日制学历教师数量：{TeacherData?.fullCollegeTeacherNum}
                    </Col>
                    <Col span={6} offset={3}>
                      非全日制学历教师数量：{TeacherData?.jobCollegeTeacherNum}
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                    <Col span={5}>本科学历教师总人数：{TeacherData?.undergTeacherNum}</Col>
                    <Col span={6} offset={3}>
                      全日制学历教师数量：{TeacherData?.fullUndergTeacherNum}
                    </Col>

                    <Col span={6} offset={3}>
                      非全日制学历教师数量：{TeacherData?.jobUndergTeacherNum}
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                    <Col span={5}>硕士学历教师总人数：{TeacherData?.masterTeacherNum}</Col>
                    <Col span={5} offset={3}>
                      全日制学历教师数量：{TeacherData?.fullMasterTeacherNum}
                    </Col>

                    <Col span={6} offset={4}>
                      非全日制学历教师数量：{TeacherData?.jobMasterTeacherNum}
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                    <Col span={5}>博士学历教师总人数：{TeacherData?.drTeacherNum}</Col>
                    <Col span={5} offset={3}>
                      全日制学历教师数量：{TeacherData?.fullDrTeacherNum}
                    </Col>

                    <Col span={7} offset={4}>
                      非全日制学历教师数量：{TeacherData?.jobDrTeacherNum}
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "30px", marginTop: "30px" }}>
                    <Col span={5}>教师学历合格率%：{TeacherData?.teacherRate}</Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ border: "1px dashed gray", marginTop: "30px" }}>
          <div>
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              学校荣誉
            </span>
          </div>
          <Row>
            <Col span={24}>
              {HonorDetails.length > 0 &&
                HonorDetails?.map((item) => {
                  return (
                    <div key={item.id}>
                      <div>
                        <Row
                          style={{ marginTop: "20px", marginLeft: "40px" }}
                        >
                          <Col span={5}>荣誉取得年份：{item.getTime}</Col>
                          <Col span={5} offset={4}>
                            荣誉级别：{item.honourLevelText}
                          </Col>
                          <Col span={5} offset={2}>
                            荣誉名称：{item.name}
                          </Col>
                        </Row>
                      </div>
                      <div>
                        {/* 展示荣誉原件图片 */}
                        <Row justify="space-around" align="middle">
                          {item.honourJpg != null && item.honourJpg !== '' ? (
                            item.honourJpg.includes(";") ? (
                              item.honourJpg.split(";").map((pngItem, index) => (
                                <Col span={8} key={index}>
                                  <Image width={200} height={100} src={pngItem} style={{ padding: "10px 30px" }}/>
                                </Col>
                              ))
                            ) : (
                              <Col span={8}>
                                <Image width={200} height={100} src={item.honourJpg} />
                              </Col>
                            )
                          ) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'暂无图片'} />)}
                        </Row>

                      </div>

                    </div>
                  )
                })}
            </Col>
          </Row>
        </div>
        <div>

        </div>
        <div className={styles["situation"]}>
          <div>
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              学校项目情况
            </span>
          </div>
          <div>
            <span style={{ marginLeft: "30px" }}></span>
          </div>
          <div className={styles["situationone"]}>
          </div>
          <div><Table key={ProjectData} columns={ProjectsituationUpgradeColumns} dataSource={Array.isArray(ProjectData) ? ProjectData : []} borderedpagination={false} pagination={false} bordered={true} /></div>
        </div>
        <div className={styles["Primaryschool"]}>
          <div>
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              小学升学率
            </span>
          </div>
          <div className={styles["Primaryschoolone"]}>
            <div>
              <Row style={{ marginTop: "20px", marginLeft: "20px" }}>
                <Col span={3}>
                  年份：{SmallData?.year}
                </Col>
                <Col span={4} offset={6}>
                  毕业总人数：{SmallData?.primarySchoolNum}
                </Col>
                <Col span={4} offset={4}>
                  初中录取人数：{SmallData?.juniorSchoolEntranceNum}
                </Col>
              </Row>
              <Row style={{ marginTop: "20px", marginLeft: "20px" }}>
                <Col span={5}>初中录取率%：{SmallData?.juniorSchoolEntranceRate}</Col>
                <Col span={5} offset={4}>
                  学生辍学率%：{SmallData?.primaryDropoutRate}
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className={styles["Juniorhighschool"]}>
          <div>
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              初中升学率
            </span>
          </div>

          <div className={styles["Juniorhighschoolone"]}>
            <div>
              <Row style={{ marginTop: "20px", marginLeft: "20px" }}>
                <Col span={3}>
                  年份：{SmallData?.year}
                </Col>

                <Col span={4} offset={6}>
                  毕业总人数：{AarlyData?.juniorSchoolNum}
                </Col>
                <Col span={4} offset={5}>
                  高中录取人数：{AarlyData?.seniorEntranceNum}
                </Col>
              </Row>
              <Row style={{ marginTop: "20px", marginLeft: "20px" }}>
                <Col span={5}>高中录取率%：{AarlyData?.seniorEntranceRate}</Col>
                <Col span={5} offset={4}>
                  中职录取人数：{AarlyData?.secondaryVocationalNum}
                </Col>
                <Col span={5} offset={4}>
                  中职录取率%：{AarlyData?.secondaryVocationalRate}
                </Col>
              </Row>
              <Row style={{ marginTop: "20px", marginLeft: "20px" }}>
                <Col span={5}>初中辍学率%：{AarlyData?.juniorDropoutRate}</Col>
              </Row>
            </div>
          </div>
        </div>
        <div className={styles["Seniorhighschool"]}>
          <div>
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              高中升学率
            </span>
          </div>
          <div className={styles["Seniorhighschoolone"]}>
            <div>
              <Row style={{ marginTop: "20px", marginLeft: "20px" }}>
                <Col span={3}>
                  年份：{SmallData?.year}
                </Col>
                <Col span={4} offset={6}>
                  毕业总人数：{HighData?.seniorGraduationNum}
                </Col>
                <Col span={5} offset={5}>
                  参加高考总人数：{HighData?.collegeEntranceExaminationNum}
                </Col>
              </Row>
              <Row style={{ marginTop: "20px", marginLeft: "20px" }}>
                <Col span={5}>大学录取人数：{HighData?.collegeEntranceNum}</Col>
                <Col span={5} offset={4}>
                  未被录取人数：{HighData?.noAdmissionNum}
                </Col>
                <Col span={5} offset={4}>
                  大学录取率%：{HighData?.collegeEntranceRate}
                </Col>
              </Row>
              <Row style={{ marginTop: "20px", marginLeft: "20px" }}>
                <Col span={5}>重点大学录取人数：{HighData?.emphasisCollegeNum}</Col>
                <Col span={5} offset={4}>
                  重点大学录取率%：{HighData?.emphasisCollegeRate}
                </Col>
                <Col span={5} offset={4}>
                  一本大学录取人数：{HighData?.keyUniversitiesNum}
                </Col>
              </Row>
              <Row style={{ marginTop: "20px", marginLeft: "20px" }}>
                <Col span={5}>一本大学录取率%：{HighData?.keyUniversitiesRate}</Col>
                <Col span={5} offset={4}>
                  二本大学录取人数：{HighData?.secondUniversitiesNum}
                </Col>
                <Col span={5} offset={4}>
                  二本大学录取率%：{HighData?.secondUniversitiesRate}
                </Col>
              </Row>
              <Row style={{ marginTop: "20px", marginLeft: "20px" }}>
                <Col span={5}>大专院校录取人数：{HighData?.tertiaryInstitutionNum}</Col>

                <Col span={5} offset={4}>
                  大专院校录取率%：{HighData?.tertiaryInstitutionRate}
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <div>
          <Button onClick={handlePrint} type="primary" style={{ margin: "20px 0", }}>打印</Button>
        </div>
      </div>
      {/* 上传确认件原件 */}
      {/* <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Form.Item name="honourJpg">
            <div style={{ textAlign: "center" }}>
              <Upload
                {...UploadProps}
                fileList={fileList}
                onPreview={handlePreview}
              >
                {fileList.length >= 5 ? null : uploadButton}
              </Upload>
              <Alert
                style={{ marginTop: 6 }}
                message={`温馨提示：请上传格式为JPG/PNG的原件照片。`}
                type="warning"
                showIcon
              />
            </div>

            <Modal
              visible={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                style={{ width: "100%" }}
                alt={previewTitle}
                src={previewImage}
              />
            </Modal>
          </Form.Item>
        </div>
      </div> */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <div><Button type="primary" onClick={previewSubmit}>提交</Button>
        </div>
      </div> */}
    </>
  )
}
const mapStateToProps = (state) => {
  return {}
}



export default connect(mapStateToProps)(PreviewPrinting)

/**
 * 学校荣誉信息
 * @author:shihaigui
 * date:2023年04月25日
 * */

import React, { useState, useEffect } from "react"
import moment from "moment"
import styles from "./SchoolHonor.less"
import { connect } from "dva"
import { School as namespace } from "../../../utils/namespace"
import { Col, Row, Button, Select, Input, Form, Space, DatePicker, Upload, Image, message, Modal, notification, Alert, Empty, Pagination, Carousel, } from "antd"
import accessTokenCache from "@/caches/accessToken"
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons"
function SchoolHonor (props) {
  const token = accessTokenCache() && accessTokenCache()
  const { dispatch, honorTypeOptions } = props
  const [AcquireForm] = Form.useForm()
  const [RecordModifyForm] = Form.useForm()
  const [HonorDetails, setHonorDetails] = useState({})
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")
  const [currentPage, setcurrentPage] = useState(1)
  const [Datatotal, setDatatotal] = useState(0)
  const [isRecordModifyModalOpen, setIsRecordModifyModalOpen] = useState(false)
  const [RecordModifyData, setRecordModifyData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])
  const [AllScreening, setAllScreening] = useState([])
  const [BtnLoading, setBtnLoading] = useState(false)
  const [showIcon, setShowIcon] = useState(false)
  const [formItems, setFormItems] = useState([{ fileList: [], name: '', honourLevel: '', getTime: null }])//存储图片路径


  // 限制可选择的时间
  const disabledDate = (current) => { return current && current > moment().endOf('day') }


  // 上传组件配置信息
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  const handleCancel = () => setPreviewOpen(false)
  const handlePreview = async (file, index) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  //点击上传按钮
  const handleChange = (changedFileList, index) => {
    const updatedFormItems = [...formItems]
    updatedFormItems[index].fileList = changedFileList
    setFormItems(updatedFormItems)
  }

  //添加学校荣誉按钮
  const handleAddFormItem = () => {
    setShowIcon(true)
    setFormItems((prevFormItems) => [...prevFormItems, { fileList: [], name: '', honourLevel: '', getTime: '' }])
  }


 //删除按钮突变
  const handleRemoveFormItem = (index) => {
    setFormItems((prevFormItems) => {
      const updatedFormItems = [...prevFormItems]
      updatedFormItems.splice(index, 1)
      return updatedFormItems
    })
  }


  const handleNameChange = (value, index) => {
    const updatedFormItems = [...formItems]
    updatedFormItems[index].name = value
    setFormItems(updatedFormItems)
  }

  const handleLevelChange = (value, index) => {
    const updatedFormItems = [...formItems]
    updatedFormItems[index].honourLevel = value
    setFormItems(updatedFormItems)
  }

  const handleTimeChange = (value, index) => {
    const updatedFormItems = [...formItems]
    updatedFormItems[index].getTime = value ? moment(value).format('YYYY-MM-DD') : null
    setFormItems(updatedFormItems)
  }

  // 保存学校荣誉
  const SaveSchoolHonor = () => {
    setBtnLoading(true)
    const newArr = formItems?.map((obj) => ({
      ...obj,
      honourLevel: honorTypeOptions?.filter(item => item.value == obj.honourLevel)[0]?.label,//保存传参文字 label文字，value值id
      honourJpg: obj?.fileList?.map((item) => item?.response?.data)
    }))

    const newArr2 = newArr.map(obj => {
      const { fileList, ...newObj } = obj
      return newObj
    })

    dispatch({
      type: namespace + "/saveSchoolHonourApi",
      payload: newArr2,
      callback: (res) => {
        if (res.result === "保存成功") {
          message.success("荣誉信息保存成功！")
          setLoading(false)
          getSchoolHonor()
          setFormItems([{ fileList: [], name: '', honourLevel: '', getTime: null }])//保存后清空内容与图片
          setBtnLoading(false)
        } else {
          setLoading(false)
          message.error("荣誉信息保存失败！")
          setBtnLoading(false)
        }
      },
    })
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>点击上传</div>
    </div>
  )



  // 获取学校荣誉
  const getSchoolHonor = (page = 1, size = 10, AllScreening) => {
    dispatch({
      type: namespace + "/getSchoolHonorApi",
      payload: { page, size, ...AllScreening },
      callback: (res) => {
        if (res) {
          setHonorDetails(res?.result?.data)
          setcurrentPage(res?.result?.currentPage)
          setDatatotal(res?.result?.total)
        }
      },
    })
  }

  // 表格分页
  const NotificationChange = (page, size) => {
    getSchoolHonor(page, size, AllScreening)
  }


  useEffect(() => {
    getSchoolHonor()
    //批量加载多个字典组
    dispatch({
      type: namespace + "/getCommonBatchLoadDictGroupsApi",
      payload: { dictCodes: "DICT_HONOR" },
    })
  }, [])




  // 打开修改窗口
  const showRecordModifyModal = (value) => {
    // dispatch({
    //   type: namespace + "/getCommonBatchLoadDictGroupsApi",
    //   payload: { dictCodes: "DICT_HONOR" },
    // })
    setRecordModifyData(value)
    RecordModifyForm.setFieldsValue({
      name: value?.name,
      honourLevel: value?.honourLevel-0,
      getTime: value?.getTime && moment(value?.getTime),
    })
    setIsRecordModifyModalOpen(true)
  }


  // 确认修改记录数据
  const handleRecordModifyOk = () => {
    // setLoading(true);
    RecordModifyForm.validateFields()
      .then((values) => {
        dispatch({
          type: namespace + "/deleteSchoolHonourApi",
          payload: {
            ...values,
            ...{ id: RecordModifyData?.id, getTime: values["getTime"] && values["getTime"].format("YYYY/MM/DD") },
            // ...{ honourLevel: honorTypeOptions?.filter(item => item.value == values.honourLevel)[0]?.label },
          },

          callback: (res) => {
            if (res?.result == null) {
              message.success("荣誉信息修改成功！")
              setLoading(false)
              setRecordModifyData(null)
              setIsRecordModifyModalOpen(false)
              getSchoolHonor()
            } else {
              setLoading(false)
              message.error("荣誉信息修改失败！")
            }
          },
        })
      })
      .catch((info) => { })
  }
  // 变动记录修改弹窗关闭
  const handleRecordModifyCancel = () => {
    setIsRecordModifyModalOpen(false)
    setRecordModifyData(null)
  }


  //查询学校荣誉取得年份
  const honorTime = (value) => {
    if (value != null) {
      setAllScreening({ ...AllScreening, getTime: value.format('YYYY') })
    } else {
      setAllScreening({ ...AllScreening, getTime: null })
    }
  }


  //查询学校荣誉级别id
  const honourLevelList = (value) => {
    if (value != null) {
      const honourLevelId = value
      setAllScreening({ ...AllScreening, honourLevel: honourLevelId })
    } else {
      setAllScreening({ ...AllScreening, honourLevel: null })
    }
  }

  //传荣誉级别文字的方式
  // const honourLevelList = (value) => {
  //   if (value != null) {
  //     setAllScreening({ ...AllScreening, honourLevel: honorTypeOptions?.filter(item => item.value == value)[0]?.label })
  //   } else {
  //     setAllScreening({ ...AllScreening, honourLevel: null })
  //   }
  // }


  useEffect(() => {
    setAllScreening(AllScreening)
    getSchoolHonor(1, 10, AllScreening)
  }, [AllScreening])

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
          学校荣誉
        </span>
      </div>
      <div className={styles["Newhonor"]}>
        <span style={{ fontWeight: "700", marginLeft: "10px" }}>
          新建荣誉：
        </span>
      </div>
      
        <Form form={AcquireForm}>
          {formItems.map((item, index) => (
            <div key={index} style={{ border: '1px dashed #bfbfbf', borderRadius: '5px', padding: '20px', marginBottom: '15px' }}>
              <Row justify="space-around" align="middle" gutter={[8, 0]}>
                <Col span={23}>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Form.Item label="荣誉取得时间" rules={[{
                        required: true,
                        message: '请输入内容!',
                      },
                      ]}>
                        <DatePicker onChange={(e) => handleTimeChange(e, index)} value={item.getTime && moment(item.getTime)} disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="荣誉级别" rules={[{
                        required: true,
                        message: '请输入内容!',
                      },
                      ]}>
                        <Select
                          onSelect={(e) => handleLevelChange(e, index)}
                          options={honorTypeOptions}
                          value={item.honourLevel}
                          style={{
                            width: 120,
                          }}
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="荣誉名称" rules={[{
                        required: true,
                        message: '请输入内容!',
                      },
                      ]}>
                        
                          <Input onChange={(e) => handleNameChange(e.target.value, index)} value={item.name}  />
                        
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ display: "flex", justifyContent: "center" }}>
                    <Form.Item name={`honourJpg-${index}`}>
                      <Upload
                        action="/auth/web/front/v1/upload/uploadImage"
                        headers={{ Authorization: token }}
                        listType="picture-card"
                        fileList={item.fileList}
                        onPreview={(file) => handlePreview(file, index)}
                        onChange={({ fileList }) => handleChange(fileList, index)}
                        // multiple={true}
                      >
                        {item.fileList.length >= 3 ? null : uploadButton}
                      </Upload>
                    </Form.Item>
                  </Row>
                  <Row style={{ display: "flex", justifyContent: "center" }}>
                    <Alert style={{ marginTop: 6 }} message={`温馨提示：请上传格式为JPG/PNG的荣誉原件照片。`} type="warning" showIcon />
                  </Row>
                </Col>
                <Col span={showIcon ? 1 : 0} >
                  <Button type="link" shape="circle" icon={<DeleteOutlined />} onClick={() => handleRemoveFormItem(index)} />
                </Col>
              </Row>
            </div>
          ))}
          <Col>
            <Form.Item>
              <Button type="dashed" block onClick={handleAddFormItem} icon={<PlusOutlined />} style={{fontWeight:900,height:"50px"}}>添加学校荣誉</Button>
            </Form.Item>
          </Col>
          <Col style={{ display: "flex", justifyContent: "center" }}>
            <Form.Item>
              <Button type="primary" onClick={SaveSchoolHonor} style={{ display: "flex", justifyContent: "center" }} loading={BtnLoading}>保存</Button>
            </Form.Item>
          </Col>
        </Form>

        <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <Carousel>
            <img
              alt="example"
              style={{
                width: '100%',
              }}
              src={previewImage}
            />
          </Carousel>
        </Modal>

        <hr style={{ width: "100%" }} />
        <Form
          name="RecordModify"
          onFinish={RecordModifyForm}
          autoComplete="off"
          form={RecordModifyForm}
          preserve={false}
        >
          <div style={{marginTop:"20px"}}>
            <Row>
              <Col span={6}>
                <div className={styles['schoolHonor']}>
                  <span style={{ fontWeight: "700", marginLeft: "10px" }}>
                    已取得荣誉:
                  </span>
                </div>
              </Col>
              <Col span={7}>
                <Form.Item label="取得年份" rules={[{
                  required: true,
                  message: '请输入年份!',
                },
                ]}>
                  <DatePicker picker="year" onChange={honorTime} disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} />
                </Form.Item>
              </Col>
              <Col span={7} offset={1}>
                <Form.Item label="荣誉级别" rules={[{
                  required: true,
                  message: '请选择荣誉级别!',
                },
                ]}>
                  <Select
                    onChange={honourLevelList}
                    allowClear
                    options={honorTypeOptions}
                    style={{
                      width: 120,
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div style={{ border: "1px solid gray", overflow: "auto", height: "500px" }}>
            <Row>
              <Col span={24}>
                {HonorDetails?.length > 0 &&
                  HonorDetails?.map((item) => {
                    return (
                      <div key={item.id}>
                        <div style={{padding:"15px 0"}}>
                          <Row style={{ marginTop: "20px", marginLeft: "40px" }}>
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
                          <Row justify="space-around" align="middle">
                            {item.honourJpg != null && item.honourJpg !== '' ? (
                              item.honourJpg.includes(";") ? (
                                item.honourJpg.split(";").map((pngItem, index) => (
                                  <Col span={8} key={index}>
                                    <Image width={200} height={100} src={pngItem} style={{ padding: "10px 30px" }} />
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
                        <Button onClick={() => { showRecordModifyModal(item) }} type="dashed" block>{" "}编辑</Button>
                      </div>
                    )
                  })}
              </Col>
            </Row>
          </div>
        </Form>
      
      <Modal
        title="荣誉信息修改"
        confirmLoading={loading}
        centered={true}
        width={900}
        visible={isRecordModifyModalOpen}
        onOk={handleRecordModifyOk}
        onCancel={handleRecordModifyCancel}
      >
        <Form name="RecordModify" form={RecordModifyForm} autoComplete="off">
          <Row>
            <Col span={6}>
              <Form.Item label="取得时间" name="getTime">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6} offset={1}>
              <Form.Item label="荣誉级别" name="honourLevel">
                <Select allowClear options={honorTypeOptions} />
              </Form.Item>
            </Col>
            <Col span={8} offset={1}>
              <Form.Item label="荣誉名称" name="name">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <div>
        <Pagination
          onChange={NotificationChange}
          total={Datatotal}
          current={currentPage}
          defaultPageSize={10}
          showTotal={(Datatotal) => `总计 ${Datatotal} 条`}
          style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}
        />
      </div>
    </>
  )
}
const mapStateToProps = (state) => {
  return {
    honorTypeOptions: state[namespace].honorTypeOptions,
  }
}

export default connect(mapStateToProps)(SchoolHonor)

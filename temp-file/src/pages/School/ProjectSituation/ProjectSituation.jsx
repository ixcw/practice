/**
 * 学校项目情况
 * @author:shihaigui
 * date:2023年04月26日
 * */

import React, { useState, useEffect } from "react"
import styles from "./ProjectSituation.less"
import { connect } from "dva"
import moment from 'moment'
import { School as namespace } from "../../../utils/namespace"
import { Col, Row, Button, Input, Form, DatePicker, Table, message, Spin,  } from "antd"
import { } from "@ant-design/icons"

function ProjectSituation (props) {
  const [projectSituationForm] = Form.useForm()
  const [ModifyItemForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [ProjectDetail, setProjectDetail] = useState([])
  const [ButtonStatus, setButtonStatus] = useState(1)
  // 表格表单
  const [ProjectsituationUpgrade, setProjectsituationUpgrade] = useState([])
  const { dispatch } = props

  // 限制可选择的时间
  const disabledDate = (current) => { return current && current > moment().endOf('day') }

  useEffect(() => {
    //查询学校项目情况
    setLoading(false)
    dispatch({
      type: namespace + "/historySchoolProjectApi",
      payload: {},
      callback: (res) => {
        if (res) {
          setProjectDetail(res?.result)
        }
      },
    })
  }, [])


  // 添加保存学校项目
  const AddItem = (value) => {
    projectSituationForm.validateFields()
    setLoading(false)
    dispatch({
      type: namespace + "/saveSchoolProjectApi",
      payload: { schoolId: 0, ...value, createDate: value["createDate"].format("YYYY-MM-DD") },
      callback: (res) => {
        if (res.result === "保存成功") {
          message.success("保存学校项目信息成功！")
          // 保存成功后清空输入框的内容
          projectSituationForm.resetFields()
          dispatch({
            type: namespace + "/historySchoolProjectApi",
            payload: {},
            callback: (res) => {
              if (res) {
                setProjectDetail(res?.result)
              }
            },
          })
          setLoading(false)
        } else {
          setLoading(false)
          message.error("保存学校项目信息失败！")
        }
      },
    })

  }

  // 表单确认修改
  const onFinish = (value) => {

    const newValue = value?.ProjectList?.length > 0 && value.ProjectList?.map(item => {
      return {
        ...item,
        createDate: item.createDate && item['createDate'].format('YYYY-MM-DD')
      }
    })
    dispatch({
      type: namespace + "/updateSchoolProjectApi",
      payload: newValue,
      callback: (res) => {
        if (res.result == '修改成功') {
          message.success("修改学校项目信息成功！")
          setButtonStatus(1)
          setLoading(false)
          dispatch({
            type: namespace + "/historySchoolProjectApi",
            payload: {},
            callback: (res) => {
              if (res) {
                setProjectDetail(res?.result)
              }
            },
          })
        } else {
          message.error("修改学校项目信息失败！")
        }
      },
    })

  }

  // 项目情况表头
  const ProjectsituationUpgradeColumns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      width: "140px",
      className: `${styles['tableHidden']}`,
      render: (text, record, index) => {
        return (
          <Form.Item name={['ProjectList', index, 'id']}>
            <Input />
          </Form.Item>
        )
      }
    },
    {
      title: "录入时间",
      dataIndex: "createDate",
      key: "createDate",
      width: "140px",
      render: (text, record, index) => {
        return (
          <Form.Item name={['ProjectList', index, 'createDate']}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        )
      }
    },
    {
      title: "拟建项目数量",
      dataIndex: "proposedProject",
      key: "proposedProject",
      width: "140px",
      render: (text, record, index) => {
        return (
          <Form.Item name={['ProjectList', index, 'proposedProject']}>
            <Input onKeyDown={handleInputChange} />
          </Form.Item>
        )
      }
    },
    {
      title: "在建项目数量",
      dataIndex: "constProject",
      key: "constProject",
      width: "140px",
      render: (text, record, index) => {
        return (
          <Form.Item name={['ProjectList', index, 'constProject']}>
            <Input onKeyDown={handleInputChange} />
          </Form.Item>
        )
      }
    },
    {
      title: "已建项目数量",
      dataIndex: "estabProject",
      key: "estabProject",
      width: "140px",
      render: (text, record, index) => {
        return (
          <Form.Item name={['ProjectList', index, 'estabProject']}>
            <Input onKeyDown={handleInputChange} />
          </Form.Item>
        )
      }
    },
    {
      title: "待建项目数量",
      dataIndex: "waitProject",
      key: "waitProject",
      width: "140px",
      render: (text, record, index) => {
        return (
          <Form.Item name={['ProjectList', index, 'waitProject']}>
            <Input onKeyDown={handleInputChange} />
          </Form.Item>
        )
      }
    },
    {
      title: "修缮建项目数量",
      dataIndex: "repairProject",
      key: "repairProject",
      width: "140px",
      render: (text, record, index) => {
        return (
          <Form.Item name={['ProjectList', index, 'repairProject']}>
            <Input onKeyDown={handleInputChange} />
          </Form.Item>
        )
      }
    },

  ]

  // 第二表头
  const Columns = [
    {
      title: "录入时间",
      dataIndex: "createDate",
      key: "createDate",
      width: "140px",
    },
    {
      title: "拟建项目数量",
      dataIndex: "proposedProject",
      key: "proposedProject",
      width: "140px",
    },
    {
      title: "在建项目数量",
      dataIndex: "constProject",
      key: "constProject",
      width: "140px",
    },
    {
      title: "已建项目数量",
      dataIndex: "estabProject",
      key: "estabProject",
      width: "140px",
    },
    {
      title: "待建项目数量",
      dataIndex: "waitProject",
      key: "waitProject",
      width: "140px",
    },
    {
      title: "修缮项目数量",
      dataIndex: "repairProject",
      key: "repairProject",
      width: "140px",
    },

  ]

  const ActivateEdit = () => {
    setButtonStatus(2)
  }

  // 设置显示默认值
  useEffect(() => {
    ModifyItemForm.setFieldsValue({
      // userName: ProjectDetail.userName,
      "ProjectList": ProjectDetail?.map(item => {
        return {
          constProject: item?.constProject,
          estabProject: item?.estabProject,
          proposedProject: item?.proposedProject,
          repairProject: item?.repairProject,
          schoolId: item?.schoolId,
          waitProject: item?.waitProject,
          id: item?.id,
          createDate: item.createDate && moment(item?.createDate),
        }
      }),
    })
  }, [ProjectDetail])


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
    <div>
      <div>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "15px"
          }}
        >
          新建学校项目情况
        </span>
        <Form
          name="projectSituation"
          onFinish={AddItem}
          autoComplete="off"
          form={projectSituationForm}
          preserve={false}
        >
          <Row gutter={[0, 33]} style={{ marginLeft: "30px" }}>
            <Col span={6} style={{ fontWeight: 700 }}>
              <Form.Item label="录入时间" name="createDate" rules={[{
                required: true,
                message: '请选择录入时间!',
              },
              ]}>
                <DatePicker disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} />
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{
              border: "1px solid gary",
              marginLeft: "35px",
              width: "1060px",
              height: "150px",
            }}
          >
            <Row style={{ marginTop: "20px" }}>
              <Col span={5}>
                <Form.Item label="拟建项目数量" name="proposedProject" rules={[{
                  required: true,
                  message: '请输入内容!',
                },
                ]}>
                  
                    <Input addonAfter="个" onKeyDown={handleInputChange} />
                  
                </Form.Item>
              </Col>
              <Col span={5} offset={2}>
                <Form.Item label="在建项目数量" name="constProject" rules={[{
                  required: true,
                  message: '请输入内容!',
                },
                ]}>
                 
                    <Input addonAfter="个" onKeyDown={handleInputChange} />
                  
                </Form.Item>
              </Col>
              <Col span={5} offset={2}>
                <Form.Item label="已建项目数量" name="estabProject" rules={[{
                  required: true,
                  message: '请输入内容!',
                },
                ]}>
                 
                    <Input addonAfter="个" onKeyDown={handleInputChange} />
                  
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginTop: "20px" }}>
              <Col span={5}>
                <Form.Item label="待建项目数量" name="waitProject" rules={[{
                  required: true,
                  message: '请输入内容!',
                },
                ]}>
                  
                    <Input addonAfter="个" onKeyDown={handleInputChange} />
                 
                </Form.Item>
              </Col>
              <Col span={5} offset={2}>
                <Form.Item label="修缮项目数量" name="repairProject" rules={[{
                  required: true,
                  message: '请输入内容!',
                },
                ]}>
                 
                    <Input addonAfter="个" onKeyDown={handleInputChange} />
                  
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </div>
          <hr />
        </Form>
      </div>
      <div>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            fontWeight: "700",
          }}
        >
          过往学校项目情况
        </span>
      </div>
      <Form
        name="ModifyItem"
        onFinish={onFinish}
        autoComplete="off"
        form={ModifyItemForm}
        preserve={false}
      >
        <Spin spinning={loading}>
          <Table key={ProjectDetail} columns={ButtonStatus == 1 ? Columns : ProjectsituationUpgradeColumns} dataSource={ProjectDetail?.map((item, index) => { return { ...item, key: index } })} borderedpagination={false} pagination={false} bordered={true} />
        </Spin>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          {ButtonStatus == 1 &&
            <Button type="primary" onClick={ActivateEdit}>修改</Button>
          }
          {ButtonStatus == 2 &&
            <Button type="primary" htmlType="submit">保存修改</Button>
          }

        </div>
      </Form>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(ProjectSituation)

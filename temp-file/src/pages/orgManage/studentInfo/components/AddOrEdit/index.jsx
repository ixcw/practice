/**
* 学生信息添加修改
* @author:张江
* @date:2020年09月10日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  Radio,
  Input,
  Modal,
  message,
  Form,
  Select,
  Button,
  Spin,
  Alert
} from 'antd';
import { StudentMange as namespace } from '@/utils/namespace';
import { getIcon, doHandleYear } from "@/utils/utils";
import LearningLevel from '@/components/LearningLevel/index';
import { phoneReg } from '@/utils/const'

import styles from './index.less';

const IconFont = getIcon();

const { Option } = Select;

@connect(state => ({
  optionalClassList: state[namespace].optionalClassList,//班级列表
  loading: state[namespace].loading,//显示保存中
}))

export default class AddOrEdit extends React.Component {
  static propTypes = {
    studentInfo: PropTypes.object,//单个学生信息
    isShowModal: PropTypes.bool.isRequired,//是否显示弹框
    handleHideModalVisible: PropTypes.func.isRequired,//弹框操作隐藏
    saveStudentInfo: PropTypes.func.isRequired,//保存信息
    // classList: PropTypes.any,//班级列表
    getOptionalClassList: PropTypes.func,//获取班级列表
    classId: PropTypes.any,//选中的班级id
  };


  constructor() {
    super(...arguments);
    this.state = {
      learningLevelCode: doHandleYear(),
      classCode: '',
      // studentName:'',
    };
  }

  componentDidMount() {
    const {
      location,
    } = this.props;
    const { search } = location;
    const query = queryString.parse(search) || {};
    if (query.learningLevelCode) {
      this.setState({
        learningLevelCode: Number(query.learningLevelCode)
      })
    }

  }


  /**
* 选择学级
* @param learningLevelCode  ：学级code
*/
  handleLearningLevelChange = (learningLevelCode) => {
    const { getOptionalClassList } = this.props
    this.setState({
      learningLevelCode,
    })
    getOptionalClassList(learningLevelCode)
  }


  /**
* 选择班级
* @param classCode  ：班级id
*/
  handleClassChange = (classCode) => {
    this.setState({
      classCode,
    })

  }

  render() {
    const {
      handleHideModalVisible,
      isShowModal,
      studentInfo,
      optionalClassList,
      form,
      classId,
      saveStudentInfo,
      location,
      loading,
      loginUserInfo
    } = this.props;
    const { learningLevelCode, classCode } = this.state;
    // const { getFieldDecorator, validateFieldsAndScroll } = form;
    const { search } = location;
    const query = queryString.parse(search);
    const classDefaultValue = classId ? classId : (optionalClassList && optionalClassList[0] ? optionalClassList[0].id : '')


    const onSubmitFinish = (payload) => {
      Object.keys(payload).forEach(key => {
        if (typeof payload[key] === 'undefined') {
          delete payload[key]
        }
      });
      const callback = () => {
        handleHideModalVisible();
      }
      let payloadForm = {}
      if (studentInfo && studentInfo.id) {
        payloadForm = {
          id: studentInfo.id,
          userName: payload.userName,
          sex: Number(payload.sex)
        }
      } else {
        if (loginUserInfo && loginUserInfo.schoolId) {
          payloadForm = {
            userName: payload.userName,
            sex: Number(payload.sex) || 0,
            // account: payload.mobile,
            phone: payload.mobile || undefined,//2021年05月08日 学生管理-添加手机号字段
            classId: classCode || classDefaultValue,
            schoolId: loginUserInfo.schoolId,
            schoolOnlyId: payload.schoolOnlyId || undefined,//2021年05月07日 学生管理-添加唯一码/学号字段
          }
          //2021年05月07日 学生管理-添加唯一码/学号字段
          if (!payload.schoolOnlyId && !payload.mobile) {
            message.warning('手机号或学号必须填写一个');
            return;
          }
        } else {
          message.warning('请选择机构');
          return
        }
      }
      saveStudentInfo(payloadForm, callback)
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 7 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 21 },
        sm: { span: 13 },
      },
    };
    return (
      <Modal
        className={'add-or-edit-student'}
        title={<div>
          <IconFont type={studentInfo && studentInfo.id ? 'icon-bianji' : 'icon-xinzeng'} />
          <span>{studentInfo && studentInfo.id ? ' 修改学生信息' : ' 新增学生'}</span>
        </div>}
        visible={isShowModal}
        onCancel={handleHideModalVisible}
        footer={null}
        maskClosable={false}
      >
        <Spin tip="正在处理..." spinning={!!loading}>
          {
            (studentInfo && studentInfo.id) || !studentInfo.isSchoolAdmin ? null : <div className='student-info-box'>
              <div className={'student-info-title'}>
                班级信息
            </div>
              <div className={'class-form-box'}>
                <LearningLevel
                  learningLevelCode={learningLevelCode}
                  selectedLearningLevelCodeChange={this.handleLearningLevelChange}
                />
                <div>
                  <label>班级：</label>
                  {
                    optionalClassList ? <Select
                      defaultValue={classDefaultValue}
                      style={{ width: 240 }}
                      onChange={this.handleClassChange}>
                      {
                        optionalClassList && optionalClassList.map((item) => {
                          return (<Option key={item.id} value={item.id}>{item.fullName}</Option>)
                        })
                      }
                    </Select> : <Spin tip="正在加载中..." spinning={true}></Spin>
                  }

                </div>
              </div>

            </div>

          }

          <div className='student-info-box'>
            <div className={'student-info-title'}>
              学生信息<Alert message="默认密码为手机号/账号" type="warning" />
            </div>
            <div className={'class-form-box'} style={{ paddingLeft: 4 }}>
              <Form onFinish={onSubmitFinish} className={'student-form-box'}>
                <Form.Item
                  label="姓名"
                  {...formItemLayout}
                  name={'userName'}
                  initialValue={studentInfo && studentInfo.userName ? studentInfo.userName : undefined}
                  rules={[{
                    required: true,
                    message: "请输入姓名",
                  }]}
                >
                  <Input placeholder="请输入姓名" />
                </Form.Item>
                {
                  studentInfo && studentInfo.id ? null : <Alert message="手机号或学号必须填写一个" showIcon type="warning" style={{ marginBottom: '6px' }} />
                }
                {
                  studentInfo && studentInfo.id ? null : <Form.Item
                    label="手机号"
                    {...formItemLayout}
                    name={'mobile'}
                    initialValue={studentInfo && studentInfo.phone ? studentInfo.phone : undefined}
                    rules={[
                      { required: false, message: '请输入手机号!', },
                      { pattern: phoneReg, message: '请输入正确的手机号' }
                    ]}
                  >
                    <Input placeholder="请输入手机号" />
                  </Form.Item>
                }

                {//2021年05月07日 学生管理-添加唯一码/学号字段
                  studentInfo && studentInfo.id ? null : <Form.Item
                    label="学号"
                    {...formItemLayout}
                    name={'schoolOnlyId'}
                    initialValue={studentInfo && studentInfo.schoolOnlyId ? studentInfo.schoolOnlyId : undefined}
                    rules={[
                      { required: false, message: '请输入学号或唯一码!', },
                    ]}
                  >
                    <Input placeholder="请输入学号或唯一码" />
                  </Form.Item>
                }

                <Form.Item
                  label="性别"
                  {...formItemLayout}
                  name={'sex'}
                  initialValue={studentInfo && studentInfo.sex != undefined ? String(studentInfo.sex) : studentInfo.id ? undefined : "0"}
                  rules={[
                    { required: false, message: '请选择性别', },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="0">男</Radio>
                    <Radio value="1">女</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item className='submit-box'>
                  <Button style={{ marginRight: '20px' }} loading={loading} key="back" onClick={handleHideModalVisible}>
                    取消
            </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}>
                    保存
            </Button>
                </Form.Item>

              </Form>


            </div>
          </div>
        </Spin>
      </Modal>
    )
  }
}


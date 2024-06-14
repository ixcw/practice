/**
 * 学生批量导入抽屉组件
 * @author:张江
 * date:2020年09月10日
 * */
import React, { Component } from 'react';
import { connect } from "dva";
import queryString from 'query-string';
import {
  Drawer,
  Button,
  Select,
  Upload,
  notification,
  message,
  Modal,
  Spin
} from 'antd';
import PropTypes from 'prop-types';
import { InboxOutlined } from '@ant-design/icons';
import { StudentMange as namespace } from '@/utils/namespace';
import { getIcon, doHandleYear } from "@/utils/utils";
import LearningLevel from '@/components/LearningLevel/index';

import styles from './index.less';

const IconFont = getIcon();
const { Option } = Select;
const { Dragger } = Upload;
const { confirm } = Modal;

@connect(state => ({
  optionalClassList: state[namespace].optionalClassList,//班级列表
  loading: state[namespace].loading,//显示保存中
}))
export default class BulkImport extends Component {

  static propTypes = {
    bulkImportVisible: PropTypes.bool || false,//是否显示
    onCloseBulkImport: PropTypes.func,
    classList: PropTypes.any,//班级列表
    saveUploadBulkImport: PropTypes.func,
    getOptionalClassList: PropTypes.func,//获取班级列表
    classId: PropTypes.any,//选中的班级id
    fullName: PropTypes.any,//选中的班级名称
    isSchoolAdmin: PropTypes.bool || false,//是否学校管理员
  };

  constructor(props) {
    super(...arguments);
    this.state = {
      learningLevelCode: doHandleYear(),
      classCode: '',
      file: {}
    };
  };


  componentDidMount() {

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


  //接收file对象
  handleReturn = (file) => {
    if (JSON.stringify(file) === "{}") {
      notification.warn({
        message: '警告信息',
        description: '请先上传文件！',
      })
      return
    }
    const fileSize = file.size / 1024 / 1024 < 20;
    if (!fileSize) {
      notification.warn({
        message: '警告信息',
        description: `${file.name}文件大小超出20M，请修改后重新上传`,
      })
      return;
    }
    if (JSON.stringify(file) !== "{}" && file.name) {
      const fileSuffixA = file.name.split('.');
      const fileSuffix = fileSuffixA[fileSuffixA.length - 1];
      if (fileSuffix === 'xls' || fileSuffix === 'xlsx' || fileSuffix === 'csv') {
        this.setState({ file })
      } else {
        notification.warn({
          message: '警告信息',
          description: '请上传文件扩展名必须为：xls xlsx csv等！',
        })
      }
    }
  };

  // 批量上传
  saveBulkImport = () => {
    const {
      saveUploadBulkImport,
      onCloseBulkImport,
      location,
      optionalClassList = [],
      classId,
      fullName
    } = this.props;
    const { search } = location;
    const { file, classCode } = this.state;
    const query = queryString.parse(search);
    const classDefaultValue = classId ? classId : (optionalClassList && optionalClassList[0] ? optionalClassList[0].id : '')
    const callback = () => {
      onCloseBulkImport();
      this.setState({
        file: {}
      })
    }
    const tempClassId = classCode || classDefaultValue;
    let className = fullName
    for (let i = 0; i < optionalClassList.length; i++) {
      if (tempClassId == optionalClassList[i].id) {
        className = optionalClassList[i].fullName;
        break;
      }
    }
    let payload = {
      classId: classCode || classDefaultValue,
    };

    if (JSON.stringify(file) === "{}") {
      message.warning('请先上传文件！');
      return;
    } else if (JSON.stringify(file) !== "{}") {
      payload.file = file;
    }
    confirm({
      title: '提示信息',
      content: `即将批量导入学生到${className}`,
      onOk() {
        saveUploadBulkImport(payload, callback)
      },
      onCancel() { },
    });

  }

  render() {
    const {
      bulkImportVisible,
      onCloseBulkImport,
      optionalClassList,
      location,
      classId,
      loading,
      isSchoolAdmin,
      fullName
    } = this.props;
    const { learningLevelCode, file, classCode } = this.state;
    const uploadProps = {
      beforeUpload: this.handleReturn,
      multiple: false,
      showUploadList: false,
    };
    const { search } = location;
    const query = queryString.parse(search);
    const classDefaultValue = classId ? classId : (optionalClassList && optionalClassList[0] ? optionalClassList[0].id : '')
    return (
      <Drawer
        className={'bulk-import-box'}
        title={<div className='drawer-title-box'>
          <div className='title-box'>
            <IconFont type={'icon-piliangxinxi'} />
            <span> 批量导入</span>
          </div>
          <a className='download-tep' href='https://res-temp.gg66.cn/student-import-template.xlsx' download='学生批量导入模板.xlsx'>下载模板</a>
        </div>}
        width={520}
        closable={false}
        onClose={() => {
          this.setState({
            file: {}
          })
          onCloseBulkImport()
        }}
        visible={bulkImportVisible}
      >

        <Spin tip="正在处理..." spinning={!!loading}>

          <div className={'class-form-box'}>
            {

              isSchoolAdmin ? [
                <LearningLevel
                  key="LearningLevel"
                  learningLevelCode={learningLevelCode}
                  selectedLearningLevelCodeChange={this.handleLearningLevelChange}
                />,
                <div key="classlist">
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
              ] :
               // 2021年05月28日 任课老师或者班主任查看学生管理 张江 加 非学校管理员时显示对应的班级名称
                <div>
                  <label>班级：</label>
                  <span>{fullName || '-'}</span>
                </div>
            }


            <div className='upload-xls-box'>
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或将文件拖拽到这里上传,支持.xls .xlsx .csv 类型</p>
                {
                  file && file.name ? <span style={{ color: '#1890ff' }}>{file.name}</span> : ''
                }
              </Dragger>
            </div>
          </div>
          <div
            style={{
              marginTop: 30,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button
              loading={loading}
              style={{
                marginRight: 8,
              }}
              onClick={() => {
                this.setState({
                  file: {}
                })
                onCloseBulkImport()
              }}
            >
              取消
            </Button>
            <Button loading={loading} onClick={this.saveBulkImport} type="primary">
              保存
            </Button>
          </div>
        </Spin>
      </Drawer>
    )
  }
}

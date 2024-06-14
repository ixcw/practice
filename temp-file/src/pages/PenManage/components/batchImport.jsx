/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2021/6/15
 *@Modified By:
 */
import React from 'react';
import {Col, Form, Input, Modal, notification, Row, Select, Upload} from "antd";
import {connect} from 'dva'
import {InboxOutlined} from "@ant-design/icons";
import {PenManage as namespace} from '@/utils/namespace'

const {Dragger} = Upload;
@connect(state => ({}))
export default class BatchImport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      file: {}
    };
  }


  componentDidMount() {
    this.props.onRef(this)
  }


  handleSwitch = () => {
    const {isModalVisible} = this.state;
    this.setState({
      isModalVisible: !isModalVisible,
      file: {}
    })
  }


  render() {
    const {isModalVisible, file} = this.state;
    const {dispatch,query} = this.props;
    const titleStyles = {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '15px'
    }
    const uploadProps = {
      beforeUpload: (file) => {
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
          if (fileSuffix === 'xls') {
            this.setState({file})
          } else {
            notification.warn({
              message: '警告信息',
              description: '请上传文件扩展名必须为：xls！',
            })
          }
        }
      },
      multiple: false,
      showUploadList: false,
    };

    /**
     * 批量导入
     */
    const batchImport = () => {
      let formData = new FormData();
      formData.append('file', file);
      formData.append('roomId', query?.id);
      dispatch({
        type: namespace + '/batchPenInformation',
        payload: {
          formData
        },
        callback: () => {
          dispatch({
            type: namespace + '/findPenList',
            payload: {
              roomId:query?.id,
              page: query?.p || 1,
              size: 10
            }
          })
          this.handleSwitch()
        }
      })
    }


    return (
      <Modal
        title={<div style={titleStyles}>
          <span>批量导入</span>
          <a onClick={() => {
            window.open('https://res.test.gogoquestionbank.gg66.cn/-8659129891623208977270.xls?attname=批量导入模板.xls')
          }}>下载模板</a>
        </div>}
        visible={isModalVisible}
        onOk={batchImport}
        closable={false}
        onCancel={this.handleSwitch}>
        <div>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined/>
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p className="ant-upload-hint" style={{color: JSON.stringify(file) !== "{}" ? '#5cb85c' : ''}}>
              {
                JSON.stringify(file) !== "{}" ? `已选择文件:${file.name}` : '文件扩展名： xls'
              }
            </p>
          </Dragger>
        </div>
      </Modal>
    )
  }
}

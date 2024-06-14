/**
* 题组上传对应的pdf
* @author:张江
* @date:2020年09月01日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import {
  Radio,
  notification,
  Upload,
  Modal,
  message,
  Alert,
  Spin,
  Button
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import styles from './UploadPdfModal.less';

const { Dragger } = Upload;

export default class UploadPdfModal extends React.Component {
  static propTypes = {
    paperInfo: PropTypes.object.isRequired,//信息
    isUploadPdfModal: PropTypes.bool.isRequired,//是否显示上传弹框
    hideUploadPdfModalVisible: PropTypes.func.isRequired,//上传弹框操作隐藏
    saveUploadPdf: PropTypes.func.isRequired,//保存上传pdf
  };


  constructor() {
    super(...arguments);
    this.state = {
      editType: '1',
      file: null,
      isUploading: false
    };
  }

  componentDidMount() {
    const { paperInfo } = this.props
    this.setState({
      editType: !!paperInfo.paperPdfUrl ? '2' : '1',
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
      if (fileSuffix === 'pdf') {
        this.setState({ file })
      } else {
        notification.warn({
          message: '警告信息',
          description: '请上传文件扩展名必须为：pdf等！',
        })
      }
    }
  };

  /**
  * 编辑类型选择
  * @param value  ：编辑类型值
  */
  editChange = ({ target: { value } }) => {
    this.setState({
      editType: value
    })
  }

  // 保存修改的图片信息
  saveQuestionImage = () => {
    const {
      paperInfo,
      saveUploadPdf,
      hideUploadPdfModalVisible } = this.props
    const { editType, file } = this.state
    const callback = () => {
      hideUploadPdfModalVisible();
      this.setState({
        previewImage: null,
        editType: '1',
        file: {},
        isUploading: false
      })
    }
    let payload = {
      paperId: paperInfo.id,
      type: editType,
    }
    if (JSON.stringify(file) === "{}") {
      message.warning('请先上传pdf！');
      return;
    } else if (JSON.stringify(file) !== "{}") {
      payload.file = file;
    }
    this.setState({
      isUploading: true
    })
    saveUploadPdf(payload, callback)
  }

  render() {
    const {
      hideUploadPdfModalVisible,
      isUploadPdfModal,
      paperInfo
    } = this.props;
    const { editType, file, isUploading } = this.state

    const uploadProps = {
      beforeUpload: this.handleReturn,
      multiple: false,
      showUploadList: false,
    };

    return (
      <div className={styles['edit-image-box']}>
        <Modal
          title={`上传PDF-${paperInfo.name || ''}`}
          visible={isUploadPdfModal}
          // onOk={this.saveQuestionImage}
          onCancel={hideUploadPdfModalVisible}
          maskClosable={false}
          // okText="确认"
          // cancelText="取消"
          footer={[
            <Button key='cancel' loading={isUploading} onClick={hideUploadPdfModalVisible}>取消</Button>,
            <Button key='ok' type="primary" loading={isUploading} onClick={this.saveQuestionImage}>确定</Button>
          ]}
        >
          <Spin spinning={isUploading} tip={'正在上传,请稍后...'}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Radio.Group defaultValue={editType} buttonStyle="solid" onChange={this.editChange}>
                {
                  paperInfo.paperPdfUrl ? null : <Radio.Button value="1">试卷PDF</Radio.Button>
                }
                {
                  paperInfo.answerPdfUrl ? null : <Radio.Button value="2">答题卡PDF</Radio.Button>
                }
              </Radio.Group>
            </div>
            <Alert message="上传前请确保试卷/答题卡与该题组对应且内容无误" type="warning" showIcon />
            <div className='upload-pdf-box'>
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                {
                  file ? <span style={{ color: '#1890ff' }}>{file.name}</span> : ''
                }
              </Dragger>
            </div>
          </Spin>
        </Modal>
      </div>
    )
  }
}


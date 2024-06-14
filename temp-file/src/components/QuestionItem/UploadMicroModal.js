/**
 * 上传微课弹窗
 * @author:张江
 * @date:2020年08月21日
 * @version:v1.0.0
 * */
import React from 'react';
import {
  Menu,
  notification,
  Upload,
  Modal,
  message,
  Button,
  Spin,
  Select,
  Tooltip,
  Progress
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from "dva";
import TcVod from 'vod-js-sdk-v6';
import { videoUploadTokenCache } from '@/caches/uploadToken'
import { Resource } from '@/utils/namespace';

// import { UploadOutlined } from '@ant-design/icons';
import { Public, HomeIndex } from "@/utils/namespace";
import { getIcon, existArr } from "@/utils/utils";
import { MicroFileSize } from "@/utils/const";

//引入样式
import styles from './UploadMicroModal.less';

const { Option } = Select;
const IconFont = getIcon();

@connect(state => ({
  // authSubjectList: state[Public].authSubjectList,//科目列表
}))

export default class UploadMicroModal extends React.Component {
  static propTypes = {
    visibleUploadMicro: PropTypes.bool,//是否显示弹窗
    handleUploadMicroCancel: PropTypes.func,//关闭弹窗方法
    handleUploadMicro: PropTypes.func,//上传微课
    QContent: PropTypes.object,//题目信息
  };

  constructor() {
    super(...arguments);
    this.state = {
      commandValue: '',
      selectedSubject: '',
      isUploading: false,
      fileId: null,
      fileName: null,
      videoUploadToken: {},
      videoUploadProgress: 0,
      isVideoUploadCancel: false,
    };
  }


  UNSAFE_componentWillMount() {

  }
  componentDidMount() {
    this.getVideoUploadToken();
  }

  isTokenValid = (token) => {
    const currentTime = new Date().getTime();
    if ((token && token.expireAt) && token.expireAt > currentTime) {
      return true
    }
    return false;
  }

  //获取视频上传签名
  getVideoUploadToken = () => {
    console.log("getVideoUploadToken")
    let { videoUploadToken } = this.state;
    if (this.isTokenValid(videoUploadToken)) {
      return videoUploadToken.token
    }
    let token = videoUploadTokenCache()
    if (this.isTokenValid(token)) {
      this.setState({ videoUploadToken: token })
      return token.token
    } else {
      const { dispatch } = this.props;
      console.log("dispatch getVideoUploadToken")
      dispatch({
        type: Resource + '/getVideoUploadToken',
        callback: (result) => {
          if (result && result.token) {
            videoUploadTokenCache(result)
            this.setState({ videoUploadToken: result })
          }
        }
      });
    }
  }

  resetVideoUpload = () => {
    const { uploader } = this.state;
    if (uploader) {
      this.setState({
        videoUploadProgress: 0,
        isVideoUploadCancel: false,
        fileId: null
      })
      uploader.cancel();
    }
  }

  /**
   * 检查视频文件是否合法
   */
  isVideoValid = (file) => {
    if (!file || !file.name || file.name === '') {
      notification.warn({
        message: '警告信息',
        description: '请先上传视频！',
      })
      return false;
    }
    const fileSize = file.size / 1024 / 1024 < MicroFileSize;
    if (!fileSize) {
      notification.warn({
        message: '警告信息',
        description: `${file.name}文件大小超出${MicroFileSize}M，请修改后重新上传`,
      })
      return false;
    }
    const fileSuffixA = file.name.split('.');
    const fileSuffix = fileSuffixA[fileSuffixA.length - 1];
    if (!/(mp4|MP4)$/.test(fileSuffix)) {
      notification.warn({
        message: '警告信息',
        description: '请上传文件扩展名必须为：mp4,MP4！',
      })
      return false;
    }
    return true
  }

  beforeVideoUpload = (file) => {
    this.getVideoUploadToken();
    let isValid = this.isVideoValid(file);
    if (isValid) {
      this.resetVideoUpload()
      this.setState({ file: file })
    }
    return isValid;
  }

  /**
   * 上传视频
   */
  uploadVideo = ({ file }) => {
    let _that = this;
    if (file && file.name) {
      const tcVod = new TcVod({
        getSignature: function () {
          return _that.state.videoUploadToken && _that.state.videoUploadToken.token
        }
      })
      const uploader = tcVod.upload({
        mediaFile: file,
      });
      uploader.on("media_progress", function (info) {
        let progress = Math.round(Math.max(_that.state.videoUploadProgress, info.percent * 100)).toFixed(2)
        const { fileId } = _that.state
        progress = progress > 100 || progress == 100 ? 99.9 : fileId ? 100 : progress;//处理进度条显示 当未成功返回获取到fileId时 进度却显示100% 容易产生误会
        _that.setState({ videoUploadProgress: progress })
      });
      // uploader.on("media_upload", function (info) {});
      _that.setState({ uploader });
      uploader
        .done()
        .then(function (doneResult) {
          let name = file.name.replaceAll("\\.(mp4|MP4)", "")
          _that.setState({ fileId: doneResult.fileId, fileName: name, videoUploadProgress: 100 });
        });
      uploader.start();
    }
  }


  /**
  * 上传微课操作
  */
  uploadMicroOper = () => {
    const { handleUploadMicro, dispatch, QContent = {} } = this.props;
    const { fileId, fileName, videoUploadProgress } = this.state;
    const _self = this;
    let payload = {
      questionId: QContent.id || QContent.questionId,
      subjectId: QContent.subjectId,
      isFlag: 0,
    }

    if (QContent.dataId && QContent.dataId > 0) {//有材料的情况 视频绑定到材料上
      // payload = {
      //   dataId: QContent.dataId,
      // }
      payload.questionId = QContent.dataId;
      payload.isFlag = 1;
    }

    if (!fileId || !fileName) {
      message.warning(videoUploadProgress > 0 ? "请先等待微课上传完成" : "请先上传微课！");
      return;
    } else if (fileName && fileId) {
      payload.fileId = fileId;
      payload.fileName = fileName;
    }
    let formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'undefined') {
        delete payload[key]
      } else {
        formData.append(key, payload[key]);
      }
    });
    this.setState({
      isUploading: true
    })
    dispatch({//上传微课
      type: HomeIndex + '/uploadVideo',
      payload: {
        formData: formData,
      },
      callback: (result) => {
        _self.setState({
          isUploading: false,
          file: {}
        })
        handleUploadMicro();
        message.success('微课已成功上传');
      }
    });
  }


  render() {
    const {
      visibleUploadMicro,
      handleUploadMicroCancel,
      // authSubjectList = []
    } = this.props;
    const { file, isUploading } = this.state
    const uploadProps = {
      beforeUpload: this.beforeVideoUpload,
      multiple: false,
      showUploadList: false,
      accept: "video/mp4",
      customRequest: this.uploadVideo
    };
    return (
      <Modal
        title=""
        footer={null}
        maskClosable={false}
        visible={visibleUploadMicro}
        onCancel={handleUploadMicroCancel}
        width={780}
      >
        <div className='upload-micro-modal'>
          <h3 className='title'>上传微课</h3>
          <div className='basic-info'>
            <Spin spinning={!!isUploading} tip="正在上传,请稍候...">
              <div className='upload-box'>
                <div>
                  <Upload {...uploadProps}>
                    <div className='upload-info'>
                      <IconFont type={'icon-icon_huabanfuben'} style={{ fontSize: 32 }} />
                      {
                        file && file.name ? <Tooltip placement="top" title={file.name}> <span className='file-title' style={{ color: '#1890ff' }}>已选择:{file.name}</span></Tooltip> : <span>上传文件</span>
                      }

                    </div>
                  </Upload>
                  {
                    this.state.videoUploadProgress > 0 ?
                      <Progress percent={this.state.videoUploadProgress} size="small" />
                      : null
                  }
                </div>
                <span>注：大小{MicroFileSize}M以内，支持扩展名 mp4</span>
              </div>
            </Spin>

            <div className='button-oper-box'>
              <Button className='join-class-oper' loading={isUploading} onClick={handleUploadMicroCancel}>取消</Button>
              <Button type="primary" loading={isUploading} className='join-class-oper' onClick={this.uploadMicroOper}>确定</Button>
            </div>

          </div>
        </div>
      </Modal>
    )
  }
}

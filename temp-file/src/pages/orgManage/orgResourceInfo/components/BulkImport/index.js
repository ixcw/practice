import React from 'react';
import { connect } from 'dva';
import styles from './index.less'
import { OrgResourceInfo as namespace } from "@/utils/namespace";
import { Drawer, Upload, Icon, message, notification, Button } from 'antd';
const { Dragger } = Upload;
@connect(state => ({
  iconLoading: state[namespace].loading
}))
export default class BulkImport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerSwitch: true,
      file: {}
    }
  }
  drawerOnClose = () => {
    this.props.closeBulkImport();
    this.setState({
      drawerSwitch: false
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
  toUpload = () => {
    const { dispatch, findOrganizeInfo } = this.props;
    const { file } = this.state;
    let formData = new FormData();
    formData.append('file', file);
    if (JSON.stringify(file) == "{}") {
      notification.warn({
        message: '警告信息',
        description: '请选择需要上传的表格文件',
      })
    } else {
      dispatch({
        type: namespace + '/batchImportOrganizeInfo',
        payload: {
          formData
        },
        callback: () => {
          findOrganizeInfo();
          message.success('上传成功');
          this.setState({
            file: {}
          })
        }
      })
    }
  }

  render() {
    const { file } = this.state;
    const { iconLoading } = this.props;
    const uploadProps = {
      beforeUpload: this.handleReturn,
      multiple: false,
      showUploadList: false,
    };
    return (
      <Drawer
        title='批量导入'
        width='400'
        headerStyle={{ border: 'none', paddingBottom: 0 }}
        placement="right"
        onClose={this.drawerOnClose}
        visible={this.state.drawerSwitch}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到这里上传,支持.xls .xlsx .csv 类型</p>
          {
            file ? <span style={{ color: '#1890ff' }}>{file.name}</span> : ''
          }
        </Dragger>,
        <Button icon='upload' loading={iconLoading} onClick={this.toUpload} className={styles['drawer-btn']}>
          {!iconLoading ? '开始上传' : '正在上传'}
        </Button>
        <div className={styles['drawer-attention']}>
          <p style={{ color: '#1890ff' }}><Icon type="exclamation-circle" theme="twoTone" />上传注意事项</p>
          <p>1：上传表格中的所属区域列格式如下：</p>
          <p><Icon type="check-circle" theme="twoTone" />贵州省-贵阳市-花溪区</p>
          <p>2：上传表格中的学段列格式如下：</p>
          <p><Icon type="check-circle" theme="twoTone" />小学,初中,高中</p>
          <p style={{ fontWeight: 'bold' }}><Icon type="warning" theme="twoTone" twoToneColor="red" />注意：上述‘，’（逗号）为英文','（逗号）</p>
          <p>3：表格其他列请按实际情况填写,可把上面两种格式复制到表格中再作修改。</p>
        </div>
        <p className={styles['drawer-p']}><a href='https://reseval.gg66.cn/orginfo-import-temp.xlsx'>上传格式模板下载</a></p>
      </Drawer>
    );
  }
}
/**
 *@Author:ChaiLong
 *@Description: 题目纠错弹框
 *@Date:Created in  2021/2/18
 *@Modified By:
 */
import React from 'react'
import {connect} from 'dva'
import {Modal, Radio, Form, Input, Upload, message, Checkbox} from 'antd'
import {PlusOutlined} from '@ant-design/icons';
import accessTokenCache from "@/caches/accessToken";
import {QuestionBank as namespace, SetQuestionSetParam} from "@/utils/namespace";
import {existArr} from "@/utils/utils";

const {TextArea} = Input;
const FormItem = Form.Item;
@connect(state => ({
  QEMessageList: state[namespace].QEMessageList,//错误类型
  addErrorQuestionInfo: state[SetQuestionSetParam].addErrorQuestionInfo,//添加纠错记录
  loading: state[namespace].loading
}))
export default class ErrorCorrectionModal extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(...arguments);
    this.state = {
      isModalVisible: false,//modal开关状态
      radioValue: [],//错误类型状态
      fileList: [],//纠错截图
      previewVisible: false,//图片预览开关
      questionId: ''
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }


  /**
   * 开关
   * @param state
   */
  onOff = (state, questionId = '') => {
    if (state && questionId) {
      this.props.dispatch({
        type: namespace + '/getQuestionErrorMessage',
        payload: {},
        callback: () => this.setState({isModalVisible: state, questionId})
      });
    } else {
      this.setState({
          isModalVisible: state,
          radioValue: [],//错误类型状态
          fileList: [],//纠错截图
          previewVisible: false,//图片预览开关
          questionId: ''
        }
      )
      this.formRef.current.resetFields()
    }
  }

  render() {
    const {dispatch, QEMessageList, loading} = this.props
    const {isModalVisible, radioValue, fileList, previewVisible, questionId} = this.state;
    const _QEMessageList = existArr(QEMessageList) ? [...QEMessageList] : []
    const token = accessTokenCache() ? accessTokenCache() : '';
    /**
     * 确认
     */
    const handleOk = () => {
      this.formRef.current.validateFields().then(values => {
        const _values = {...values}
        _values.messageIds = _values.messageIds.join(',')
        _values.imgUrl = _values.imgUrl.fileList.map(re => (re.response.data.name)).join(',')
        _values.questionId = questionId;
        dispatch({
          type: SetQuestionSetParam + '/addErrorQuestionInfo',
          payload: _values,
          callback: () => {
            this.onOff(false)
          }
        })
      })
    }
    /**
     * 错误类型选择器
     * @param values
     */
    const handleRadio = (values) => {
      this.setState({radioValue: values})
    }

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 3},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
      },
    };
    /**
     * 图片上传验证
     * @param file
     * @returns {boolean|boolean}
     */
    const beforeUpload = (file) => {
      const {setFields} = this.formRef.current;
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('格式不正确')
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片超出大小')
        return false
      }
    };

    const props = {
      name: 'file',
      action: '/auth/web/v1/questionMonitor/uploadFileQiNiuService',
      multiple: false,
      headers: {Authorization: token},
      accept: ".jpg,.jpeg,image/png"
    };


    /**
     * 改变loading状态
     * @param bool
     */
    const changeLoading = (bool) => {
      dispatch({
        type: namespace + '/set',
        payload: {
          loading: bool
        }
      })
    };

    /**
     * 这个是监听文件变化的
     * @param info
     */
    const fileChange = (info) => {
      const {code = '', msg = ''} = info.file.response ? info.file.response : {};


      /**
       * 改变文件件状态和加载状态
       * @param fileList
       * @param bool
       */
      const setStateAndLoading = (fileList, bool) => {
        // file.name=file.respond.name;
        this.setState({
          fileList
        }, () => {
          changeLoading(bool);
        })
      }
      // 正在上传
      if (info.file.status === 'uploading') {
        //必须存在这一步，不然状态会一直处于uploading状态
        setStateAndLoading(info.fileList, true)
      }
      if (info.file.status === 'done') {
        if (code === 200) {
          setStateAndLoading(info.fileList, false)
        } else {
          setStateAndLoading([], false)
          message.error(msg)
        }
      } else if (info.file.status === 'error') {
        setStateAndLoading([], false)
        message.error(`${info.file.name} 上传出错`);
      }
    }

    /**
     * 预览图片开关
     */
    const handlePreview = (bool) => this.setState({previewVisible: bool});

    /**
     * 文件列表的删除
     * @param file
     */
    const fileRemove = (file) => {
      this.setState(({fileList}) => {
        const index = fileList.indexOf(file);
        return {
          fileList: fileList.filter((_, i) => i !== index)
        }
      })
    }


    const uploadButton = (
      <div>
        <PlusOutlined/>
        <div style={{marginTop: 8}}>Upload</div>
      </div>
    );

    return (
      <Modal
        width={820}
        title="题目纠错"
        visible={isModalVisible}
        onOk={handleOk}
        confirmLoading={!!loading}
        onCancel={() => this.onOff(false)}>
        <div>

          <Form ref={this.formRef}>
            <FormItem
              label="错误类型"
              name="messageIds"
              {...formItemLayout}
              rules={[{
                required: true,
                message: "请选择错误类型"
              }]}>
              <Checkbox.Group onChange={handleRadio} value={radioValue}>
                {_QEMessageList.map(re => <Checkbox key={re.id} value={re.id}>{re.name}</Checkbox>)}
              </Checkbox.Group>
            </FormItem>
            <FormItem
              label="纠错说明"
              name="notes"
              {...formItemLayout}
              rules={[{
                required: true,
                message: "请输入纠错说明"
              }]}>
              <TextArea rows={4} maxLength={100}/>
            </FormItem>

            <FormItem
              label="纠错截图"
              name="imgUrl"
              {...formItemLayout}
              rules={[{
                required: true,
                message: "请导入纠错截图"
              }]}>
              <Upload
                listType="picture-card"
                {...props}
                beforeUpload={beforeUpload}
                fileList={fileList}
                onRemove={fileRemove}
                onPreview={() => handlePreview(true)}
                onChange={fileChange}
              >
                {fileList && fileList.length > 3 ? null : uploadButton}
              </Upload>
            </FormItem>
          </Form>
        </div>
        <Modal visible={previewVisible} footer={null} onCancel={() => handlePreview(false)}>
          <img alt="example" style={{width: '100%'}} src={fileList && fileList.length > 0 && fileList[0].thumbUrl}/>
        </Modal>
      </Modal>
    )

  }
}

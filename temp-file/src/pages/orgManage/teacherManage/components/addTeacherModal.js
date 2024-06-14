/**
 *@Author:ChaiLong
 *@Description: 添加修改教职工弹窗表单
 *@Date:Created in  2020/6/24
 *@Modified By:
 */
import React from 'react'
import {Modal, Spin, Form, Input, message} from 'antd'
import queryString from 'query-string'
import {connect} from 'dva'
import {ClassAndTeacherManage as namespace} from "@/utils/namespace";
import {replaceSearch} from "@/utils/utils";
import userInfoCaches from '@/caches/userInfo'


const FormItem = Form.Item;
// @Form.create({
//   mapPropsToFields: state => Form.createFormField(state)
// })
@connect(state => ({
  loading: state[namespace].loading
}))
export default class AddTeacherModal extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(...arguments);
    this.state = {
      modalData: {},
      modalVisible: false
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  /**
   * 提交添加修改教职工表单
   * @param e
   */
  handleModifySubmit = (e) => {
    e.preventDefault();
    this.formRef.current.validateFields().then(values=>{
      const {dispatch, location} = this.props;
      const {modalData} = this.state;
      const {userName, account} = values;
      const userInfo = userInfoCaches()
      const {search} = this.props.location;
      const query = queryString.parse(search);
      //添加教师和修改教师是不同接口和传入数据
      const data = modalData.id ?
        {
          teacherId: modalData.id,
          userName: userName
        }
        :
        {
          mobile: account,
          userName: userName,
          schoolId: userInfo.schoolId || 1,
        };
      dispatch({
        type: namespace + `${modalData.id ? '/updateTeacher' : '/addTeacher'}`,
        payload: data,
        callback: () => {
          this.setState({modalData: {}, modalVisible: false});
          message.success(`${modalData.id?'信息修改成功！':'教师添加成功！'}`);
          query.classId = 0;
          replaceSearch(dispatch, location, query);
        }
      });
    });
  };

  /**
   * 控制器，控制modal开关
   * @param state 0:关 1:开
   * @returns {function(...[*]=)}
   */
  controller = (state, record) => {
    //关闭modal重置form
    if (!state) {
      this.setState({modalVisible: false, fileList: [], modalData: {}});
      this.formRef.current.resetFields();
      return null
    }
    this.setState({modalVisible: true, modalData: record || {}});
  };


  render() {
    const {form, loading} = this.props;
    const {modalData, modalVisible} = this.state;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    return (
      <div>
        <Modal
          title={`${modalData.id ? '修改教职工信息' : '新增教职工帐号'}`}
          visible={modalVisible}
          onOk={this.handleModifySubmit}
          onCancel={() => this.controller(0)}
          okText="保存"
          cancelText="取消"
          wrapClassName="add-modal"
          confirmLoading={!!loading}
        >
          <Spin spinning={!!loading} delay={500}>
            <Form ref={this.formRef}>
              <FormItem
                {...formItemLayout}
                label="姓名"
                name={'userName'}
                rules={[{
                  required: true,
                  message: '请输入教职工姓名',
                  pattern: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,12}$/,
                }]}
                initialValue={modalData.userName}
              >
                  <Input placeholder="请输入教职工姓名"/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                name={'account'}
                initialValue={modalData.account}
                rules={[{
                  required: true,
                  len: 11,
                  pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
                  message: '请输入正确的手机号',
                }]}
                label="手机号">
                  <Input disabled={modalData.id} placeholder="请输入手机号" maxLength={11}/>
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      </div>
    )
  }
}

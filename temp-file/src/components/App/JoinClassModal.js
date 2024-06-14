/**
 * 加入班级弹窗
 * @author:张江
 * @date:2020年08月21日
 * @version:v1.0.0
 * */
import React from 'react';
import {
  Menu,
  Avatar,
  Dropdown,
  Modal,
  message,
  Button,
  Input,
  Select
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from "dva";
import { Public, HomeIndex } from "@/utils/namespace";
//引入样式
import styles from './JoinClassModal.less';
import { clear } from 'echarts/lib/util/throttle';

const { Option } = Select;

@connect(state => ({
  selectSubjectList: state[Public].selectSubjectList,//科目列表
}))

export default class JoinClassModal extends React.Component {
  static propTypes = {
    visibleJoinClass: PropTypes.bool,//是否显示弹窗
    handleJoinClassCancel: PropTypes.func,//关闭弹窗方法
    handleJoinClass: PropTypes.func,//加入班级
    loginUserInfo: PropTypes.object,//登录用户信息
    closable: PropTypes.bool,//是否显示右上角的关闭按钮
  };

  constructor() {
    super(...arguments);
    this.state = {
      commandValue: '',
      selectedSubject: '',
      isJoinClassing: false
    };
  }


  UNSAFE_componentWillMount() {
    // const { loginUserInfo = {} } = this.props
    // this.getSubjectList(loginUserInfo.studyId || 1);
  }

  /**
* 科目列表
* @param studyId  ：学段id
*/
  // getSubjectList(studyId) {
  //   const { dispatch, loginUserInfo = {} } = this.props;
  //   dispatch({
  //     type: Public + '/getAuthSubjectList',
  //     payload: {
  //       queryType: 1,
  //       studyId,
  //     },
  //     callback: (result) => {
  //       if (result && result.length > 0) {
  //         this.setState({
  //           selectedSubject: loginUserInfo.subjectId || result[0].id || '',
  //         })
  //       }

  //     }
  //   });
  // }

  /**
  * 科目列表
  * @param classCode  ：班级口令
  */
  getSubjectList(classCode) {
    const { dispatch } = this.props;
    if (!classCode) {
      message.warn('输入班级口令才能获取科目列表');
      return;
    }
    dispatch({
      type: Public + '/getSubjectByClassCode',
      payload: {
        classCode,
      },
      callback: (result) => {
        let selectedSubject = '';
        if (result && result.length > 0) {
          selectedSubject = result[0].id || ''
        }
        this.setState({
          selectedSubject,
        })
      }
    });
  }

  /**
  * 获取口令输入值
  * @param e  ：事件对象
  */
  onCommandChange = e => {
    this.setState({
      commandValue: e.target.value,
    })
  };

  /**
  * 失去焦点获取输入值
  * @param e  ：事件对象
  */
  onCommandBlur = (e) => {
    const { loginUserInfo = {} } = this.props;
    const { commandValue } = this.state
    this.setState({
      commandValue: commandValue,
    }, () => {
      if (loginUserInfo.code == "TEACHER") {//优化-只有任课老师加入班级时才去查询科目列表-2021年07月26日-张江
        this.getSubjectList(commandValue);
      }
    })
  }

  /**
  * 获取选择值
  * @param value  ：选择的科目id
  */
  handleSubjectChange = (value) => {
    this.setState({
      selectedSubject: value,
    })
  }

  /**
  * 加入班级操作
  */
  joinClassOper = () => {
    const { handleJoinClass, dispatch, loginUserInfo = {} } = this.props;
    const { selectedSubject, commandValue } = this.state;
    if (!commandValue) {
      message.warn('请输入班级口令');
      return;
    }
    if (!selectedSubject && loginUserInfo.code == "TEACHER") {//优化-只有任课老师加入班级时才去校验是否已选择科目-2021年07月26日-张江
      message.warn('请选择任教科目');
      return;
    }
    this.setState({
      isJoinClassing: true
    })
    dispatch({
      type: HomeIndex + '/userAddClassInfo',
      payload: {
        code: commandValue,
        subjectId: loginUserInfo.code == "TEACHER" ? selectedSubject : undefined,
      },
      callback: (result) => {
        this.setState({
          isJoinClassing: false,
        })
        if (result) {
          const returnJudge = window.$HandleAbnormalStateConfig(result);
          if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
          if (typeof result == 'object' && result.code && result.code != 200) {
            const messageTip = result.msg || result.alert || '加入班级失败';
            Modal.warning({ title: '提示信息', content: messageTip });
          } else {
            this.setState({
              commandValue: '',
              selectedSubject: '',
            })
            message.success('加入班级成功');
            handleJoinClass(commandValue, selectedSubject)
          }
        }
      }
    });

    this.outTimer = setTimeout(() => {//定时器处理加载中
      this.setState({
        isJoinClassing: false,
      }, () => {
        clearTimeout(this.outTimer);//清除定时器
      })
    }, 1500)

  }

  render() {
    const {
      visibleJoinClass,
      handleJoinClassCancel,
      selectSubjectList = [],
      loginUserInfo = {},
      closable
    } = this.props;
    const { selectedSubject, isJoinClassing } = this.state;

    return (
      <Modal
        title=""
        footer={null}
        maskClosable={false}
        visible={visibleJoinClass}
        onCancel={handleJoinClassCancel}
        closable={closable}
        width={380}
      >
        {
          visibleJoinClass ? <div className='join-class-modal'>
            <h3 className='title'>加入班级</h3>
            <div className='basic-info'>
              <div className='info'>
                <label className='label-title'>输入班级口令</label>
                <Input placeholder="请输入班级口令" onChange={this.onCommandChange} onBlur={this.onCommandBlur} />
                <p className='input-desc'>注：请联系班主任或者管理员拿班级唯一口令</p>
              </div>
              {
                loginUserInfo.code == "TEACHER" ? <div className='info'>
                  <label className='label-title'>选择任教科目(输入班级口令点击可查询)</label>
                  <div className='select-box'>
                    <Select value={String(selectedSubject) || undefined} placeholder='请选择任教科目' style={{ width: '100%' }} onChange={this.handleSubjectChange}>
                      {
                        Array.isArray(selectSubjectList) && selectSubjectList.map(item => <Option key={item.id} value={String(item.id)}>{item.name}</Option>)
                      }
                    </Select>
                  </div>
                </div> : null
              }
              <Button type="primary" loading={isJoinClassing} className='join-class-oper' onClick={this.joinClassOper}>{isJoinClassing ? '正在加入,请稍候...' : '加入班级'}</Button>
            </div>
          </div>
            : null
        }
      </Modal>
    )
  }
}

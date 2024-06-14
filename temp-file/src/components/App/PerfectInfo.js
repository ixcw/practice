/**
 * 完善信息弹窗
 * @author:张江
 * @date:2021年08月24日
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
import { Public, HomeIndex, Auth } from "@/utils/namespace";
import { streamArray } from "@/utils/const";
import { existArr } from "@/utils/utils";
//引入样式
import styles from './PerfectInfo.less';

const { Option } = Select;

@connect(state => ({
  gradeList: state[Public].gradeList,//年级列表
}))

export default class PerfectInfo extends React.Component {
  static propTypes = {
    visiblePerfectInfo: PropTypes.bool,//是否显示弹窗
    handlePerfectInfoCancel: PropTypes.func,//关闭弹窗方法
    handlePerfectInfo: PropTypes.func,//完善信息
    loginUserInfo: PropTypes.object,//登录用户信息
    closable: PropTypes.bool,//是否显示右上角的关闭按钮
  };

  constructor() {
    super(...arguments);
    this.state = {
      isPerfectInfoLoading: false,
      gradeId: '',
      subjectType: streamArray[0].code,
      // schoolId: '',
      schoolValue: '',
      // professionalIdArray: []
      professionalValue: '',

      isShowProfessionalList: false,
    };
  }


  UNSAFE_componentWillMount() {
    this.getGradeList();
  }

  /**
  * 完善信息操作
  */
  perfectInfoOper = () => {
    const { handlePerfectInfo, dispatch, loginUserInfo = {},handleJoinClassCancel } = this.props;
    const {
      gradeId,
      subjectType,
      schoolValue,
      professionalValue
    } = this.state;
    if (!gradeId) {
      message.warn('请选择年级');
      return;
    }
    const isTopUp = gradeId == 17;//是否专升本
    if (!subjectType && isTopUp) {
      message.warn('请选择专业类型');
      return;
    }
    // if (!schoolId && isTopUp) {
    //   message.warn('请选择报考学校');
    //   return;
    // }
    // if (professionalIdArray.length<1 && isTopUp) {
    //   message.warn('请选择报考专业');
    //   return;
    // }
    if (!schoolValue && isTopUp) {
      message.warn('请输入报考学校');
      return;
    }
    if (!professionalValue && isTopUp) {
      message.warn('请输入报考专业名称');
      return;
    }
    this.setState({
      isPerfectInfoLoading: true
    })
    const payload = isTopUp ? {
      gradeId,
      subjectType,
      schoolName: schoolValue,
      majorName: professionalValue,
    } : {
      gradeId,
    }
    dispatch({
      type: Auth + '/saveStudentGrade',
      payload: {
        ...payload,
      },
      callback: (result) => {
        this.setState({
          isPerfectInfoLoading: false,
        })
        // if (result) {
          const returnJudge = window.$HandleAbnormalStateConfig(result);
          if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
        if (typeof result == 'object' && result && result.code && result.code != 200) {
            const messageTip = result.msg || result.alert || '完善信息失败';
            Modal.warning({ title: '提示信息', content: messageTip });
          } else {
            // this.setState({
            //   gradeId: '',
            //   subjectType: '',
            //   schoolValue: '',
            //   professionalValue: ''
            // })
            message.success('已成功完善信息');
            // dispatch({ type: Auth + '/userAccessToken', });//完善注册信息后刷新token 仅刷新后台缓存数据 
            handlePerfectInfo(payload)
          }
        // }
      }
    });

    this.outTimer = setTimeout(() => {//定时器处理加载中
      this.setState({
        isPerfectInfoLoading: false,
      }, () => {
        clearTimeout(this.outTimer);//清除定时器
      })
    }, 1500)

  }

  /**
 * 年级列表
 */
  getGradeList() {
    const { dispatch } = this.props;
    dispatch({
      type: Public + '/getGradeList',
      payload: {},
      callback: (result) => {
        let gradeId = '';
        if (result && result.length > 0) {
          gradeId = result[result.length - 1].id || ''
        }
        this.setState({
          gradeId,
        })
      }
    });
  }
  /**
  * 获取选择值
  * @param value  ：选择的年级id
  */
  handleGradeChange = (value) => {
    this.setState({
      gradeId: value,
    })
  }

  /**
* 获取选择值
* @param value  ：选择的科目id
*/
  handleSubjectChange = (value) => {
    this.setState({
      subjectType: value,
    })
  }
  //   /**
  // * 获取选择值
  // * @param value  ：选择的学校id
  // */
  //   handleSchoolChange = (value) => {
  //     this.setState({
  //       schoolId: value,
  //     })
  //   }

  /**
  * 获取学校输入值
  * @param e  ：事件对象
  */
  onSchoolChange = e => {
    this.setState({
      schoolValue: e.target.value,
    })
  };

  //   /**
  // * 获取选择值
  // * @param value  ：选择的科目id
  // */
  //   handleProfessionalChange = (value) => {
  //     this.setState({
  //       professionalIdArray: value,
  //     })
  //   }

  /**
  * 获取专业输入值
  * @param e  ：事件对象
  */
  onProfessionalChange = e => {
    this.setState({
      professionalValue: e.target.value,
    })
  };
  /**
* 回车获取专业输入值
* @param e  ：事件对象
*/
  onInputPressEnter = (e) => {
    this.setState({
      professionalValue: e.target.value,
      isShowProfessionalList: true,
    })
  }

  /**
* 点击获取专业名称
* @param name  ：专业名称
*/
  selectProfessional = (name) => {
    this.setState({
      professionalValue: name,
      isShowProfessionalList: false,
    })
  }

  render() {
    const {
      visiblePerfectInfo,
      handlePerfectInfoCancel,
      gradeList = [],
      // loginUserInfo = {},
      closable = false,
      professionalList = [
        // {
        //   name: '计算机1计算机1计算机1计算机1计算机1计算机1计算机1计算机1计算机1计算机1计算机1计算机1'
        // }, {
        //   name: '计算机2'
        // },
      ]
    } = this.props;
    const {
      gradeId,
      isPerfectInfoLoading,
      subjectType,
      schoolId,
      professionalIdArray,
      isShowProfessionalList,
      professionalValue
    } = this.state;

    return (
      <Modal
        title=""
        footer={null}
        maskClosable={false}
        visible={visiblePerfectInfo}
        onCancel={handlePerfectInfoCancel}
        closable={closable}
        width={480}
      >
        {
          visiblePerfectInfo ? <div className='perfect-info-modal'>
            <h3 className='title'>完善信息</h3>
            <div className='basic-info'>
              <div className='info'>
                <label className='label-title'>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级 :</label>
                <div className='select-box'>
                  <Select value={String(gradeId) || undefined} placeholder='请选择年级' style={{ width: '100%' }} onChange={this.handleGradeChange}>
                    {
                      Array.isArray(gradeList) && gradeList.map(item => <Option key={item.id} value={String(item.id)}>{item.name}</Option>)
                    }
                  </Select>
                </div>
              </div>
              {
                gradeId == 17 ? [//专升本
                  <div className='info' key="subject">
                    <label className='label-title'>分&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类 :</label>
                    <div className='select-box'>
                      <Select value={String(subjectType) || undefined} placeholder='请选择专业类型' style={{ width: '100%' }} onChange={this.handleSubjectChange}>
                        {
                          Array.isArray(streamArray) && streamArray.map(item => <Option key={item.code} value={String(item.code)}>{item.name}</Option>)
                        }
                      </Select>
                    </div>
                  </div>,
                  // <div className='info' key="school">
                  //   <label className='label-title'>报考学校 :</label>
                  //   <div className='select-box'>
                  //     <Select value={String(schoolId) || undefined} placeholder='请选择报考学校' style={{ width: '100%' }} onChange={this.handleSchoolChange}>
                  //       {
                  //         Array.isArray(gradeList) && gradeList.map(item => <Option key={item.id} value={String(item.id)}>{item.name}</Option>)
                  //       }
                  //     </Select>
                  //   </div>
                  // </div>,
                  // <div className='info' key="professional">
                  //   <label className='label-title'>报考专业 :</label>
                  //   <div className='select-box'>
                  //     <Select mode="multiple" value={professionalIdArray} placeholder='请选择报考专业' style={{ width: '100%' }} onChange={this.handleProfessionalChange}>
                  //       {
                  //         Array.isArray(gradeList) && gradeList.map(item => <Option key={item.id} value={String(item.id)}>{item.name}</Option>)
                  //       }
                  //     </Select>
                  //   </div>
                  // </div>
                  <div className='info' key="school">
                    <label className='label-title'>报考学校 :</label>
                    <Input placeholder="请输入报考学校" onChange={this.onSchoolChange} />
                  </div>,
                  <div className='info input-select-box' key="professional">
                    <label className='label-title'>报考专业 :</label>
                    <Input
                      // placeholder="请输入报考专业名称（回车即可检索）"
                      placeholder="请输入报考专业名称"
                      value={professionalValue}
                      onChange={this.onProfessionalChange}
                      onPressEnter={this.onInputPressEnter}
                    />
                    {
                      isShowProfessionalList && existArr(professionalList) ? <div className="input-select-list">
                        <div className='list-item' onClick={() => { this.setState({ isShowProfessionalList: false }) }} >保留输入({professionalValue})</div>
                        {professionalList.map((item) => {
                          return (<div className='list-item' onClick={() => { this.selectProfessional(item.name) }} dangerouslySetInnerHTML={{ __html: professionalValue ? String(item.name).replace(professionalValue, `<span style="color: #ff4843">${professionalValue}</span>`) : item.name }}></div>);
                        })}
                      </div> : null
                    }
                  </div>,
                ] : null
              }
              <Button type="primary" loading={isPerfectInfoLoading} className='perfect-info-oper' onClick={this.perfectInfoOper}>{isPerfectInfoLoading ? '正在完善,请稍候...' : '完善信息'}</Button>
            </div>
          </div>
            : null
        }
      </Modal>
    )
  }
}

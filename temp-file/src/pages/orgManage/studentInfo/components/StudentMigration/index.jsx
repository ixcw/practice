/**
 * 学生迁移抽屉组件
 * @author:张江
 * date:2020年09月10日
 * */
import React, { Component } from 'react';
import { connect } from "dva";
import queryString from 'query-string';
import {
  Drawer,
  Button,
  Transfer,
  Select,
  Icon,
  Input,
  message,
  Modal
} from 'antd';
import PropTypes from 'prop-types';

import { getIcon, doHandleYear } from "@/utils/utils";
import { StudentMange as namespace } from '@/utils/namespace';
import styles from './index.less';
import LearningLevel from '@/components/LearningLevel/index';

const IconFont = getIcon();
const { Option, OptGroup } = Select;

@connect(state => ({
  optionalClassList: state[namespace].optionalClassList,//班级列表
  classStudentInfo: state[namespace].classStudentInfo,//班级下的学生信息
  targetClassStudentList: state[namespace].targetClassStudentList,//班级下的学生信息
  loading: state[namespace].loading,//迁移显示加载中
}))

export default class StudentMigration extends Component {

  static propTypes = {
    topDrawerVisible: PropTypes.bool || false,//是否显示
    onCloseStudentMigration: PropTypes.func,//关闭操作
    gradeList: PropTypes.any,//年级列表
    studyAndGradeList: PropTypes.any,//学段年级列表
    getOptionalClassList: PropTypes.func,//获取班级列表
    saveStudentMigration: PropTypes.func,//保存学生班级迁移的方法
  };

  constructor(props) {
    super(...arguments);
    this.state = {
      childrenDrawer: false,
      targetKeys: [],//目标班级学生id
      selectedKeys: [],
      disabled: false,

      mLearningLevelCode: doHandleYear(),

      gradeCode: '',
      targetStudentList: [],
      classCode: '',//目标班级id

      leftMoveKeys: [],
    };
  };

  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true,
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
  };


  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
    if (direction == 'right') {
      this.setState({
        leftMoveKeys: [],//向左侧移动数据
      })
    } else {
      this.setState({
        leftMoveKeys: moveKeys,//向左侧移动数据
      })
    }

  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    const { classCode } = this.state;
    if (!classCode) {
      message.warning('请先选择目标班级');
      return;
    }
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  /**
* 班级迁移-选择学级
* @param mLearningLevelCode  ：学级code
*/
  handleLearningLevelChange = (mLearningLevelCode) => {
    const { getOptionalClassList } = this.props
    this.setState({
      mLearningLevelCode,
    })

    getOptionalClassList(mLearningLevelCode)
  }


  /**
* 选择班级
* @param classCode  ：班级id
*/
  handleClassChange = (classCode) => {
    this.setState({
      classCode,
    })
    this.getStudentList(classCode);
  }

  /**
   * 获取学生列表
   * @param classId  ：班级id
   */
  getStudentList = (classId) => {
    const {
      dispatch,
    } = this.props;

    dispatch({
      type: namespace + '/getTargetClassStudentList',
      payload: {
        classId: classId,
      },
      callback: (result) => {
        const { studentList = [] } = result || {};
        let targetKeys = [];
        studentList.map((item) => {
          targetKeys.push(item.id)
        })
        this.setState({
          targetKeys,
          targetStudentList: studentList
        })
      }

    });
  }

  /**
* 选择年级
* @param gradeCode  ：年级id
*/
  handleGradeChange = (gradeCode) => {
    this.setState({
      gradeCode,
    })
  }


  /**
* 获取班级名称
* @param e  ：事件
*/
  handleCLassName = (e) => {
    this.setState({
      className: e.target.value,
    })
  }

  /**
  * 新增保存班级信息
  */
  saveClassInfo = () => {
    const {
      dispatch,
      getOptionalClassList,
      location,
      gradeList,
      // getStudentClassList
      loginUserInfo
    } = this.props;
    const { mLearningLevelCode, gradeCode, className } = this.state
    const { search } = location;
    const query = queryString.parse(search);
    let gradeId = gradeCode ? gradeCode : (gradeList && gradeList[0] ? gradeList[0].id : '')
    if (loginUserInfo && loginUserInfo.schoolId) {
      let schoolId = loginUserInfo.schoolId;
      let gradeName = ''
      for (let i = 0; i < gradeList.length; i++) {
        if (gradeId == gradeList[i].id) {
          gradeName = gradeList[i].name;
          break;
        }
      }
      dispatch({
        type: namespace + '/saveClassInfo',
        payload: {
          schoolId: schoolId,
          gradeId: gradeId,
          shortName: className,
          fullName: `${mLearningLevelCode}级${gradeName}${className}班`,
          studyYear: mLearningLevelCode
        },
        callback: (result) => {
          message.success('保存班级成功');
          this.onChildrenDrawerClose();
          getOptionalClassList(mLearningLevelCode);//当前页获取班级列表
        }

      });
    } else {
      message.warning('请选择机构');
      return
    }

  }

  /**
  * 保存学生迁移数据
  */
  saveTransferData = () => {
    const { classStudentInfo, saveStudentMigration, onCloseStudentMigration, location, loginUserInfo } = this.props;
    const { classId, studentList = [], fullName } = classStudentInfo || {};
    const { search } = location;
    const query = queryString.parse(search);
    const { classCode, targetKeys = [], leftMoveKeys = [], selectedKeys } = this.state;
    if (!classCode) {
      message.warning('不存在目标班级');
      return;
    }

    const callback = () => {
      onCloseStudentMigration();
      this.setState({
        targetKeys: [],
        leftMoveKeys: [],
        classCode: ''
      })
    }

    // 获取原班级的学生id
    let sourceKeys = studentList.map((item) => {
      return item.id
    })
    // 都是同样的数据类型 所以使用filter去重数组
    sourceKeys = [...sourceKeys, ...leftMoveKeys].filter(function (item, index, array) {
      return array.indexOf(item) === index;
    });
    targetKeys.map((item) => {
      sourceKeys.map((sItem, index) => {
        if (sItem == item) {
          delete sourceKeys[index]
        }
      })
    })
    // 获取操作之后的左侧班级的学生id
    sourceKeys = sourceKeys.filter(item => item).map((item) => {
      return item
    })

    let payload = {
      leftClassId: classId,
      leftStudentIds: sourceKeys,
      rightClassId: classCode,
      rightStudentIds: targetKeys,
    };
    if (loginUserInfo && loginUserInfo.schoolId) {
      let schoolId = loginUserInfo.schoolId;
      payload.schoolId = schoolId;
      if (selectedKeys.length > 0) {
        Modal.confirm({
          title: '提示信息',
          content: `还存在未迁移的学生,是否确认保存？`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            saveStudentMigration(payload, callback)
          }
        });
      } else {
        saveStudentMigration(payload, callback)
      }
    } else {
      message.warning('请选择机构');
      return
    }
  }

  /**
* 页面组件即将卸载时：清空数据
*/
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const {
      topDrawerVisible,
      onCloseStudentMigration,
      optionalClassList,
      gradeList,
      studyAndGradeList,
      classStudentInfo,
      targetClassStudentList,
      loading
    } = this.props;
    const { targetKeys, selectedKeys, mLearningLevelCode, gradeCode, targetStudentList } = this.state;
    const { classId, studentList = [], fullName } = classStudentInfo || {};
    const { fullName: targetFullName = '' } = targetClassStudentList || {};

    const tempStudentList = [...studentList, ...targetStudentList].map((item) => {
      return {
        ...item,
        key: item.id,
        title: item.userName || '',
      }
    })

    return (
      <Drawer
        className={'student-migration-box'}
        title={<div>
          <IconFont type={'icon-shujuqianyi'} />
          <span> 学生迁移</span>
        </div>}
        width={660}
        closable={false}
        onClose={onCloseStudentMigration}
        visible={topDrawerVisible}
      >

        <div>
          <Transfer
            dataSource={tempStudentList}
            titles={[fullName, `${targetFullName ? targetFullName + '(新班级)' : ''}`]}
            listStyle={{
              width: 280,
              height: 600,
            }}
            showSearch={true}
            locale={{ itemUnit: '名', itemsUnit: '名', searchPlaceholder: '请输入搜索内容' }}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            // onScroll={this.handleScroll}
            render={item => item.title}
          />
        </div>

        <div className={'class-info-box'}>
          <div className={'class-info-title'}>
            班级信息
            </div>
          <div className={'class-form-box'}>
            <LearningLevel
              learningLevelCode={mLearningLevelCode}
              selectedLearningLevelCodeChange={this.handleLearningLevelChange}
            />
            <div>
              <label>班级：</label>
              {
                optionalClassList ? <Select
                  // defaultValue={optionalClassList && optionalClassList[0] && optionalClassList[0].id != classId ? optionalClassList[0].id : ''}
                  style={{ width: 240 }}
                  onChange={this.handleClassChange}>
                  {
                    optionalClassList && optionalClassList.filter(item => item.id != classId).map((item) => {
                      return (<Option key={item.id} value={item.id}>{item.fullName}</Option>)
                    })
                  }
                </Select> : null
              }
              <Icon type="plus-circle" className='plus-circle' onClick={this.showChildrenDrawer} />
            </div>
          </div>
        </div>


        <Drawer
          className='children-drawer'
          title={<div>
            <IconFont type={'icon-xinzeng'} />
            <span> 新增班级</span>
          </div>}
          width={360}
          closable={false}
          onClose={this.onChildrenDrawerClose}
          visible={this.state.childrenDrawer}
        >
          <div className='add-class-info'>
            <LearningLevel
              learningLevelCode={mLearningLevelCode}
              selectedLearningLevelCodeChange={this.handleLearningLevelChange}
            />
            <div>
              <label>年级：</label>
              <Select
                defaultValue={gradeList && gradeList[0] ? gradeList[0].id : ''}
                style={{ width: 160 }}
                onChange={this.handleGradeChange}>
                {
                  studyAndGradeList && studyAndGradeList.map((item) => {
                    return (
                      <OptGroup label={item.studyName} key={item.studyId}>
                        {
                          item.gradeList && item.gradeList.map((item) => {
                            return (
                              <Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>
                            )
                          })
                        }
                      </OptGroup>
                    )
                  })
                }
              </Select>
            </div>

            <div>
              <label>班级：</label>
              <Input
                addonAfter="班"
                placeholder="请输入班级"
                style={{ width: '160px' }}
                onChange={this.handleCLassName}
              />
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
              onClick={this.onChildrenDrawerClose}
            >
              取消
            </Button>
            <Button loading={loading} onClick={this.saveClassInfo} type="primary">
              保存
            </Button>
          </div>
        </Drawer>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
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
            onClick={onCloseStudentMigration}
          >
            取消
            </Button>
          <Button loading={loading} onClick={this.saveTransferData} type="primary">
            保存
            </Button>
        </div>
      </Drawer>
    )
  }
}

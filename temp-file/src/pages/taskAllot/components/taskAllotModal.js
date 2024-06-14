/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/12/4
 *@Modified By:
 */
import React from 'react'
import {Modal, Checkbox, Spin, Row, Col, message} from 'antd'
import styles from './taskAllotModal.less'
import {connect} from 'dva'
import {TaskAllot as namespace} from '@/utils/namespace'
import {existArr} from "@/utils/utils";

@connect(state => ({
  initTaskAllocation: state[namespace].initTaskAllocation,//任务分配知识点初始化
  loading: state[namespace].loading
}))
export default class TaskAllotModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberRecord: {},//组员的信息
      checkedList: [],//选择项
      isModalVisible: false,
      foldStatus: '',//折叠框状态
      sum: 0,//小知识点总数
      pontIdAndCount: [],//知识点id和数量
      initTaskAllocation: [],//任务分配知识点初始化
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {initTaskAllocation} = nextProps;
    const {initTaskAllocation: stInitTaskAllocation} = prevState;
    const _initTaskAllocation = existArr(initTaskAllocation);
    const reString = (obj) => JSON.stringify(obj);

    //判断initTaskAllocation是否有更新，有更新则放入state
    if (_initTaskAllocation && reString(_initTaskAllocation) !== reString(stInitTaskAllocation)) {
      /**
       * 返回默认被选中的知(识点)，(数量)，以及(所有知识点id和数量)对象方便计算
       * @param arr
       * @returns {{pontIdAndCount: [], defaultValue: [], defaultSum: number}}
       */
      const getDefaultCheckValue = (arr) => {
        let defaultValue = [];//默认知识点
        let defaultSum = 0;//默认总知识点数
        let pontIdAndCount = [];
        if (existArr(arr)) {
          arr.map(re => {
            if (existArr(re.knowledgeData)) {
              re.knowledgeData.map(r => {
                r.count && pontIdAndCount.push({knowId: r.knowId, count: r.count})
                if (r.option === 1) {
                  defaultSum = defaultSum + (r.count || 0);
                  defaultValue.push(r.knowId)
                }
              })
            }
          })
        }
        return {defaultValue, defaultSum, pontIdAndCount}
      }
      let {defaultValue, defaultSum, pontIdAndCount} = getDefaultCheckValue(_initTaskAllocation);
      return {initTaskAllocation, checkedList: defaultValue, sum: defaultSum, pontIdAndCount}
    }
    return {}
  }


  /**
   *  modal开关
   * @param status
   */
  switchForTaskAllot = (status) => {
    let objStatus = {};
    //关闭清空
    if (!status) {
      objStatus = {
        memberRecord: {},
        checkedList: [],
        foldStatus: '',
        initTaskAllocation: []
      }

      this.props.dispatch({
        type: namespace + '/set',
        payload: {
          initTaskAllocation: []
        }
      })
    }
    objStatus.isModalVisible = status;
    this.setState(objStatus)
  }

  /**
   * 打开任务分配并且初始化
   * @param obj
   */
  openTaskAllot = (obj) => {
    this.switchForTaskAllot(true)
    this.setState({memberRecord: obj})
  }

  render() {
    const {isModalVisible, foldStatus, checkedList, memberRecord, initTaskAllocation, pontIdAndCount, sum} = this.state;
    const {loading, dispatch, query = {}} = this.props;
    const _initTaskAllocation = existArr(initTaskAllocation);


    /**
     * 点击选择器
     * @param checkedList
     */
    const checkKnowledgePrint = (checkedList) => {
      let sum = 0;
      //判断如果有选中则计算出总数
      if (existArr(checkedList)) {
        pontIdAndCount.map(re => {
          if (checkedList.includes(re.knowId)) {
            sum += (re.count || 0)
          }
        })
      }
      this.setState({checkedList, sum})
    }

    /**
     * 多级可折叠开关
     * @param index
     */
    const foldSwitch = (index) => {
      let _foldStatus = ''
      if (foldStatus.includes(index + '')) {
        _foldStatus = foldStatus.split(index + '').sort().join('');//去掉index后排序
      } else {
        _foldStatus = foldStatus + index;
      }
      this.setState({foldStatus: _foldStatus})
    }


    /**
     * 提交任务
     */
    const submitTask = () => {
      dispatch({
        type: namespace + '/taskAllocation',
        payload: {
          id: memberRecord.userId,
          expertGroupId: memberRecord.expertGroupId,
          knowIds: checkedList.join(',')
        },
        callback: (resolve) => {
          message.success(resolve)
          let date = new Date();
          dispatch({
            type: namespace + '/countTask',
            payload: {
              size: 10,
              page: query.p || 1,
              yearMonth: query.yearMonth || `${date.getFullYear()}-${date.getMonth() + 1}`
            }
          })
          this.switchForTaskAllot(false)
        }
      })
    }

    return (<div className={styles['taskAllotModal']}>
      <Modal
        className='taskAllotModal'
        title="分配任务"
        visible={isModalVisible}
        width={'80%'}
        confirmLoading={!!loading}
        onOk={submitTask}
        onCancel={() => this.switchForTaskAllot(false)}
      >
        <Spin spinning={!!loading}>
          {_initTaskAllocation ?
            <div>
              <Checkbox.Group value={checkedList} onChange={checkKnowledgePrint}>
                {
                  _initTaskAllocation.map((re, index) => (
                    <div key={index}>
                      <div className='titleLine' onClick={() => foldSwitch(index)}>
                        <span className={`${foldStatus.includes(index + '') ? 'foldFlagOpen' : ''}`}>></span>
                        <span>&nbsp;{re.pointLName}</span>
                      </div>
                      <Row className={`knowledgeRow ${foldStatus.includes(index + '') ? 'foldFlagOpenRow' : ''}`}>
                        {existArr(re.knowledgeData) ? re.knowledgeData.map(currentValue => (
                          <Col span={8} key={currentValue.knowId}>
                            <Checkbox
                              value={currentValue.knowId}>
                              {currentValue.pointMName}
                              <span style={{color: 'red'}}>{`(${currentValue.count || 0})`}</span>
                            </Checkbox>
                          </Col>
                        )) : ''}
                      </Row>
                    </div>
                  ))
                }
              </Checkbox.Group>
              <span style={{color: 'red'}}>{`总计题目数量${sum}`}</span>
            </div> : '暂无数据'}
        </Spin>
      </Modal>
    </div>)
  }
}

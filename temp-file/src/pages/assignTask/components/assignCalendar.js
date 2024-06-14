/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/8/26
 *@Modified By:
 */
import React from 'react'
import {Modal, Calendar, Badge} from 'antd'
import styles from "./addTask.less";
import {connect} from 'dva'
import {getCurrentMonthLast, dateFormat, existArr, dealTimestamp} from '@/utils/utils'
import {AssignTask as namespace} from '@/utils/namespace'

@connect(state => ({}))
export default class AssignCalendar extends React.Component {
  state = {
    visible: false,
    listData: {},
    month: ''
  };

  componentDidMount() {
    //将ref暴露给父级
    this.props.onRef(this)
    this.setState({
      month: dealTimestamp(new Date(), 'MM')
    })
  }


  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  /**
   * 数组对象中的当月日期相同的放入到数组中
   * @param d  数组对象
   * @returns {{}} {1:[],2:[]}
   */
  timeArrData = d => {
    const obj = {}
    const data = existArr(d) ? [...d] : []
    const monthArr = [...new Set(data.map(re => {
      let day = dealTimestamp(re.createTime, 'DD')
      let month = dealTimestamp(re.createTime, 'MM')
      re.day = day
      re.month = month
      return day
    }))];//将月份放入数组然后去重
    data.map(item => {
      monthArr.map(re => {
        if (item.day == re) {
          if (obj[re]) {
            obj[re].push({name: item.name, month: item.month})
          } else {
            obj[re] = [{name: item.name, month: item.month}]
          }
        }
      })
    })
    return obj
  }

  /**
   * 开关
   * @param state
   */
  onOff = (state) => {
    //开启操作
    const on = (bool) => {
      this.setState({visible: bool})
      this.props.dispatch({
        type: namespace + '/getDayWorkLists',
        payload: {
          paperTypeIds: '1,2,3',
          endTime: dateFormat('YYYY-mm-dd HH:MM', getCurrentMonthLast())
        },
        callback: (response) => {
          this.setState({listData: this.timeArrData(response)})
        }
      })
    }
    //关闭操作
    const off = (bool) => {
      this.setState({visible: bool})
    }
    //控制开关
    switch (state) {
      case true:
        on(state)
        break;
      case false:
        off(state)
        break;
      default:
    }
  }

  render() {
    const {visible} = this.state;

    /**
     * 根据日期返回列表
     * @param value
     * @returns {*[]}
     */
    const getListData = (value) => {
      const {listData, month} = this.state;
      let day = value.date()
      if (dealTimestamp(value, 'MM') == month) {
        if (day < 10) {
          day = `0${day}`
        }
      }
      return listData[day] || [];
    }

    /**
     * 渲染日期
     * @param value
     * @returns {*}
     */
    const dateCellRender = (value, month) => {
      const listData = getListData(value);
      const _listData=existArr(listData)?[...listData]:undefined
      let tag=''
      if(_listData&&(dealTimestamp(value, 'MM')==listData[0].month)){
          tag=(<ul className="events">
            {listData.map((item, index) => {
              return (
                <li key={index}>
                  <Badge status={'success'} text={item.name}/>
                </li>
              )
            })}
          </ul>)
      }
      return tag;
    }
    /**
     * 日期面板变化获取当前月的任务信息
     * @param value
     */
    const onPanelChange = (value) => {
      this.props.dispatch({
        type: namespace + '/getDayWorkLists',
        payload: {
          paperTypeIds: '1,2,3',
          endTime: dateFormat('YYYY-mm-dd HH:MM', getCurrentMonthLast(`${value.format('YYYY-MM-DD')} 00:00`))
        },
        callback: (response) => {
          this.setState({listData: this.timeArrData(response), month: dealTimestamp(value, 'MM')})
        }
      })
    }


    return (
      <Modal
        title="日历"
        onOk={this.handleOk}
        className={styles['componentAddTaskModal']}
        visible={visible}
        width={'80%'}
        footer={null}
        onCancel={() => this.onOff(false)}
      >
        <Calendar className={styles['calendar']} onPanelChange={onPanelChange}
                  dateCellRender={(value) => dateCellRender(value, this.state.month)}/>
      </Modal>
    )
  }
}

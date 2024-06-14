/**
 *@Author:ChaiLong
 *@Description: 作业批改
 *@Date:Created in  2020/8/27
 *@Modified By:
 *----------------------------------------- 2021-10-08添加布置对象-xiongwei------------------------ 
 */
import React from 'react'
import styles from './index.less'
import {Button, Pagination, Empty, Spin, Checkbox, Popover} from 'antd'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import queryString from 'query-string'
import {TaskCorrect as namespace, TopicManage} from '@/utils/namespace'
import {existArr, existObj, pushNewPage, replaceSearch, dealTimestamp} from '@/utils/utils'
import paginationConfig from "@/utils/pagination";
import userInfoCache from "@/caches/userInfo";


const CheckboxGroup = Checkbox.Group;
@connect(state => ({
  getWorkListsByUserId: state[namespace].getWorkListsByUserId,//未批改任务列表
  loading: state[namespace].loading
}))
export default class TaskCorrect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentName: [],//学生列表
      popoverVisible: '',//气泡开关
    }
  }

  render() {
    const {dispatch, location, getWorkListsByUserId, loading} = this.props;
    const {search, pathname} = existObj(location) ? {...location} : {};
    const {studentName = [], popoverVisible = false} = this.state;
    const query = existObj(queryString.parse(search)) ? {...queryString.parse(search)} : {};
    const paperType = query.paperType ? query.paperType.split(",") : [];
    const {data: _getWorkListsByUserId, total} = existObj(getWorkListsByUserId) ? {...getWorkListsByUserId} : {}
    const options = [
      {label: '作业', value: '1'},
      {label: '测验', value: '2'},
      {label: '考试', value: '3'},
    ];

    //批改跳转
    const handleCorrect = (record, status) => {
      dispatch(routerRedux.push({
        pathname: '/correctJob',
        search: queryString.stringify({jobId: record.jobId, jobType: record.jobType, isCorrect: status || undefined})
      }));
    };

    //列表分页、排序、筛选变化时触发
    const handleTableChange = (page) => {
      let query = queryString.parse(search);
      query = {...query, p: page};
      //修改地址栏最新的请求参数
      dispatch(routerRedux.push({
        pathname,
        search: queryString.stringify(query),
      }));
    };

    /**
     * 任务批阅筛选
     * @param list
     */
    const onChange = list => {
      let paperType = list.join(",")
      query.paperType = paperType
      query.p = 1
      replaceSearch(dispatch, location, {...query})
    };

    /**
     * 显示隐藏回调
     *@param  visible
     *@param  record
     */
    const visibleCallback = (visible, record) => {
      if (visible) {
        dispatch({
          type: namespace + '/getNotCompleteStudentInfo',
          payload: {
            jobId: record.jobId
          },
          callback: (re) => {
            this.setState({studentName: re})
          }
        })

      }
    }

    /**
     * 卡片展示内容
     * @param nameArr
     * @returns {JSX.Element}
     */
    const content = (nameArr) => (<div>
      {nameArr.map(re => <p key={re}>{re}</p>)}
    </div>)

    /**
     * 气泡开关
     * @param visible
     * @param record
     */
    const handleVisibleChange = (visible, record) => {
      if (visible) {
        dispatch({
          type: namespace + '/getNotCompleteStudentInfo',
          payload: {
            jobId: record.jobId
          },
          callback: (re) => {
            this.setState({studentName: re, popoverVisible: record.jobId})
          }
        })
      } else {
        this.setState({studentName: [], popoverVisible: ''})
      }
    };


    //完成人数统计
    const studentState = (record, type) => {
      const totalNum = parseInt(record.totalNum, 10);//总人数
      const count = record[type] ? parseInt(record[type], 10) : 0
      const typeArr = [
        {name: `${type == 'submitNum' ? '已完成' : '已批阅'}`, num: count},
        {
          name: `${type == 'submitNum' ? '未完成' : '未批阅'}`,
          num: (totalNum - count) ? (totalNum - count) : 0
        }
      ]
      if (existArr(typeArr)) {
        return (
          <div>
            {typeArr.map((re, index) => (
              <Popover
                trigger="click"
                key={index}
                placement="top"
                visible={re.name === '未完成' && record.jobId === popoverVisible}
                content={() => content(studentName)}
                onVisibleChange={(visible) => handleVisibleChange(visible, record)}
                title={'未完成学生'}>
                <div style={re.name === '未完成' ? {color: '#40a9ff', cursor: 'pointer'} : {}}>
                  <span>{re.name}：</span>
                  <span>{re.num ? re.num : 0}人</span>
                </div>
              </Popover>
            ))}
          </div>
        )
      }
    };

    const jobName = ['作业', '测验', '考试']
    return (
      <Spin spinning={!!loading}>
        <div id={styles['taskCorrect']}>
          <div className={styles['taskFilter']}>
            <span className={styles['title']}>任务类型：</span>
            <CheckboxGroup options={options} value={paperType} onChange={onChange}/>
          </div>
          <ul className={styles['listBox']}>
            {existArr(_getWorkListsByUserId) ? _getWorkListsByUserId.map((re) =>
                <li key={re.jobId} className={styles['list']}>
                  <span title={re.name}>{re.name}</span>
                    <div className={styles['contentBox']}>
                      <div className={styles['jobName']}>{re.jobType ? jobName[re.jobType - 1] : ''}</div>
                      <div className={styles['jobTime']}>
                        <div>
                          <span>布置时间：</span>
                          <span>{re.jobCreateTime ? dealTimestamp(re.jobCreateTime, 'YYYY-MM-DD HH:mm') : '-'}</span>
                        </div>
                        <div>
                          <span>截止时间：</span>
                          <span>{re.jobEndTime ? dealTimestamp(re.jobEndTime, 'YYYY-MM-DD HH:mm') : '-'}</span>
                        </div>
                      </div>
                      {/* -----------------------------------------2021-10-08添加布置对象-xiongwei------------------------ */}
                      <div className={styles['groupName']}>
                        布置对象：{re.groupName?re.groupName:'全部'}
                      </div>
                      {/*----------------------------------------- 2021-10-08添加布置对象-xiongwei------------------------ */}
                      <div className={styles['peopleNum']}>
                        {studentState(re, 'submitNum')}
                      </div>
                      <div className={styles['peopleNum']}>
                        {studentState(re, 'correctNum')}
                      </div>

                      {
                        re.totalNum == re.correctNum ?
                          <div className={styles['action']}>
                            <a className='button-a'
                               onClick={() => pushNewPage({
                                 jobId: re.jobId,
                                 paperId: re.paperId,
                               }, '/testReport', dispatch)}> 班级报告</a>
                            <a disabled={!re.submitNum} type='primary' onClick={() => handleCorrect(re, true)}>查看批改详情</a>
                          </div>
                          :
                          <div className={styles['action']}>
                            <Button disabled={!(re.submitNum || re.partSubmitNum)} type='primary'
                                    onClick={() => handleCorrect(re)}>批改</Button>
                          </div>
                      }
                    </div>
                </li>
              )
              :
              <Empty style={{marginTop: 150}}/>
            }
          </ul>
          <div className={styles['pagination']}>
            {
              total && parseInt(total, 10) > 10 ?
                <Pagination
                  {...paginationConfig(query, total)}
                  onChange={handleTableChange}/> : ''
            }
          </div>
        </div>
      </Spin>
    )
  }

}

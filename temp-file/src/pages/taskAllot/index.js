/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/12/10
 *@Modified By:
 */
import React from 'react'
import styles from './taskAllot.less'
import Page from "@/components/Pages/page";
import {dealTimestamp, getLocationObj, getTimestampDay, existObj, replaceSearch} from '@/utils/utils'
import paginationConfig from '@/utils/pagination'
import {TaskAllot as namespace} from '@/utils/namespace';
import TaskAllotModal from './components/taskAllotModal'
import moment from 'moment';
import {Button, DatePicker, Table} from 'antd';
import {connect} from 'dva'
import TaskDetailModal from "./components/taskDetailModal";

const {MonthPicker} = DatePicker;
@connect(state => ({
  countTask: state[namespace].countTask,
  initTaskAllocation: state[namespace].initTaskAllocation,
  getTaskDetail: state[namespace].getTaskDetail,
  loading: state[namespace].loading
}))
export default class TaskAllot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeMM: ''
    }
  }

  /**
   * 将modal对象存储
   * @param ref
   */
  onRef = (ref) => {
    this.taskAllotModal = ref
  }


  /**
   * 将modal对象存储
   * @param ref
   */
  onRefDetail = (ref) => {
    this.taskDetailModal = ref
  }


  /**
   * 任务分配弹框开关
   * @param record
   */
  taskAllotModalSwitch = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: namespace + '/initTaskAllocation',
      payload: {
        id: record.userId,
        expertGroupId: record.expertGroupId
      },
      callback: () => {
        this.taskAllotModal.openTaskAllot(record)
      }
    })
  }


  /**
   * 任务详情弹框开关
   * @param record
   */
  taskDetailsModalSwitch = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: namespace + '/getTaskDetail',
      payload: {
        userId: record.userId,
      },
      callback: () => {
        this.taskDetailModal.openTaskDetail(record)
      }
    })
  }
  render() {
    const monthFormat = 'YYYY-MM';
    const title = '任务分配';
    const breadcrumb = [title];
    const {countTask = [], location, dispatch, initTaskAllocation, getTaskDetail, loading} = this.props;
    const {query, pathname} = getLocationObj(location);
    const _query = existObj(query) ? {...query} : {}
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title}/>
    );
    const {data = [], total = 0} = existObj(countTask) || {};//任务成员列表
    const timeYYYYMM = getTimestampDay('-')//获取年
    const month = (time) => time.split('-')[1];
    /**
     * 点击切换时间
     * @param date
     */
    const onChangeTime = (date) => {
      replaceSearch(dispatch, location, {..._query, yearMonth: dealTimestamp(date, 'YYYY-MM')});
    }
    const columns = [
      {
        title: '任务人',
        align: 'center',
        dataIndex: 'questionExpertName',
        key: 'questionExpertName'
      },
      {
        title: '大知识点',
        align: 'center',
        dataIndex: 'bigKnowlegdeName',
        key: 'bigKnowlegdeName',
      },
      {
        title: '小知识点',
        align: 'center',
        dataIndex: 'smallKnowledgeName',
        key: 'smallKnowledgeName',
      },
      {
        title: '总任务题数',
        align: 'center',
        key: 'questionNum',
        dataIndex: 'questionNum'
      },
      {
        title: '已设参',
        align: 'center',
        key: 'questionSetParamNum',
        dataIndex: 'questionSetParamNum'
      },
      {
        title: `${query.yearMonth ? month(query.yearMonth) : month(timeYYYYMM)}月设参`,
        key: 'questionSetParamNumByMonth',
        align: 'center',
        dataIndex: 'questionSetParamNumByMonth',
        render: (text) => <div style={{color: 'red'}}>{text}</div>
      },
      {
        title: '已上传微课',
        key: 'smallClassNum',
        align: 'center',
        dataIndex: 'smallClassNum'
      },
      {
        title: `${query.yearMonth ? month(query.yearMonth) : month(timeYYYYMM)}月上传`,
        align: 'center',
        key: 'smallClassNumByMonth',
        dataIndex: 'smallClassNumByMonth',
        render: (text) => <div style={{color: 'red'}}>{text}</div>
      },
      // {
      //   title: '上传题数',
      //   align: 'center',
      //   key: 'uploadQuestionNum',
      //   dataIndex: 'uploadQuestionNum'
      // },
      {
        title: '操作',
        align: 'center',
        key: 'Action',
        render: (text, record) => (
          <div>
            <a onClick={() => this.taskDetailsModalSwitch(record)}>详情</a>
            {
              window.$PowerUtils.judgeButtonAuth(pathname, '任务分配') ?
                <a style={{marginLeft: '5px'}} onClick={() => this.taskAllotModalSwitch(record)}>任务分配</a> : null
            }
          </div>)
      }
    ];

    /**
     * 列表分页、排序、筛选变化时触发
     * @param page 页数
     */
    const handleTableChange = (page) => {
      replaceSearch(dispatch, location, {..._query, p: page.current});
    };
    return (
      <Page header={header} loading={!!loading}>
        <div className={styles['taskAllot']}>
          <div className={styles['time']}>
            <span>时间：</span>
            <MonthPicker
              allowClear={false}
              value={query.yearMonth ? moment(query.yearMonth, monthFormat) : moment(timeYYYYMM, monthFormat)}
              onChange={onChangeTime}/>
          </div>
          <div className={styles['taskAllotTable']}>
            <Table
              bordered
              onChange={handleTableChange}
              pagination={paginationConfig(query, total)}
              rowKey='userId'
              columns={columns}
              dataSource={data}/>
          </div>
          <TaskAllotModal query={query} initTaskAllocation={initTaskAllocation} onRef={this.onRef}/>
          <TaskDetailModal getTaskDetail={getTaskDetail} onRef={this.onRefDetail}/>
        </div>
      </Page>
    )
  }
}

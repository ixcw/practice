/**
 *@Author:xiongwei
 *@Description:年级报告成绩竞争力
 *@Date:Created in  2021/4/30
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
import { Table, Spin } from "antd";
import PerformanceCompetitivenessCharts from '@/components/Charts/PerformanceCompetitivenessCharts'
import { existArr } from "@/utils/utils";
import SelectModal from '../SelectModal'
import { GradeReport as namespace } from '@/utils/namespace'
import queryString from 'query-string';
import { connect } from 'dva'
@connect(state => ({
  loading: state[namespace].loading,
  findGradeReportTreeScoreTwoLoading: state[namespace].findGradeReportTreeScoreTwoLoading,
  GradeReportTreeScoreListTwo: state[namespace].findGradeReportTreeScoreTwo,//成绩竞争力
  GradeReportClassInfoList: state[namespace].findGradeReportClassInfo,
}))
export default class PerformanceCompetitiveness extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      value: [],
      pageSize:10
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
  componentDidMount() {
  }
  render() {
    const { value,pageSize } = this.state;
    const {
      location,
      dispatch,
      findGradeReportTreeScoreTwoLoading,
      loading,
      GradeReportClassInfoList = [],
      GradeReportTreeScoreListTwo = {},
    } = this.props;
    const {  search } = location;
    const query = queryString.parse(search);
    let defaultValue = [-1]
    GradeReportClassInfoList.map(({ id }) => { defaultValue.push(id) })
    let column = [
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '平均分',
        dataIndex: 'classAvgScore',
        key: 'classAvgScore',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '标准差',
        dataIndex: 'standardDeviation',
        key: 'standardDeviation',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
    ];
    //获取选择框点击确认时传回来的参数
    const getParameter = (value) => {
      this.setState({
        value,
        pageSize:10
      })
      dispatch({
        type: namespace + '/saveState',
        payload: {
          findGradeReportTreeScoreTwo: undefined
        }
      })
      dispatch({
        type: namespace + '/findGradeReportTreeScoreTwo',
        payload: {
          reportType: 3,
          jobId: query.jobId,
          classIds: value.toString(),
          page: 1,
          size: 10,
        }
      })
    }
    const TableonChange = (pagination) => {
      this.setState({
        pageSize:pagination.pageSize
      })
      dispatch({
        type: namespace + '/saveState',
        payload: {
          findGradeReportTreeScoreTwo: undefined
        }
      })
      dispatch({
        type: namespace + '/findGradeReportTreeScoreTwo',
        payload: {
          reportType: 3,
          jobId: query.jobId,
          page: pagination.current,
          size: pagination.pageSize,
        }
      })
    }
    return (
      <div className={styles['PerformanceCompetitiveness']}>
        {/* <SelectModal outputParameter={getParameter} defaultValue={existArr(value) ? value : defaultValue} /> */}
        <div className={styles['PerformanceCompetitiveness-charst']}>
          <p>成绩竞争力分布图</p>
          <div className={styles['charst-mian']}>
            {
              existArr(GradeReportTreeScoreListTwo.data) && !findGradeReportTreeScoreTwoLoading ?
                <PerformanceCompetitivenessCharts GradeReportTreeScoreList={GradeReportTreeScoreListTwo.data} />
                :
                <Spin />
            }
          </div>
        </div>
        <div className={styles['PerformanceCompetitiveness-table']}>
          <p>成绩竞争力分布表</p>
          <Table
            columns={column}
            dataSource={GradeReportTreeScoreListTwo.data}
            loading={!!findGradeReportTreeScoreTwoLoading}
            style={{ width: '100%' }}
            bordered
            rowKey='id'
            onChange={(pagination) => { TableonChange(pagination) }}
            pagination={{ total: GradeReportTreeScoreListTwo.total, pageSize: pageSize, current: GradeReportTreeScoreListTwo.currentPage, }}
          />
        </div>
      </div>
    )
  }
}
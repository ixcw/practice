/**
 *@Author:xiongwei
 *@Description:年级报告得分率分布
 *@Date:Created in  2021/4/30
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
import { Table, Spin } from "antd";
import ScoreDistribution from '@/components/Charts/ScoreDistribution'
import SelectModal from '../SelectModal'
import { existArr } from "@/utils/utils";
import { GradeReport as namespace } from '@/utils/namespace'
import queryString from 'query-string';
import { connect } from 'dva'
@connect(state => ({
  getClassReportTotalScoreRateLoading: state[namespace].getClassReportTotalScoreRateLoading,
  ClassReportTotalScoreRateList: state[namespace].getClassReportTotalScoreRate,//得分率分布
  GradeReportClassInfoList: state[namespace].findGradeReportClassInfo,
}))
export default class ScoreDistributionCompontent extends React.Component {
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
    const { ClassReportTotalScoreRateList = {}, getClassReportTotalScoreRateLoading, GradeReportClassInfoList = [], dispatch, location } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    let defaultValue = [-1]
    GradeReportClassInfoList.map(({ id }) => { defaultValue.push(id) })
    let tableData = existArr(ClassReportTotalScoreRateList.data) && ClassReportTotalScoreRateList.data.map(({ className, gradeName = {}, dataRate = [] }, index) => {
      let obj = {
        id: index,
        className,
      }
      dataRate.map((item, index) => {
        obj['data' + index] = (item * 100).toFixed(1)
      })
      for (let key in gradeName) {
        let str = gradeName[key]
        if (key == 'aNum') {
          str = str + '人(' + (dataRate[0] * 100).toFixed(2) + '%)';
        }
        if (key == 'bNum') {
          str = str + '人(' + (dataRate[1] * 100).toFixed(2) + '%)';
        }
        if (key == 'cNum') {
          str = str + '人(' + (dataRate[2] * 100).toFixed(2) + '%)';
        }
        if (key == 'dNum') {
          str = str + '人(' + (dataRate[3] * 100).toFixed(2) + '%)';
        }
        obj[key] = str
      }
      return obj
    });
    let column = [
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: 'A等',
        dataIndex: 'aNum',
        key: 'aNum',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: 'B等',
        dataIndex: 'bNum',
        key: 'bNum',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: 'C等',
        dataIndex: 'cNum',
        key: 'cNum',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: 'D等',
        dataIndex: 'dNum',
        key: 'dNum',
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
          getClassReportTotalScoreRate: undefined
        }
      })
      dispatch({
        type: namespace + '/getClassReportTotalScoreRate',
        payload: {
          reportType: 3,
          jobId: query.jobId,
          paperId: query.paperId,
          page: 1,
          size: 10,
          classIds: value.toString(),
        }
      })
    }
    const TableonChange = (pagination) => {
      dispatch({
        type: namespace + '/saveState',
        payload: {
          getClassReportTotalScoreRate: undefined
        }
      })
      dispatch({
        type: namespace + '/getClassReportTotalScoreRate',
        payload: {
          reportType: 3,
          paperId: query.paperId,
          page: pagination.current,
          size: pagination.pageSize,
          jobId: query.jobId,
          classIds: value.toString(),
        }
      })
    }
    return (
      <div className={styles['ScoreDistributionCompontent']}>
        <SelectModal outputParameter={getParameter} defaultValue={existArr(value) ? value : defaultValue} />
        <div className={styles['ScoreDistributionCompontent-charst']}>
          <p>等次分布图</p>
          {
            existArr(tableData) && !getClassReportTotalScoreRateLoading ?
              <ScoreDistribution data={tableData} />
              :
              <Spin />
          }
        </div>
        <div className={styles['ScoreDistributionCompontent-table']}>
          <p>等次分布表</p>
          <Table
            columns={column}
            dataSource={tableData}
            loading={!!getClassReportTotalScoreRateLoading}
            style={{ width: '100%' }}
            bordered
            rowKey='id'
            onChange={(pagination) => { TableonChange(pagination) }}
            pagination={{ total: ClassReportTotalScoreRateList.total, pageSize: pageSize, current: ClassReportTotalScoreRateList.currentPage, }}
          />
        </div>
      </div>
    )
  }
}
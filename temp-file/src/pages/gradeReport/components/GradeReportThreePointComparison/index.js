/**
 *@Author:xiongwei
 *@Description:年级报告三分比较
 *@Date:Created in  2021/4/30
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
import { Table, Spin } from "antd";
import ThreePointComparison from '@/components/Charts/ThreePointComparison'
import { existArr } from "@/utils/utils";
import SelectModal from '../SelectModal'
import { GradeReport as namespace } from '@/utils/namespace'
import paginationConfig from '@/utils/pagination';
import queryString from 'query-string';
import { connect } from 'dva'
@connect(state => ({
  loading: state[namespace].loading,
  GradeReportTreeScoreList: state[namespace].findGradeReportTreeScoreOne,//三分比较
  GradeReportClassInfoList: state[namespace].findGradeReportClassInfo,
  findGradeReportTreeScoreLoading: state[namespace].findGradeReportTreeScoreOneLoading,
}))
export default class GradeReportThreePointComparison extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      value: [],
      pageSize:10,
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
    const { value,pageSize } = this.state;
    const {
      location,
      loading,
      dispatch,
      GradeReportTreeScoreList = {},//三分比较
      GradeReportClassInfoList = [],
      findGradeReportTreeScoreLoading
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
        title: '任课老师',
        dataIndex: 'teacherName',
        key: 'teacherName',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '满分',
        dataIndex: 'totalScore',
        key: 'totalScore',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '最高分',
        dataIndex: 'classMaxScore',
        key: 'classMaxScore',
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
        title: '最低分',
        dataIndex: 'classMinScore',
        key: 'classMinScore',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '得分率',
        dataIndex: 'classScoreRate',
        key: 'classScoreRate',
        align: 'center',
        render: (text) => text == null ? '--' : text + '%'

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
          findGradeReportTreeScoreOne:undefined
        }
      })
      dispatch({
        type: namespace + '/findGradeReportTreeScoreOne',
        payload: {
          reportType: 3,
          jobId: query.jobId,
          page: 1,
          size: 10,
          classIds: value.toString(),
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
          findGradeReportTreeScoreOne:undefined
        }
      })
      dispatch({
        type: namespace + '/findGradeReportTreeScoreOne',
        payload: {
          reportType: 3,
          jobId: query.jobId,
          page: pagination.current,
          size: pagination.pageSize,
        }
      })
    }
    return (
      // <div>
      // {!loading?
      <div className={styles['GradeReportThreePointComparison']}>
        <SelectModal outputParameter={getParameter} defaultValue={existArr(value) ? value : defaultValue} />
        <div className={styles['GradeReportThreePointComparison-charst']}>
          <p>三分比较图</p>
          <div className={styles['charst-mian']}>
            {
              existArr(GradeReportTreeScoreList.data) && !findGradeReportTreeScoreLoading ?
                <ThreePointComparison GradeReportTreeScoreList={GradeReportTreeScoreList.data} />
                :
                <Spin />
            }
          </div>
        </div>
        <div className={styles['GradeReportThreePointComparison-table']}>
          <p>三分比较表</p>
          <Table
            columns={column}
            dataSource={GradeReportTreeScoreList.data}
            loading={!!findGradeReportTreeScoreLoading}
            style={{ width: '100%' }}
            bordered
            rowKey='id'
            onChange={(pagination) => { TableonChange(pagination) }}
            pagination={{ total: GradeReportTreeScoreList.total, pageSize: pageSize, current: GradeReportTreeScoreList.currentPage, }}
          />
        </div>
      </div>
      // }
      // </div>
    )
  }
}
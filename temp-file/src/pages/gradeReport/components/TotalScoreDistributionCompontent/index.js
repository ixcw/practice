/**
 *@Author:xiongwei
 *@Description:年级报告总分分布
 *@Date:Created in  2021/4/30
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
import { Table, Spin } from "antd";
import GoalDistribute from '@/components/AssignTask/charts/goalDistribute'
import SelectModal from './SelectModal'
import { existArr, backDataSource } from "@/utils/utils";
import { GradeReport as namespace } from '@/utils/namespace'
import queryString from 'query-string';
import { connect } from 'dva'
@connect(state => ({
  loading: state[namespace].loading,
  GradeReportClassInfoList: state[namespace].findGradeReportClassInfo,
  GradeExamReportScoreList: state[namespace].findGradeExamReportScore,
  findGradeExamReportScoreLoading: state[namespace].findGradeExamReportScoreLoading,
}))
export default class TotalScoreDistributionCompontent extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      value: -1,//默认选择
      p: 1,//成绩分布表本地分页
      titleStr: '本校',
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
  //总分分布表改变
  cjfbTableChange = (pagination, filters, sorter) => {
    this.setState({ p: pagination.current })
  }
  render() {
    const { GradeExamReportScoreList, findGradeExamReportScoreLoading, dispatch, location } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    const { value, p, titleStr } = this.state;
    let column = [
      {
        title: '分段',
        dataIndex: 'segmentation',
        key: 'segmentation',
        align: 'center',
      },
      {
        title: `(${titleStr})人数及占比`,
        dataIndex: 'proportion',
        key: 'proportion',
        align: 'center',
        render: (text,record) => <div><span style={{color:'#188DF0'}}>{record.number}人</span><span>({record.accounted})</span></div>
      },
    ];
    //获取选择框点击确认时传回来的参数
    const getParameter = (value) => {
      const { GradeReportClassInfoList = [] } = this.props;
      GradeReportClassInfoList.map(({ id, className }) => {
        if (id == value) {
          this.setState({ titleStr: className })
        }
        if (value == -1) {
          this.setState({ titleStr: '本校' })
        }
      })
      this.setState({
        value,
      })
      dispatch({
        type: namespace + '/saveState',
        payload: {
          findGradeExamReportScore: undefined
        }
      })
      dispatch({
        type: namespace + '/findGradeExamReportScore',
        payload: {
          reportType: 3,
          paperId: query.paperId,
          diffeScore: 10,
          jobId: query.jobId,
          classId: value.toString(),
        }
      })
    }

    return (
      <div className={styles['TotalScoreDistributionCompontent']}>
        <SelectModal outputParameter={getParameter} defaultValue={value ? value : -1} />
        <div className={styles['TotalScoreDistributionCompontent-charst']}>
          <p>成绩分布图</p>
          {
            GradeExamReportScoreList && !findGradeExamReportScoreLoading ?
              <GoalDistribute findClassReportTotalScoreDistribution={GradeExamReportScoreList} id='TotalScoreDistributionCompontentID' />
              :
              <Spin />
          }
        </div>
        <div className={styles['TotalScoreDistributionCompontent-table']}>
          <p>成绩分布表</p>
          <Table columns={column} dataSource={backDataSource(GradeExamReportScoreList, p)} style={{ width: '100%' }}
            pagination={{ total: GradeExamReportScoreList && GradeExamReportScoreList.xData && GradeExamReportScoreList.xData.length, pageSize: 10, current: p, position: ['bottomCenter'] }}
            tableLayout='auto'
            loading={!!findGradeExamReportScoreLoading}
            bordered
            onChange={this.cjfbTableChange}
          />
        </div>
      </div>
    )
  }
}
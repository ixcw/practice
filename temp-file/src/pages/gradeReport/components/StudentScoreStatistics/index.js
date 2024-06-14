/**
 *@Author:xiongwei
 *@Description:年级报告学生得分统计
 *@Date:Created in  2021/4/30
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
import { Table } from "antd";
import ScoreDistribution from '@/components/Charts/ScoreDistribution'
import SelectModal from './SelectModal'
import { existArr } from "@/utils/utils";
import { GradeReport as namespace } from '@/utils/namespace'
import { connect } from 'dva'
import queryString from 'query-string';
@connect(state => ({
  findExamScoreLoading: state[namespace].findExamScoreLoading,
  findExamScoreList: state[namespace].findExamScore,
  GradeReportClassInfoList: state[namespace].findGradeReportClassInfo,
}))
export default class StudentScoreStatistics extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      value: -1,
      titleStr: '本校',
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
    const { findExamScoreList = {}, dispatch, findExamScoreLoading, GradeReportClassInfoList = [], location } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    let defaultValue = [-1]
    GradeReportClassInfoList.map(({ id }) => { defaultValue.push(id) })
    const categoryId = existArr(findExamScoreList.data) ? findExamScoreList.data[0].categoryStr.split(',') : [];
    const category = existArr(findExamScoreList.data) ? findExamScoreList.data[0].categoryNameStr.split(',') : [];
    let tableData = existArr(findExamScoreList.data) ? findExamScoreList.data.map(({ userName, className, schoolOnlyId, schoolRank, classRank, score, jobCategorys }) => {
      let obj = {
        userName,
        className,
        schoolOnlyId,
        schoolRank,
        classRank,
        score,
      }
      existArr(jobCategorys) && jobCategorys.map(({ category, score }) => {
        obj['category-' + category] = score
      })
      return obj
    }) : [];
    let column = [
      {
        title: '序号',
        align: 'center',
        render: (text, record, index) => index + 1
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '唯一码',
        dataIndex: 'schoolOnlyId',
        key: 'schoolOnlyId',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '全校名次',
        dataIndex: 'schoolRank',
        key: 'schoolRank',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '班级名次',
        dataIndex: 'classRank',
        key: 'classRank',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '总分',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        render: (text) => text == null ? '--' : text

      },
    ];
    existArr(category) && existArr(categoryId) && categoryId.map((item, index) => {
      column.push({
        title: category[index],
        dataIndex: 'category-' + item,
        key: 'category-' + item,
        align: 'center',
        render: (text) => text == null ? '--' : text
      })
    })
    //获取选择框点击确认时传回来的参数
    const getParameter = (value) => {
      console.log(value)
      GradeReportClassInfoList.map(({ id, className }) => {
        if (id == value) {
          this.setState({ titleStr: className })
        }
        if (id == -1) {
          this.setState({ titleStr: '本校' })
        }
      })
      this.setState({
        value,
        pageSize:10
      })
      dispatch({
        type: namespace + '/saveState',
        payload: {
          findExamScore: undefined
        }
      })
      dispatch({
        type: namespace + '/findExamScore',
        payload: {
          reportType: 3,
          paperId: query.paperId,
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
          findExamScore: undefined
        }
      })
      dispatch({
        type: namespace + '/findExamScore',
        payload: {
          paperId: query.paperId,
          jobId: query.jobId,
          reportType: 3,
          page: pagination.current,
          size: pagination.pageSize,
          classIds: value.toString(),
        }
      })
    }
    return (
      <div className={styles['StudentScoreStatistics']}>
        <SelectModal outputParameter={getParameter} defaultValue={value ? value : -1} />
        <div className={styles['StudentScoreStatistics-TABLE']}>
          <Table
            columns={column}
            dataSource={tableData}
            style={{ width: '100%' }}
            bordered
            loading={!!findExamScoreLoading}
            rowKey='schoolOnlyId'
            onChange={(pagination) => { TableonChange(pagination) }}
            pagination={{ total: findExamScoreList.total, pageSize: pageSize, current: findExamScoreList.currentPage, }}
          />
        </div>
      </div>
    )
  }
}
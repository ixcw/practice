/**
 *@Author:xiongwei
 *@Description:年级报告考题细目表
 *@Date:Created in  2021/4/30
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
import { Table, message } from "antd";
import ListModal from './listModal';
import queryString from 'query-string'
import { GradeReport as namespace } from '@/utils/namespace'
import { connect } from 'dva'
@connect(state => ({
  findGradeReportQuestionDetailLoading: state[namespace].findGradeReportQuestionDetailLoading,
  GradeReportQuestionDetailList: state[namespace].findGradeReportQuestionDetail,
}))
export default class BreakdownOfQuestionsTable extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      pageSize: 10
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
  /**
* 获取detailRef
* @param ref
*/
  getDetailRef = (ref) => {
    this.detailRef = ref;
  }
  //查看详情
  checkPeople = (record) => {
    const { location, dispatch } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    // window.open('http://localhost:8081/#/gradeReport', "_blank", "scrollbars=yes,toolbar=0,resizable=1,modal=false,alwaysRaised=yes
    this.detailRef.detailSwitch(true, record)
    // if (record.exceptionLoseScore) {
    dispatch({
      type: namespace + '/saveState',
      payload: {
        findGradeReportExamClassDetailByQuestion: undefined
      }
    })
    dispatch({
      type: namespace + "/findGradeReportExamClassDetailByQuestion",
      payload: {
        jobId: query.jobId,
        questionId: record.questionId,
        paperDetailId: record.paperDetailId,
        reportType: 3
      }
    })
    // } else {
    //     message.warning('0人');
    // }
  }
  render() {
    const { pageSize } = this.state;
    const { GradeReportQuestionDetailList = {}, dispatch, findGradeReportQuestionDetailLoading, location } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    let column = [
      {
        title: '题号',
        dataIndex: 'code',
        key: 'code',
        align: 'center',
        render: (text) => text === ' ' ? '--' : text
      },
      {
        title: '题型',
        dataIndex: 'categoryName',
        key: 'categoryName',
        align: 'center',
        render: (text) => text === ' ' ? '--' : text
      },
      {
        title: '难度',
        dataIndex: 'difficulty',
        key: 'difficulty',
        align: 'center',
        render: (text) => text === ' ' ? '--' : text
      },
      {
        title: '知识点',
        dataIndex: 'knowNames',
        key: 'knowNames',
        align: 'center',
        render: (text) => text === ' ' ? '--' : text
      },
      {
        title: '认知层次',
        dataIndex: 'cognName',
        key: 'cognName',
        align: 'center',
        render: (text) => text === ' ' ? '--' : text
      },
      {
        title: '关键能力',
        dataIndex: 'abilityName',
        key: 'abilityName',
        align: 'center',
        render: (text) => text === ' ' ? '--' : text
      },
      {
        title: '得分率',
        dataIndex: 'scoreRate',
        key: 'scoreRate',
        align: 'center',
        render: (text) => text === ' ' ? '--' : text + '%'

      },
      {
        title: '异常正确',
        dataIndex: 'countExceptTrueNum',
        key: 'countExceptTrueNum',
        align: 'center',
        render: (text) => text === ' ' ? '--' : text + '人'
      },
      {
        title: '异常错误',
        dataIndex: 'countExceptErrorNum',
        key: 'countExceptErrorNum',
        align: 'center',
        render: (text) => text === ' ' ? '--' : text + '人'
      },
      {
        title: '错误人数',
        dataIndex: 'errorNum',
        key: 'errorNum',
        align: 'center',
        render: (text) => text === ' ' ? '--' : text + '人'
      },
      {
        title: '已做专练',
        dataIndex: 'trainNum',
        key: 'trainNum',
        align: 'center',
        render: (text) => text === ' ' ? '--' : text + '人'
      },
      {
        title: '可提分人数',
        dataIndex: 'upSpaceScore',
        key: 'upSpaceScore',
        align: 'center',
        render: (text) => text === ' ' ? '--' : text + '人'
      },
      {
        title: '操作',
        align: 'center',
        render: (record) => <a onClick={() => { this.checkPeople(record) }}>详情</a>
      },
    ];
    const TableonChange = (pagination) => {
      this.setState({
        pageSize: pagination.pageSize
      })
      dispatch({
        type: namespace + '/saveState',
        payload: {
          findGradeReportQuestionDetail: undefined
        }
      })
      dispatch({
        type: namespace + '/findGradeReportQuestionDetail',
        payload: {
          reportType: 3,
          page: pagination.current,
          size: pagination.pageSize,
          jobId: query.jobId,
        }
      })
    }
    return (
      <div className={styles['BreakdownOfQuestionsTable']}>
        {/* <SelectModal/> */}
        <div className={styles['BreakdownOfQuestionsTable-TABLE']}>
          <Table
            columns={column}
            dataSource={GradeReportQuestionDetailList.data}
            style={{ width: '100%' }}
            bordered
            loading={!!findGradeReportQuestionDetailLoading}
            rowKey='code'
            onChange={(pagination) => { TableonChange(pagination) }}
            pagination={{ total: GradeReportQuestionDetailList.total, pageSize: pageSize, current: GradeReportQuestionDetailList.currentPage, }}
          />
        </div>
        <ListModal onRef={this.getDetailRef} />
      </div>
    )
  }
}
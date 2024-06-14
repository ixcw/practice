/**
 *@Author:ChaiLong
 *@Description:学生个人报告
 *@Date:Created in  2020/1/5
 *@Modified By:
 */
import React from 'react'
import styles from './studentsReport.less'
import {connect} from 'dva'
import {Table, Progress, Empty} from 'antd'
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/component/grid';
import {routerRedux} from 'dva/router'
import {TopicManage as namespace} from '@/utils/namespace'
import Page from "@/components/Pages/page";
import TreePoints from '@/components/ReviewReport/treePoints'
import BackBtns from "@/components/BackBtns/BackBtns";

@connect(state => ({
  loading: state[namespace].loading,
  findQuestionAnalysisInfo: state[namespace].findQuestionAnalysisInfo,//题目解析
  findStudentTreeScoreCompare: state[namespace].findStudentTreeScoreCompare,//全班三分比较
  findStudentReportTotalScore: state[namespace].findStudentReportTotalScore,//总分评价
}))
export default class StudentPersonReport extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {};
  };

  componentWillUnmount() {
    this.props.dispatch({
      type: namespace + '/set',
      payload: {
        findStudentTreeScoreCompare: {},
        findQuestionAnalysisInfo: [],
        findStudentReportTotalScore: {}
      }
    });
  }


  /**
   * 返回上一层
   */
  // getBack = () => {
  //   const {dispatch} = this.props;
  //   // const {search,pathname} = location;
  //   // const query = queryString.parse(search);
  //   dispatch(routerRedux.push({
  //     pathname: '/reviewReport',
  //     // search:  queryString.stringify({ id:query.id }),
  //   }));
  // };


  render() {
    const {loading, findStudentReportTotalScore, findQuestionAnalysisInfo, findStudentTreeScoreCompare} = this.props;
    const title = '学生个人报告-批阅及报告-试题管理';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title}/>
    );

    //0优秀，1及格，2不及格，3低分
    const colorObj = [
      {name: "优分", color: '#37a2da'},
      {name: '及格', color: '#67e0e3'},
      {name: '不及格', color: '#ffdb5c'},
      {name: '低分', color: '#ff9f7f'}];
    const filterColor = findStudentReportTotalScore && findStudentReportTotalScore.standard ? (colorObj.filter(re => re.name === findStudentReportTotalScore.standard)[0]).color : '';
    //计算分数百分比
    const percentNmb = findStudentReportTotalScore ? ((findStudentReportTotalScore.score / findStudentReportTotalScore.totalScore).toFixed(2)) * 100 : 0;

    const columns = [
      {
        title: '题目编号',
        dataIndex: 'serialCode',
        key: 'serialCode',
      },
      {
        title: '知识点',
        dataIndex: 'knowName',
        key: 'knowName',
      },
      {
        title: '个人得分',
        dataIndex: 'personScoreRate',
        key: 'personScoreRate',
        render: (text) => `${(text === 0 || text) ? (text * 100).toFixed(2) + '%' : ''}`
      },
      {
        title: '班级得分率',
        key: 'classScoreRate',
        dataIndex: 'classScoreRate',
        render: (text) => `${(text === 0 || text) ? (text * 100).toFixed(2) + '%' : ''}`
      },
      {
        title: '难度',
        key: 'difficulty',
        dataIndex: 'difficulty',
      },
    ];
    return (
      <Page header={header} loading={!!loading}>
        <div id={styles['studentPersonReport']}>
          {findStudentReportTotalScore && Object.keys(findStudentReportTotalScore).length > 0 ?
            <div className={styles['studentPersonReportBox']}>

              {/*头部视图部分*/}
              <div className={styles['reportHeader']}>
                {/*总分评价*/}
                <div className={styles['gradeAppraise']}>
                  <div className={styles['gradeAppraiseBox']}>
                    <div className={styles['boxL']}>
                      <Progress
                        strokeColor='#108ee9'
                        className='gradeProgress'
                        strokeWidth={10}
                        width={250}
                        type="circle"
                        percent={percentNmb}
                        format={percent => (
                          <div className='gradeBox'>
                            <div><span>{findStudentReportTotalScore.score}</span> 分</div>
                            <div>{findStudentReportTotalScore.totalScore} 分</div>
                          </div>
                        )}/>
                    </div>
                    <div className={styles['boxR']}>总分评价：<span style={{color: filterColor}}>{findStudentReportTotalScore.standard}</span></div>
                  </div>
                </div>
                {/*全班三分比较*/}

                <div className={styles['treePoints']}>
                  {findStudentTreeScoreCompare && Object.keys(findStudentTreeScoreCompare).length ?
                    <TreePoints findStudentTreeScoreCompare={findStudentTreeScoreCompare}/> : null}
                </div>
              </div>

              {/*底部表格部分*/}
              <div className={styles['reportFooter']}>
                <div className={styles['title']}>题目解析</div>
                <Table
                  rowKey='questionId'
                  pagination={false}
                  columns={columns}
                  dataSource={findQuestionAnalysisInfo && findQuestionAnalysisInfo.length > 0 ? findQuestionAnalysisInfo : []}
                />
              </div>
            </div>
            :
            <div className={styles['Empty']}><Empty/></div>
          }
          <BackBtns tipText={"返回"} />
        </div>
      </Page>
    )
  }

}


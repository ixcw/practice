/**
 *@Author:xiongwei
 *@Description:班级报告
 *@Date:Created in  2019/12/17
 *@Modified By:
 */
import React from 'react'
import styles from './assignTask.module.less'
import Page from "@/components/Pages/page";
import { routerRedux } from 'dva/router';
import ReportLayout from "@/components/ReportComponents/ReportLayout";
import RoseDiagram from './charts/roseDiagram'//总得分率
import ThreeGoalContrast from "./charts/threeGoalContrast";//三分比较
import FinishingPercent from "./charts/finishingPercent";//完成率
import GoalDistribute from './charts/goalDistribute'//得分分布图
import AbilityLevel from '@/components/Charts/AbilityLevel'//能力水平图
import KnowledgeStructure from '@/components/Charts/KnowledgeStructure'//知识结构图
import QuestionTypeScore from './charts/questionTypeScore'//题型得分分布图
import CognitiveLevel from '././charts/CognitiveLevel'//题型得分分布图
import ParameterAnalysisTable from './charts/ParameterAnalysisTable';//题型参数分析表格
import WrongTopicTable from "@/pages/studentPersonReport/components/WrongTopicTable";//错题分析
import queryString from 'query-string'
import { existArr } from '@/utils/utils'
import { backDataSource, getIcon } from '@/utils/utils';
import { TopicManage as namespace } from '@/utils/namespace'
import { Table, Empty, Spin, Drawer, Anchor, Switch, Tooltip, Progress } from 'antd';
import ChartsTitle from '../Charts/ChartsTitle/index';
import classNames from 'classnames';
import { connect } from 'dva';
import { UpOutlined, DownOutlined, DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
// import QuestionCategoryScore from './charts/questionTypeScore';

const { Link } = Anchor;
const IconFont = getIcon();

@connect(state => ({
  loading: state[namespace].loading,
  Subjective: state[namespace].findClassReportSubjectiveAnalysis,//主观题分析
  Objective: state[namespace].findClassReportObjectiveAnalysis,//客观题分析
  Distribution: state[namespace].findClassReportTotalScoreDistribution,//总得分分布
  TreeScore: state[namespace].findClassReportTreeScore,//总分三分比较
  ScoreRate: state[namespace].findClassReportTotalScoreRate,//总得分率
  Situation: state[namespace].jobCompleteSituation,//完成情况
  Statistics: state[namespace].studentScoreStatistics,//学生得分统计
  questionCategoryScore: state[namespace].questionCategoryScore,//题型得分统计
  findExemQuestionDataAnalysis: state[namespace].findExemQuestionDataAnalysis,//考题参数分析
  findExemQuestionDataAbility: state[namespace].findExemQuestionDataAbility,//能力水平
  findExemQuestionKnowStructure: state[namespace].findExemQuestionKnowStructure,//知识结构
  findExemReportCognInfo: state[namespace].findExemReportCognInfo,//认知层次
  findExemReportCognInfoOne: state[namespace].findExemReportCognInfoOne,//认知层次
  findExemReporTabilityInfo: state[namespace].findExemReporTabilityInfo,//关键能力
  findExemReporTabilityInfoOne: state[namespace].findExemReporTabilityInfoOne,//关键能力
  findExemReportCompInfo: state[namespace].findExemReportCompInfo,//核心素养
  findExemReportCompInfoOne: state[namespace].findExemReportCompInfoOne,//核心素养
  NotCompleteStudentInfoList: state[namespace].getNotCompleteStudentInfo,//完成情况
  findStudentReportErrorQuestionAnalysis: state[namespace].findStudentReportErrorQuestionAnalysis,//错题分析

}))
export default class AssignTaskChart extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      p: 1,//成绩分布表本地分页
      modalSwitch: false,//查看更多modal开关
      unfoldStatisticsTable: false,//Statistics表格是否展开
      unfoldSubjectiveTable: false,//Subjective表格是否展开
      unfoldObjectiveTable: false,//Objective表格是否展开
      unfoldAnchorfixed: true,//unfoldAnchorfixed是否展开
      colorArr: ['#7352cf', '#5aab09',
        '#e54e6c', '#f9d44b', '#e57673',
        '#7ab2e0', '#f9e44b', '#cb3d88',
        '#c2ec47', '#ff7300', '#f74a4f',
        '#e6f54a', '#2e9991', '#93ca76',
        '#fde8d0', '#028760', '#59b9c6'],
    }
  }


  componentWillUnmount() {
    this.props.dispatch({
      type: namespace + '/saveState',
      payload: {
        findClassReportSubjectiveAnalysis: [],//主观题分析
        findClassReportObjectiveAnalysis: {
          list: [],
          options: []
        },//客观题分析
        findClassReportTotalScoreDistribution: {},//总得分分布
        findClassReportTreeScore: {},//总分三分比较
        findClassReportTotalScoreRate: {},//总得分率
        studentScoreStatistics: [],
        jobCompleteSituation: {},
        findExemReportCompInfoOne: undefined,
        questionCategoryScore: undefined,//题型得分统计
        findExemQuestionDataAnalysis: undefined,//考题参数分析
        findExemQuestionDataAbility: undefined,//能力水平
        findExemQuestionKnowStructure: undefined,//知识结构
        findExemReportCognInfo: undefined,//认知层次
        findExemReportCognInfoOne: undefined,//认知层次
        findExemReporTabilityInfo: undefined,//关键能力
        findExemReporTabilityInfoOne: undefined,//关键能力
        findExemReportCompInfo: undefined,//核心素养
        getNotCompleteStudentInfo: undefined
      }
    })
    /**
* 页面组件即将卸载时：清空数据
*/
    //   this.setState = (state, callback) => {
    //     return;
    // };
  }
  PrintTheReport = () => {
    window.print();
  }
  //分数段开关
  segmentationSwitch = (checked) => {
    const { location, dispatch } = this.props;
    const { pathname, search } = location;
    let query = queryString.parse(search);
    if (checked) {
      query.diffeScore = 10
    } else {
      query.diffeScore = 5
    }
    dispatch({
      type: namespace + '/set',
      payload: {
        findClassReportTotalScoreDistribution: {},//总得分分布
      }
    })
    dispatch({
      type: namespace + '/findClassReportTotalScoreDistribution',
      payload: {
        jobId: query.jobId,
        diffeScore: checked ? 10 : 5
      }
    })
    //修改地址栏最新的请求参数
    // dispatch(routerRedux.push({
    //   pathname,
    //   search: queryString.stringify(query),
    // }));
  }
  //得分统计表改变
  deFenTableChange = (pagination, filters, sorter) => {
    const { location, dispatch } = this.props;
    const { pathname, search } = location;
    let query = queryString.parse(search);
    query = {
      ...query,
      // p: pagination.current,
      // s: Number(pagination.pageSize),
      rankWay: sorter.order ? sorter.order.replace("end", "") : null
    };
    if (sorter) {
      if (sorter.columnKey === 'totalScore' || sorter.columnKey === 'rank') {
        query.rankType = -1;
      } else {
        query.rankType = Number(sorter.columnKey.replace("category", ""));
      }
    }
    //---------------------------------------------------------------------------排序由前端排
    //学生得分统计
    // dispatch({
    //   type: namespace + '/studentScoreStatistics',
    //   payload: {
    //     jobId: query.jobId,
    //     rankType: query.rankType || -1,
    //     rankWay: query.rankWay || 'desc'//	desc:升序；asc:降序
    //   }
    // });
    //修改地址栏最新的请求参数

    // dispatch(routerRedux.push({
    //   pathname,
    //   search: queryString.stringify(query),
    // }));
  }
  //总分分布表改变
  cjfbTableChange = (pagination, filters, sorter) => {
    this.setState({ p: pagination.current })
  }
  render() {
    const { p, unfoldAnchorfixed, unfoldStatisticsTable, unfoldSubjectiveTable, unfoldObjectiveTable, colorArr } = this.state;
    const { Subjective, Objective, dispatch,
      ScoreRate, TreeScore, Distribution, Situation, Statistics, location,
      StatisticsModal, loading, questionCategoryScore = [],
      findExemQuestionDataAnalysis = [],
      findExemQuestionDataAbility,
      findExemReportCognInfo = [],
      findExemQuestionKnowStructure,
      findExemReportCognInfoOne,
      findExemReporTabilityInfo,
      findExemReporTabilityInfoOne,
      findExemReportCompInfo,
      findExemReportCompInfoOne,
      NotCompleteStudentInfoList,
      findStudentReportErrorQuestionAnalysis
    } = this.props;
    const { search } = location;
    const bannerImgUrl = 'https://reseval.gg66.cn/class-report-bg.png'
    const title = '学生班级报告';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );
    const query = queryString.parse(search);
    //遍历出选择题有多少个
    const choose = Objective && Object.keys(Objective).length > 0 && Objective.options.length > 0 ? Objective.options : [];
    //将选择题遍历出配置文件方便显示表格
    //学生得分统计column
    let columnsScoringStatistics = query.jobType == 1 ? [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
      },
      {
        title: '总分等级',
        dataIndex: 'totalScoreLevel',
        key: 'totalScoreLevel',
        align: 'center',
        sorter: (a, b) => a.totalScore - b.totalScore,
      },
      // {
      //   title: '总分',
      //   dataIndex: 'totalScoreLevel',
      //   key: 'totalScoreLevel1',
      //   align: 'center',
      //   sorter: (a, b) => a.totalScore - b.totalScore,
      // },
    ] : [
        {
          title: '序号',
          dataIndex: 'number',
          key: 'number',
          align: 'center',
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          key: 'userName',
          align: 'center',
        },
        {
          title: '排名',
          dataIndex: 'rank',
          key: 'rank',
          align: 'center',
          sorter: (a, b) => a.rank - b.rank,
        },
        {
          title: '总分',
          dataIndex: 'totalScore',
          key: 'totalScore',
          align: 'center',
          sorter: (a, b) => a.totalScore - b.totalScore,
        },
      ]
      ;
    Statistics && Statistics[0] && Statistics[0].jobCategorys && Statistics[0].jobCategorys.map(({ name, category }, index) => {
      columnsScoringStatistics.push({ title: name, dataIndex: 'category' + category, key: 'category' + category, align: 'center', sorter: (a, b) => a['category1' + category] - b['category1' + category], })
    })

    //学生得分统计DataSource
    let ScoringStatisticsDataSource = [];
    Statistics && Statistics.map(({ rank, userName, totalScore, jobCategorys, totalScoreLevel }, index) => {
      let DataSourceItem = { key: index + 1, number: index + 1, userName, rank, totalScore, totalScoreLevel };
      jobCategorys && jobCategorys.map(({ category, score, scoreLevel }, index) => {
        DataSourceItem['category' + category] = query.jobType == 1 ? scoreLevel : score;
        DataSourceItem['category1' + category] = score;
      })
      ScoringStatisticsDataSource.push(DataSourceItem);
    })
    //学生得分统计ModalDataSource
    let ScoringStatisticsModalDataSource = [];
    StatisticsModal && StatisticsModal.data && StatisticsModal.data.map(({ rank, userName, totalScore, jobCategorys }, index) => {
      let ModalDataSourceItem = { key: index + 1, number: index + 1, userName, rank, totalScore };
      jobCategorys && jobCategorys.map(({ category, score }, index) => {
        ModalDataSourceItem['category' + category] = score;
      })
      ScoringStatisticsModalDataSource.push(ModalDataSourceItem);
    })
    //成绩分布表Column
    const goalTableColumn = [
      {
        title: '分段',
        dataIndex: 'segmentation',
        key: 'segmentation',
        align: 'center',
      },
      {
        title: '人数及占比',
        dataIndex: 'proportion',
        key: 'proportion',
        align: 'center',
      },
    ];

    return (
      <Page header={header} loading={!!loading}>
        <div id='classReportLinkSection' className='classReport-print-shrink'>
          {Situation && (Object.keys(Situation).length !== 0) ?
            <ReportLayout url={bannerImgUrl} >
              <div className={styles['assignHeaderTitle']}>
                <p>{Situation.className ? <span><IconFont type='icon-zongrenshu' className={styles['icon']} />{Situation.className}</span> : <Spin />}</p>
                <p>{Situation.jobName ? <span><IconFont type='icon-kaoshi' className={styles['icon']} />{Situation.jobName}</span> : <Spin />}</p>
                {/* <p><a onClick={this.PrintTheReport}>打印报告</a></p> ---------------------------------------------------------------------------------*/}
              </div>
              <div className={styles['assignHeaderTitleBottom']}>
                <div className={styles['item']}>
                  <div className={styles['Avatar']}><IconFont type='icon-zongrenshu2' style={{ color: '#fff', fontSize: '22px' }} /></div>
                  <div>
                    <p>总人数</p>
                    <p>{Situation.total || Situation.total == 0 ? Situation.total : <Spin />}<span className={styles['span']}>&nbsp;&nbsp;人</span></p>
                  </div>
                </div>
                <div className={styles['item']}>
                  <div className={styles['Avatar']}><IconFont type='icon-yitijiaorenshu' /></div>
                  <div>
                    <p>已提交人数</p>
                    <p>{Situation.compeleteSum || Situation.compeleteSum == 0 ? Situation.compeleteSum : <Spin />}<span className={styles['span']}>&nbsp;&nbsp;人</span></p>
                  </div>
                </div>
                <div className={styles['item']}>
                  <div className={styles['Avatar']}><IconFont type='icon-yipirenshu' /></div>
                  <div>
                    <p>已批改人数</p>
                    <p>{Situation.correctSum || Situation.correctSum == 0 ? Situation.correctSum : <Spin />}<span className={styles['span']}>&nbsp;&nbsp;人</span></p>
                  </div>
                </div>
              </div>
              {query.jobType != 1 && <div className={classNames(styles['assignHeader'], 'classReport-sprin-section1')}>

                <div className={classNames(styles['assignHeaderL1'])} id='classReportLinkSection1'>
                  <div className={styles['chartName']}><span className={styles['mark']}></span><span>总分得分率分布</span></div>
                  <div className={styles['chart']}>
                    {ScoreRate && (Object.keys(ScoreRate).length !== 0) ?
                      <RoseDiagram findClassReportTotalScoreRate={ScoreRate} /> :
                      <Spin className={styles['Spins']} />
                    }
                  </div>
                </div>


                <div className={classNames(styles['assignHeaderL2'])}>
                  <div className={styles['chartName']}><span className={styles['mark']}></span><span>总分三分比较</span></div>
                  <div className={styles['chart']}>
                    {TreeScore && (Object.keys(TreeScore).length !== 0) ?
                      <ThreeGoalContrast /> :
                      <Spin className={styles['Spins']} />
                    }
                  </div>
                </div>

                <div className={classNames(styles['assignHeaderL3'])}>
                  <div className={styles['chartName']}><span className={styles['mark']}></span><span>完成率</span></div>
                  <div className={styles['chart']}>
                    {
                      Situation && (Object.keys(Situation).length !== 0) && NotCompleteStudentInfoList ?
                        <FinishingPercent /> :
                        <Spin className={styles['Spins']} />
                    }
                  </div>
                </div>
              </div>}
              <div className={styles['assignFooter']} id='classReportLinkSection2'>
                <ChartsTitle name='总分分布'>

                  <div className={styles['goalDistributeBox']}>
                    <div className={classNames(styles['chartName'], 'no-print')}>
                      {query.jobType != 1 && <Switch
                        checkedChildren="10分段"
                        unCheckedChildren="5分段"
                        style={{ marginRight: '20px', zIndex: '1' }}
                        onChange={this.segmentationSwitch}
                        defaultChecked={!query.diffeScore ? false : query.diffeScore == 5 ? false : true}
                      />}
                    </div>
                    <div className={classNames(styles['chart'], '')}>
                      <div className={classNames(styles['chart-M'], 'ClassReportgoalDistribute')}>
                        <p>成绩分布图</p>
                        <div className={styles['chart-mian']}>
                          {Distribution && (Object.keys(Distribution).length !== 0) ?
                            <GoalDistribute findClassReportTotalScoreDistribution={Distribution} id='ClassReportGoalDistributeID' /> :
                            <Spin>
                              <div className={styles['Spin']}></div>
                            </Spin>
                          }
                        </div>
                      </div>
                      <div className={classNames(styles['chart-T'], 'no-print')}>
                        <p>成绩分布表</p>
                        <Table columns={goalTableColumn} dataSource={backDataSource(Distribution, p)} style={{ width: '100%' }}
                          pagination={{ total: Distribution && Distribution.xData && Distribution.xData.length, pageSize: 10, current: p, position: ['bottomCenter'] }}
                          tableLayout='auto'
                          bordered
                          onChange={this.cjfbTableChange}
                        />
                      </div>
                    </div>
                  </div>
                </ChartsTitle>
              </div>
              {/* {questionCategoryScore && <div className={styles['Questiontypescore']} id='classReportLinkSection5'>
              {questionCategoryScore.length < 4 ? <div className={classNames(styles['assignHeaderL4'])}>
                <div className={styles['chartName']}><span className={styles['mark']}></span><span>题型得分情况</span></div> */}
              {existArr(questionCategoryScore) && <div id='classReportLinkSection5'>
                <ChartsTitle name='题型得分情况'>
                  {<div className={styles['Questiontypescore']}>
                    {questionCategoryScore.length < 4 ?
                      <div className={styles['chart']}>
                        {
                          questionCategoryScore.map((re, index) => <Progress
                            key={index}
                            className='gradeProgress'
                            percent={re.scoringRate||0}
                            strokeColor={colorArr[index]}
                            // className='gradeProgress'
                            strokeWidth={8}
                            width={200}
                            type="circle"
                            format={percent => (
                              <div className='gradeBox'>
                                <div>{re.category}</div>

                                <div>{re.scoringRate||0}%
                          </div>
                              </div>
                            )} />)
                        }
                      </div>
                      :
                      <QuestionTypeScore className={styles['QuestionTypeScore']} />
                    }
                  </div>
                  }
                </ChartsTitle>
              </div>}
              {/*如果没有选项则不展示客观题*/}
              <div id='classReportLinkSection3'>
                <ChartsTitle name='学生得分统计'>
                  {Objective && Objective.options.length > 0 && <div className={styles['objectiveItem']}>

                    <div className={classNames(styles['chart'], 'classReport-sprin-open')} style={{ maxHeight: unfoldStatisticsTable ? '20000px' : '600px' }}>
                      <Table
                        columns={columnsScoringStatistics}
                        dataSource={ScoringStatisticsDataSource}
                        bordered
                        pagination={false}
                        onChange={this.deFenTableChange}
                      />
                    </div>
                    {
                      ScoringStatisticsDataSource && ScoringStatisticsDataSource.length >= 10 ?
                        <div className={classNames(styles['chart-down'], 'no-print')} >
                          <a onClick={() => { this.setState({ unfoldStatisticsTable: !unfoldStatisticsTable }) }}>{!unfoldStatisticsTable ? <span>展开<DownOutlined /></span> : <span>收起<UpOutlined /></span>}</a>
                        </div> : null
                    }
                  </div>}
                </ChartsTitle>
              </div>
              {existArr(findExemQuestionDataAbility) &&
                <div className={classNames(styles['chart'], 'ClassReportAbilityLevel')} id='classReportLinkAbilityLevel'>
                  <ChartsTitle name='能力水平' subTitle='班级平均能力值'>
                    <AbilityLevel findExemQuestionDataAbility={findExemQuestionDataAbility} id='classReportfindExemQuestionDataAbility' />
                  </ChartsTitle>
                </div>}
              {existArr(findExemQuestionKnowStructure) && query.jobType != 1 &&
                <div className={classNames(styles['chart'], 'ClassReportAbilityLevel')} id='classReportLinkKnowledgeStructure'>
                  <ChartsTitle name='知识结构' subTitle='知识点得分率'>
                    <KnowledgeStructure findExemQuestionKnowStructure={findExemQuestionKnowStructure} id='classReportfindExemQuestionKnowStructure' />
                  </ChartsTitle>
                </div>}
              {
                existArr(findExemReportCognInfoOne) && query.jobType != 1 &&
                <div className={classNames(styles['chart'], 'ClassReportAbilityLevel')} id='classReportLinkCognitiveLevelCognInfo'>
                  <ChartsTitle name='认知层次'>
                    <CognitiveLevel
                      location={location}
                      dispatch={dispatch}
                      id='classReportfindExemReportCognInfo'
                      loading={loading}
                      findExemReportCognInfo={findExemReportCognInfo}
                      findExemReportCognInfoOne={findExemReportCognInfoOne}
                      model='topicManage'
                      text='findExemReportCognInfo'
                      name='认知层次'
                    />
                  </ChartsTitle>
                </div>
              }
              {
                existArr(findExemReporTabilityInfoOne) && query.jobType != 1 &&
                <div className={classNames(styles['chart'], 'ClassReportAbilityLevel')} id='classReportLinkCognitiveLevelTabilityInfo'>
                  <ChartsTitle name='关键能力'>
                    <CognitiveLevel
                      location={location}
                      dispatch={dispatch}
                      id='classReportfindExemReporTabilityInfo'
                      loading={loading}
                      findExemReportCognInfo={findExemReporTabilityInfo}
                      findExemReportCognInfoOne={findExemReporTabilityInfoOne}
                      model='topicManage'
                      text='findExemReporTabilityInfo'
                      name='关键能力'
                    />
                  </ChartsTitle>
                </div>
              }
              {
                existArr(findExemReportCompInfoOne) && query.jobType != 1 &&
                <div className={classNames(styles['chart'], 'ClassReportAbilityLevel')} id='classReportLinkCognitiveLevelCompInfo'>
                  <ChartsTitle name='核心素养'>
                    <CognitiveLevel
                      location={location}
                      dispatch={dispatch}
                      id='classReportfindExemReportCompInfo'
                      loading={loading}
                      findExemReportCognInfo={findExemReportCompInfo}
                      findExemReportCognInfoOne={findExemReportCompInfoOne}
                      model='topicManage'
                      text='findExemReportCompInfo'
                      name='核心素养'
                    />
                  </ChartsTitle>
                </div>
              }
              {existArr(findExemQuestionDataAnalysis) && <div id="classReportLinkSection-6">
                <ChartsTitle name='考题参数分析'>
                  <ParameterAnalysisTable findExemQuestionDataAnalysis={findExemQuestionDataAnalysis} location={location} />
                </ChartsTitle>
              </div>}
              {/* {query.jobType == 1 &&<ChartsTitle name='错题分析'>
                <WrongTopicTable location={location} exemQuestionExpetionAnalysis={findStudentReportErrorQuestionAnalysis} />
              </ChartsTitle>} */}
              <div className={classNames(styles['Anchorfixed'], 'no-print')}>
                {unfoldAnchorfixed ?
                  <Anchor offsetTop={120} onClick={(e, link) => { e.preventDefault() }} affix={false} showInkInFixed={true}>
                    <Link href="#classReportLinkSection" title="班级报告" />
                    {query.jobType != 1 && <Link href="#classReportLinkSection1" title="总得分率分布" />}
                    <Link href="#classReportLinkSection2" title="总分分布" />
                    {existArr(questionCategoryScore) && <Link href="#classReportLinkSection5" title="题型得分情况" />}
                    <Link href="#classReportLinkSection3" title="学生得分统计" />
                    {existArr(findExemQuestionDataAbility) && <Link href="#classReportLinkAbilityLevel" title="能力水平" />}
                    {existArr(findExemQuestionKnowStructure) && query.jobType != 1 && <Link href="#classReportLinkKnowledgeStructure" title="知识结构" />}
                    {existArr(findExemReportCognInfoOne) && query.jobType != 1 && <Link href="#classReportLinkCognitiveLevelCognInfo" title="认知层次" />}
                    {existArr(findExemReportCompInfoOne) && query.jobType != 1 && <Link href="#classReportLinkCognitiveLevelTabilityInfo" title="关键能力" />}
                    {existArr(findExemReporTabilityInfoOne) && query.jobType != 1 && <Link href="#classReportLinkCognitiveLevelCompInfo" title="核心素养" />}
                    {existArr(findExemQuestionDataAnalysis) && <Link href="#classReportLinkSection-6" title="考题参数分析" />}
                  </Anchor> : null
                }
                <div className={styles['DoubleRightOutlined']} onClick={() => { this.setState({ unfoldAnchorfixed: !unfoldAnchorfixed }) }}>
                  {unfoldAnchorfixed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
                  {/* <DoubleLeftOutlined /> */}
                </div>
              </div>
              <div className={classNames(styles['printfixed'], 'no-print')} onClick={this.PrintTheReport}>
                <div className={styles['print']}><IconFont type='icon-daochu' /></div>
                <p>导出报告</p>
              </div>
            </ReportLayout>
            :
            <Spin>
              <div className={styles['Empty']}><Empty /></div>
            </Spin>
          }
        </div>
      </Page>
    )
  }
}

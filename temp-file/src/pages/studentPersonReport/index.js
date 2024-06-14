/**
 *@Author:ChaiLong
 *@Description: 学生个人报告
 *@Date:Created in  2020/9/28
 *@Modified By:
 */
import React from 'react';
import styles from './studentPersonReport.less'
import { Affix, Button } from "antd";
import { connect } from 'dva'
import { StudentPersonReport as namespace, PayCenter } from '@/utils/namespace'
import Page from "@/components/Pages/page";
import ChartsTitle from "@/components/ReportComponents/ChartsTitle";
import { existArr, existObj, getIcon, getLocationObj } from "@/utils/utils";
import TreeCompare from "./components/treeCompare";
import TestPaperAnalyse from "./components/testPaperAnalyse"
import ReportAnalyse from "./components/reportAnalyse";
import TestScoresAnalyse from "./components/testScoresAnalyse";
import SubjectAnalyse from "./components/subjectAnalyse";
import PersonReportProgress from "./components/personReportProgress";
import TotalScoreDistribution from "./components/TotalScoreDistribution";
import TestParameterAnalysisTable from "./components/TestParameterAnalysisTable";
import AbnormalAnalysisOfAnswersTable from "./components/AbnormalAnalysisOfAnswersTable";
import WrongTopicTable from "./components/WrongTopicTable";
import KnowledgeStructure from "@/components/Charts/KnowledgeStructure";
import AbilityLevel from "./components/AbilityLevel";
import CognitiveLevel from "@/components/AssignTask/charts/CognitiveLevel";
import BackBtns from "@/components/BackBtns/BackBtns";
import { findKnowledgePointAnalysis } from "@/services/studentPersonReport";
import ReportPay from "@/components/ReportPay/reportPay";

const IconFont = getIcon();
@connect(state => ({
  findStudentReportTotalScore: state[namespace].findStudentReportTotalScore,//获取学生个人分数
  findStudentTreeScoreCompare: state[namespace].findStudentTreeScoreCompare,//三分比较
  paperAnalysisDetails: state[namespace].paperAnalysisDetails,//卷面分析/知识点分析/题目分析
  questionTypeScore: state[namespace].questionTypeScore,//题型得分情况
  findKnowledgePointAnalysis: state[namespace].findKnowledgePointAnalysis,//知识点分析
  findStudentPrivateReport: state[namespace].findStudentPrivateReport,//知识结构;答题异常分析;考题参数分析
  findStudentAbilityLevel: state[namespace].findStudentAbilityLevel,//能力水平
  findStudentReportTotalScoreDistribution: state[namespace].findStudentReportTotalScoreDistribution,//总得分分布 
  findStudentKeyAbility: state[namespace].findStudentKeyAbility,//关键能力
  findStudentKeyCompetencies: state[namespace].findStudentKeyCompetencies,//核心素养
  findStudentCognitionLevel: state[namespace].findStudentCognitionLevel,//认知层次
  findStudentKeyAbilityOne: state[namespace].findStudentKeyAbilityOne,//关键能力One
  findStudentKeyCompetenciesOne: state[namespace].findStudentKeyCompetenciesOne,//核心素养One
  findStudentCognitionLevelOne: state[namespace].findStudentCognitionLevelOne,//认知层次One
  findStudentReportErrorQuestionAnalysis: state[namespace].findStudentReportErrorQuestionAnalysis,//错题分析
  isBuyGoods: state[PayCenter].isBuyGoods,//是否已经支付当前报告
  loading: state[namespace].loading
}))
export default class StudentPersonReport extends React.Component {
  componentWillUnmount() {
    this.props.dispatch({
      type: namespace + '/saveState',
      payload: {
        findStudentReportTotalScore: undefined,//获取学生个人分数
        findStudentTreeScoreCompare: undefined,//三分比较
        paperAnalysisDetails: undefined,//卷面分析/知识点分析/题目分析
        questionTypeScore: undefined,//题型得分情况
        findKnowledgePointAnalysis: undefined,//知识点分析
        findStudentPrivateReport: undefined,//知识结构;答题异常分析;考题参数分析
        findStudentAbilityLevel: undefined,//能力水平
        findStudentReportTotalScoreDistribution: undefined,//总得分分布 
        findStudentKeyAbility: undefined,//关键能力
        findStudentKeyCompetencies: undefined,//核心素养
        findStudentCognitionLevel: undefined,//认知层次
        findStudentKeyAbilityOne: undefined,//关键能力One
        findStudentKeyCompetenciesOne: undefined,//核心素养One
        findStudentCognitionLevelOne: undefined,//认知层次One
      }
    })
    /**
* 页面组件即将卸载时：清空数据
*/
    //   this.setState = (state, callback) => {
    //     return;
    // };
  }
  render() {
    const {
      findKnowledgePointAnalysis, findStudentReportTotalScore = {}, loading = false,
      findStudentTreeScoreCompare = {}, paperAnalysisDetails = {}, questionTypeScore = {}, location, isBuyGoods = false, dispatch,
      findStudentPrivateReport = {},
      findStudentAbilityLevel,
      findStudentKeyAbility,
      findStudentKeyCompetencies,
      findStudentReportTotalScoreDistribution,
      findStudentCognitionLevel,
      findStudentKeyAbilityOne,
      findStudentKeyCompetenciesOne,
      findStudentCognitionLevelOne,
      findStudentReportErrorQuestionAnalysis
    } = this.props;
    const _location = getLocationObj(location);
    const { query } = _location || {};
    const reportTotalScore = existObj(findStudentReportTotalScore) ? findStudentReportTotalScore : '';//学生得分
    const _findStudentTreeScoreCompare = existObj(findStudentTreeScoreCompare) ? { ...findStudentTreeScoreCompare } : '';//三分比较
    const _paperAnalysisDetails = existArr(paperAnalysisDetails) ? [...paperAnalysisDetails] : '';//卷面分析/知识点分析/题目分析
    const _findKnowledgePointAnalysis = existArr(findKnowledgePointAnalysis) ? [...findKnowledgePointAnalysis] : '';//知识点分析
    const _questionTypeScore = existArr(questionTypeScore) ? [...questionTypeScore] : '';//题型得分情况
    const parameterAnalysis = findStudentPrivateReport.exemQuestionDataAnalysis ? findStudentPrivateReport.exemQuestionDataAnalysis : [];//考题参数分析
    const exemQuestionExpetionAnalysis = findStudentPrivateReport.exemQuestionExpetionAnalysis ? findStudentPrivateReport.exemQuestionExpetionAnalysis : {};//答题异常分析
    const title = '学生个人报告';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );

    return (
      <Page header={header} loading={!!loading}>
        {/* 2021-9-24 xiongwei  报告取消付费------------------------- */}
        {/* {query && parseInt(query.equities, 10) ? */}
          <div>
            <div className={styles['pageName']} style={{ backgroundImage: 'url("https://reseval.gg66.cn/personal-report-bg.png")' }} />
            <div className={styles['studentPersonReport']}>
              <Affix offsetTop={300}>
                <div className={styles['affixPrint']}>
                  <div className={styles['printBox']} onClick={() => window.print()}>
                    <div className={styles['iconBox']}>
                      <IconFont style={{ fontSize: "60px", color: "white" }} type={'icon-daochu'} />
                    </div>
                    打印报告
                  </div>
                </div>
              </Affix>

              <div className={`${styles['content']} ${styles['contentPrint']}`}>
                <div className={`${styles['headerTitle']}`}>
                  <div className={`${styles['headerTitle-name']}`}>
                    <div><IconFont style={{ fontSize: 35, color: '#838383' }}
                      type={'icon-xuexiaobanji'} />{reportTotalScore && reportTotalScore.className}</div>
                    <div>{reportTotalScore && reportTotalScore.userName}</div>
                    <div><IconFont style={{ fontSize: 35, color: '#838383' }}
                      type={'icon-kaoshi'} />{reportTotalScore.jobName}
                    </div>
                  </div>
                  {
                    query.jobType == 1 ?
                      <div className={`${styles['headerTitle-score']}`}>
                        我的等级:&nbsp;
                        {findStudentReportTotalScore.scoreLevel}&nbsp;&nbsp;&nbsp;&nbsp;{findStudentReportTotalScore.standard}
                      </div> : ''
                  }
                </div>

                {reportTotalScore &&query.jobType != 1? <PersonReportProgress reportTotalScore={reportTotalScore} /> : ''}

                {/* <ChartsTitle name={'总分三分比较'}>
                  {reportTotalScore && _findStudentTreeScoreCompare ?
                    <TreeCompare reportTotalScore={reportTotalScore}
                                 location={_location}
                                 findStudentTreeScoreCompare={_findStudentTreeScoreCompare}/> : ''}
                </ChartsTitle> */}
                {findStudentReportTotalScoreDistribution &&
                  <ChartsTitle name={'总分得分分布'}>
                    <TotalScoreDistribution findStudentReportTotalScoreDistribution={findStudentReportTotalScoreDistribution} location={location}/>
                  </ChartsTitle>
                }
                {
                  _questionTypeScore ?
                    <ChartsTitle name={'题型得分情况'}>
                      <TestScoresAnalyse location={_location} questionTypeScore={_questionTypeScore} />
                    </ChartsTitle>
                    : ''}
                <ChartsTitle name={'考题参数分析'}>
                  <TestParameterAnalysisTable location={_location} parameterAnalysis={parameterAnalysis} />
                </ChartsTitle>
                {query.jobType != 1&&<ChartsTitle name={'答题异常分析'}>
                  <AbnormalAnalysisOfAnswersTable location={_location} exemQuestionExpetionAnalysis={exemQuestionExpetionAnalysis} />
                </ChartsTitle>}
                <ChartsTitle name={'错题分析'}>
                  <WrongTopicTable location={_location} exemQuestionExpetionAnalysis={findStudentReportErrorQuestionAnalysis} />
                </ChartsTitle>
                {query.jobType != 1&&<ChartsTitle name={'卷面分析'} subTitle={"（根据每个题目难度，与全班得分率进行对比）"}>
                  {
                    _paperAnalysisDetails ?
                      <TestPaperAnalyse location={_location} paperAnalysisDetails={_paperAnalysisDetails} /> : ''
                  }
                </ChartsTitle>}
                {existArr(findStudentAbilityLevel) &&query.jobType != 1&&
                  <ChartsTitle name={'能力水平'}>
                    <AbilityLevel findStudentAbilityLevel={findStudentAbilityLevel} />
                  </ChartsTitle>
                }
                {findStudentPrivateReport && existArr(findStudentPrivateReport.knowledgeStructure) &&query.jobType != 1&& <ChartsTitle name={'知识结构'}>
                  <KnowledgeStructure findExemQuestionKnowStructure={findStudentPrivateReport.knowledgeStructure} id='individualReportKnowledgeStructureChart' />
                </ChartsTitle>}
                {query.jobType != 1&&<ChartsTitle name={'知识点分析'}>
                  {
                    reportTotalScore && _findKnowledgePointAnalysis ?
                      <ReportAnalyse subject={reportTotalScore.subjectName}
                        findKnowledgePointAnalysis={_findKnowledgePointAnalysis} /> : ''
                  }
                </ChartsTitle>}

                {query.jobType != 1&&<div className='no-print'>
                  {existArr(findStudentCognitionLevelOne) &&
                    <ChartsTitle name={'认知层次'}>
                      <CognitiveLevel
                        location={location}
                        dispatch={dispatch}
                        id='individualReportfindStudentCognitionLevelcharst'
                        loading={loading}
                        findExemReportCognInfo={findStudentCognitionLevel}
                        findExemReportCognInfoOne={findStudentCognitionLevelOne}
                        model='studentPersonReport'
                        text='findStudentCognitionLevel'
                        name='认知层次'
                      />
                    </ChartsTitle>}
                  {existArr(findStudentKeyAbilityOne) &&
                    <ChartsTitle name={'关键能力'}>
                      <CognitiveLevel
                        location={location}
                        dispatch={dispatch}
                        id='individualReportfindStudentKeyAbilitycharst'
                        loading={loading}
                        findExemReportCognInfo={findStudentKeyAbility}
                        findExemReportCognInfoOne={findStudentKeyAbilityOne}
                        model='studentPersonReport'
                        text='findStudentKeyAbility'
                        name='关键能力'
                      />
                    </ChartsTitle>}
                  {existArr(findStudentKeyCompetenciesOne) &&
                    <ChartsTitle name={'核心素养'}>
                      <CognitiveLevel
                        location={location}
                        dispatch={dispatch}
                        id='individualReportfindStudentKeyCompetenciesLevelcharst'
                        loading={loading}
                        findExemReportCognInfo={findStudentKeyCompetencies}
                        findExemReportCognInfoOne={findStudentKeyCompetenciesOne}
                        model='studentPersonReport'
                        text='findStudentKeyCompetencies'
                        name='核心素养'
                      />
                    </ChartsTitle>}
                </div>}
                {/* <ChartsTitle name={'题目分析'}>
                  {
                    _paperAnalysisDetails ?
                      <SubjectAnalyse paperAnalysisDetails={_paperAnalysisDetails}/> : ''
                  }
                </ChartsTitle> */}
              </div>
              <BackBtns />
            </div>
          </div>
        {/* //   :
        //   <ReportPay location={location} />
        // } */}
      </Page>
    )
  }
}

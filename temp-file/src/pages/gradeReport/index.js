/**
 *@Author:熊伟
 *@Description: 年级报告
 *@Date:Created in  2021/4/28
 *@Modified By:
 */
import React from 'react';
import styles from './index.less'
// import { Affix, Button } from "antd";
import { connect } from 'dva'
import { GradeReport as namespace, PayCenter } from '@/utils/namespace'
import Page from "@/components/Pages/page";
import ChartsTitle from '@/components/Charts/ChartsTitle'
import BackBtns from "@/components/BackBtns/BackBtns";
import { existArr, existObj, getIcon, getLocationObj } from "@/utils/utils";
import ReportLayout from "@/components/ReportComponents/ReportLayout";
import GradeReportThreePointComparison from "./components/GradeReportThreePointComparison";
import ScoreDistributionCompontent from "./components/ScoreDistributionCompontent";
import TotalScoreDistributionCompontent from "./components/TotalScoreDistributionCompontent";
import StudentScoreStatistics from "./components/StudentScoreStatistics";
import PerformanceCompetitiveness from "./components/PerformanceCompetitiveness";
import BreakdownOfQuestionsTable from "./components/BreakdownOfQuestionsTable";
import FourElementsTable from "./components/FourElementsTable";
import GradeLevel from "@/components/Charts/GradeLevel";
import { Spin } from 'antd';

const IconFont = getIcon();
@connect(state => ({
    loading: state[namespace].findGradeReportStudentCountLoading,
    GradeReportStudentCount: state[namespace].findGradeReportStudentCount,//统计考生参考情况
    GradeReporteClassAbilityList: state[namespace].findGradeReporteClassAbility,//能力水平
    ExamReportCompetenceList: state[namespace].findExamReportCompetence,//核心素养
    ExamReportKeyAbilityList: state[namespace].findExamReportKeyAbility,//关键能力
    ExamReportCognizeList: state[namespace].findExamReportCognize,//认知层次
}))
export default class GradeReport extends React.Component {
    componentWillUnmount() {
        
        this.props.dispatch({
            type: namespace + '/saveState',
            payload: {
                findGradeReportStudentCount: {},//统计考生参考情况
                findGradeReportTreeScore: undefined,//三分比较/成绩竞争力
                GradeReporteClassAbilityList: undefined,//能力水平
                findGradeExamReportScore: {},//总分分布
                findExamScoreList: {},//学生得分统计
                GradeReportQuestionDetailList: {},//考题细目表
                findExamReportCompetence: undefined,//核心素养
                findExamReportKeyAbility: undefined,//关键能力
                findExamReportCognize: undefined,//认知层次
            }
        })
        /**
    * 页面组件即将卸载时：清空数据
    */
        this.setState = (state, callback) => {
            return;
        };
    }
    componentDidMount(){
    }
    render() {
        const {
            loading,
            location,
            GradeReportStudentCount = {},//统计考生参考情况
            GradeReporteClassAbilityList = [],//能力水平
            ExamReportCompetenceList = {},//核心素养
            ExamReportKeyAbilityList = {},//关键能力
            ExamReportCognizeList = {},//认知层次
        } = this.props; 
        const bannerImgUrl = 'https://res-temp.gg66.cn/grade-report.png'
        const title = '年级报告';
        const breadcrumb = [title];
        const header = (
            <Page.Header breadcrumb={breadcrumb} title={title} />
        );

        return (
            <Page header={header} loading={!!loading}>
                <div>
                    <ReportLayout url={bannerImgUrl}>
                        <div>
                            <div className={styles['GradeReport-name']}>
                                <p> <span><IconFont type='icon-kaoshi' className={styles['icon']} />{GradeReportStudentCount.jobName}</span> </p>
                            </div>
                            <div className={styles['GradeReport-title']}>
                                <div className={styles['item']}>
                                    <div className={styles['Avatar']}><IconFont type='icon-zongrenshu2' style={{ color: '#fff', fontSize: '22px' }} /></div>
                                    <div>
                                        <p>总人数</p>
                                        <p>{GradeReportStudentCount.total}<span className={styles['span']}>&nbsp;&nbsp;人</span></p>
                                    </div>
                                </div>
                                <div className={styles['item']}>
                                    <div className={styles['Avatar']}><IconFont type='icon-zongrenshu2' style={{ color: '#fff', fontSize: '22px' }} /></div>
                                    <div>
                                        <p>实际参考人数</p>
                                        <p>{GradeReportStudentCount.compeleteSum}<span className={styles['span']}>&nbsp;&nbsp;人</span></p>
                                    </div>
                                </div>
                                <div className={styles['item']}>
                                    <div className={styles['Avatar']}><IconFont type='icon-zongrenshu2' style={{ color: '#fff', fontSize: '22px' }} /></div>
                                    <div>
                                        <p>缺考人数</p>
                                        <p>{GradeReportStudentCount.notCompeleteSum}<span className={styles['span']}>&nbsp;&nbsp;人</span></p>
                                    </div>
                                </div>
                            </div>
                            <ChartsTitle name='三分比较'>
                                <GradeReportThreePointComparison location={location} />
                            </ChartsTitle>
                            <ChartsTitle name='得分率分布'>
                                <ScoreDistributionCompontent location={location} />
                            </ChartsTitle>
                            <ChartsTitle name='总分分布'>
                                <TotalScoreDistributionCompontent location={location} />
                            </ChartsTitle>
                            <ChartsTitle name='学生得分统计'>
                                <StudentScoreStatistics location={location} />
                            </ChartsTitle>
                            <ChartsTitle name='成绩竞争力'>
                                <PerformanceCompetitiveness location={location} />
                            </ChartsTitle>
                            <ChartsTitle name='能力水平'>
                                {
                                    existArr(GradeReporteClassAbilityList) ?
                                        <GradeLevel GradeReporteClassAbilityList={GradeReporteClassAbilityList} id='gradeReportGradeLevelChartsId' /> :
                                        <div className={styles['GradeLevel-Spin']}>
                                            <Spin />
                                        </div>
                                }
                            </ChartsTitle>
                            <ChartsTitle name='考题细目表'>
                                <BreakdownOfQuestionsTable location={location} />
                            </ChartsTitle>
                            {existArr(ExamReportCognizeList.data) && <ChartsTitle name='认知层次'>
                                <FourElementsTable ExamReportList={ExamReportCognizeList} type='findExamReportCognize' location={location} />
                            </ChartsTitle>}
                            {existArr(ExamReportKeyAbilityList.data) && <ChartsTitle name='关键能力'>
                                <FourElementsTable ExamReportList={ExamReportKeyAbilityList} type='findExamReportKeyAbility' location={location} />
                            </ChartsTitle>}
                            {existArr(ExamReportCompetenceList.data) && <ChartsTitle name='核心素养'>
                                <FourElementsTable ExamReportList={ExamReportCompetenceList} type='findExamReportCompetence' location={location} />
                            </ChartsTitle>}
                        </div>
                        <div className='no-print'>
                            <BackBtns tipText={"返回"} />
                        </div>
                    </ReportLayout>
                </div>
            </Page>
        )
    }
}
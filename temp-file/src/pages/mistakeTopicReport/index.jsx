/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2021/3/8
 *@Modified By:
 */
import React from 'react';
import styles from './mistakeTopicReport.less'
import {existArr, existObj, getIcon, getLocationObj,calculateSerialNumber} from "@/utils/utils";
import Page from "@/components/Pages/page";
import {connect} from 'dva'
import {MistakeTopicReport as namespace, StudentPersonReport} from "@/utils/namespace";
import ChartsTitle from "@/components/ReportComponents/ChartsTitle";
import {Affix, Table} from "antd";
import BackBtns from "@/components/BackBtns/BackBtns";
import ReportPay from "@/components/ReportPay/reportPay";
import SubjectAnalyse from "../studentPersonReport/components/subjectAnalyse";
import KnowledgeStructure from "./components/knowledgeStructure";
import DetailsModal from "./components/detailsModal";
import paginationConfig from "@/utils/pagination";
import userInfoCache from "@/caches/userInfo";
import WrongTopicTable from "../studentPersonReport/components/WrongTopicTable";
const IconFont = getIcon();
@connect(state => ({
  loading: state[namespace].loading,
  findClassErrorQuestionTask: state[namespace].findClassErrorQuestionTask,//查询报告基本信息（基本信息及知识结构）
  findErrorTrainList: state[namespace].findErrorTrainList,//获取错题专练列表统计
  findClassAnalysisTableInfo: state[namespace].findClassAnalysisTableInfo,//获取错题分析统计详情
  findClassAnalysisTable: state[namespace].findClassAnalysisTable,//获取错题分析统计
  findStudentReportErrorQuestionAnalysis: state[namespace].findStudentReportErrorQuestionAnalysis,//错题分析
}))
export default class MistakeTopicReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageAnalysis: 1,
      pageTrain: 1
    };
  }

  componentWillUnmount() {
    //清除页面数据
    this.props.dispatch({
      type: namespace + '/set',
      payload: {
        findClassErrorQuestionTask: {},
        findErrorTrainList: {},
        findClassAnalysisTable: {}
      }
    })
  }

  /**
   * 获取detailRef
   * @param ref
   */
  getDetailRef = (ref) => {
    this.detailRef = ref;
  }


  render() {
    const title = '错题报告';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title}/>
    );
    const {pageAnalysis, pageTrain} = this.state;
    const {dispatch, loading = false, location = {}, findClassErrorQuestionTask = {}, findClassAnalysisTable = {}, findErrorTrainList = {},findStudentReportErrorQuestionAnalysis} = this.props;
    const _location = getLocationObj(location) || {};
    const {query} = _location || {};
    const {jobMap, knowList} = existObj(findClassErrorQuestionTask) ? findClassErrorQuestionTask : {};//学生得分
    const {data: analysisData = [], total: analysisTotal = ''} = existObj(findClassAnalysisTable) || {};//错题分析表
    const {data: trainData = [], total: trainTotal = ''} = existObj(findErrorTrainList) || {};
    const {classId} = existObj(userInfoCache()) || {};


    //错题分析表
    const answerAnalyseColumns = [
      {
        title: '题号',
        dataIndex: 'CODE',
        align: 'center',
        key: 'CODE'
      },
      {
        title: '题型',
        align: 'center',
        dataIndex: 'categoryName',
        key: 'categoryName',
      },
      {
        title: '难度',
        align: 'center',
        dataIndex: 'difficulty',
        key: 'difficulty',
      },
      {
        title: '能力要求',
        align: 'center',
        key: 'abilityNeed',
        dataIndex: 'abilityNeed'
      },
      {
        title: '能力水平',
        align: 'center',
        key: 'ability',
        dataIndex: 'ability'
      },
      {
        title: '知识点',
        align: 'center',
        key: 'knowName',
        dataIndex: 'knowName'
      },
      {
        title: '认知层次',
        align: 'center',
        key: 'cognLevelName',
        dataIndex: 'cognLevelName',
        render: (text) => <span>{text ? text : '--'}</span>
      },
      {
        title: '关键能力',
        align: 'center',
        key: 'keyAbilityName',
        dataIndex: 'keyAbilityName',
        render: (text) => <span>{text ? text : '--'}</span>
      },
      {
        title: '错误人数',
        align: 'center',
        key: 'deviantNum',
        dataIndex: 'deviantNum'
      },
      {
        title: '异常错误人数',
        align: 'center',
        key: 'deviantScoreNum',
        dataIndex: 'deviantScoreNum'
      },
      {
        title: '学生失分名单',
        render: (text, record) => <a onClick={() => openDetailModal(record, 'analysis')}>学生失分名单</a>
      },
    ];


    //错题专练
    const mistakeExerciseColumns = [
      {
        title: '序号',
        align: 'center',
        dataIndex: 'studentName',
        key: 'studentName',
        render:(text,record,index)=><span>{calculateSerialNumber(index,pageTrain,10)}</span>
      },
      {
        title: '姓名',
        align: 'center',
        dataIndex: 'studentName',
        key: 'studentName',
      },
      {
        title: '错题数量',
        align: 'center',
        dataIndex: 'errorNum',
        key: 'errorNum',
      },
      {
        title: '已掌握题数',
        align: 'center',
        dataIndex: 'haveMastered',
        key: 'haveMastered',
      },
      {
        title: '未掌握题数',
        align: 'center',
        dataIndex: 'notMastered',
        key: 'notMastered',
      },
      // {
      //   title: '错题专练正确率',
      //   align: 'center',
      //   dataIndex: 'correctRate',
      //   key: 'correctRate',
      //   render: (text) => <span>{text ? text + '%' : ''}</span>
      // },
      {
        title: '详情',
        align: 'center',
        render: (text, record) => <a onClick={() => openDetailModal(record, 'train')}>详情</a>
      },
    ];

    //列表分页、排序、筛选变化时触发
    const handleTableChange = (page, subscript) => {
      switch (subscript) {
        case 'pageAnalysis':
          dispatch({
            type: namespace + "/findClassAnalysisTable",
            payload: {
              jobId: query.jobId,
              classId: classId || query.classId,
              page: page.current || 1,
              size: 10
            }
          })
          break
        case 'pageTrain':
          dispatch({
            type: namespace + '/findErrorTrainList',
            payload: {
              jobId: query.jobId,
              page: page.current || 1,
              size: 10
            }
          })
          break
        default:
          break
      }

      this.setState({[subscript]: page.current})
    };

    /**
     * 详情开关
     * @param record
     * @param status
     */
    const openDetailModal = (record, status) => {
      switch (status) {
        case 'analysis':
          dispatch({
            type: namespace + "/findClassAnalysisTableInfo",
            payload: {
              jobId: query.jobId,
              questionId: record.questionId || '',
            },
            callback: () => {
              this.detailRef.detailSwitch(true)
            }
          })
          break
        case 'train':
          dispatch({
            type: namespace + '/findErrorTrainInfoByUserId',
            payload: {
              jobId: query.jobId,
              userId: record.userId,
              classId: classId
            },
            callback: () => {
              this.detailRef.detailSwitch(true)
            }
          })
          break
        default:
          break
      }

    }

    return (
      <Page header={header} loading={!!loading}>
        {/* 2021-9-24 xiongwei  报告取消付费------------------------- */}
        {/* {query && parseInt(query.equities, 10) ? */}
          <div>
            <div className={styles['pageName']}
                 style={{backgroundImage: 'url("https://resformalqb.gg66.cn/wrong-report-top-bg.png")'}}/>
            <div id={styles['mistakeTopicReport']}>
              <div className={`${styles['content']} ${styles['contentPrint']}`}>
                {
                  existObj(jobMap) ? <div className={`${styles['headerTitle']}`}>
                    <div><IconFont style={{fontSize: 35, color: '#838383'}}
                                   type={'icon-xuexiaobanji'}/>{jobMap && jobMap.className}</div>
                    <div>{jobMap && jobMap.userName}</div>
                    <div><IconFont style={{fontSize: 35, color: '#838383'}}
                                   type={'icon-kaoshi'}/>{jobMap.paperName}
                    </div>
                  </div> : ''
                }

                <ChartsTitle name={'知识结构'} subTitle={"（知识点错误率）"}>
                  {existArr(knowList) ? <KnowledgeStructure knowList={knowList} location={_location}/> : ''}
                </ChartsTitle>


                <ChartsTitle name={'错题分析表'}>
                  <Table
                    onChange={(e) => handleTableChange(e, 'pageAnalysis')}
                    pagination={paginationConfig({p: pageAnalysis}, analysisTotal || 0)}
                    rowKey='CODE' columns={answerAnalyseColumns} dataSource={analysisData}/>,
                </ChartsTitle>

                <ChartsTitle name={'错题专练'}>
                  <Table
                    onChange={(e) => handleTableChange(e, 'pageTrain')}
                    pagination={paginationConfig({p: pageTrain}, trainTotal || 0)}
                    rowKey='userId' columns={mistakeExerciseColumns} dataSource={trainData}/>,
                </ChartsTitle>
                {/* {query.jobType == 1 &&<ChartsTitle name={'错题分析'}>
                  <WrongTopicTable location={_location} exemQuestionExpetionAnalysis={findStudentReportErrorQuestionAnalysis} />
                </ChartsTitle>} */}
              </div>
              <BackBtns/>
            </div>
            <DetailsModal onRef={this.getDetailRef} location={_location}/>

          </div>
        {/* //   :
        //   <ReportPay location={location}/>
        // } */}
      </Page>
    )
  }
}

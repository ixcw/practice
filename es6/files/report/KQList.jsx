/**
 * 知识点题目切换组件
 * @author:张江
 * @date:2020年08月20日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "dva";
import {
  Pagination,
  Empty,
  Spin,
  Button,
  Tabs,
  Message
} from 'antd';
// import { routerRedux } from 'dva/router';
// import queryString from 'query-string';
import { HomeIndex as namespace, Public } from '@/utils/namespace';
import { pushNewPage } from "@/utils/utils";
import paginationConfig from '@/utils/pagination';
import styles from './KQList.less';
import QuestionItem from "@/components/QuestionItem/QuestionItem";
import QuestionPaperItem from "@/components/QuestionPaperItem/QuestionPaperItem";
import MicroItem from "@/components/MicroItem/MicroItem";
import KnowledgeList from "@/components/KnowledgeList/KnowledgeList";
import tabButtonActiveKeyPageCache from "@/caches/tabButtonActiveKeyPage";

import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
import userInfo from "@/caches/userInfo";
import AddTask from "@/pages/assignTask/components/addTask";
import QuestionGroupItem from "./QuestionGroupItem";

TweenOne.plugins.push(Children);

@connect(state => ({
  studyList: state[Public].studyList,//学段
  subjectList: state[Public].subjectList,//科目列表
  versionList: state[Public].versionList,//版本列表
  knowledgeList: state[namespace].knowledgeList,//知识点列表
  knowledgeLoading: state[namespace].knowledgeLoading,//知识点加载中
  // questionList: state[namespace].questionList,//题目列表
  // questionLoading: state[namespace].questionLoading,//题目加载中
  total: state[namespace].total,//总页数
  examPaperList: state[namespace].examPaperList,//套题或者套卷列表
  questionVideoList: state[namespace].questionVideoList,//微课列表
  loading: state[namespace].loading,//加载中
  questionBoardStatistics: state[namespace].questionBoardStatistics,//试题板题目数量统计
}))
export default class KQList extends React.Component {
  constructor(props) {
    super(...arguments);
    const tabButtonActiveKeyPage = tabButtonActiveKeyPageCache() || {}
    this.state = {
      tabButtonActiveKey: tabButtonActiveKeyPage.key || 1,
      currentPage: tabButtonActiveKeyPage.page || 1,
      selectedParam: null,
      selectedItemId: null,
      taskTypeItems: [
        // 1-课前作业 2-课中作业 3-课后作业 4-单元测试 5-周末作业 6-假期作业
        {
          label: `课前作业`,
          key: '1',
          children: ``,
        },
        {
          label: `课中作业`,
          key: '2',
          children: ``,
        },
        {
          label: `课后作业`,
          key: '3',
          children: ``,
        },
        {
          label: `单元测试`,
          key: '4',
          children: ``,
        },
        {
          label: `周末作业`,
          key: '5',
          children: ``,
        },
        {
          label: `假期作业`,
          key: '6',
          children: ``,
        },
      ],
      taskTypeKey: '1',
      questionPaperList: [],
      questionPaperLoading: false,
      assignLoading: false,
    };
  };

  static propTypes = {
    singleItem: PropTypes.any,//数据
  };

  UNSAFE_componentWillMount() {

  }

  componentDidMount() {

  }

  /**
   * 题目tab切换
   * @param key  ：选中的key
   */
  onTabButtonChange = (key) => {
    const { selectedParam } = this.state;
    this.setState({
      tabButtonActiveKey: key,
    })
    tabButtonActiveKeyPageCache({ key, page: 1 })
    this.resetModelsState(selectedParam, key);
    
  }
  
  onTaskTypeChange = (key) => {
    const { selectedParam } = this.state;
    this.setState({ taskTypeKey: key }, () => {
      this.resetModelsState(selectedParam, key);
    })
  }

  /**
   * 获取选择的参数
   * @param  selectInfo ：选择参数对象
   */
  getSelectedParam = (selectInfo) => {
    const { tabButtonActiveKey } = this.state;
    this.resetModelsState({
      knowId: selectInfo.knowledgeId,
      subjectId: selectInfo.subjectId,
      queryType: selectInfo.queryType
    }, tabButtonActiveKey, 1);
  }

  /**
   * 题目列表
   * @param  selectInfo ：选择参数对象
   */
  getQuestionList(selectInfo, key, currentPage) {
    const { dispatch } = this.props;
    const { taskTypeKey } = this.state;
    this.setState({ questionPaperLoading: true })
    dispatch({
      type: namespace + '/queryPaperListByVersionKnowId',
      payload: {
        versionKnowId: selectInfo.knowId,
        taskType: taskTypeKey,
      },
      callback: res => {
        if (res.errCode == 0 && res.success) {
          this.setState({
            questionPaperLoading: false,
            questionPaperList: res.data
          })
        }
        // this.setState({coreLiteracyList:data})
      }
    });
  }

  /**
   * 分页获取首页套题或者试卷列表
   * @param  selectInfo ：选择参数对象
   */
  pageListIndexPaper(selectInfo, currentPage, type) {
    const { dispatch } = this.props;
    dispatch({
      type: namespace + '/pageListIndexPaper',
      payload: {
        ...selectInfo,
        page: currentPage,
        type
      },
    });
  }


  /**
   * w微课列表
   * @param  selectInfo ：选择参数对象
   * @param  currentPage ：页码
   */
  getQuestionVideoList(selectInfo, currentPage) {
    const { dispatch } = this.props;
    dispatch({
      type: namespace + '/getQuestionVideoList',
      payload: {
        ...selectInfo,
        page: currentPage,
        queryType: 1,
        size: 12,
      },
    });
  }


  /**
   * 重置models state 重新获取
   * @param  selectInfo ：选择参数对象
   * @param  key ：类型 1知识点 2套题 3套卷 4微课
   */
  resetModelsState = (selectInfo, key, page = 1) => {
    const { dispatch, knowledgeList, total } = this.props;
    const currentPage = page;
    this.setState({
      selectedParam: selectInfo,
      currentPage
    })

    if (page == 1) {
      dispatch({
        type: namespace + '/saveState',
        payload: {
          questionList: undefined,
          examPaperList: undefined,
          questionVideoList: undefined,
          total: page == 1 ? 0 : total,
        },
      });
    }

    if (!knowledgeList || knowledgeList.length < 1) {//没有知识点的时候不再请求接口
      return;
    }
    dispatch({
      type: namespace + '/saveState',
      payload: {
        questionLoading: false,
      },
    });
    // if (key == 1) {//获取题目列表
    //   this.getQuestionList(selectInfo, currentPage)
    // } else if (key == 2) {//获取套题列表
    //   this.pageListIndexPaper(selectInfo, currentPage, 1);
    // } else if (key == 3) {//获取套卷列表
    //   this.pageListIndexPaper(selectInfo, currentPage, 2);
    // } else if (key == 4) {//获取微课列表
    //   this.getQuestionVideoList(selectInfo, currentPage)
    // }
    console.log('====================================');
    console.log('selectInfo', selectInfo);
    console.log('key', key);
    console.log('====================================');
    this.getQuestionList(selectInfo, key, currentPage)
  }

  /**
   * 页面组件即将卸载时：清空数据
   */
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: namespace + '/saveState',
      payload: {
        questionList: undefined,
        examPaperList: undefined,
        questionVideoList: undefined,
        total: 0,
        questionLoading: false,
      },
    });
    this.setState = (state, callback) => {
      return;
    };
  }

  /**
   * 获取addTask的ref
   * @param ref
   */
  getAddTaskRef = (ref) => {
    this.addRef = ref
  }

  /**
   * 打开布置任务
   * @param record
   */
  openAddTask = (e, record) => {
    e.stopPropagation && e.stopPropagation();
    this.addRef.onOff(true, record)
  }

  handleItemSelect = (itemId) => {
    this.setState({
      selectedItemId: this.state.selectedItemId === itemId ? null : itemId
    });
  }

  /**
   * 布置作业
   */
  handleAssignHomework = () => {
    const { selectedItemId, taskTypeKey } = this.state;
    const { dispatch } = this.props;

    if (!selectedItemId) {
      Message.warning('请先选择要布置的作业');
      return;
    }

    this.setState({ assignLoading: true });

    dispatch({
      type: namespace + '/instructionReportAddTask',
      payload: {
        paperId: selectedItemId,
        taskType: taskTypeKey,
        userId: userInfo().userId,
        classId: userInfo().classId,
        schoolId: userInfo().schoolId
      },
      callback: (res) => {
        this.setState({ assignLoading: false });
        if (res.errCode === 0 && res.success) {
          Message.success('布置作业成功');
        } else {
          Message.error(res.errDetail || '布置作业失败');
        }
      }
    });
  }

  checkPaperDetail = (e) => {
    e.stopPropagation();
    console.log('checkPaperDetail');
  }

  render() {
    const { code, subjectId } = userInfo() || {}
    const permission = (subId) => (code === "TEACHER" && subjectId === (subId));
    const {
      location,
      dispatch,
      questionList = [],//题目列表
      questionLoading,//题目加载中
      total = 0,
      examPaperList = [],//套题或者套卷列表
      questionVideoList,//微课列表
      // hotVideoList,//热门微课列表
      // loading,//加载中
      accessToken,
      loginUserInfo = {},
      questionBoardStatistics = 0
    } = this.props;
    const {
      tabButtonActiveKey,
      currentPage,
      selectedParam = {},
      taskTypeItems,
      questionPaperList,
      questionPaperLoading,
      assignLoading
    } = this.state

    const handleTableChange = (page, pageSize) => {
      // this.setState({
      //     currentPage: page
      // })
      tabButtonActiveKeyPageCache({ key: tabButtonActiveKey, page })
      this.resetModelsState(selectedParam, tabButtonActiveKey, page);
    };
    const PaginationComponents = (size = 10) => {
      return (<div className={styles['question-page']}>
        <Pagination
          {...paginationConfig({ s: size, p: currentPage }, total || 0, undefined, true)}
          onChange={handleTableChange}
        />
      </div>)
    }
    // const textAnimation = {
    //     Children: {
    //         value: Number(questionBoardStatistics),
    //         floatLength: 0
    //     },
    //     duration: 1000,
    // }
    return (
      <div className={styles['knowledge-questionlist']}>
        {/* 章节知识点 */}
        <KnowledgeList location={location} getSelectedParam={this.getSelectedParam} />
        {/* 试卷类型选择 */}
        <div className={styles['questionlist-box']}>
          <div style={{ display: 'flex', justifyContent: "space-between" }}>
            <Tabs
              activeKey={this.state.taskTypeKey}
              onChange={this.onTaskTypeChange}
              items={taskTypeItems}
            />
            <Button 
              type="primary" 
              loading={assignLoading}
              onClick={this.handleAssignHomework}
            >
              布置作业
            </Button>
          </div>
          {/* <div className={styles['button-tab-box']}>
            {
              [
                { key: 1, name: '单题' },//知识点
                { key: 2, name: '套题' },
                { key: 3, name: '试卷' },//套卷
                { key: 4, name: '微课' },
              ].map(item =>
                <div 
                  key={item.key}
                  className={styles[tabButtonActiveKey == item.key ? 'active' : '']}
                  onClick={() => {
                    this.onTabButtonChange(item.key)
                  }}
                >
                  {item.name}
                </div>
              )
            }
          </div> */}
          {/* 试卷列表 */}
          {
            tabButtonActiveKey == 1 ? <div className={styles['question-box']}>
              <Spin tip="题目加载中..." spinning={questionPaperLoading}>
                {
                  questionPaperList && questionPaperList.length > 0 ? [
                    <div className={styles['questionlist']} key='list'>
                      {
                        questionPaperList.map(item => {
                          return (
                            <QuestionPaperItem 
                              subjectId={selectedParam ? selectedParam.subjectId : ''}
                              key={item.id}
                              location={location}
                              QContent={item}
                              isSelected={this.state.selectedItemId === item.id}
                              onSelect={() => this.handleItemSelect(item.id)}
                              checkPaperDetail={this.checkPaperDetail}
                            />
                          )
                        }
                        )
                      }
                    </div>] : <div className={styles['empty-box']}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={window.$emptyDescInfo} />
                  </div>
                }
                {PaginationComponents()}
              </Spin>
            </div> :
              tabButtonActiveKey == 2 ? <div className={styles['knot-list']}>
                <Spin tip="套题加载中..." spinning={!questionLoading}>
                  {
                    examPaperList && examPaperList.length > 0 ?
                      <div>
                        {
                          examPaperList.map(item => {
                            return (
                              <QuestionGroupItem key={item.id} questionGroupInfo={item}/>
                            )
                          })
                        }
                      </div>
                      : <div className={styles['empty-box']}>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={window.$emptyDescInfo} />
                      </div>
                  }
                  {PaginationComponents()}
                </Spin>
              </div> : tabButtonActiveKey == 3 ? <div className={styles['knot-list']}>
                <Spin tip="套卷加载中..." spinning={!questionLoading}>
                  {
                    examPaperList && examPaperList.length > 0 ?
                      <div>
                        {
                          examPaperList.map(item => {
                            return (
                               <QuestionGroupItem key={item.id} questionGroupInfo={item}/>
                            )
                          })
                        }
                      </div>
                      : <div className={styles['empty-box']}>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={window.$emptyDescInfo} />
                      </div>
                  }
                  {PaginationComponents()}
                </Spin>
              </div> : <div className={styles['micro-box']}>
                <Spin tip="微课加载中..." spinning={!questionLoading}>
                  {
                    questionVideoList && questionVideoList.length > 0 ? [
                      <div className={styles['micro-list']} key='list'>
                        {
                          questionVideoList.map(item => {
                            return (
                              <MicroItem key={item.id} stylesClassName={'item-3'} location={location} mItem={item} />
                            )
                          }
                          )
                        }
                      </div>] : <div className={styles['empty-box']}>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={window.$emptyDescInfo} />
                    </div>
                  }
                  {PaginationComponents(12)}
                </Spin>
              </div>
          }
        </div>
        <AddTask location={location} onRef={this.getAddTaskRef} />
      </div>

    );
  }
}


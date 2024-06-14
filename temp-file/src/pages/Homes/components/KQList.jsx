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
  Button
} from 'antd';
// import { routerRedux } from 'dva/router';
// import queryString from 'query-string';
import { HomeIndex as namespace, Public } from '@/utils/namespace';
import { pushNewPage } from "@/utils/utils";
import paginationConfig from '@/utils/pagination';
import styles from './KQList.less';
import QuestionItem from "@/components/QuestionItem/QuestionItem";
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
  questionList: state[namespace].questionList,//题目列表
  questionLoading: state[namespace].questionLoading,//题目加载中
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
  getQuestionList(selectInfo, currentPage) {
    const { dispatch } = this.props;
    dispatch({
      type: namespace + '/getQuestionByKnowledge',
      payload: {
        ...selectInfo,
        page: currentPage
      },
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
    if (key == 1) {//获取题目列表
      this.getQuestionList(selectInfo, currentPage)
    } else if (key == 2) {//获取套题列表
      this.pageListIndexPaper(selectInfo, currentPage, 1);
    } else if (key == 3) {//获取套卷列表
      this.pageListIndexPaper(selectInfo, currentPage, 2);
    } else if (key == 4) {//获取微课列表
      this.getQuestionVideoList(selectInfo, currentPage)
    }
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
      selectedParam = {}
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
        <KnowledgeList location={location} getSelectedParam={this.getSelectedParam} />
        <div className={styles['questionlist-box']}>
          <div className={styles['button-tab-box']}>
            {
              [
                { key: 1, name: '单题' },//知识点
                { key: 2, name: '套题' },
                { key: 3, name: '试卷' },//套卷
                { key: 4, name: '微课' },
              ].map(item =>
                <div key={item.key} className={styles[tabButtonActiveKey == item.key ? 'active' : '']} onClick={() => {
                  this.onTabButtonChange(item.key)
                }}>
                  {item.name}
                </div>
              )
            }
          </div>
          {
            tabButtonActiveKey == 1 ? <div className={styles['question-box']}>
              <Spin tip="题目加载中..." spinning={!questionLoading}>
                {
                  questionList && questionList.length > 0 ? [
                    <div className={styles['questionlist']} key='list'>
                      {
                        questionList.map(item => {
                          return (
                            <QuestionItem subjectId={selectedParam ? selectedParam.subjectId : ''} key={item.id}
                              location={location} QContent={item} />
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
                              // <div key={item.id}
                              //   onClick={() => pushNewPage({
                              //     id: item.id,
                              //     paperName: item.name
                              //   }, '/my-question-group/preview-export', dispatch)} className={styles['knot-item']}>
                              //   <div>
                              //     {item.name}
                              //   </div>
                              //   <div>
                              //     {permission(item.subjectId) ? <Button type='primary'
                              //       onClick={(e) => this.openAddTask(e, item)}>布置任务</Button> : ''}
                              //   </div>

                              // </div>
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
                              // <div key={item.id} onClick={() => pushNewPage({
                              //   id: item.id,
                              //   paperName: item.name
                              // }, '/my-question-group/preview-export', dispatch)} className={styles['knot-item']}>
                              //   <div>
                              //     {item.name}
                              //   </div>
                              //   <div>
                              //     {permission(item.subjectId) ? <Button type='primary'
                              //       onClick={(e) => this.openAddTask(e, item)}>布置任务</Button> : ''}
                              //   </div>
                              // </div>
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

          {/* {
                        tabButtonActiveKey == 1 && accessToken && (loginUserInfo.code == "TEACHER" || loginUserInfo.code == 'GG_QUESTIONBANKADMIN' || loginUserInfo.code == 'GG_GUIDETOPICMEMBER') ? <div className={styles['side-menu']}>
                            <div onClick={() => pushNewPage({}, '/my-question-group/paper-board', dispatch)}>试题板<span>(<TweenOne
                                animation={textAnimation}
                                style={{ display: 'inline-block' }}
                            >
                                0
                            </TweenOne>)</span></div>
                            <div onClick={() => pushNewPage({}, '/question-center', dispatch)}>自定义题组</div>
                        </div> : null
                    } */}

        </div>
        <AddTask location={location} onRef={this.getAddTaskRef} />
      </div>

    );
  }
}


/**
 * 手动组题
 * @author:张江
 * @date:2020年08月31日
 * @version:v1.0.0
 * */
import react, { Component } from 'react'
import { Select, Pagination, Button, Spin, Empty, Message, Affix, message } from 'antd'
import { HeartOutlined, HeartFilled, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { ManualCombination as namespace, QuestionBank, HomeIndex, Auth } from '@/utils/namespace';
import styles from './index.less'
import Page from "@/components/Pages/page";
import BackBtns from "@/components/BackBtns/BackBtns";
import TopicContent from "@/components/TopicContent/TopicContent";
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
import ParametersArea from '@/components/QuestionBank/ParametersArea';
import { connect } from "dva";
import userCache from "@/caches/userInfo";
import {
  getIcon,
  getPageQuery,
  modifyKeyNamesOfTreeData,
  openNotificationWithIcon,
  replaceSearch,
  handleFetchingField
} from "@/utils/utils";
import { collectionType } from "@/utils/const";
import KnowledgeList from "@/components/KnowledgeList/KnowledgeList";
// import renderAnswerAnalysis from "@/components/RenderAnswerAnalysis/index";//渲染题目答案与解析部分
import userInfoCache from '@/caches/userInfo';
import ErrorCorrectionModal from "@/components/QuestionBank/ErrorCorrectionModal";

const { Option } = Select;
const IconFont = getIcon();

@connect(state => ({
  knowledges: state[QuestionBank].knowledgeList,
  knowledgeLoading: state[QuestionBank].loading,
  filterPanel: state[namespace].filterPanel,
  filterPanelLoading: state[namespace].loading,
  topicList: state[namespace].topicList,//题目列表数据
  loading: state[namespace].loading,
  topicListLoading: state[namespace].topicListLoading,
  authButtonList: state[Auth].authButtonList,//按钮权限数据
}))
export default class ManualCombination extends Component {

  constructor(props) {
    super(...arguments)
    let query = getPageQuery()
    let roleInfo = userCache()
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      roleInfo,

      // subjectId: undefined,//科目id
      page: parseInt(query.page, 10) || 1,//分页，当前页，默认第一页
      pageSize: parseInt(query.pageSize, 10) || 10,//分页大小（默认10）
      addedTopics: [],//已添加到试题板的题目
      collectedTopics: [],//已收藏的题目
      clistId: [],//题型参数
      glistId: [],//年级参数
      dlistId: [],//难度参数

      selectedParamInfo: {}
    }
  }

  componentDidMount() {
    // let { roleInfo } = this.state
    // const { subjectId, gradeId } = roleInfo || {}
    // const { dispatch } = this.props
    // if (subjectId) {
    //   // dispatch({
    //   //   type: namespace + '/getGroupCenterConditions',
    //   //   payload: {
    //   //     subjectId,
    //   //   }
    //   // })
    //   // if (gradeId) {
    //   //   dispatch({
    //   //     type: QuestionBank + '/getKnowledgeDetailsByPid',
    //   //     payload: {
    //   //       subjectId,
    //   //       gradeId
    //   //     }
    //   //   })
    //   // }
    // }
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    let newFilterPanel = nextProps.filterPanel
    const { location, dispatch } = this.props
    let query = getPageQuery()
    const { filterPanel } = this.props
    if (!filterPanel && newFilterPanel) {
      //定义默认年级的id
      let defaultGradeId = []
      newFilterPanel.glist && newFilterPanel.glist.length > 0 && newFilterPanel.glist.forEach(item => {
        if (item.defaults) {
          defaultGradeId.push(item.id + '')
        }
      })

      this.setState({
        clistId: query.clistId && query.clistId.split(',') || [],//题型参数
        glistId: query.glistId && query.glistId.split(',') || defaultGradeId || newFilterPanel.glist && newFilterPanel.glist.length > 0 && newFilterPanel.glist[0].id && [newFilterPanel.glist[0].id + ""] || [],//年级参数
        dlistId: query.dlistId && query.dlistId.split(',') || [],//难度参数
        checkedKeys: query.knowIdStr && query.knowIdStr.split(",") || [],//知识点当前选中的
        expandedKeys: query.knowIdStr && query.knowIdStr.split(",") || [],//初始化默认展开当前选中的知识点
      }, _ => {
        let newState = this.state
        let {
          page = 1,
          size = 10,
          clistId = [],
          glistId = [],
          dlistId = [],

        } = newState
        replaceSearch(dispatch, location, {
          clistId: clistId.join(','),
          glistId: glistId.join(','),
          dlistId: dlistId.join(','),
        })
      })
    }
  }

  /**
  * 页面组件即将卸载时：清空数据
  */
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
    this.props.dispatch({
      type: `${namespace}/set`,
      payload: {
        filterPanel: undefined,
        topicList: []
      }
    })
  }

  onSelectFilter = (id, keyName) => {
    // let targetArray = this.state[keyName]//获取即将操作的数据数组
    // let newArraay = [...this.state[keyName]]

    let newArraay = []
    id = id + ""
    // if (targetArray.find(itemId => id === itemId) !== undefined) {
    //   newArraay.splice(targetArray.indexOf(id), 1)
    // } else {
    newArraay.push(id)
    // }
    this.setState({
      [keyName]: newArraay,
      page: 1
    },
      // _ => {
      //   let parseStr = this.state[keyName].join(',')
      //   replaceSearch(this.props.dispatch, this.props.location, {
      //     [keyName]: parseStr,
      //     page: this.state.page
      //   })
      // }
    )
  }
  // onExpand = expandedKeys => {
  //   this.setState({
  //     expandedKeys,
  //     autoExpandParent: false,
  //   });
  // };

  /**
   *
   * @param page:题目列表当前页
   */
  onTogglePage = (page, pageSize) => {
    const { pageSize: tempSize } = this.state;
    page = tempSize == pageSize ? page : 1;
    this.setState({
      page,
      pageSize
    }, _ => {
      const { dispatch, location } = this.props
      replaceSearch(dispatch, location, { page: page, pageSize })
    })
  }

  /**
   * 当分页大小切换时，回调
   *@currentPage {number}:当前页
   *@pageSize {number}:新的页码大小
   * */
  onTogglePageSize = (currentPage, pageSize) => {
    this.setState({
      pageSize,
      page: 1
    }, _ => {
      const { dispatch, location } = this.props
      replaceSearch(dispatch, location, { page: 1, pageSize: pageSize })
    })
  }


  /**
   * 收藏题目
   *@topicId :题目id
   *@isCollect :是否收藏，true，收藏操作，false：取消收藏操作
   */
  collectTopic = (topicId, isCollect) => {
    const { dispatch } = this.props
    const { roleInfo, selectedParamInfo } = this.state

    //===============收藏失败的时候做的假收藏，后期等数据添加了收藏标识字段后，删除=====【start】
    if (topicId) {
      let collectedTopics = [...this.state.collectedTopics]
      collectedTopics.push(topicId)
      this.setState({
        collectedTopics
      })
    }
    //===============收藏失败的时候做的假收藏，后期等数据添加了收藏标识字段后，删除=====【end】

    topicId ?
      isCollect ?
        dispatch({
          type: `${namespace}/collectTopic`,
          payload: {
            itemId: topicId,
            type: collectionType.QUESTION.type

          },
          callback: data => {
            //收藏成功后，将当前的题目id添加到状态中
            let collectedTopics = [...this.state.collectedTopics]
            collectedTopics.push(topicId)
            this.setState({
              collectedTopics
            })
            Message.success(data && data.msg || "收藏成功！")
          }
        })
        :
        dispatch({
          type: `${namespace}/cancleCollectTopic`,
          payload: {
            itemId: topicId,
            type: collectionType.QUESTION.type
          },
          callback: data => {
            //取消成功后，将当前的题目id从当前状态数据中移除
            let collectedTopics = [...this.state.collectedTopics]
            this.setState({
              collectedTopics: collectedTopics.filter(collectedTopicId => collectedTopicId !== topicId)
            })
            Message.success(data && data.msg || "取消成功！")
          }
        })
      : openNotificationWithIcon('error', '收藏失败！请稍后重试!', 'red', '缺少题目id参数', 2)
  }

  /**
   * 将题目添加到试题板或者取消添加
   * @topicId : 题目id
   * @questionCategory :题目类型
   */
  addOrCancel = (topicId, questionCategory, isAdd, subjectId) => {
    const { dispatch } = this.props
    const getTestQuestionEdition = () => {
      dispatch({
        type: HomeIndex + '/getTestQuestionEdition',
        payload: {},
      });
    }
    //  && questionCategory
    topicId ?
      isAdd ?
        dispatch({
          type: `${namespace}/saveOptionQuestion`,
          payload: {
            questionId: topicId,
            questionCategory,
            subjectId,
          },
          callback: data => {
            const addedTopics = [...this.state.addedTopics]
            addedTopics.push(topicId)
            this.setState({
              addedTopics,
            })
            getTestQuestionEdition();
            message.success('添加成功!')
            // openNotificationWithIcon('success', '添加成功!', 'green', '', 2)
          }
        })
        :
        dispatch({
          type: `${namespace}/removeQuetion`,
          payload: {
            questionId: topicId,
          },
          callback: data => {
            let addedTopics = [...this.state.addedTopics]
            this.setState({
              addedTopics: addedTopics.filter(addedTopicId => addedTopicId !== topicId)
            })
            getTestQuestionEdition();
          }
        })
      : openNotificationWithIcon('error', '添加失败！', 'red', !topicId ? '缺少题目id参数' : '缺少题目类型参数', 2)
  }
  // renderTreeNodes = data =>
  //   data.map(item => {
  //     if (item.children) {
  //       return (
  //         <TreeNode title={item.title} key={item.key} dataRef={item}>
  //           {this.renderTreeNodes(item.children)}
  //         </TreeNode>
  //       );
  //     }
  //     return <TreeNode key={item.key} {...item} />;
  //   });


  /**
* 获取选择的参数
* @param  selectInfo ：选择参数对象
*/
  getSelectedParam = (selectInfo = {}) => {
    const { dispatch } = this.props;
    const { selectedParamInfo = {} } = this.state;
    let query = getPageQuery() || {};
    dispatch({
      type: namespace + '/saveState',
      payload: {
        topicList: [],
        topicListLoading: true
      },
    });
    // 优化:只有科目发生改变时才调用
    const isSubjectIdChange = selectedParamInfo.subjectId != selectInfo.subjectId;
    if (isSubjectIdChange) {
      dispatch({
        type: namespace + '/saveState',
        payload: {
          filterPanel: null,
        }
      })
      dispatch({
        type: namespace + '/getGroupCenterConditions',
        payload: {
          subjectId: selectInfo.subjectId,
          studyId: selectInfo.studyId
        }
      })
    }
    this.setState({
      checkedKeys: selectInfo.isMultiple ? selectInfo.knowledgeId : [selectInfo.knowledgeId],
      page: 1,
      selectedParamInfo: selectInfo
    }, _ => {
      replaceSearch(
        dispatch,
        this.props.location,
        {
          knowIdStr: selectInfo.isMultiple ? selectInfo.knowledgeId.join(',') : selectInfo.knowledgeId,
          queryType: selectInfo.queryType,
          page: 1,
          pageSize: this.state.pageSize,
          subjectId: selectInfo.subjectId,
          glistId: isSubjectIdChange ? undefined : query.glistId,
          clistId: isSubjectIdChange ? undefined : query.clistId,
          dlistId: isSubjectIdChange ? undefined : query.dlistId,
        })
    });
  }

  /**
* 点击检索
*/
  onSearch = () => {
    const { clistId = [],//题型参数
      glistId = [],//年级参数
      dlistId = [],//难度参数
    } = this.state;
    replaceSearch(this.props.dispatch, this.props.location, {
      glistId: glistId.join(','),
      clistId: clistId.join(','),
      dlistId: dlistId.join(','),
      page: 1
    })
  }

  /**
   * 获取题目纠错modal的ref
   **/
  getErrorCorrectionModal = (ref) => {
    this.errorCorrectionRef = ref;
  }

  /**
   * 打开布置任务
   */
  openErrorCorrection = (questionId) => {
    this.errorCorrectionRef.onOff(true, questionId)
  }

  render() {
    const { roleInfo } = this.state
    let query = getPageQuery() || {}
    let {
      knowledges = [],
      knowledgeLoading,
      filterPanel,
      topicList = {},
      loading,
      location,
      topicListLoading,
      authButtonList,//按钮权限数据
    } = this.props
    const { pathname } = location;
    let topicListData = topicList.data//题目列表数组
    /**
     * 是否有按钮权限
     * */
    const isClick = (name) => {
      return window.$PowerUtils.judgeButtonAuth(authButtonList, name)
    }
    knowledges = modifyKeyNamesOfTreeData(knowledges, [
      {
        oldKeyName: 'name',
        newKeyName: 'title'
      },
      {
        oldKeyName: 'id',
        newKeyName: 'key'
      },
      {
        oldKeyName: 'child',
        newKeyName: 'children'
      }
    ], 'child')

    const title = '手动组题-我的题组';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );
    const loginUserInfo = userInfoCache() || {};
    return (
      <Page header={header}>
        {/* loading={!!loading} */}
        <div className={styles.wrap}>
          <div className={styles.content}>
            {/* 120 */}
            {/* <Affix offsetTop={120}> */}
            <KnowledgeList
              location={location}
              getSelectedParam={this.getSelectedParam}
              // isMultiple={true}
              // heightObject={{
              //   warpHeight: (document.body.clientHeight-360) +'px',
              //   listHeight: (document.body.clientHeight-190) + 'px'
              // }}
              heightObject={{
                warpHeight: '88vh',
                listHeight: '82vh'
              }}
            />
            {/* </Affix> */}
            <div className={styles.main}>
              <Affix offsetTop={110}>
                {/* <Spin spinning={!!loading} tip="筛选条件正在加载中..."> */}
                {/* <Affix offsetTop={0}> */}
                {
                  filterPanel ? <div className={styles['topfilter']}>
                    {
                      //通过动态的渲染筛选条件，以方便后期扩展
                      Object.keys(filterPanel).map((keyName, index) => {
                        let filterName = ''//定义筛选条件的名称
                        let selectedId = undefined//定义已经选中的id值
                        switch (keyName) {
                          case "clist"://题型
                            filterName = '题型'
                            selectedId = query.clistId
                            break
                          case "dlist"://难度
                            filterName = "难度"
                            selectedId = query.clistId
                            break
                          case "glist"://年级
                            filterName = "年级"
                            selectedId = query.glistId
                            break
                          default:
                            break
                        }
                        return (
                          <div key={index}>
                            <label>{filterName}：</label>
                            <Select
                              mode="multiple"
                              allowClear
                              defaultValue={selectedId}
                              style={{ width: 240 }}
                              onChange={(id) => { this.onSelectFilter(id, keyName + "Id") }}
                              placeholder={`请选择${filterName}`}
                            >
                              {
                                filterPanel[keyName] && filterPanel[keyName].map((item) => {
                                  return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                })
                              }
                            </Select>
                          </div>)
                      })
                    }

                    {
                      window.$PowerUtils.judgeButtonAuth(pathname, '搜索') ?
                        <Button
                          icon={<SearchOutlined />}
                          style={{ marginTop: '10px' }}
                          onClick={() => { this.onSearch() }}
                        >搜索</Button> : null
                    }
                  </div>
                    : <div></div>
                }
                {/* </Spin> */}
                {/* </Affix> */}
              </Affix>
              {/*题目列表*/}
              <Spin spinning={!topicListLoading} tip="题目正在加载中...">
                <div className={styles.topicListPanel}>
                  <ul>
                    {
                      topicListData && topicListData.length > 0
                        ? topicListData.map((topic, index) => (
                          <li className={styles.topicItem} key={index}>
                            <div className={styles.topicBody}>
                              <div className={styles.topicContent}>
                                {
                                  RenderMaterialAndQuestion(topic, false, (RAQItem) => {
                                    return (<TopicContent topicContent={RAQItem}
                                      childrenFiledName={'children'}
                                      contentFiledName={'content'}
                                      optionIdFiledName={'code'}
                                      optionsFiledName={"optionList"}
                                      currentPage={topicList.currentPage}
                                      currentTopicIndex={index}
                                      pageSize={Number(query.pageSize) || 10}
                                    />)
                                  },
                                    (RAQItem) => {
                                      return <ParametersArea QContent={RAQItem} comePage={''} />;
                                    },
                                  )
                                }
                                {/* 材料部分 */}
                                {/* {
                                  RenderMaterial(topic)
                                } */}
                                {/* <TopicContent topicContent={topic}
                                  childrenFiledName={'children'}
                                  contentFiledName={'content'}
                                  optionIdFiledName={'code'}
                                  optionsFiledName={"optionList"}
                                  currentPage={topicList.currentPage}
                                  currentTopicIndex={index}
                                  pageSize={Number(query.pageSize) || 10}
                                /> */}
                                {/* {renderAnswerAnalysis(topic, 1)} */}
                              </div>
                            </div>
                            <div className={styles.topicFooter}>
                              {/*信息列表*/}
                              <ul className={styles.info}>
                                {/* <li>难度： <span>{handleFetchingField(topic, 'difficulty') || '暂无'}</span></li> */}
                                <li>使用次数： <span>{handleFetchingField(topic, 'useNumber') || 0}</span></li>
                              </ul>
                              {/*交互列表*/}
                              <ul className={styles.interactive}>
                                {
                                  isClick('收藏') ?
                                    <li onClick={_ => {
                                      let { collectedTopics } = this.state
                                      topic.collect || collectedTopics.indexOf(handleFetchingField(topic, 'id')) !== -1
                                        ?
                                        this.collectTopic(handleFetchingField(topic, 'id'), false)
                                        :
                                        this.collectTopic(handleFetchingField(topic, 'id'), true)
                                    }}>
                                      {
                                        topic.collect || this.state.collectedTopics.indexOf(handleFetchingField(topic, 'id')) !== -1 ?
                                          <HeartFilled style={{ color: "rgba(230,30,30,0.73)" }} /> :
                                          <HeartOutlined />
                                      }
                                      收藏
                                    </li>
                                    :
                                    null
                                }
                                {
                                  isClick('加入') && loginUserInfo.subjectId && loginUserInfo.subjectId == handleFetchingField(topic, 'subjectId') ?
                                    <li className={this.state.addedTopics.indexOf(handleFetchingField(topic, 'id')) === -1 ? "" : styles.added}
                                      onClick={_ => {
                                        this.state.addedTopics.indexOf(handleFetchingField(topic, 'id')) === -1 ?
                                          this.addOrCancel(handleFetchingField(topic, 'id'), handleFetchingField(topic, 'category'), true, handleFetchingField(topic, 'subjectId'))
                                          : this.addOrCancel(handleFetchingField(topic, 'id'), handleFetchingField(topic, 'category'), false, handleFetchingField(topic, 'subjectId'))
                                      }}>
                                      {
                                        this.state.addedTopics.indexOf(handleFetchingField(topic, 'id')) === -1
                                          ?
                                          <><PlusCircleOutlined />加入试题板</>
                                          : "取消加入"
                                      }
                                    </li>
                                    :
                                    null
                                }
                                {
                                  isClick('纠错') ?
                                    <li onClick={() => this.openErrorCorrection(topic.id)}>
                                      <IconFont type={'icon-jiucuo'} />
                                      纠错
                                    </li>
                                    :
                                    null
                                }

                              </ul>
                            </div>
                          </li>
                        ))
                        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'当前条件暂无题目'} />
                    }
                  </ul>
                </div>
              </Spin>

              {/*  底部分页器*/}
              <div className={styles.pagiNationBar}>
                <Pagination total={topicList.total}
                  // showSizeChanger
                  showQuickJumper
                  current={Number(query.page) || 1}
                  pageSize={Number(query.pageSize) || 10}
                  onChange={this.onTogglePage}
                // onShowSizeChange={this.onTogglePageSize}
                />
              </div>
            </div>
          </div>
        </div>
        <ErrorCorrectionModal onRef={this.getErrorCorrectionModal} />
        <BackBtns tipText={"返回"} isBack={false} />
      </Page>
    )
  }
}

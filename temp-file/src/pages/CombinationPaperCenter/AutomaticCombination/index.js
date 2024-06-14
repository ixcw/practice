/**
 * 自动组题
 * @author:张江
 * @date:2020年08月31日
 * @version:v1.0.0
 * */
import react, { Component } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Spin, Tree, Empty, Tag, Button, Switch, Table, Input, Steps, Radio, Tooltip, Affix } from 'antd'

import styles from './index.less'
import Page from "@/components/Pages/page";
import {
  AutomaticCombination as namespace,
  ManualCombination,
  Public,
  QuestionBank,
  TopicPanel,
  Auth
} from "@/utils/namespace";
import {
  getPageQuery,
  modifyKeyNamesOfTreeData,
  openNotificationWithIcon,
  replaceSearch,
  save2NumAfterPoint
} from "@/utils/utils";
import userCache from "@/caches/userInfo";
import { myRegExp } from "@/utils/const";
import KnowledgeList from "@/components/KnowledgeList/KnowledgeList";
import BarTwo from '../components/chart/barTwo.js'

const { TreeNode } = Tree;
const { Step } = Steps;
const columns = [
  {
    title: '题型',
    dataIndex: 'topicType',
    key: 'topicType',
  },
  {
    title: <Tooltip placement="bottom" title={"占比值由于保留2位小数，总和可能不足100%，这属于正常情况"}>
      <span>题目量（占比）</span>
      {/* <Icon type="question" /> */}
    </Tooltip>,
    dataIndex: 'topicRate',
    key: 'topicRate',
  },
  {
    title: <Tooltip placement="bottom" title={"占比值由于保留2位小数，总和可能不足100%，这属于正常情况"}>
      <span>分值（占比）</span>
      {/* <Icon type="question" /> */}
    </Tooltip>,
    dataIndex: 'scoreRate',
    key: 'scoreRate',
  },
  {
    title: '综合难度',
    dataIndex: 'comprehensiveDifficulty',
    key: 'comprehensiveDifficulty',
  },
];
const KNOWLEDGENAMECACHE = 'knowledgeNameCaChe'//知识点名称缓存
const KNOWLEDGEIDCACHE = 'knowledgeIdCaChe'//知识点id缓存
@connect((state) => ({
  knowledgeLoading: state[QuestionBank].loading,
  knowledges: state[QuestionBank].knowledgeList,
  filterPanel: state[ManualCombination].filterPanel,//筛选面板的数据
  subjectList: state[Public].subjectList,//根据年级获取科目列表
  authButtonList: state[Auth].authButtonList,//按钮权限数据
}))
export default class AutomaticCombination extends Component {

  constructor(props) {
    super(...arguments)
    let query = getPageQuery()
    let roleInfo = userCache()
    this.state = {
      roleInfo,
      subjectId: query.subjectId || roleInfo.subjectId,
      subjectName: query.subjectName || roleInfo.gradeName || "",

      autoExpandParent: true,
      selectedKeys: [],
      checkedKeys: this.knowledgeCache(KNOWLEDGEIDCACHE) || [],//知识点当前选中的
      checkedKnowledgeName: this.knowledgeCache(KNOWLEDGENAMECACHE) || [],
      expandedKeys: this.knowledgeCache(KNOWLEDGEIDCACHE) || [],//初始化默认展开当前选中的知识点

      singleChoiceIsShow: true,//单选题开关状态
      multipleChoiceIsShow: true,//多选题开关状态
      blankIsShow: true,//填空题开关状态
      answerIsShow: true,//解答题开关状态
      topicTypes: [],//存放当前所有的题目类型
      topicTypeArr: [],//存放当前显示的题目类型
      currentStep: 0,//默认步骤位置
      topicTypeAnalysisData: [],//题型分析表格数据
      statistics: {
        difficultStatisticsChartData: undefined,//难度分布图表数据
      },

      selectedParam: {},//选择的配置参数
    }
  }

  componentDidMount() {
    let { roleInfo, subjectId } = this.state
    const { gradeId } = roleInfo || {}
    // console.log(roleInfo)
    const { dispatch } = this.props
    this.requestKnowAndTopicTypes(subjectId, gradeId)
  }


  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    const { filterPanel } = this.props
    if (JSON.stringify(filterPanel) !== JSON.stringify(nextProps.filterPanel)) {
      const { clist } = nextProps.filterPanel || {}

      let newTopicTypes = []
      let initSwitchNameObj = {}
      clist && clist.length > 0 && clist.map((topicTypeData, index) => {
        newTopicTypes.push({
          id: topicTypeData.id,
          serialNumber: index,
          topicType: topicTypeData.name,
          //5个难度（难度<=0.20，0.21~0.40，0.41~0.60，0.61~0.80，难度>=0.81）对应题目数量的数组
          levels: [
            { name: '难度<=0.20', number: 0 },
            { name: '0.21~0.40', number: 0 },
            { name: '0.41~0.60', number: 0 },
            { name: '0.61~0.80', number: 0 },
            { name: '难度>=0.81', number: 0 },
          ],
          everyScore: 0,//每题分数
        })
        initSwitchNameObj[`topicTypeSwitch-${topicTypeData.id}`] = true
      })
      this.setState({
        ...initSwitchNameObj,
        topicTypes: JSON.parse(JSON.stringify(newTopicTypes)),
        topicTypeArr: JSON.parse(JSON.stringify(newTopicTypes))
      })
    }
  }

  /**
   * 获取知识点数据和题型列表数据
   * @param subjectId
   * @param gradeId
   */
  requestKnowAndTopicTypes = (subjectId, gradeId) => {
    const { dispatch } = this.props
    if (subjectId) {
      if (gradeId) {
        // dispatch({
        //   type: QuestionBank + '/getKnowledgeDetailsByPid',
        //   payload: {
        //     subjectId,
        //     gradeId
        //   }
        // })
        dispatch({
          type: Public + "/getSubjectListByGradeId",
          payload: {
            gradeId
          }
        })
      }
    }
  }
  // onExpand = expandedKeys => {
  //   this.setState({
  //     expandedKeys,
  //     autoExpandParent: false,
  //   });
  // }

  // onCheck = (checkedKeys, { checkedNodes }) => {
  //   const { dispatch } = this.props
  //   let knowIdArr = []//被选中的知识点id数组
  //   let knowledgeNameArr = []//被选中的知识点名称数组
  //   checkedNodes.forEach((item, index) => {
  //     if (!item.props.dataRef.children || item.props.dataRef.children.length === 0) {
  //       knowIdArr.push(item.props.dataRef.id + "")
  //       knowledgeNameArr.push(item.props.dataRef.title)
  //     }
  //   })
  //   this.setState({
  //     checkedKeys,
  //     checkedKnowledgeName: knowledgeNameArr
  //   }, _ => {
  //     //将数据存入缓存（之所以不放入地址栏，是因为字太多了）
  //     this.knowledgeCache(KNOWLEDGENAMECACHE, knowledgeNameArr)
  //     this.knowledgeCache(KNOWLEDGEIDCACHE, knowIdArr)
  //   });
  // }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });

  /**
   * 知识点名称的缓存
   * @param keyName
   * @param cache
   */
  knowledgeCache = (keyName, cache) => {
    //如果传入数据就存，没传数据就取
    if (cache) {
      let currentData = JSON.parse(sessionStorage.getItem(keyName)) || []
      let addData = cache || []
      addData && addData.length > 0 && addData.forEach(item => {
        currentData.push(item)
      })
      sessionStorage.setItem(keyName, JSON.stringify(currentData))
    } else {
      return JSON.parse(sessionStorage.getItem(keyName))
    }
  }
  /**
   *  从已选的知识点中，移除某个知识点
   * @param knowledgeName
   * @param KnowledgeNameIndex
   */
  removeKnowledge = (knowledgeName, KnowledgeNameIndex) => {
    const { checkedKeys } = this.state || []
    let checkedKnowledgeName = this.knowledgeCache(KNOWLEDGENAMECACHE)
    let knowIdArr = this.knowledgeCache(KNOWLEDGEIDCACHE)
    let newChechedKeys = checkedKeys.filter((itemId, index) => KnowledgeNameIndex !== index)//知识点当前选中的
    let newCheckedKnowledgeName = checkedKnowledgeName.filter(itemName => itemName !== knowledgeName)//知识点当前选中的
    this.setState({
      checkedKeys: newChechedKeys,
      checkedKnowledgeName: newCheckedKnowledgeName,
    }, () => {
      this.KnowledgeList.clearKnowledge(newChechedKeys);//清除子组件的数据
      //替换缓存中的数据，所以需要先清空再存处理后的数据
      sessionStorage.clear()
      this.knowledgeCache(KNOWLEDGEIDCACHE, newChechedKeys)
      this.knowledgeCache(KNOWLEDGENAMECACHE, newCheckedKnowledgeName)
    })
  }

  /**
   * 清空已选的知识点
   */
  clearKnowledge = () => {
    sessionStorage.clear()
    this.setState({
      checkedKeys: [],//知识点当前选中的
      checkedKnowledgeName: [],
    }, () => {
      this.KnowledgeList.clearKnowledge([]);////清除子组件的数据
    })
  }

  onRef = (ref) => {
    this.KnowledgeList = ref
  }

  componentWillUnmount() {
    sessionStorage.clear()
  }

  /**
   * 题型开关控制方法
   * @param isShow:
   * @param topicTypeId:题型id
   */
  toggleSwitch = (isShow, topicTypeId) => {
    let { topicTypeArr, topicTypes } = this.state
    let switchName = `topicTypeSwitch-${topicTypeId}`
    let newArr = []
    if (isShow) {
      topicTypeArr.push(topicTypes.find(topicType => topicType.id === topicTypeId))
      topicTypeArr.sort((lastTopicType, currTopicType) => lastTopicType.serialNumber - currTopicType.serialNumber)
      newArr = topicTypeArr
    } else {
      newArr = topicTypeArr.filter(topicType => topicType.id !== topicTypeId)
    }
    this.setState({ [switchName]: isShow, topicTypeArr: newArr })
  }
  /**
   * 统计（总题数、总分数、每个题型的总分数、每个题型的总题数）
   * @param callback:统计完成后的回调函数
   */
  statistics = (callback) => {
    //  统计难度分析
    let difficultStatisticsChartData = [
      { num: 0, name: "难度≤0.2" },
      { num: 0, name: "0.21~0.40" },
      { num: 0, name: "0.41~0.60" },
      { num: 0, name: "0.61~0.80" },
      { num: 0, name: "难度≥0.81" },
    ]
    const { topicTypeArr = [] } = this.state
    let totalNumOfTopic = 0//试卷总题数
    let totalScore = 0//试卷总分数
    let topicTypesState = {}//封装每个题型对应的key和题型对应的分数和数量

    topicTypeArr.length > 0 && topicTypeArr.forEach((topicType, index) => {

      //为新的有关题型的部分状态对象添加对应的key且赋值（统计每个题型的总分数和总题数）
      topicTypesState[`topicTotalNum-${topicType.id}`] = 0
      //将当前的题型的题目数量累加到题目总数上
      for (let i = 0; i < 5; i++) {
        totalNumOfTopic += topicType.levels[i].number
        topicTypesState[`topicTotalNum-${topicType.id}`] += topicType.levels[i].number
        //统计难度数据
        difficultStatisticsChartData[i].num += topicType.levels[i].number
      }

      //每个题型的总分 = 题型的当前题型的总数*每个题的分值
      topicTypesState[`topicTotalScore-${topicType.id}`] = topicTypesState[`topicTotalNum-${topicType.id}`] * topicType.everyScore
      //试卷总分等于每个题型的总分之和
      totalScore += topicTypesState[`topicTotalScore-${topicType.id}`]
    })
    this.setState({
      statistics: {
        totalNumOfTopic,
        totalScore,
        ...topicTypesState,
        difficultStatisticsChartData
      }
    }, () => {
      callback()
    })
  }
  /**
   * 步骤条的下一步操作
   */
  next = () => {
    const { topicTypeArr, checkedKeys, roleInfo = {} } = this.state
    const { subjectId } = roleInfo
    if (checkedKeys.length > 0 && subjectId) {
      //如果当前步骤在第二步之前，往下走
      if (this.state.currentStep < 1) {
        //统计题型分布情况和难度分布情况
        this.statistics(() => {
          let topicTypeAnalysisData = []
          const { topicTypeArr = [] } = this.state

          if (topicTypeArr.length > 0) {
            for (let i = 0; i < topicTypeArr.length; i++) {
              const topicType = topicTypeArr[i]
              const { statistics = {} } = this.state
              const { totalNumOfTopic, totalScore } = statistics
              let topicTypeNum = statistics[`topicTotalNum-${topicType.id}`]
              let topicTypeScore = statistics[`topicTotalScore-${topicType.id}`]
              //如果所有数量和分数都填了
              if (
                topicType.levels[0].number !== undefined && topicType.levels[0].number !== "" && topicType.levels[0].number !== null &&
                topicType.levels[1].number !== undefined && topicType.levels[1].number !== "" && topicType.levels[1].number !== null &&
                topicType.levels[2].number !== undefined && topicType.levels[2].number !== "" && topicType.levels[2].number !== null &&
                topicType.levels[3].number !== undefined && topicType.levels[3].number !== "" && topicType.levels[3].number !== null &&
                topicType.levels[4].number !== undefined && topicType.levels[4].number !== "" && topicType.levels[4].number !== null &&
                topicType.everyScore !== undefined && topicType.everyScore !== "" && topicType.everyScore !== null
              ) {
                const currentStep = this.state.currentStep + 1;
                //综合难度：每个难度对应的数量乘以每个难度段的值 除以 参与计算的难度段的个数（如果某个难度段没有题目，则不算在算法中）
                let comprehensiveDifficulty = 0.1 * topicType.levels[0].number / topicTypeNum
                  + 0.3 * topicType.levels[1].number / topicTypeNum
                  + 0.5 * topicType.levels[2].number / topicTypeNum
                  + 0.7 * topicType.levels[3].number / topicTypeNum
                  + 0.8 * topicType.levels[4].number / topicTypeNum
                  / (
                    (topicType.levels[0].number === 0 ? 0 : 1)
                    + (topicType.levels[1].number === 0 ? 0 : 1)
                    + (topicType.levels[2].number === 0 ? 0 : 1)
                    + (topicType.levels[3].number === 0 ? 0 : 1)
                    + (topicType.levels[4].number === 0 ? 0 : 1)
                  )
                topicTypeAnalysisData.push({
                  topicType: topicType.topicType,
                  //表格显示内容：‘题目量（占比）’
                  topicRate: `${topicTypeNum} (${save2NumAfterPoint((topicTypeNum / totalNumOfTopic) || 0, 4) * 100}%)`,//当前题型题目数量除以试卷中题目总数
                  scoreRate: `${topicTypeScore} (${save2NumAfterPoint((topicTypeScore / totalScore) || 0, 4) * 100}%)`,
                  comprehensiveDifficulty: save2NumAfterPoint(comprehensiveDifficulty || 0)
                })
                this.setState({
                  currentStep,
                  topicTypeAnalysisData
                })
              } else {
                openNotificationWithIcon('error', "组卷异常！", 'red', "请确认您已填入所有分数及题目数量", 3)
                return false
              }
            }
          }
        })
      }
    } else {
      openNotificationWithIcon('error', '没有知识点或者科目无法组题哦！', 'red', '请确保您已挑选了知识点并且选择了科目')
    }

  }

  /**
   * 步骤条的上一步操作
   */
  prev = () => {
    const currentStep = this.state.currentStep - 1;
    const { topicTypeArr = [] } = this.state
    let switchStateObj = {}
    //如果状态中，存放当前显示的题型的数据长度大于0，以该数据为准，设置开关的状态
    topicTypeArr.length > 0 && topicTypeArr.forEach((topicType) => {
      switchStateObj[`topicTypeSwitch-${topicType.id}`] = true
    })
    this.setState({ currentStep, ...switchStateObj });
  }

  /**
   * 确认自动组题
   */
  confirm = () => {
    //  发送请求
    const { topicTypeArr, checkedKeys, roleInfo = {} } = this.state
    const { subjectId } = roleInfo
    let categoryList = []
    topicTypeArr && topicTypeArr.length > 0 && topicTypeArr.forEach((topicType) => {
      categoryList.push({
        id: topicType.id,
        l1: topicType.levels[0].number,
        l2: topicType.levels[1].number,
        l3: topicType.levels[2].number,
        l4: topicType.levels[3].number,
        l5: topicType.levels[4].number,
        score: topicType.everyScore
      })
    })
    // let knowIdArr = this.knowledgeCache(KNOWLEDGEIDCACHE)
    this.props.dispatch({
      type: namespace + '/genAutomaticQuestion',
      payload: {
        subjectId,
        knowIds: checkedKeys.join(','),
        // knowIds: knowIdArr.join(','),//优化 只传最后一级id
        categoryList
      },
      callback: () => {
        const { dispatch, location } = this.props
        dispatch(routerRedux.replace({
          pathname: TopicPanel,
        }))
      }
    })
  }

  /**
* 获取选择的参数
* @param  selectInfo ：选择参数对象
*/
  getSelectedParam = (selectInfo = {}) => {
    const { dispatch, location } = this.props;
    const { subjectId } = this.state;
    let query = getPageQuery();
    let checkedKeys = selectInfo.knowledgeId;
    let checkedNodes = selectInfo
      && typeof selectInfo.checkedNodes == 'object'
      && selectInfo.checkedNodes.selectedNodes ? selectInfo.checkedNodes.selectedNodes : selectInfo.checkedNodes;
    let knowIdArr = []//被选中的知识点id数组
    let knowledgeNameArr = []//被选中的知识点名称数组
    checkedNodes.map((item) => {
      if (selectInfo.type == 1) {
        knowIdArr.push(item.key + "")
        knowledgeNameArr.push(item.title)
      } else {
        knowIdArr.push(item.id + "")
        knowledgeNameArr.push(item.name)
      }
    })
    // checkedNodes.forEach((item, index) => {
    //   if (!item.props.dataRef.children || item.props.dataRef.children.length === 0) {
    //     knowIdArr.push(item.props.dataRef.id + "")
    //     knowledgeNameArr.push(item.props.dataRef.title)
    //   }
    // })
    if (selectInfo.subjectId != query.subjectId) {
      this.setState({
        subjectId: selectInfo.subjectId,
      }, _ => {
        replaceSearch(dispatch, location, { ...query, subjectId: selectInfo.subjectId })
      });
    }
    this.setState({
      checkedKeys,
      checkedKnowledgeName: knowledgeNameArr,
      subjectId: selectInfo.subjectId,
      selectedParam: selectInfo
    }, _ => {
      //将数据存入缓存（之所以不放入地址栏，是因为字太多了）
      this.knowledgeCache(KNOWLEDGENAMECACHE, knowledgeNameArr)
      this.knowledgeCache(KNOWLEDGEIDCACHE, knowIdArr)
    });

  }

  render() {
    let {
      knowledgeLoading,
      knowledges = [],
      subjectList = [],
      location,
      authButtonList,//按钮权限数据
    } = this.props
    const { pathname = '' } = location;
    const { topicTypes, currentStep, topicTypeAnalysisData = [], statistics = {}, subjectId, subjectName } = this.state
    let checkedKnowledgeName = this.state.checkedKnowledgeName || []
    const { difficultStatisticsChartData } = statistics;

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
    let column = [
      {
        title: '题型',
        align: 'center',
        dataIndex: 'topicType',
        key: 'topicType',
      },
      {
        title: '难度及试题数量',
        align: 'center',
        dataIndex: 'levels',
        key: 'levels',
        render: (levels = [], record) => {
          return (
            <ul className={styles.levels}>
              {
                levels.map((level, index) => {
                  return (
                    <li key={index} className={styles.levelTag}>
                      <span className={styles.label}>{level.name} </span>
                      <Input style={{ width: 68 }} type={'number'} placeholder={'数量'} value={level.number} onChange={(e) => {
                        let number = e.target.value
                        myRegExp.isInteger.lastIndex = 0
                        if (number === '' || number === '0' || myRegExp.isInteger.test(number)) {
                          const { topicTypeArr } = this.state
                          topicTypeArr && topicTypeArr.length > 0 && topicTypeArr.map((topicType, i) => {
                            if (topicType.id.toString() === record.id.toString()) {
                              topicType.levels[index].number = number === '' ? undefined : parseInt(number, 10)
                              this.setState({ topicTypeArr })
                            }
                          })
                        } else {
                          openNotificationWithIcon('error', '数据格式不正确', 'red', '题目数量只能是整数', 4)
                        }
                      }} />
                    </li>
                  )
                })
              }
            </ul>
          )
        }
      },
      {
        title: '分值',
        width: 200,
        align: 'center',
        dataIndex: 'everyScore',
        key: 'everyScore',
        render: (text, record) => {
          return (
            <>每题<Input style={{ width: 60, margin: '0 8px' }} type={'number'} value={record.everyScore} onChange={(e) => {
              const { topicTypeArr } = this.state
              topicTypeArr && topicTypeArr.length > 0 && topicTypeArr.map((topicType, i) => {
                if (topicType.id.toString() === record.id.toString()) {
                  let score = e.target.value
                  myRegExp.checkScoreFormat.lastIndex = 0
                  if (score === '' || score === '0' || myRegExp.checkScoreFormat.test(score)) {
                    topicType.everyScore = score === '' ? undefined : score
                    this.setState({ topicTypeArr })
                  } else {
                    openNotificationWithIcon('error', '分数格式不正确', 'red', '（只能为小数点后一位，且小数后只能是0或者5的数字，请注意是否满足要求）', 4)
                  }
                }
              })
            }} />分</>
          )
        }
      },
    ]

    const steps = [
      {
        title: '第1步',
        content: (
          <>
            <div className={styles.subjectArea}>
              <Radio.Group value={subjectId === undefined || subjectId === null ? subjectId : parseInt(subjectId, 10)}>
                {
                  subjectList.length > 0 && subjectList.map((subject, index) => (
                    <Radio.Button key={index} value={subject.id} onClick={() => {
                      {
                        const { dispatch, location } = this.props
                        let query = getPageQuery()
                        query.subjectId = subject.id
                        query.subjectName = subject.name
                        this.setState(
                          {
                            subjectId: subject.id,
                            subjectName: subject.name,
                          },
                          () => {
                            replaceSearch(dispatch, location, query)
                            this.clearKnowledge()
                          }
                        )
                        this.state.roleInfo && this.state.roleInfo.gradeId &&
                          this.requestKnowAndTopicTypes(subject.id, this.state.roleInfo.gradeId)
                      }
                    }}>
                      {subject.name}
                    </Radio.Button>
                  ))
                }
              </Radio.Group>
            </div>
            <div className={styles.selectedKnowledgesWrap}>
              <div className={styles.selectedKnowledgesTitle}>已选知识点:{checkedKnowledgeName.length}
                <Button size={"small"} onClick={this.clearKnowledge}>清空</Button>
              </div>
              <div className={styles.selectedKnowledges}>
                {
                  checkedKnowledgeName.length > 0 ?
                    checkedKnowledgeName.map((knowledgeName, index) => (
                      <Tag
                        closable
                        key={index}
                        color={"blue"}
                        visible={checkedKnowledgeName.filter(item => item === knowledgeName)}
                        onClose={() => this.removeKnowledge(knowledgeName, index)}
                      >
                        {knowledgeName}</Tag>
                    ))
                    : <Empty description={"请添加知识点"} />
                }
              </div>
            </div>
            <ul className={styles.topicType}>
              {
                topicTypes && topicTypes.length > 0 && topicTypes.map((topicType, index) => (
                  <li key={index}>
                    <span>{topicType.topicType}：</span>
                    <Switch checked={this.state[`topicTypeSwitch-${topicType.id}`]}
                      onChange={(value) => this.toggleSwitch(value, topicType.id)} />
                  </li>
                ))
              }
            </ul>
            <Table
              className={styles.table}
              columns={column}
              rowKey={'id'}
              dataSource={this.state.topicTypeArr}
              pagination={false}
            />
            <div className={styles.nextBtnArea}>
              {isClick('下一步:预览分析') ? <div className={styles.nextBtn} onClick={this.next}>下一步:预览分析</div> : null}
            </div>
          </>
        )
      },
      {
        title: '第2步',
        content: (
          <div>
            <h3 className={styles.topicGroupAnalysis}>题组分析</h3>
            <div className={styles.analysis}>
              <div className={styles.topicTypeStatistics}>
                <div className="title">题型统计</div>
                {/* 
                <PieOne 
                idString="topicAnalysis" 
                styleObject={{ width: '80vw', height: 500 }}
                  chartData={topicTypeAnalysisData}
                 />
                <BarTwo /> */}

                <Table
                  dataSource={topicTypeAnalysisData || []}
                  pagination={false}
                  rowKey={"topicType"}
                  columns={columns} />
              </div>
              <div className={styles.difficultStatistics}>
                <div className="title">难度统计</div>
                <div className={styles.chart}>
                  <BarTwo idString="topicAnalysis"
                    styleObject={{ width: '80vw', height: 600 }}
                    chartData={difficultStatisticsChartData}
                  />
                  {/* <DifficultStatisticsChart data={difficultStatisticsChartData} /> */}
                </div>
              </div>
            </div>
            <div className={styles.nextBtnArea}>
              {isClick('上一步:调整分布情况') ? <div className={styles.preBtn} onClick={this.prev}>上一步:调整分布情况</div> : null}
              {isClick('下一步:进入试题板编辑') ? <div className={styles.nextBtn} onClick={this.confirm}>下一步:进入试题板编辑</div> : null}
            </div>
          </div>
        )
      },
    ]
    const title = '自动组题-我的题组';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );
    return (
      <Page header={header} loading={knowledgeLoading}>
        <div className={styles.AutomaticCombination}>
          <div className={styles.content}>
            <Affix offsetTop={20}>
              <div style={{ display: currentStep == 0 ? '' : 'none' }}>
                <KnowledgeList
                  onRef={this.onRef}
                  location={location}
                  getSelectedParam={this.getSelectedParam}
                  isMultiple={true}
                />
              </div>
            </Affix>

            <div className={styles.main}>
              <Steps current={currentStep}>
                {steps.map(item => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              {steps[currentStep].content}
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

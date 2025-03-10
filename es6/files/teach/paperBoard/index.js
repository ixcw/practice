/**
* 试题板
* @author:张江
* @date:2020年08月29日
* @version:v1.0.0
* @updateAuthor:张江
* @updateVersion:v1.1.0
* @updateDate:2020年11月04日
* @description 更新描述:动态获取题型列表 渲染材料题目 可上下移动题型进行排序
* @updateDate:2023年11月27日
* @description 更新描述:修复保存出现的问题
* */
import react, { Component } from 'react'
import {
  Radio,
  TreeSelect,
  Input,
  InputNumber,
  Message,
  Empty,
  Modal,
  Tag,
  Spin,
  Table,
  Button,
  Tree,
  Transfer
} from 'antd';
import { connect } from "dva";
import { routerRedux } from 'dva/router';
import queryString from 'qs';
import classNames from 'classnames';
import { HeartOutlined, HeartFilled, FrownOutlined } from '@ant-design/icons';

import Page from "@/components/Pages/page";
import styles from './index.less'
import TopicContent from "@/components/TopicContent/TopicContent";
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
import ParametersArea from '@/components/QuestionBank/ParametersArea';//
import BackBtns from "@/components/BackBtns/BackBtns";
import {
  ManualCombination,
  PaperBoard as namespace,
  HomeIndex,
  Auth,
  QuestionBank,
  MyQuestionTemplate,
  SchoolQuestionTemplate,
  Public
} from '@/utils/namespace'
import {
  getPageQuery,
  dealQuestionfieldIdOrName,
  existArr,
  calQuestionNum,
  calibrationScore,
  getIcon, openNotificationWithIcon, uppercaseNum, validatingSpecialCharacters,
  save2NumAfterPoint,
  pushNewPage
} from "@/utils/utils";
import userCache from "@/caches/userInfo";
import { myRegExp, permissionVisibleList, collectionType } from "@/utils/const";
// import DifficultStatisticsChart from "../components/chart/difficultStatisticsChart";
import BarTwo from '../components/chart/barTwo.js';
// import renderAnswerAnalysis from "@/components/RenderAnswerAnalysis/index";//渲染题目答案与解析部分
// import SetParameterModal from "../components/SetParameterModal/index";
import WrongQuestionMatchModal from "../components/WrongQuestionMatchModal/index";//相似题匹配
import EvalTargetModal from "../components/EvalTargetModal/index";//添加测评目标弹窗
import TopicGroupAnalysis from "../components/TopicGroupAnalysis";//题组分析弹窗
import ErrorCorrectionModal from "@/components/QuestionBank/ErrorCorrectionModal";
import paperBoardInfoCache from "@/caches/generalCacheByKey";//优化-试题版参数缓存-2021年07月23日-张江
import school from './../../School/School';

const IconFont = getIcon();
const { confirm } = Modal;

// const columns = [
//   {
//     title: '题型',
//     dataIndex: 'bigTopicType',
//     key: 'bigTopicType',
//   },
//   {
//     title: '题目量（占比）',
//     dataIndex: 'topicRate',
//     key: 'topicRate',
//   },
//   {
//     title: '分值（占比）',
//     dataIndex: 'scoreRate',
//     key: 'scoreRate',
//   },
//   {
//     title: '综合难度',
//     dataIndex: 'comprehensiveDifficulty',
//     key: 'comprehensiveDifficulty',
//   },
// ];
// //组题分析====>知识点统计表格的表头
// const knowledgeColumns = [
//   {
//     title: '题号',
//     dataIndex: 'serialNumber',
//     key: 'serialNumber',
//   },
//   {
//     title: '知识点',
//     dataIndex: 'knowNames',
//     key: 'knowNames',
//     render(text) {
//       return text ? text.split(',').map((knowName, index) => <Tag key={index} color={"#2db7f5"}>{knowName}</Tag>) : '-';
//     }
//   },
//   {
//     title: '分值',
//     dataIndex: 'score',
//     key: 'score',
//   },
//   {
//     title: '难度',
//     dataIndex: 'difficulty',
//     key: 'difficulty',
//   },
// ]

let scoreTemp = undefined//当前设置的题目分数暂存变量
let paperBoardInfoCacheKEY = '';//优化-试题版参数缓存KEY-2021年07月23日-张江
@connect(state => ({
  topicList: state[namespace].topicList,
  loading: state[namespace].loading,
  changeTopicList: state[ManualCombination].topicList,//待替换的题目列表
  changeTopicListLoading: state[ManualCombination].loading,
  analysisData: state[namespace].analysisData,//组题分析数据
  authButtonList: state[Auth].authButtonList,//按钮权限数据
}))
export default class PaperBoard extends Component {

  constructor(props) {
    super(...arguments);
    const query = getPageQuery()
    this.state = {
      collectedTopics: [],//已收藏的题目
      roleInfo: userCache(),
      topicsCount: 0,//题目总数
      totalScore: undefined,//保存操作的请求参数，总分
      paperType: query.paperType || undefined,//保存操作的请求参数，试卷类型
      topics: [],//保存操作的请求参数,所有题目
      topicScore: {},//用于存放每个题目分数的对象，用于给题目添加分数以及显示分数时方便取值，key：采用 下划线加题目id，如：{_2182:5,_2145:10}
      topicTypeTotalScores: [],//体型总分

      targetTopic: undefined,//换题操作---》即将被替换的题目
      toggleTopicModalIsShow: false,//换一题的弹框显示状态
      combinationAnalysisModalIsShow: false,//组题分析弹框显示状态
      repeatTotalNum: undefined,//可以用于替换的题目总数目
      setScoreModalIsShow: false,//设置分数弹框的显示状态
      setScoreData: [],//设置分数弹框表格的数据


      // isSetParameterModal: false,//是否显示设置参数弹窗-2020年12月30日加-张江-试题板设置参数 - 未使用-暂留

      questionInfo: null,//需要设参的题目信息-2020年12月30日加-张江-试题板设置参数 - 未使用-暂留
      isWrongQuestionMatchModal: false,//

      selectedChangeKnowId: '',//换一题添加知识点切换-2021年02月01日加-张江-已选中知识点id
      selectedChangeKnowList: [],//换一题添加知识点切换-2021年02月01日加-张江-待选择知识点列表

      permissionVisible: '3',//20210427新加 设置权限可见
      questionTemplateValue: '', // 试题模板值，前2位表示模板归属，01 学校模板 02 我的模板，后10位为唯一字符串，需要截取
      questionTemplateTreeData: [], // 试题模板树形数据
      paperNameValue: '', // 试卷名称
      templateList: [], // 模板列表
      knowledgePointTreeData: [], // 知识点树形数据
      knowledgePointValue: '', // 知识点值
      paperId: query.paperId || undefined,
      areaList: [], // 区域列表
      selectedChoolDataSource: [], // 已选学校列表数据源
      selectedChoolColumns: [
        {
          title: '省份',
          dataIndex: 'province',
          key: 'province',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '市',
          dataIndex: 'city',
          key: 'city',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '区/县',
          dataIndex: 'county',
          key: 'county',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '学校',
          dataIndex: 'school',
          key: 'school',
          align: 'center',
          ellipsis: true,
        },
      ], // 已选学校列表列数据
      querySchoolDataSource: [], // 查询学校列表
      querySchoolColumns: [
        {
          title: '学校',
          dataIndex: 'school',
          key: 'school',
          align: 'center',
          ellipsis: true,
        },
      ], // 查询学校列表列数据
      querySchoolLoading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      currentAreaId: null,
      isShowSelectSchoolModal: false,
      treeSelectedAreaKeys: [],
      selectedTransferKeys: [],
      targetTransferKeys: [],
      transferDataSource: [],
      selectedMultiSchools: ''
    }
  }


  /**
   * 渲染树节点，禁用非叶子节点
   * @param {*} data 模板数据
   * @param {*} level 记录层级
   */
  renderTreeNodes = (data, level = 0) => {
    return data.map((item) => {
      // 叶子节点 且 必须是第三层模板层
      if ((!item.children || item.children.length === 0) && level === 2) {
        return <TreeSelect.TreeNode value={item.value} title={item.title} isLeaf={true} />
      }
      // 非叶子节点
      return (
        <TreeSelect.TreeNode value={item.value} title={item.title} selectable={false}>
          {this.renderTreeNodes(item.children, level + 1)}
        </TreeSelect.TreeNode>
      )
    })
  }

  /**
   * 选择试题模板
   * @param {*} value 试题模板
   */
  onQuestionTemplateSelect = (value) => {
    const paperTemplateIdStr = value.slice(0, -10)
    const paperTemplateIdType = Number(paperTemplateIdStr.slice(0, 2))
    const paperTemplateId = Number(paperTemplateIdStr.slice(2))
    this.getTemplateDetail(paperTemplateIdType, paperTemplateId)
    this.setState({ questionTemplateValue: value })
  }
  /**
 * 选择知识点
 * @param {*} value 知识点
 */
  oneKnowledgePointSelect = (value) => {
    this.setState({ knowledgePointValue: value })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const role = JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.code
    const classId = JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.classId
    const schoolId = JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId
    const { roleInfo = {} } = this.state;
    // 获取模板列表
    dispatch({
      type: namespace + '/getQuestionTemplateTreeData',
      payload: {
        role,
        classId,
        schoolId
      },
      callback: res => this.setState({ questionTemplateTreeData: res.data.children })
    })
    // 获取知识点列表
    console.log(roleInfo, "用户信息")
    dispatch({
      type: namespace + '/getVersionKnowledgePoints',
      payload: {
        version: roleInfo && roleInfo.versionId
      },
      callback: (res) => {
        this.setState({
          knowledgePointTreeData: res.map((item) => {
            return {
              title: item.name,
              value: item.id,
              disabled:true,
              children: item.childList ? item.childList.map((childItem) => {
                return {
                  title: childItem.name,
                  value: childItem.id,
                  children: childItem.childList ? childItem.childList.map((subChildItem) => {
                    return {
                      title: subChildItem.name,
                      value: subChildItem.id,
                    };
                  }) : null
                };
              }) : null
            };
          })
        });

      }
    })

    if (roleInfo.subjectId) {//2020年12月29日加-张江
      this.getFourElementsList(roleInfo.subjectId)
    }
    /** ********************************************************* 优化-试题板参数显示 start author:张江 date:2021年07月23日 *************************************************************************/
    paperBoardInfoCacheKEY = `${roleInfo.account}-${roleInfo.gradeId}-${roleInfo.classId}-${roleInfo.subjectId}`;
    const paperBoardInfo = paperBoardInfoCache(paperBoardInfoCacheKEY, null) || {};
    const query = getPageQuery();
    if (paperBoardInfo.paperType) {
      this.setState({
        paperType: query.paperType || paperBoardInfo.paperType,//保存操作的请求参数，试卷类型
      })
    }
    if (paperBoardInfo.permissionVisible) {
      this.setState({
        permissionVisible: paperBoardInfo.permissionVisible || '3',//20210427新加 设置权限可见
      })
    }
    // if (paperBoardInfo.paperName) {
    //   setTimeout(() => {
    // 		this.refs.paperNameInput.state.value = query.paperName || paperBoardInfo.paperName //设置名称-2021年01月05日-张江
    // 	}, 0)
    // }

    if (query.paperName) {
      this.setState({ paperNameValue: query.paperName }) // 设置试卷名称
    }

    dispatch({
      type: namespace + '/getGroupCenterPaperBoard',
      callback: topicList => {
        this.setState(this.handleTopicsAndReturnNewStateObj(topicList, [], true))
      }
    })

    dispatch({
      type: Public + '/getAreaInfoList',
      payload: {},
      callback: (result) => {
        if (result && result.length > 0) {
          this.setState({ areaList: result })
        }
      }
    })
  }

  componentDidUpdate(prevProps) {
    const { topicList: prevTopicList } = prevProps
    const { topicList: newTopicList } = this.props
    if (JSON.stringify(prevTopicList) !== JSON.stringify(newTopicList)) {
      this.setState(this.handleTopicsAndReturnNewStateObj(newTopicList))
    }
  }

  /**
 * 获取四要素列表-2020年12月30日加-张江-试题板设置参数
 */
  getFourElementsList = (subjectId) => {
    const {
      dispatch,
    } = this.props;
    /** ********************************************************* 四要素设参 核心素养 关键能力 认知层次 start author:张江 date:2020年12月29日 *************************************************************************/
    //根据科目筛选关键能力
    dispatch({
      type: QuestionBank + '/getQuestionAbilityList',
      payload: {
        subjectId: subjectId,
      },
    });
    //根据科目筛选核心素养
    dispatch({
      type: QuestionBank + '/getQuestionCompetenceList',
      payload: {
        subjectId: subjectId,
      },
    });
    //根据科目筛选认知层次
    dispatch({
      type: QuestionBank + '/getCognitionLevelList',
      payload: {
        subjectId: subjectId,
      },
    });
    /** ********************************************************* 四要素设参 核心素养 关键能力 认知层次 end author:张江 date:2020年12月29日 *************************************************************************/
    /** ********************************************************* 题库管理 知识维度查询 start author:张江 date:2022年05月20日 *************************************************************************/
    //知识维度查询
    dispatch({
      type: QuestionBank + '/getKnowledgeDimension',
      payload: {},
    });
    /** ********************************************************* 题库管理 知识维度查询 end author:张江 date:2022年05月10日 *************************************************************************/

  }


  /**
  * 统计试题板题目数量
  */
  getTestQuestionEdition = () => {
    this.props.dispatch({
      type: HomeIndex + '/getTestQuestionEdition',
      payload: {},
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: `${namespace}/set`,
      payload: {
        topicList: undefined
      }
    })
  }

  /**
   * 收藏题目
   *@topicId :题目id
   *@isCollect :是否收藏，true，收藏操作，false：取消收藏操作
   */
  collectTopic = (topicId, isCollect) => {
    const { dispatch } = this.props
    const { roleInfo } = this.state
    topicId ?
      isCollect ?
        dispatch({
          type: `${ManualCombination}/collectTopic`,
          payload: {
            // questionId: topicId,
            // subjectId: roleInfo.subjectId,
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
          type: `${ManualCombination}/cancleCollectTopic`,
          payload: {
            // questionId: topicId,
            // subjectId: roleInfo.subjectId,
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
      : openNotificationWithIcon(
        'warning',
        '收藏失败！请稍后重试!',
        'rgba(0,0,0,.85)',
        '缺少题目id参数',
        2
      )
  }

  /**
   * 移除题目
   * @topicId:题目id
   * @tempId:试题板临时 id
   * @category:题目类型
   * */
  removeTopic = (topicId, tempId, category) => {
    const { dispatch } = this.props;
    const _self = this;
    confirm({
      title: '确认从试题板移除该题吗？',
      content: '',
      onOk() {
        dispatch({
          type: `${namespace}/remveTopic`,
          payload: {
            // questionId: topicId
            tempId,
          },
          callback: () => {
            //  移除成功后，从状态中复制一份题，并移除当前题，更新状态
            let topics = JSON.parse(JSON.stringify(_self.state.topics))
            topics.forEach(topicType => {
              if (topicType.category === category) {
                if (topicType.questionList) {
                  topicType.questionList = topicType.questionList.filter(topic => topic.id !== topicId)
                }
              }
            })
            _self.setState(_self.handleTopicsAndReturnNewStateObj(topics, [], false, true), _ => {
              _self.getTestQuestionEdition();
              Message.success("移除成功!")
            })
          }
        })
      },
      onCancel() { },
    });
  }


  /**
   * 处理获取到的数据，将需要统计的数据统计出来，并给每个题添加序号,并且返回新的可以用于修改状态的state
   * @param topics
   */
  handleTopicsAndReturnNewStateObj = (
    topics = [],
    templateList = [],
    isOrganize = false,
    reSequence = false
  ) => {
    let count = 0
    let qcount = 0
    let score = 0
    let topicTypeTotalScores = []
    let records = []//用于封装数据的，设置分数的弹框的所有题目记录
    // 根据模板规则，恢复小题或分割小题
    if (existArr(templateList)) {
      topics = this.restoreCategoryQuestionListByTemplate(topics, templateList)
    } else {
      topics = this.organizeCategoryQuestionList(topics, isOrganize)
    }
    if (reSequence) {
      topics = this.reSequenceCodeCategoryQuestionList(topics)
    }
    topics.forEach((topicType, topicTypeIndex) => {
      //定义变量统计当前体型的分数
      let topicTypeTotalScore = 0
      //遇到一个题目类型，创建一个对应的表格对象添加到 records 中
      if (topicType.questionList && topicType.questionList.length > 0) {
        records.push({
          serialNumber: topicType.name,
          sequenceCode: topicType.name,
          isTopicTypeTitle: true,
          topicTypeIndex,
          colSpan: 2,
          knowNames: '设置每道单题的分数'
        })
      }
      topicType.questionList && topicType.questionList.length > 0 && topicType.questionList.forEach((topic, index) => {
        if (parseFloat(topic.score)) {
          if (topic.sequenceCode) {
            const singleTopicScore = topic.sequenceCode.includes('-') ? 0 : parseFloat(topic.score)
            score += singleTopicScore
            topicTypeTotalScore += singleTopicScore
          } else {
            score += parseFloat(topic.score)
            topicTypeTotalScore += parseFloat(topic.score)
          }
        }
        // topic.serialNumber = ++count;
        //获取材料下子题的id 并处理分数
        if (existArr(topic.materialQuestionList)) {
          topic.materialQuestionList.map((item, tIndex) => {
            topic.serialNumber = ++qcount;
            item.serialNumber = topic.serialNumber
            //將題目添加到记录表格中
            records.push({
              id: item.id,
              parentId: item.parentId,
              tempId: item.tempId,
              serialNumber: item.serialNumber,
              sequenceCode: item.sequenceCode,
              knowNames: item.knowName,
              score: item.score,
              difficulty: item.difficulty,
              topicTypeIndex,
            })
          })
        } else {
          topic.serialNumber = ++qcount;
          //將題目添加到记录表格中
          records.push({
            id: topic.id,
            parentId: topic.parentId,
            tempId: topic.tempId,
            serialNumber: topic.serialNumber,
            sequenceCode: topic.sequenceCode,
            knowNames: topic.knowName,
            score: topic.score,
            difficulty: topic.difficulty,
            topicTypeIndex,
          })
        }
        // //將題目添加到记录表格中
        // records.push({
        //   id: topic.id,
        //   tempId: topic.tempId,
        //   serialNumber: topic.serialNumber,
        //   knowNames: topic.knowName,
        //   score: topic.score,
        //   difficulty: topic.difficulty,
        //   topicTypeIndex,
        //   materialQuestionList: topic.materialQuestionList,//材料下的子题
        // })
      })
      topicTypeTotalScores.push(topicTypeTotalScore)//将统计好的当前题型的总分添加到存放的数组中
    })
    records = this.createMergedDataSourceList(records)
    return { setScoreData: records, topicsCount: qcount, totalScore: score, topicTypeTotalScores, topics }
  }

  /**
   * 获取模板详情
   * @param {*} type 类型，1 学校 2 教师
   * @param {*} templateId 模板id
   */
  getTemplateDetail = (type, templateId) => {
    const { dispatch } = this.props
    if (type === 1) {
      // 获取学校模板详情
      dispatch({
        type: `${SchoolQuestionTemplate}/getSchoolTemplateDetail`,
        payload: { id: templateId },
        callback: res => {
          this.setState({ templateList: res.data.templateDetails }, () => {
            this.setState(this.handleTopicsAndReturnNewStateObj(this.state.topics, this.state.templateList))
          })
        }
      })
    } else if (type === 2) {
      // 获取我的模板详情
      dispatch({
        type: `${MyQuestionTemplate}/getMyTemplateDetail`,
        payload: { id: templateId },
        callback: res => {
          this.setState({ templateList: res.data.templateDetails }, () => {
            this.setState(this.handleTopicsAndReturnNewStateObj(this.state.topics, this.state.templateList))
          })
        }
      })
    }
  }

  /**
   * 通过 parentId 组织题目列表
   * @param {*} questionList 题目列表
   * @param {*} qCount 题目计数对象
   */
  organizeQuestionListByParentId = (questionList, qCount) => {
    const questionMap = new Map()
    const organizeMaterialQuestionList = (materialQuestionList, qCount) => {
      if (existArr(materialQuestionList)) {
        this.organizeQuestionListByParentId(materialQuestionList, qCount)
        materialQuestionList.forEach(materialQuestion => {
          if (existArr(materialQuestion.materialQuestionList)) {
            qCount = organizeMaterialQuestionList(materialQuestion.materialQuestionList, qCount)
          }
        })
      }
      return qCount
    }
    questionList.forEach(question => {
      questionMap.set(question.id, question)
      if (existArr(question.materialQuestionList)) {
        qCount = organizeMaterialQuestionList(question.materialQuestionList, qCount)
      } else if (!question.parentId) {
        question.childrenList = []
        question.sequenceCode = `${++qCount.count}`
      }
    })
    for (let i = questionList.length -1; i >= 0; i--) {
      if (questionList[i].parentId) {
        const parent = questionMap.get(questionList[i].parentId)
        if (parent) {
          const content = parent.content
          const lastIndex = content.lastIndexOf('<@>')
          if (lastIndex !== -1) {
            questionList[i].lastContent = content.slice(lastIndex + 3)
          }
          parent.childrenList.unshift(questionList[i])
          parent.childrenList.forEach((q, i) => {
            q.sequenceCode = `${parent.sequenceCode}-${i + 1}`
          })
          questionList.splice(i, 1)
        }
      }
    }
  }

  /**
   * 重新排序分类题目列表编号
   * @param {*} categoryQuestionList 分类题目列表
   * @returns 分类题目列表
   */
  reSequenceCodeCategoryQuestionList = (categoryQuestionList) => {
    const qCount = { count: 0 }
    const reSequenceCodeQuestionList = (questionList, qCount) => {
      const organizeMaterialQuestionList = (materialQuestionList, qCount) => {
        if (existArr(materialQuestionList)) {
          reSequenceCodeQuestionList(materialQuestionList, qCount)
          materialQuestionList.forEach(materialQuestion => {
            if (existArr(materialQuestion.materialQuestionList)) {
              qCount = reSequenceCodeQuestionList(materialQuestion.materialQuestionList, qCount)
            }
          })
        }
        return qCount
      }
      questionList.forEach(question => {
        if (existArr(question.materialQuestionList)) {
          qCount = organizeMaterialQuestionList(question.materialQuestionList, qCount)
        } else {
          if (!question.parentId) {
            question.sequenceCode = `${++qCount.count}`
            if (existArr(question.childrenList)) {
              question.childrenList.forEach((q, i) => {
                q.sequenceCode = `${question.sequenceCode}-${i + 1}`
              })
            }
            let childCode = 0
            questionList.forEach(q => {
              if (q.parentId === question.id) {
                childCode++
                q.sequenceCode = `${question.sequenceCode}-${childCode}`
              }
            })
          }
        }
      })
    }
    categoryQuestionList.forEach(categoryQuestion => {
      const questionList = categoryQuestion.questionList
      if (existArr(questionList)) {
        reSequenceCodeQuestionList(questionList, qCount)
      }
    })
    return categoryQuestionList
  }

  /**
   * 组织分类题目列表
   * @param {*} categoryQuestionList 分类题目列表
   * @param {*} isOrganize 是否组织
   * @returns 分类题目列表
   */
  organizeCategoryQuestionList = (categoryQuestionList, isOrganize) => {
    if (isOrganize) {
      const qCount = { count: 0 }
      categoryQuestionList.forEach(categoryQuestion => {
        const questionList = categoryQuestion.questionList
        if (existArr(questionList)) {
          this.organizeQuestionListByParentId(questionList, qCount)
        }
      })
    }
    return categoryQuestionList
  }

  /**
   * 通过题目子列表组织题目列表
   * @param {*} questionList 题目列表
   */
  organizeQuestionListByChildrenList = (questionList) => {
    if (!existArr(questionList)) return
    const isOnlyParentNode = questionList.every(question => !question.parentId)
    const clonedQuestionList = JSON.parse(JSON.stringify(questionList))
    questionList.forEach(question => {
      const id = question.id
      const childrenList = question.childrenList
      if (existArr(childrenList) && isOnlyParentNode) {
        const sIndex = clonedQuestionList.findIndex(question => question.id === id)
        clonedQuestionList.splice(sIndex + 1, 0, ...childrenList)
      }
    })
    questionList.length = 0
    questionList.push(...clonedQuestionList)
    questionList.forEach(question => {
      if (existArr(question.materialQuestionList)) {
        this.organizeQuestionListByChildrenList(question.materialQuestionList)
      }
    })
  }

   /**
   * 取消通过题目子列表组织题目列表
   * @param {*} questionList 题目列表
   */
  cancelOrganizeQuestionListByChildrenList = (questionList) => {
    if (!existArr(questionList)) return
    for (let i = questionList.length - 1; i >= 0; i--) {
      const question = questionList[i]
      const parentId = question.parentId
      const materialQuestionList = question.materialQuestionList
      if (parentId) {
        questionList.splice(i, 1)
      } else {
        if (existArr(materialQuestionList)) {
          this.cancelOrganizeQuestionListByChildrenList(materialQuestionList)
        }
      }
    }
  }

  /**
   * 通过模板列表恢复分类题目列表
   * @param {*} categoryQuestionList 分类题目列表
   * @param {*} templateList 模板列表
   * @returns 分类题目列表
   */
  restoreCategoryQuestionListByTemplate = (categoryQuestionList, templateList) => {
    const categoryMap = categoryQuestionList.reduce((acc, category) => (acc[category.name] = category, acc), {})
    templateList.forEach(template => {
      if (template.smallItem === 1) {
        // 分割小题小项
        const category = categoryMap[template.categoryName]
        if (category) {
          this.organizeQuestionListByChildrenList(category.questionList)
        }
      } else {
        // 取消分割
        const category = categoryMap[template.categoryName]
        if (category) {
          this.cancelOrganizeQuestionListByChildrenList(category.questionList)
        }
      }
    })
    return categoryQuestionList
  }

  /**
   * 创建合并数据源列表
   * @param {*} dataSourceList 数据源列表
   * @returns 合并数据源列表
   */
  createMergedDataSourceList = (dataSourceList) => {
    const hasSequenceCode = dataSourceList.every(el => el.sequenceCode)
    if (!hasSequenceCode) return dataSourceList
    const topicTypeList = []
    const mergedDataSourceList = []
    for (let i = dataSourceList.length - 1; i >= 0; i--) {
      if (dataSourceList[i]?.isTopicTypeTitle) {
        topicTypeList.push({k: i, v: dataSourceList.splice(i, 1)[0]})
      }
    }
    const topicGroupList = dataSourceList.reduce((acc, val) => {
      if (!acc[val.topicTypeIndex]) acc[val.topicTypeIndex] = []
      acc[val.topicTypeIndex].push(val)
      return acc
    }, [])
    topicGroupList.forEach(topicGroup => {
      const mergedTopicGroupList = topicGroup.filter(item => {
        return (!item.sequenceCode.includes('-') && !item.parentId)
      }).reduce((acc, val) => {
        const children = [val]
        topicGroup.forEach(item => {
          if (val.id === item.parentId) children.push(item)
        })
        acc = acc.concat(
          children.map((item, index) => ({
            ...item,
            rowSpan: index === 0 ? children.length : 0
          }))
        )
        return acc
      }, [])
      mergedDataSourceList.push(...mergedTopicGroupList)
    })
    mergedDataSourceList.sort((a, b) => a.serialNumber - b.serialNumber)
    if (topicTypeList.length > 0) {
      for (let i = topicTypeList.length - 1; i >= 0; i--) {
        mergedDataSourceList.splice(topicTypeList[i].k, 0, topicTypeList[i].v)
      }
    }
    return mergedDataSourceList
  }

  /**
   * 创建合并材料数据源列表
   * @param {*} materialDataSourceList 材料数据源列表
   * @returns 合并材料数据源列表
   */
  createMergedMaterialDataSourceList = (materialDataSourceList) => {
    const hasSequenceCode = materialDataSourceList.every(el => el.sequenceCode)
    if (!hasSequenceCode) return materialDataSourceList
    const topMaterialElem = materialDataSourceList.shift()
    topMaterialElem.knowName = '设置每道单题的分数'
    const mergedMaterialDataSourceList = []
    const mergedMaterialTopicList = materialDataSourceList.filter(item => {
      return (!item.sequenceCode.includes('-') && !item.parentId)
    }).reduce((acc, val) => {
      const children = [val]
      materialDataSourceList.forEach(item => {
        if (val.id === item.parentId) children.push(item)
      })
      acc = acc.concat(
        children.map((item, index) => ({
          ...item,
          rowSpan: index === 0 ? children.length : 0
        }))
      )
      return acc
    }, [])
    mergedMaterialDataSourceList.push(...mergedMaterialTopicList)
    mergedMaterialDataSourceList.sort((a, b) => a.serialNumber - b.serialNumber)
    mergedMaterialDataSourceList.unshift(topMaterialElem)
    return mergedMaterialDataSourceList
  }

  /**
   * 打开/关闭 换题弹窗isShow,
   * @ isShow ：显示状态
   * @topic:需要替换的题目
   */
  toggleTopicModalState = (isShow, topic) => {
    const { dispatch, topicList = [] } = this.props
    //如果是打开弹窗，发送请求获取题目列表
    if (isShow) {
      // 换一题添加知识点切换 - 2021年02月01日加 - 张江 - 待选择知识点列表 start
      const selectedChangeKnowList = dealQuestionfieldIdOrName(topic);
      if (existArr(selectedChangeKnowList)) {
        const selectedId = selectedChangeKnowList[0].code
        // 换一题添加知识点切换 - 2021年02月01日加 - 张江 - 待选择知识点列表 end
        dispatch({
          type: `${ManualCombination}/getTopicList`,
          payload: {
            type: 2,//1.表示试题中心拉题；2.试题板换一题
            page: 1,
            size: 10,
            categoryStr: topic.category,
            // difficultIntStr: topic.difficulty,//题目难度
            knowIdStr: selectedId,//topic.knowIds,
            subjectId: topic.subjectId,
            status: 1
          },
          callback: data => {
            //更新状态，以便于在点击换一批的时候，计算随机页码
            this.setState({
              repeatTotalNum: data && data.total,
              selectedChangeKnowId: selectedId,
              selectedChangeKnowList,
            })
          }
        })
      }
    }
    let newState = {
      toggleTopicModalIsShow: isShow
    }
    if (topic) {
      topic.categoryName = this.getCategoryName(topicList, topic);//获取题型标题
      newState = { ...newState, targetTopic: topic }
    } else {
      newState = { ...newState, targetTopic: undefined }
    }
    this.setState(newState)
  }

  /**
 * 获取题目类型标题
 * @param topicList ：题型列表
 * @param topic ：题目信息
 *
 */
  getCategoryName = (topicList = [], topic = {}) => {
    let bigTopicType = '无'
    for (const categoryJson of topicList) {
      if (categoryJson.category == topic.category) {
        bigTopicType = categoryJson.name || '无';
        break;
      }
    }
    return bigTopicType;
  }

  /**
   * 打开/关闭  查看组题分析的弹框
   * @param isShow ：显示状态
   *
   */
  toggleAnalysisModalState = (isShow) => {
    const { topics } = this.state
    const { dispatch } = this.props
    //如果是打开弹窗，发送请求
    if (isShow) {
      //使用延时器，将内部的代码放到事件队列中执行，解决设置最后一道题分数后直接点击预览报告导致最后一道题分数没有设置的问题
      setTimeout(_ => {
        let noScoreTopics = []//定义数组，存放所有没有设置分数的题目序号
        //遍历数据，封装参数
        let topicList = []
        topics && topics.forEach(topicType => {
          topicType && topicType.questionList && topicType.questionList.forEach(topic => {
            if (existArr(topic.materialQuestionList)) {//获取材料下子题的id 并处理分数
              topic.materialQuestionList.map((item) => {
                if (item.id !== null && item.id !== undefined && item.id !== '' && item.score !== null && item.score !== undefined && item.score !== '' && item.score != 0) {
                  topicList.push({
                    id: item.id,
                    score: parseFloat(item.score),
                    code: item.serialNumber
                  })
                } else {
                  noScoreTopics.push(item.serialNumber)
                }
              })
            } else {
              if (topic.id !== null && topic.id !== undefined && topic.id !== '' && topic.score !== null && topic.score !== undefined && topic.score !== '' && topic.score != 0) {
                topicList.push({
                  id: topic.id,
                  score: parseFloat(topic.score),
                  code: topic.serialNumber
                })
              } else {
                noScoreTopics.push(topic.serialNumber)
              }
            }
            // if (topic.id !== null && topic.id !== undefined && topic.id !== '' && topic.score !== null && topic.score !== undefined && topic.score !== '') {
            //   topicList.push({
            //     id: topic.id,
            //     score: parseFloat(topic.score)
            //   })
            // } else {
            //   noScoreTopics.push(topic.serialNumber)
            // }
          })
        })
        if (noScoreTopics.length === 0) {
          this.setState({ combinationAnalysisModalIsShow: isShow })
          dispatch({
            type: `${namespace}/previewAnalysis`,
            payload: {
              question: topicList,
              type: 1,//1 表示还没有组成试卷之前（在试题板看到的题组分析），2：表示组成任务之后其他地方需要看这个任务的组题分析
            }
          })
        } else {
          openNotificationWithIcon(
            'warning',
            `请设置第 ${noScoreTopics.join("、")} 题的分数`,
            'rgba(0,0,0,.85)',
            '',
            4
          )
        }
      }, 0)
    } else {
      this.setState({ combinationAnalysisModalIsShow: isShow })
    }
  }

  /**
   * 打开/关闭   设置全部分数的弹框
   * @param isShow
   */
  toggleScoreModalState = (isShow, type) => {
    this.setState({ setScoreModalIsShow: type == 2 || !type ? !!isShow : true }, () => {
      const returnData = this.handleTopicsAndReturnNewStateObj(this.state.topics) || {}
      if (type == 1) {
        let setScoreData = returnData.setScoreData && returnData.setScoreData.filter((item) => item.id)
        let tempSetScoreData = []
        setScoreData && setScoreData.map((topic) => {
          //获取材料下子题的id 并处理分数
          if (existArr(topic.materialQuestionList)) {
            const tempScore = save2NumAfterPoint(Number(topic.score) / topic.materialQuestionList.length, 1)
            topic.materialQuestionList.map((item) => {
              let itemJson = { ...item, id: item.id, tempId: item.tempId, score: tempScore }
              tempSetScoreData.push(itemJson)
            })
          } else {
            tempSetScoreData.push(topic)
          }
        })
        this.saveScoreSetting(tempSetScoreData, false);
      }
    })
  }

  /**
   * 打开/关闭 设置材料下单个题的分数的弹框
   * @param isShow
   */
  toggleSingleScoreModalState = (isShow, type) => {
    const { singleTopic = {} } = this.state;
    this.setState({ isShowSingleTopic: type == 2 || !type ? !!isShow : true }, () => {
      if (type == 1) {
        let setScoreData = singleTopic.materialQuestionList && singleTopic.materialQuestionList.filter((item) => item.id);
        setScoreData = setScoreData && setScoreData.map((item) => {
          let itemJson = { ...item, id: item.id, tempId: item.tempId };
          return itemJson;
        })
        this.saveScoreSetting(setScoreData, true);
      }
    })
  }

  showSelectSchoolModalState = () => {
    this.setState({ isShowSelectSchoolModal: true })
  }

  hideSelectSchoolModal = () => {
    this.setState({ isShowSelectSchoolModal: false })
  }

  setSelectedSchool = () => {
    this.setState({ isShowSelectSchoolModal: false })
  }

  /**
   * 渲染树形结构
   * @param data: 数据
   */
  renderSchoolTreeNodes = data => {
    return data && data.map(item => {
      if ((item.areas && item.areas.length > 0)) {
        return {
          title: item.name,
          key: item.id,
          dataRef: item,
          children: this.renderSchoolTreeNodes(item.areas)
        }
      }
      return {
        title: item.name,
        key: item.id,
        dataRef: item,
        ...item,
        isLeaf: true
      }
    })
  }

  /**
   * 选择区域
   * @param selectedKeys：选中的id
   */
  onTreeSelect = (selectedKeys) => {
    const { pagination } = this.state
    if (!selectedKeys || selectedKeys.length < 1) return
    pagination.current = 1
    this.setState({ 
      treeSelectedAreaKeys: selectedKeys,
      pagination,
      currentAreaId: selectedKeys[0]
    }, () => {
      this.queryAreaSchoolList(selectedKeys[0])
    })
  }

  /**
   * 学校表格分页
   * @param {*} pagination 
   */
  handleTableChange = (pagination) => {
    const { currentAreaId } = this.state
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          current: pagination.current,
        },
      },
      () => {
        this.queryAreaSchoolList(currentAreaId)
      }
    )
  }

  /**
   * 查询区域学校列表
   * @param {*} areaId 区域id
   */
  queryAreaSchoolList = (areaId) => {
    const { dispatch } = this.props
    const { pagination } = this.state
    this.setState({ querySchoolLoading: true })
    dispatch({
      type: namespace + '/findOrganizeInfoList',
      payload: {
        areaId,
        page: pagination.current,
        size: pagination.pageSize,
      },
      callback: (result) => {
        const { data, total } = result
        const querySchoolDataSource = data.map(item => ({
          key: item.id,
          school: item.name,
          detailAddress: item.detailAddress
        }))
        this.setState({ 
          querySchoolDataSource,
          querySchoolLoading: false,
          pagination: {
            ...pagination,
            total
          },
        })
      }
    })
  }
  
  handleTransferChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetTransferKeys: nextTargetKeys })
  }

  onSelectTransferChange = (sourceSelectedKeys, targetSelectedKeys) => {
    const selectedMultiSchools = targetSelectedKeys.join(',')
    const selectedChoolDataSource = this.state.transferDataSource
      .filter(item => targetSelectedKeys.includes(item.key))
      .map(item => ({
        key: item.key,
        province: item.detailAddress.split(',')[0],
        city: item.detailAddress.split(',')[1],
        county: item.detailAddress.split(',')[2],
        school: item.title
      }))
    this.setState({ 
      selectedTransferKeys: [...sourceSelectedKeys, ...targetSelectedKeys],
      selectedMultiSchools,
      selectedChoolDataSource,
    })
  }

  /**
   * 点击左侧导航题目选中时
   * @param topicId
   */
  selectTopic = (topicId, idString) => {
    const { topics } = this.state
    topics && topics.length > 0 && topics.forEach(topicType => {
      topicType && topicType.questionList && topicType.questionList.forEach(topic =>
        topicId === topic.id
          ? topic.isSelected = true
          : topic.isSelected = false
      )
    })
    this.setState({ topics });

    let offsetTop = document.getElementById(idString).offsetTop;
    offsetTop = offsetTop - 20;//计算可滚动的高度=
    window.scrollTo({//滚动的距离
      top: offsetTop < 0 ? 0 : offsetTop,
      behavior: "smooth"
    });
  }

  /**
   * 替换题目操作
   * @newTopic:用于替换的新题
   */
  replaceTopic(newTopic) {
    const { dispatch } = this.props
    const { targetTopic, topics } = this.state//从state中获取待换题和新题

    if (newTopic !== undefined && targetTopic !== undefined) {
      topics && topics.forEach(topicType => {
        topicType.questionList && topicType.questionList.forEach((topic, index) => {
          if (topic.id === targetTopic.id) {
            //将被替换的题目的tempid赋值给新的题目(解决，连续替换，替换时导致没有tempId无法替换的问题)
            newTopic.tempId = targetTopic.tempId
            topicType.questionList[index] = newTopic
            //三个参数不能为没值，为避免值为0的情况，所以单独判断undefined和null的情况（0可以通过条件）
            if (targetTopic.tempId !== undefined && targetTopic.tempId !== null && newTopic.id !== undefined && newTopic.id !== null && newTopic.category !== undefined && newTopic.category !== null) {
              dispatch({
                type: `${ManualCombination}/saveOptionQuestion`,
                payload: {
                  id: targetTopic.tempId,//即将被替换的题目在数据库表中的位置id
                  questionId: newTopic.id,
                  questionCategory: newTopic.category,
                },
                callback: _ => {
                  Message.success("替换成功!")
                  //替换成功后，将本地数据修改，更新页面
                  this.setState(this.handleTopicsAndReturnNewStateObj(topics, [], false, true), () => {
                    //关闭弹窗
                    this.toggleTopicModalState(false)
                  })
                }
              })
            } else {
              Message.error('替换失败！请稍后重试')
            }
          }
        })
      })
    }
  }

  /**
   * 随机换一页（换一批功能）
   */
  randomChange = () => {
    const { targetTopic, repeatTotalNum } = this.state
    const { dispatch, changeTopicList = {} } = this.props;
    let pageNum = Math.ceil(Math.random() * (repeatTotalNum / 10));

    // const { currentPage=1 } = changeTopicList
    // let pageNum = currentPage+1;//换一批 则是下一页
    // if (currentPage * 10 > repeatTotalNum){
    //   pageNum=1;
    // }
    // dispatch({
    //   type: `${ManualCombination}/getTopicList`,
    //   payload: {
    //     type: 2,//1.表示试题中心拉题；2.试题板换一题
    //     page: pageNum || 1,
    //     size: 10,
    //     categoryStr: targetTopic.category,
    //     // difficultIntStr: targetTopic.difficulty,//题目难度
    //     knowIdStr: selectedChangeKnowId,//targetTopic.knowIds,
    //     subjectId: targetTopic.subjectId,
    //     status: 1
    //   }
    // })
    this.getTopicListData(pageNum)
  }

  /**
  * 获取数据
  */
  getTopicListData = (pageNum) => {
    const { targetTopic, selectedChangeKnowId } = this.state
    const { dispatch } = this.props;
    dispatch({
      type: `${ManualCombination}/getTopicList`,
      payload: {
        type: 2,//1.表示试题中心拉题；2.试题板换一题
        page: pageNum,
        size: 10,
        categoryStr: targetTopic.category,
        // difficultIntStr: targetTopic.difficulty,//题目难度
        knowIdStr: selectedChangeKnowId,//targetTopic.knowIds,
        subjectId: targetTopic.subjectId,
        status: 1
      }
    })
  }
  /**
   * 设置试卷类型
   * @param e
   */
  setPaperType = (e) => {
    this.setPaperBoardInfoCache('paperType', e.target.value)
    this.setState({ paperType: e.target.value })
  }

  /**
  * 设置权限可见
  * @param e
  */
  setPermissionVisible = (e) => {
    this.setPaperBoardInfoCache('permissionVisible', e.target.value)
    this.setState({ permissionVisible: e.target.value })
  }

  /**
   * 切换是否可编辑的状态
   * @param topic 题目对象
   */
  toggleEditState = (topic) => {
    const { topics } = this.state;
    if (scoreTemp === undefined) {
      if (existArr(topic.materialQuestionList)) {
        this.dealMaterialQuestionScore(topic)
        this.setState({ isShowSingleTopic: true })
      } else {
        topic.isEdit = true
        this.setState({ topics })
      }
    }
  }


  /**
   * 设置单题分数
   * @param topic 题目对象
   * @param score 需要设置的分数
   * @param topicTypeIndex 当前单题所在的大题所在整张试卷数组的下标
   */
  setSingleItemScore = (topic, score, topicTypeIndex, type) => {
    const { topics, singleTopic = {} } = this.state
    let topicTypeKeyName = `topicTypeInput-${topicTypeIndex}`
    //如果分数为xxx. 的格式，自动处理，在末尾添加0
    score = calibrationScore(score)
    myRegExp.checkScoreFormat.lastIndex = 0;
    //需要保存的分数数据
    let saveDataScore = [];
    if (!topic.sequenceCode) {
      openNotificationWithIcon(
        'warning',
        '设置失败！',
        'rgba(0,0,0,.85)',
        '数据异常，请刷新页面重试！',
        3
      )
      scoreTemp = undefined
      return
    }
    if (Number(score) === 0) {
      openNotificationWithIcon(
        'warning',
        '设置失败！',
        'rgba(0,0,0,.85)',
        '您当前输入的分数不合理（不能设置0分）',
        3
      )
      scoreTemp = undefined
      return
    }
    if (score === '' || myRegExp.checkScoreFormat.test(score)) {
      topics && topics.forEach((topicType, topicTypeI) => {
        //定义一个变量，判断是否当前设置的分数和其他所有题的分数都一样，如果一样，在【每题（多少）分那儿也同步分数】
        let scoreIsSame = true
        topicType && topicType.questionList && topicType.questionList.forEach(topicItem => {
          //遍历查找需要设置分数的题，找到以后，直接设置分数
          if (existArr(topicItem.materialQuestionList)) {
            //处理材料下单题的情况
            let currentMaterialScroce = 0;
            topicItem.materialQuestionList.map((item) => {
              if (topic.id === item.id) {
                if (score !== '') {
                  item.score = score;
                  topicItem.materialQuestionList.forEach(v => {
                    if (
                      v.sequenceCode &&
                      v.sequenceCode.includes('-') &&
                      v.sequenceCode.startsWith(item.sequenceCode)
                    ) {
                      v.score = ''
                    }
                  })
                }
                item.isEdit = false
              } else {
                //如果遇到不同的分数，则说明存在不同的分数
                scoreIsSame = item.score === score
              }
              if (topicTypeIndex === item.serialNumber) {
                scoreIsSame
                  ? this.setState({ [topicTypeKeyName]: score })
                  : this.setState({ [topicTypeKeyName]: '' })
              }
              currentMaterialScroce += item?.sequenceCode.includes('-') ? 0 : Number(item.score)
            })
            topicItem.score = currentMaterialScroce;
            if (singleTopic && topicItem && singleTopic.id == topicItem.id) {
              this.dealMaterialQuestionScore(topicItem)
            }
          } else {
            if (topic.id === topicItem.id) {
              if (score !== '' && score != 0) {
                topicItem.score = score;
                topicType.questionList.forEach(v => {
                  if (
                    v.sequenceCode &&
                    v.sequenceCode.includes('-') &&
                    v.sequenceCode.startsWith(topicItem.sequenceCode)
                  ) {
                    v.score = ''
                  }
                })
              }
              topicItem.isEdit = false
            } else {
              //如果遇到不同的分数，则说明存在不同的分数
              scoreIsSame = topicItem.score === score
            }
          }
        })
        if (topicTypeIndex === topicTypeI) {
          scoreIsSame
            ? this.setState({ [topicTypeKeyName]: score })
            : this.setState({ [topicTypeKeyName]: '' })
        }
      })
      this.setState(this.handleTopicsAndReturnNewStateObj(this.state.topics), () => { scoreTemp = undefined })
      if (type == 1 || type == 2) return
      if (!existArr(saveDataScore)) {
        saveDataScore = [{ id: topic.id, tempId: topic.tempId, score }];
      }
      this.saveScoreSetting(saveDataScore, true);
    } else {
      openNotificationWithIcon(
        'warning',
        '设置失败！',
        'rgba(0,0,0,.85)',
        '您当前输入的分数不合理（小数位后只能保留一位且是0或者5）',
        3
      )
    }
  }

  /**
   * 设置小项分数
   */
  setSmallItemScore = (topic, score, type) => {
    const { topics, singleTopic = {} } = this.state
    score = calibrationScore(score)
    myRegExp.checkScoreFormat.lastIndex = 0
    let saveDataScore = [];
    const parentId = topic.parentId
    let parentScore = null
    let childrenTotalScore = null
    const childrenList = []
    if (Number(score) === 0) {
      openNotificationWithIcon(
        'warning',
        '设置失败！',
        'rgba(0,0,0,.85)',
        '您当前输入的分数不合理（不能设置0分）',
        3
      )
      scoreTemp = undefined
      return
    }
    if (myRegExp.checkScoreFormat.test(score)) {
      topics && topics.forEach((topicType) => {
        topicType && topicType.questionList && topicType.questionList.forEach(topicItem => {
          if (existArr(topicItem.materialQuestionList)) {
            topicItem.materialQuestionList.map((item) => {
              if (item.id === parentId) {
                parentScore = Number(item.score)
              }
              if (item.parentId === parentId) {
                childrenList.push(item)
              }
            })
          } else {
            if (topicItem.id === parentId) {
              parentScore = Number(topicItem.score)
            }
            if (topicItem.parentId === parentId) {
              childrenList.push(topicItem)
            }
          }
        })
      })
      if (!parentScore) {
        openNotificationWithIcon(
          'warning',
          '设置失败！',
          'rgba(0,0,0,.85)',
          '设置小项分数前请先设置单题分数',
          3
        )
        scoreTemp = undefined
        return
      }
      childrenTotalScore = childrenList.reduce((acc, val) => {
        const aScore = val.id === topic.id ? Number(score) : Number(val.score)
        return acc + (isNaN(aScore) ? 0 : aScore)
      }, 0)
      const isLastChild = childrenList
        .filter(v => v.id !== topic.id)
        .every(v => v.score)
      if (childrenTotalScore > parentScore) {
        openNotificationWithIcon(
          'warning',
          '设置失败！',
          'rgba(0,0,0,.85)',
          '小项分数之和不可超过单题分数',
          3
        )
        scoreTemp = undefined
        return
      }
      if (isLastChild && (childrenTotalScore !== parentScore)) {
        openNotificationWithIcon(
          'warning',
          '设置失败！',
          'rgba(0,0,0,.85)',
          '小项分数之和必须等于单题分数',
          3
        )
        scoreTemp = undefined
        return
      }
      topics && topics.forEach((topicType) => {
        topicType && topicType.questionList && topicType.questionList.forEach(topicItem => {
          if (existArr(topicItem.materialQuestionList)) {
            let currentMaterialScroce = 0;
            topicItem.materialQuestionList.map((item) => {
              if (topic.id === item.id) {
                if (score) item.score = score
                item.isEdit = false
              }
              currentMaterialScroce += item?.sequenceCode.includes('-') ? 0 : Number(item.score)
            })
            topicItem.score = currentMaterialScroce
            if (singleTopic && topicItem && singleTopic.id == topicItem.id) {
              this.dealMaterialQuestionScore(topicItem)
            }
          } else {
            if (topic.id === topicItem.id) {
              if (score) topicItem.score = score
              topicItem.isEdit = false
            }
          }
        })
      })
      this.setState(this.handleTopicsAndReturnNewStateObj(this.state.topics), () => { scoreTemp = undefined })
      if (type == 1 || type == 2) return
      if (!existArr(saveDataScore)) {
        saveDataScore = [{ id: topic.id, tempId: topic.tempId, score }];
      }
      this.saveScoreSetting(saveDataScore, true);
    } else {
      openNotificationWithIcon(
        'warning', '设置失败！',
        'rgba(0,0,0,.85)',
        '您当前输入的分数不合理（小数位后只能保留一位且是0或者5）',
        3
      )
    }
  }

  /**
   * 批量设置一类大题下的题目分数
   * @param topicTypeIndex ：当前设置的大题再整张试卷的索引
   * @param score：设置的分数
   */
  handleEveryTopicScoreAndReturnNewStateObj = (topicTypeIndex, score) => {
    const { topics } = this.state
    let newScore = calibrationScore(score)
    // 在全局匹配模式下
    // 对于同一个正则对象重复调用就会出现下一次的匹配位置从上一次匹配结束的位置开始,解决方法重置lastIndex为0
    myRegExp.checkScoreFormat.lastIndex = 0
    if (newScore === '' || myRegExp.checkScoreFormat.test(newScore + "")) {
      topics && topics.length > 0 && topics.forEach((topicType, index) => {
        //找到当前大题，将下面所有的小题分数设置为需要设置的分数
        if (index === topicTypeIndex) {
          let { questionList } = topicType
          questionList && questionList.length > 0 && questionList.forEach(topic => {
            //获取材料下子题的id 并处理分数
            if (existArr(topic.materialQuestionList)) {
              topic.materialQuestionList.map((item) => {
                if (!item.sequenceCode.includes('-')) {
                  item.score = newScore
                } else {
                  item.score = ''
                }
              })
              //统计材料下所有小题的分数
              topic.score = newScore * (topic.materialQuestionList.filter(v => !v.sequenceCode.includes('-')).length);
            } else {
              if (!topic.sequenceCode.includes('-')) {
                topic.score = newScore
              } else {
                topic.score = ''
              }
            }
          })
        }
      })
      return this.handleTopicsAndReturnNewStateObj(topics)
    } else {
      openNotificationWithIcon(
        'warning', '设置失败！',
        'rgba(0,0,0,.85)',
        '您当前输入的分数不合理（小数位后只能保留一位且是0或者5）',
        2
      )
    }
  }

  /**
  * 批量设置材料下单个题目分数
  * @param serialNumber ：题目在材料下的编号
  * @param score：设置的分数
  */
  handleSingleEveryTopicScoreAndReturnNewStateObj = (serialNumber, score) => {
    const { singleTopic, topics } = this.state
    let newScore = calibrationScore(score)
    // 在全局匹配模式下
    // 对于同一个正则对象重复调用就会出现下一次的匹配位置从上一次匹配结束的位置开始,解决方法重置lastIndex为0
    myRegExp.checkScoreFormat.lastIndex = 0
    if (newScore === '' || myRegExp.checkScoreFormat.test(newScore + "")) {
      //获取材料下子题的id 并处理分数
      if (singleTopic && existArr(singleTopic.materialQuestionList)) {
        singleTopic.score = 0
        singleTopic.materialQuestionList.map((item, index) => {
          if (!item.sequenceCode.includes('-')) {
            item.score = newScore
            if (index > 0) {
              singleTopic.score += Number(newScore)
            }
          } else {
            item.score = ''
          }
        })
      }
      //处理数据 重新渲染
      let isBreak = false;
      for (const topic of topics) {
        const { questionList = [] } = topic;
        for (const question of questionList) {
          if (singleTopic.id == question.id) {
            question.score = singleTopic.score;
            isBreak = true;
            question.materialQuestionList.map((item, index) => {
              if (!item.sequenceCode.includes('-')) {
                item.score = newScore
              } else {
                item.score = ''
              }
            })
            break;
          }
        }
        if (isBreak) {
          break;
        }
      }
      this.setState({ ...this.handleTopicsAndReturnNewStateObj(topics) })
      return singleTopic;
    } else {
      openNotificationWithIcon(
        'warning', '设置失败！',
        'rgba(0,0,0,.85)',
        '您当前输入的分数不合理（小数位后只能保留一位且是0或者5）',
        2
      )
    }
  }

  /**
   * 处理材料下题目的分数
   * @param question ：题目信息
   */
  dealMaterialQuestionScore = (question) => {
    if (existArr(question.materialQuestionList)) {
      const categoryName = question.materialQuestionList[0].categoryName || '材料题'
      let tempTopic = JSON.parse(JSON.stringify(question))
      tempTopic.materialQuestionList.unshift({
        isTopicTypeTitle: true,
        sequenceCode: categoryName,
        serialNumber: categoryName
      })
      tempTopic.materialQuestionList = this.createMergedMaterialDataSourceList(tempTopic.materialQuestionList)
      this.setState({ singleTopic: tempTopic })
    }
  }

  /**
   * 清空试题板
   */
  clearPaperBoard = () => {
    const { dispatch } = this.props;
    const _self = this;
    confirm({
      title: '确认清空试题板吗？',
      content: '',
      onOk() {
        dispatch({
          type: `${namespace}/clearPaperBoard`,
          callback: _ => {
            Message.success("试题板已清空")
            paperBoardInfoCache.clear(paperBoardInfoCacheKEY)
            _self.getTestQuestionEdition();
            //清空redux中的题目列表
            dispatch({
              type: `${namespace}/set`,
              payload: {
                topicList: undefined
              }
            })
          }
        })
      },
      onCancel() { },
    });
    // dispatch({
    //   type: `${namespace}/clearPaperBoard`,
    //   callback: _ => {
    //     Message.success("试题板已清空")
    //     this.getTestQuestionEdition();
    //     //清空redux中的题目列表
    //     dispatch({
    //       type: `${namespace}/set`,
    //       payload: {
    //         topicList: undefined
    //       }
    //     })
    //   }
    // })

  }

  /**
   * 确认完成组题操作
   **/
  confirmPaperBoard = () => {

    const { dispatch } = this.props
    const { topics, totalScore, paperType, permissionVisible, paperNameValue, selectedMultiSchools } = this.state
    const paperNameObj = document.getElementById('paperNameInput')
    let paperName = paperNameObj && paperNameObj.value;
    if (!paperNameValue) {
      openNotificationWithIcon(
        'warning',
        `请先设置组卷名称`,
        'rgba(0,0,0,.85)',
        '',
        3
      )
      return
    }
    if (validatingSpecialCharacters(paperNameValue)) {//验证是否有特殊字符
      return;
    }
    if (!paperType) {
      openNotificationWithIcon(
        'warning',
        `请先设置试题类型`,
        'rgba(0,0,0,.85)',
        '',
        3
      )
      return
    }
    if (permissionVisible == '4' && !selectedMultiSchools) {
      openNotificationWithIcon(
        'warning',
        `请先选择学校`,
        'rgba(0,0,0,.85)',
        '',
        3
      )
      return
    }
    let paperTemplateId = ''
    if (!this.state.questionTemplateValue) {
      openNotificationWithIcon(
        'warning',
        `请先选择试题模板`,
        'rgba(0,0,0,.85)',
        '',
        3
      )
      return
    } else {
      paperTemplateId = this.state.questionTemplateValue.slice(0, -10)
    }


    let paperProperty = {
      name: paperNameValue,
      totalScore,
      paperType,
      isPrivate: permissionVisible || '3',
      paperTemplateId,
      id: this.state.paperId,
      // versionKnowledgeId:this.state.knowledgePointValue
    }

    if (permissionVisible == '4') {
      paperProperty.multiSchoolIds = selectedMultiSchools
    }

    // setTimeout(() => {
    // 	this.refs.paperNameInput.state.value = undefined
    // }, 0)

    //定义数组，存放所有没有设置分数的题目序号
    let noScoreTopics = []
    //遍历数据，封装参数
    let topicList = []
    topics && topics.forEach(topicType => {
      topicType.questionList && topicType.questionList.forEach(topic => {
        if (existArr(topic.materialQuestionList)) {
          //获取材料下子题的id 并处理分数
          topic.materialQuestionList.map((item) => {
            if (item.id !== null && item.id !== undefined && item.id !== '' && item.score !== null && item.score !== undefined && item.score !== '' && item.score != 0) {
              const isParent = existArr(item.childrenList) ? 1 : 0
              topicList.push({
                questionId: item.id,
                questionCategory: item.category,
                score: item.score,
                code: item.sequenceCode,
                flag: isParent
              })
            } else {
              noScoreTopics.push(item.sequenceCode)
            }
          })
        } else {
          if (topic.id !== null && topic.id !== undefined && topic.id !== '' && topic.score !== null && topic.score !== undefined && topic.score !== '' && topic.score != 0) {
            const isParent = existArr(topic.childrenList) ? 1 : 0
            topicList.push({
              questionId: topic.id,
              questionCategory: topic.category,
              score: topic.score,
              code: topic.sequenceCode,
              flag: isParent
            })
          } else {
            noScoreTopics.push(topic.sequenceCode)
          }
        }
        // if (topic.id !== null && topic.id !== undefined && topic.id !== '' && topic.score !== null && topic.score !== undefined && topic.score !== '' && topic.score !== 0) {
        //   topicList.push({
        //     questionId: topic.id,
        //     questionCategory: topic.category,
        //     score: topic.score,
        //     code: topic.serialNumber
        //   })
        // } else {
        //   noScoreTopics.push(topic.serialNumber)
        // }
      })
    })
    if (noScoreTopics.length === 0) {
      dispatch({
        type: `${namespace}/confirmPaperBoard`,
        payload: {
          versionKnowledgeId:this.state.knowledgePointValue,
          group: [paperProperty, topicList],
        },
        callback: () => {
          Message.success("保存成功!")
          paperBoardInfoCache.clear(paperBoardInfoCacheKEY)
          this.getTestQuestionEdition();
          this.setState(this.handleTopicsAndReturnNewStateObj([]), () => {
            dispatch(routerRedux.replace({//返回我的题组
              pathname: '/my-question-group',
              search: queryString.stringify({ paperType: 0 })
            }))
          })
          //  @ts-ignore
          if (window._czc) {
            //  @ts-ignore
            window._czc.push(['_trackEvent', `${window.$systemTitleName}-保存题组`, '保存']);
          }
        }
      })
    } else {
      openNotificationWithIcon(
        'warning',
        `请设置第 ${noScoreTopics.join("、")} 题的分数`,
        'rgba(0,0,0,.85)',
        '',
        4
      )
    }
  }

  /**
   * 上移操作
   * @topic：题目对象
   * @moveLength : 移动位数
   */
  moveTopic = (topic, moveLength) => {
    const { topics } = this.state
    let newTopics = []
    topics && topics.forEach((topicType, index) => {
      //只能在当前题型内移动
      if (topicType.category === topic.category) {
        topicType.questionList && topicType.questionList.forEach((topicItem, i) => {
          if (topicItem.id === topic.id) {
            newTopics = topicType.questionList.filter(item => !item.parentId)
            newTopics.forEach(newTopic => {
              newTopic.isSplit = topicType.questionList.some(item => item.parentId === newTopic.id)
            })
            const newTopicItemIndex = newTopics.findIndex(item => item.id === topicItem.id)
            const newTopicsLength = newTopics.length
            const moveTopics = newTopics.splice(newTopicItemIndex, 1)
            if (newTopicItemIndex + moveLength < 0) {
              openNotificationWithIcon(
                'warning',
                '顶不上去啦！',
                'rgba(0,0,0,.85)',
                '当前题目已经在所属题型的第一位了',
                3,
                <FrownOutlined style={{ color: "#ffe58f" }} />
              )
            } else if (newTopicItemIndex + moveLength >= newTopicsLength) {
              openNotificationWithIcon(
                'warning',
                '到底咯！',
                'rgba(0,0,0,.85)',
                '当前题目已经在所属题型的最后一位了',
                3,
                <FrownOutlined style={{ color: "#ffe58f" }} />
              )
            } else {
              if (
                moveLength !== 0 && 
                index !== undefined && 
                i !== undefined && 
                newTopicItemIndex !== undefined && 
                topics && 
                topics[index]
              ) {
                newTopics.splice(newTopicItemIndex + moveLength, 0, ...moveTopics)
                newTopics = newTopics.reduce((a, v) => {
                    if (v.isSplit) {
                      delete v.isSplit
                      a.push([v, ...v.childrenList])
                    } else {
                      delete v.isSplit
                      a.push([v])
                    }
                    return a
                  }, []).flat()
                topics[index].questionList = newTopics
                this.setState(this.handleTopicsAndReturnNewStateObj(topics, [], false, true))
              }
            }
          }
        })
      }
    })
  }

  /**
   * 上下移操作
   * @topicType：题型对象
   * @moveLength : 移动位数
   */
  moveTopicType = (sTopicType, moveLength) => {
    const { topics } = this.state
    let newTopicTypes = []
    topics && topics.forEach((topicType, index) => {
      //只能在当前题型内移动
      if (topicType.category === sTopicType.category) {
        newTopicTypes = topics.filter(item => item.category !== sTopicType.category);
        if (index + moveLength < 0) {
          openNotificationWithIcon(
            'warning',
            '顶不上去啦！',
            'rgba(0,0,0,.85)',
            '当前题型已经在第一位了',
            3,
            <FrownOutlined style={{ color: "#ffe58f" }} />
          )
        } else if (index + moveLength >= topics.length) {
          openNotificationWithIcon(
            'warning',
            '到底咯！',
            'rgba(0,0,0,.85)',
            '当前题型已经在最后一位了',
            3,
            <FrownOutlined style={{ color: "#ffe58f" }} />
          )
        } else {
          if (moveLength !== 0 && index !== undefined && index !== undefined && topics && topics[index]) {
            newTopicTypes.splice(index + moveLength, 0, sTopicType)
            this.setState(this.handleTopicsAndReturnNewStateObj(newTopicTypes, [], false, true))
          }
        }
      }
    })
  }

  /**
   *  将后台获取到的数据转换为题型表格适用的数据格式
   * @resourceData：原数据
   * @return  返回重新封装后的数据格式
   */
  // handleTopicTypeAnalysisData = (resourceData) => {
  //   const { topicList = [] } = this.props
  //   let resultData = []
  //   resourceData && resourceData.length > 0 && resourceData.forEach((record, index) => {
  //     let bigTopicType = this.getCategoryName(topicList, record);//获取题型标题
  //     resultData.push({
  //       key: index,
  //       bigTopicType,
  //       // bigTopicType: record.category && topicType[record.category] || '无',
  //       topicRate: `${record.count !== undefined && record.count !== null ? record.count : '无题目数量数据'}（${record.ratio !== undefined && record.ratio != null ? save2NumAfterPoint(record.ratio, 2) : '无占比数据'}%）`,
  //       scoreRate: `${record.score !== undefined && record.score !== null ? record.score : '无分值数据'}（${record.scoreRatio !== undefined && record.scoreRatio !== null ? save2NumAfterPoint(record.scoreRatio, 2) : '无占比数据'}%）`,
  //       comprehensiveDifficulty: record.comprehensiveDifficulty !== undefined && record.comprehensiveDifficulty !== null ? record.comprehensiveDifficulty : record.comprehensiveDifficulty || '无'
  //     })
  //   })
  //   return resultData
  // }

  /**
   * 保存分数设置
   * @scoreData :已设置保存分数的对象
   * @isSingle :是否单个设置，true，单个，false：多个
   */
  saveScoreSetting = (scoreData = [], isSingle) => {
    const { dispatch } = this.props;
    let isHaveScore = false;
    scoreData = scoreData.map((item) => {
      //判断分数是否为0或者为空
      if (item.score == 0 || !item.score) {
        isHaveScore = true
      }
      return {
        id: item.tempId,
        score: item.score
      }
    })
    if (isHaveScore) {
      openNotificationWithIcon(
        'warning',
        `分数不能设置为0或为空`,
        'rgba(0,0,0,.85)',
        '',
        3
      )
      if (!isSingle) {
        this.setState({
          setScoreModalIsShow: true
        })
      }
      return;
    }
    dispatch({
      type: `${namespace}/saveExamPaperDetailBoard`,
      payload: scoreData,
      callback: data => {
        Message.success(data && data.msg || "分数保存成功！")
        this.setState({
          setScoreModalIsShow: false,
          isShowSingleTopic: false
        })
      }
    })
  }

  /**
 * 显示设置参数弹窗-2020年12月30日加-张江-试题板设置参数 - 未使用-暂留
 *@isShow :是否显示弹窗
 *@item :题目信息
 */
  // handleSetParameterModal = (isShow, item) => {
  //   this.setState({
  //     isSetParameterModal: isShow,
  //     questionInfo: item,
  //   })
  // }


  /**
  * 显示相似题匹配弹窗-2021年02月01日加-张江-试题板相似题匹配
  *@isShow :是否显示弹窗
  *@item :题目信息
  */
  handleWrongQuestionMatchModal = (isShow, item) => {
    this.setState({
      isWrongQuestionMatchModal: isShow,
      questionInfo: item,
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

  /**
  * 设置试题板缓存的值-2021年07月23日加-张江
  *@field :field 显示字段
  *@value :value显示的值
  */
  setPaperBoardInfoCache = (field, value) => {
    if (field === 'paperName') this.setState({ paperNameValue: value })
    const paperBoardInfo = paperBoardInfoCache(paperBoardInfoCacheKEY, null) || {};
    paperBoardInfo[field] = value;
    paperBoardInfoCache(paperBoardInfoCacheKEY, paperBoardInfo)
  }
  render() {
    const { dispatch } = this.props
    const {
      topics,
      topicsCount,
      totalScore,
      targetTopic,
      topicTypeTotalScores,
      combinationAnalysisModalIsShow,
      authButtonList,

      isShowSingleTopic,
      singleTopic,

      // isSetParameterModal,
      questionInfo,
      isWrongQuestionMatchModal,
      selectedChangeKnowList,
      selectedChangeKnowId,
      areaList,
      pagination
    } = this.state;
    const { changeTopicList, changeTopicListLoading, analysisData, loading, location, topicList } = this.props
    let difficultStatisticsChartData = analysisData && analysisData.length > 2 && analysisData[1]//图表数据
    const { pathname = '' } = location;
    let knowledgeStatisticsData = analysisData && analysisData.length > 2 && analysisData[2].map((topic, index) => {
      topic.serialNumber = topic.code || (index + 1)
      return topic
    }) || []//知识点统计表格数据
    /**
     * 是否有按钮权限
     * */
    const isClick = (name) => {
      return window.$PowerUtils.judgeButtonAuth(authButtonList, name)
    }

    // 选择学校
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        const transferDataSource = this.state.transferDataSource
        const newTransferDataSource = selectedRows.map(item => ({
          key: item.key,
          title: item.school,
          detailAddress: item.detailAddress
        }))
        const combinedTransferDataSource = [
          ...transferDataSource,
          ...newTransferDataSource
        ]
        const uniqueTransferDataSource = combinedTransferDataSource
          .reduce((a, c) => {
            if (!a.some(item => item.key === c.key)) a.push(c)
            return a
          }, [])
        this.setState({
          transferDataSource: uniqueTransferDataSource
        })
      }
    }

    // 设置全卷分数
    const setScoreColumn = [
      {
        title: '题号',
        dataIndex: 'sequenceCode',
        key: 'sequenceCode',
        width: 100,
        align: 'center'
      },
      {
        title: '知识点',
        dataIndex: 'knowNames',
        key: 'knowNames',
        ellipsis: true,
        width: 300,
        align: 'center',
        render(_, row) {
          return {
            children: row.knowNames,
            props: {
              rowSpan: row.rowSpan,
              colSpan: row.colSpan ? row.colSpan : 1
            }
          }
        }
      },
      {
        title: '难度',
        dataIndex: 'difficulty',
        key: 'difficulty',
        width: 100,
        align: 'center',
        render(_, row) {
          return {
            children: row.difficulty,
            props: {
              rowSpan: row.rowSpan,
              colSpan: row.colSpan ? 0 : 1
            }
          }
        }
      },
      {
        title: '分值',
        width: 220,
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        render: (text, record) => {
          let stateKeyName = `topicTypeInput-${record.topicTypeIndex}`
          return (
            record.isTopicTypeTitle
              ? <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                  每题
                  <InputNumber
                    min={0}
                    max={99}
                    step={1}
                    style={{ margin: '0 10px', width: 100 }}
                    value={this.state[stateKeyName]}
                    placeholder='单题分数'
                    onChange={(value) => {
                      const score = value
                      this.setState({
                        [stateKeyName]: score,
                        ...this.handleEveryTopicScoreAndReturnNewStateObj(record.topicTypeIndex, score)
                      })
                    }} />
                  分
                </div>
              : record.sequenceCode && record.sequenceCode.includes('-') ?
                <InputNumber
                  min={0}
                  max={99}
                  step={1}
                  style={{ width: 100 }}
                  placeholder="小项分数"
                  value={record.score}
                  onChange={value => {
                    this.setSmallItemScore(record, value, 1)
                  }} /> :
                <InputNumber
                  min={0}
                  max={99}
                  step={1}
                  style={{ width: 100 }}
                  placeholder="单题分数"
                  value={record.score}
                  onChange={value => {
                    this.setSingleItemScore(record, value, record.topicTypeIndex, 1)
                  }} />
          )
        }
      },
    ]

    // 设置材料下单个题
    const setSingleScoreColumn = [
      {
        title: '题号',
        dataIndex: 'sequenceCode',
        key: 'sequenceCode',
        width: 100,
        align: 'center'
      },
      {
        title: '知识点',
        dataIndex: 'knowName',
        key: 'knowName',
        ellipsis: true,
        width: 300,
        align: 'center',
        render(_, row, index) {
          return {
            children: row.knowName,
            props: {
              rowSpan: row.rowSpan,
              colSpan: index === 0 ? 2 : 1
            }
          }
        }
      },
      {
        title: '难度',
        dataIndex: 'difficulty',
        key: 'difficulty',
        width: 100,
        align: 'center',
        render(_, row, index) {
          return {
            children: row.difficulty,
            props: {
              rowSpan: row.rowSpan,
              colSpan: index === 0 ? 0 : 1
            }
          }
        }
      },
      {
        title: '分值',
        width: 220,
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        render: (text, record) => {
          let stateKeyName = `topicTypeInput-${record.serialNumber}`
          return (
            record.isTopicTypeTitle
              ? <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                  每题
                  <InputNumber
                    min={0}
                    max={99}
                    step={1}
                    style={{ margin: '0 10px', width: 100 }}
                    value={this.state[stateKeyName]}
                    placeholder='单题分数'
                    onChange={(value) => {
                      const score = value
                      this.setState({
                        [stateKeyName]: score,
                        ...this.handleSingleEveryTopicScoreAndReturnNewStateObj(record.serialNumber, score)
                      })
                    }} />
                  分
                </div>
              : record.sequenceCode && record.sequenceCode.includes('-') ?
                <InputNumber
                  min={0}
                  max={99}
                  step={1}
                  style={{ width: 100 }}
                  placeholder="小项分数"
                  value={record.score}
                  onChange={value => {
                    this.setSmallItemScore(record, value, 2)
                  }}
                /> :
                <InputNumber
                  min={0}
                  max={99}
                  step={1}
                  style={{ width: 100 }}
                  placeholder="单题分数"
                  value={record.score}
                  onChange={value => {
                    this.setSingleItemScore(record, value, record.serialNumber, 2)
                  }}
                />
          )
        }
      },
    ]
    const title = '试题板-我的题组';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );
    const classString = classNames(styles['wrap'], 'gougou-content');
    return (
      <Page header={header} loading={!!loading}>
        <div className={classString}>
          {/*主内容*/}
          <div className={styles.main}>
            {/* <div className={styles.mainTop}>
              <div className={styles.filterTopicType}>
                <span>选择类型：</span>
                <Radio.Group style={{ width: '100%' }}
                  value={this.state.paperType} size={'large'}
                  onChange={this.setPaperType}
                >
                  <Radio value="1">作业</Radio>
                  <Radio value="2">测验</Radio>
                  <Radio value="3">试卷</Radio>
                </Radio.Group>
              </div>
              <div className={styles.search}>
                <span>名称:</span>
                <Input id='paperNameInput' ref={"paperNameInput"} placeholder="设置组卷名称" style={{ minWidth: 200 }}
                  allowClear
                />
              </div>
            </div> */}
            <ul className={styles.content}>
              {
                topics.length > 0 ?
                  topics.map((topicType, topicTypeIndex) => (
                    <li key={topicTypeIndex}>
                      <div className={styles.mainContenTtitle}>
                        <div className={styles.topicTypeTitle}>
                          { topicType.name ? `${uppercaseNum(topicTypeIndex + 1)}、${topicType.name}` : "未知题型" }
                          （共{calQuestionNum(topicType.questionList)}题；共{topicTypeTotalScores[topicTypeIndex]}分）
                        </div>
                        <div className={styles.questionTypeSort}>
                          {
                            isClick('上移') ?
                              <span onClick={_ => this.moveTopicType(topicType, -1)}>
                                <IconFont type="icon-moveUp" />上移
                              </span> : null
                          }
                          {
                            isClick('下移') ?
                              <span onClick={_ => this.moveTopicType(topicType, 1)}>
                                <IconFont type="icon-moveDown" />下移
                              </span> : null
                          }
                        </div>
                      </div>
                      <ul className={styles.topics}>
                        {
                          topicType.questionList && topicType.questionList.length > 0 ?
                            topicType.questionList.map((topic, index) => {
                              topic.category = topicType.category;
                              topic.categoryName = topicType.name;
                              return (
                                <li
                                  className={`${styles.topicItem} ${topic.isSelected ? styles.selected : ''}`}
                                  key={index}
                                  id={`question${topic.id}`}
                                >
                                  <div className={styles.topicBody}>
                                    <div className={styles.topicContent}>
                                      {
                                        RenderMaterialAndQuestion(topic, false, (RAQItem) => {
                                            return (
                                              <TopicContent
                                                topicContent={RAQItem}
                                                optionsFiledName='optionList'
                                                optionIdFiledName="code"
                                                contentFiledName='content'
                                                childrenFiledName='child'
                                                currentPage={1}
                                                pageSize={topicsCount}
                                                currentTopicIndex={(RAQItem.serialNumber || RAQItem.serialCode || Number(RAQItem.questionNum)) - 1}
                                              />
                                            )
                                          }, (RAQItem) => {
                                            return <ParametersArea QContent={RAQItem} comePage={''} />;
                                          }
                                        )
                                      }
                                      {/* 材料部分 */}
                                      {/* {
                                      RenderMaterial(topic)
                                    } */}
                                      {/* <TopicContent topicContent={topic}
                                      optionsFiledName='optionList'
                                      optionIdFiledName="code"
                                      contentFiledName='content'
                                      childrenFiledName='child'
                                      currentPage={1}
                                      pageSize={topicsCount}
                                      currentTopicIndex={topic.serialNumber - 1}
                                    /> */}
                                      {/* {renderAnswerAnalysis(topic, 1)} */}
                                    </div>
                                  </div>
                                  <div className={styles.topicFooter}>
                                    {/*信息列表*/}
                                    <ul className={styles.info} style={{ paddingLeft: '0px' }}>
                                      {/* <li>难度： <span>{topic.difficulty || '暂无'}</span></li> */}
                                      <li>
                                        使用次数：<span>{topic.useNumber || 0}</span>
                                      </li>
                                    </ul>
                                    {/*交互列表*/}
                                    <ul className={styles.interactive}>
                                      {/* {//-2020年12月30日加-张江-试题板设置参数 - 未使用-暂留
                                      isClick('设置参数') && !topic.abilityIds ? <li onClick={_ => {
                                        this.handleSetParameterModal(true, topic)
                                      }}><IconFont type="icon-bianji" />设置参数</li> : null} */}
                                      {
                                        //-2021年03月10日加-张江-试题板添加测评目标
                                        isClick('测评目标') ?
                                          <li onClick={() => { this.evalTargetRef.handleOnOrOff(true, topic) }}>
                                            <IconFont type="icon-cepingmubiao" /> 测评目标
                                          </li> : null
                                      }
                                      {
                                        //-2021年02月04日加-张江-试题板添加上传微课
                                        isClick('上传微课') ? <li onClick={_ => {
                                          pushNewPage({ questionId: topic.id, dataId: topic.dataId, }, '/question-detail', dispatch)
                                        }}><IconFont type="icon-shangchuanweike" /> 上传微课</li> : null
                                      }
                                      {
                                        //2021年05月07日加-张江-试题板纠错
                                        isClick('纠错') ?
                                          <li onClick={() => this.openErrorCorrection(topic.id)}>
                                            <IconFont type={'icon-jiucuo'} /> 纠错
                                          </li> : null
                                      }
                                      {
                                        //-2021年02月01日加-张江-试题板相似题匹配
                                        isClick('相似题匹配') ?
                                          <li onClick={_ => {this.handleWrongQuestionMatchModal(true, topic)}}>
                                            <IconFont type="icon-icon_hailiangmingdanpipei" /> 相似题匹配
                                          </li> : null
                                      }
                                      {
                                        topic.isEdit ?
                                          <li className={styles.isEdit}>
                                            <InputNumber
                                              defaultValue={topic.score}
                                              min={0}
                                              max={99}
                                              step={1}
                                              style={{ width: 160 }}
                                              autoFocus={true}
                                              placeholder={"输入此题分数"}
                                              onFocus={(e) => {
                                                let { topics } = this.state
                                                //当当前文本框获取焦点时，在数据中找到当前的分数，设置到scoreTemp变量中
                                                if (topics && topics.length > 0) {
                                                  for (let i = 0; i < topics.length; i++) {
                                                    let topicTy = topics[i]
                                                    let { questionList } = topicTy
                                                    if (questionList && questionList.length > 0) {
                                                      for (let j = 0; j < questionList.length; j++) {
                                                        let topi = questionList[j]
                                                        if (topic.id === topi.id) {
                                                          scoreTemp = topic.score
                                                          break
                                                        } else {
                                                          scoreTemp = undefined
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }}
                                              onChange={value => {
                                                scoreTemp = value;
                                              }}
                                              onBlur={e => {
                                                topic.sequenceCode && topic.sequenceCode.includes('-') ?
                                                  this.setSmallItemScore(topic, e.target.value) :
                                                  this.setSingleItemScore(topic, e.target.value, topicTypeIndex)
                                              }} />
                                          </li> :
                                            topic.score ?
                                              <li onClick={_ => {this.toggleEditState(topic)}}>
                                                <IconFont type="icon-setScore" /> 分数:
                                                <span style={{ fontWeight: 'bold', marginLeft: 2 }}>{topic.score}</span>
                                              </li> :
                                              (
                                                isClick('设置分数') ?
                                                  <li onClick={_ => {this.toggleEditState(topic)}}>
                                                    <IconFont type="icon-setScore" />设置分数
                                                  </li> : null
                                              )
                                      }
                                      {
                                        isClick('换一题') ?
                                          <li onClick={_ => {this.toggleTopicModalState(true, topic)}}>
                                            <IconFont type="icon-switch" />换一题
                                          </li> : null
                                      }
                                      {
                                        isClick('收藏') ?
                                          <li
                                            onClick={_ => {
                                              let { collectedTopics } = this.state
                                              topic.collect || collectedTopics.indexOf(topic.id) !== -1 ?
                                                this.collectTopic(topic.id, false) :
                                                this.collectTopic(topic.id, true)
                                            }}
                                          >
                                            {
                                              topic.collect || this.state.collectedTopics.indexOf(topic.id) !== -1 ?
                                                <HeartFilled style={{ color: "rgba(230,30,30,0.73)" }} /> :
                                                <HeartOutlined />
                                            }
                                            收藏
                                          </li> : null
                                      }
                                      {
                                        isClick('上移') && 
                                        ((topic.sequenceCode && !topic.sequenceCode.includes('-')) || 
                                        existArr(topic.materialQuestionList)) ?
                                          <li onClick={_ => this.moveTopic(topic, -1)}>
                                            <IconFont type="icon-moveUp" />上移
                                          </li> : null
                                      }
                                      {
                                        isClick('下移') && 
                                        ((topic.sequenceCode && !topic.sequenceCode.includes('-')) || 
                                        existArr(topic.materialQuestionList)) ?
                                          <li onClick={_ => this.moveTopic(topic, 1)}>
                                            <IconFont type="icon-moveDown" />下移
                                          </li> : null
                                      }
                                      {
                                        isClick('移除') ?
                                          <li onClick={_ => {this.removeTopic(topic.id, topic.tempId, topic.category)}}>
                                            <IconFont type="icon-remove" />移除
                                          </li> : null
                                      }
                                    </ul>
                                  </div>
                                </li>
                              )
                            }) :
                            <Empty
                              description={
                                topicType.name ?
                                  `还未添加任何【${topicType.name}】类型的题` :
                                  "还未添加任何相关题目"
                              }
                            />
                        }
                      </ul>
                    </li>
                  )) : <Empty description={'您还未添加任何题目'} />
              }
            </ul>
          </div>

          {/*试题板操作*/}
          <div className={styles.right}>
            <div className={styles.title}>试题板操作</div>
            <div className={styles.mainTop}>
              <div className={styles.search}>
                <span>名称:</span>
                <Input
                  id='paperNameInput'
                  ref={"paperNameInput"}
                  placeholder="设置组卷名称"
                  style={{ minWidth: 200 }}
                  value={this.state.paperNameValue}
                  allowClear
                  onChange={(e) => {
                    this.setPaperBoardInfoCache('paperName', e.target.value)
                  }}
                />
              </div>
              <div className={styles.filterTopicType}>
                <span>题组类型：</span>
                <Radio.Group style={{ width: '100%' }}
                  value={this.state.paperType} size={'large'}
                  onChange={this.setPaperType}
                >
                  <Radio value="1">作业</Radio>
                  <Radio value="2">测验</Radio>
                  <Radio value="3">试卷</Radio>
                </Radio.Group>
              </div>
              <div className={styles.filterTopicType} style={{ marginBottom: 8 }}>
                <span>权限可见：</span>
                <Radio.Group style={{ width: '100%' }}
                  value={this.state.permissionVisible} size={'large'}
                  onChange={this.setPermissionVisible}
                >
                  {
                    permissionVisibleList && permissionVisibleList.map((item) => {
                      return (<Radio value={item.code} key={item.code}>{item.name}</Radio>)
                    })
                  }
                  {/* <Radio value="1">全部</Radio>
                  <Radio value="2">校内</Radio>
                  <Radio value="3">仅自己</Radio> */}
                </Radio.Group>
              </div>
              {
                this.state.permissionVisible === '4' ?
                  <div className={styles.selectedSchoolTable}>
                    <div className={styles.selectedSchoolTableTitle}>
                      <span>已选学校：</span>
                      <Button 
                        type="primary"
                        onClick={this.showSelectSchoolModalState}
                      >去选择</Button>
                    </div>
                    <Table 
                      dataSource={this.state.selectedChoolDataSource}
                      columns={this.state.selectedChoolColumns}
                      pagination={{ pageSize: 5 }}
                      bordered
                    />
                  </div> : null
              }
              <div className={styles.filterTopicType} style={{marginTop: 3}}>
                <span>试题模板：</span>
                <TreeSelect
                  style={{ width: '270px' }}
                  dropdownStyle={{ overflow: 'auto' }}
                  value={this.questionTemplate}
                  placeholder="请选择"
                  allowClear
                  treeExpandAction={'click'}
                  onChange={this.onQuestionTemplateSelect}
                >
                  {this.renderTreeNodes(this.state.questionTemplateTreeData)}
                </TreeSelect>
              </div>
              <div className={styles.filterTopicType}>
                <span>章节知识点: </span>
                <TreeSelect
                  style={{ width: '270px' }}
                  dropdownStyle={{ overflow: 'auto' }}
                  value={this.knowledgePointValue}
                  placeholder="请选择"
                  allowClear
                  treeExpandAction={'click'}
                  onChange={this.oneKnowledgePointSelect}
                  treeData={this.state.knowledgePointTreeData}

                />


              </div>
            </div>
            <div className={styles.leftMain}>
              <div className={styles.optArea}>
                <div className={styles.optContent}>
                  <div className={styles.optItem} onClick={() => this.toggleScoreModalState(true)} >设置分数</div>
                  {isClick('题组分析') ? <div className={styles.optItem} onClick={_ => this.toggleAnalysisModalState(true)}>题组分析</div> : null}
                  {isClick('清空试题') ? <div className={styles.optItem} onClick={this.clearPaperBoard}>清空试题</div> : null}
                  {isClick('保存题组') ? <div className={styles.optItem} onClick={this.confirmPaperBoard}>保存题组</div> : null}
                </div>
                <div className={styles.info}>
                  <div className={styles.optAreaBottomLeft}>
                    <div>总题数 <span>{topicsCount}</span> 题</div>
                    <div>总分数 <span>{totalScore}</span> 分</div>
                  </div>
                </div>
              </div>
              <div className={styles.topicNavWrap}>
                {
                  topics && topics.length > 0
                    ? topics.map((topicType, topicTypeIndex) => (
                      <div className={styles.topicNav} key={topicTypeIndex}>
                        <div className={styles.topicTypeTitle}>
                          <span>
                            {
                              topicType.name ?
                                `${uppercaseNum(topicTypeIndex + 1)}、${topicType.name}` : "未知题型"
                            }
                          </span>
                          {
                            isClick('上移') ?
                              <span onClick={_ => this.moveTopicType(topicType, -1)}>
                                <IconFont type="icon-moveUp" />上移
                              </span> : null
                          }
                          {
                            isClick('下移') ?
                              <span onClick={_ => this.moveTopicType(topicType, 1)}>
                                <IconFont type="icon-moveDown" />下移
                              </span> : null
                          }
                        </div>
                        <ul>
                          {
                            topicType.questionList && topicType.questionList.length > 0 ?
                              topicType.questionList.map((topic, index) => {
                                //获取材料下子题的id 并处理分数
                                if (existArr(topic.materialQuestionList)) {
                                  return topic.materialQuestionList.map((item) => {
                                    return (
                                      <li
                                        key={item.id}
                                        className={topic.isSelected ? styles.selected : ''}
                                        onClick={() => this.selectTopic(topic.id, `question${topic.id}`)}
                                      >
                                        {item.serialNumber}
                                      </li>
                                    )
                                  })
                                } else {
                                  return (
                                    <li
                                      key={topic.id}
                                      className={topic.isSelected ? styles.selected : ''}
                                      onClick={() => this.selectTopic(topic.id, `question${topic.id}`)}
                                    >
                                      {topic.serialNumber}
                                    </li>
                                  )
                                }
                              }) : <Empty style={{ padding: "10px" }} description={'您还未添加任何题目'} />
                          }
                        </ul>
                      </div>
                    ))
                    : <Empty description={'您还未添加任何题目'} />
                }
              </div>
            </div>
          </div>
          {/*换一题弹框*/}
          <Modal
            className="toggleTopicModal"
            width={"80%"}
            title="换题"
            visible={this.state.toggleTopicModalIsShow}
            onOk={_ => {
              this.toggleTopicModalState(false)
            }}
            onCancel={_ => {
              this.toggleTopicModalState(false)
            }}
          >
            <Spin spinning={!!changeTopicListLoading} tip='正在加载中...'>
              <div className='topicListPanel'>
                <div className='header'>
                  <div className="left">
                    <div>原题信息</div>
                    <div>题型：{targetTopic && targetTopic.category && targetTopic.categoryName || '未知'}</div>
                    {
                      targetTopic && targetTopic.difficulty ? <div>难度：{targetTopic.difficulty}</div> : ''
                    }
                    {
                      targetTopic && selectedChangeKnowId ? <div>知识点：
                        <Radio.Group onChange={(event) => {
                          const selectValue = event.target.value;
                          this.setState({
                            selectedChangeKnowId: selectValue
                          }, () => {
                            this.getTopicListData(1)
                          })
                        }} defaultValue={selectedChangeKnowId}>
                          {
                            selectedChangeKnowList.map((item) => {
                              return (<Radio.Button key={item.code} value={item.code}>{item.name}</Radio.Button>)
                            })
                          }
                        </Radio.Group>
                      </div> : ''
                    }
                  </div>
                  <div className="right" onClick={this.randomChange}><IconFont type='icon-switch' />换一批</div>
                </div>
                <ul>
                  {
                    changeTopicList && changeTopicList.data && changeTopicList.data.length > 0
                      ? changeTopicList.data.map((topic, index) => (
                        <li className='topicItem' key={index}>
                          <div className='topicBody'>
                            <div className='topicContent'>
                              {
                                RenderMaterialAndQuestion(topic, false, (RAQItem) => {
                                  return (<TopicContent topicContent={RAQItem}
                                    childrenFiledName={'children'}
                                    contentFiledName={'content'}
                                    optionIdFiledName={'code'}
                                    optionsFiledName={"optionList"}
                                    currentPage={changeTopicList.currentPage}
                                    currentTopicIndex={index}
                                    pageSize={10}
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
                                currentPage={changeTopicList.currentPage}
                                currentTopicIndex={index}
                                pageSize={10}
                              /> */}
                              {/* {renderAnswerAnalysis(topic, 1)} */}
                            </div>
                          </div>
                          <div className='topicFooter'>
                            {/*信息列表*/}
                            <ul className='info'>
                              {/* <li>难度： <span>{topic.difficulty || '暂无'}</span></li> */}
                              <li>使用次数： <span>{topic.useNumber || 0}</span></li>
                            </ul>
                            <ul className='interactive'>
                              <li onClick={_ => {
                                this.replaceTopic(topic)
                              }}>
                                <IconFont type="icon-switch" />
                                替换
                              </li>
                            </ul>
                          </div>
                        </li>
                      ))
                      : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={window.$emptyDescInfo} />
                  }
                </ul>
              </div>
            </Spin>
          </Modal>
          {/*组题分析弹框*/}
          {
            combinationAnalysisModalIsShow ?
              <TopicGroupAnalysis
                analysisData={analysisData}
                combinationAnalysisModalIsShow={combinationAnalysisModalIsShow}
                toggleAnalysisModalState={this.toggleAnalysisModalState}
                topicList={topicList}
              /> : null
          }

          {/* <Modal
            className='combinationAnalysisModal'
            width='80%'
            title="组题分析"
            visible={combinationAnalysisModalIsShow}
            onOk={_ => {
              this.toggleAnalysisModalState(false)
            }}
            onCancel={_ => {
              this.toggleAnalysisModalState(false)
            }}
          >
            <Spin spinning={!!loading}>
              <div className='combinationAnalysis_wrap'>
                <div className='statisticsItem topicTypeStatistics'>
                  <div className="title">题型统计</div>
                  <Table
                    dataSource={analysisData && analysisData.length > 1 && this.handleTopicTypeAnalysisData(analysisData[0]) || []}
                    pagination={false}
                    columns={columns} />
                </div>
                <div className='statisticsItem difficultStatistics'>
                  <div className="title">难度统计</div>
                  <div className='chart'>
                    {
                      !loading && difficultStatisticsChartData && difficultStatisticsChartData.length > 0 ?
                        <BarTwo idString="topicAnalysis"
                          styleObject={{ width: '72vw', height: 600 }}
                          chartData={difficultStatisticsChartData}
                        /> : null
                    } */}

          {/* <DifficultStatisticsChart data={difficultStatisticsChartData}/> */}
          {/* </div>
                </div>
                <div className='statisticsItem knowledgeStatistics'>
                  <div className="title">知识点统计</div>
                  <Table dataSource={knowledgeStatisticsData}
                    columns={knowledgeColumns}
                    rowKey={"serialNumber"}
                    pagination={false} />
                </div>

              </div>
            </Spin>
          </Modal> */}
          {/*设置全卷分数弹框*/}
          <Modal
            className='setScoreModal'
            width='60%'
            title="设置全卷分数"
            visible={this.state.setScoreModalIsShow}
            onOk={() => this.toggleScoreModalState(false, 1)}
            onCancel={() => this.toggleScoreModalState(false, 2)}
          >
            <div>
              <Table
                dataSource={this.state.setScoreData}
                pagination={false}
                columns={setScoreColumn}
                bordered
                rowKey={"sequenceCode"}
              />
            </div>
          </Modal>
          {/*设置材料下单个分数弹框*/}
          <Modal
            className='setScoreModal'
            width='60%'
            title="设置材料下单题分数"
            visible={isShowSingleTopic}
            onOk={() => this.toggleSingleScoreModalState(false, 1)}
            onCancel={() => this.toggleSingleScoreModalState(false, 2)}
          >
            <div>
              <Table
                dataSource={singleTopic ? singleTopic.materialQuestionList || [] : []}
                pagination={false}
                columns={setSingleScoreColumn}
                bordered
                // rowKey={"serialNumber"}
                rowKey={"sequenceCode"}
              />
            </div>
          </Modal>

          {/*选择权限可见学校*/}
          <Modal
            width='80%'
            title="选择权限可见学校"
            visible={this.state.isShowSelectSchoolModal}
            onOk={this.setSelectedSchool}
            onCancel={this.hideSelectSchoolModal}
          >
            <div className={styles['school-tree-wrap']}>
              <div className={styles['school-tree-box']}>
                <div className={styles['school-tree-two-title']}>
                  <span>区域列表</span>
                  <span>学校列表</span>
                </div>
                <div className={styles['school-tree-tree']}>
                  <div className={styles['school-tree-area']}>
                    {
                      areaList && areaList.length > 0 ?
                        <Tree
                          blockNode
                          defaultExpandedKeys={[areaList[0].id]}
                          defaultSelectedKeys={[areaList[0].id]}
                          selectedKeys={this.state.treeSelectedAreaKeys}
                          onSelect={this.onTreeSelect}
                          treeData={this.renderSchoolTreeNodes(areaList)}
                        />
                        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={window.$emptyDescInfo} />
                    }
                  </div>
                  <div className={styles['school-tree-school']}>
                    <Table
                      rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                      }}
                      pagination={{ 
                        simple: true,
                        ...pagination
                      }}
                      loading={this.state.querySchoolLoading}
                      onChange={this.handleTableChange}
                      columns={this.state.querySchoolColumns}
                      dataSource={this.state.querySchoolDataSource}
                    />
                  </div>
                </div>
              </div>
              <div className={styles['school-tree-box']}>
                <div className={styles['school-tree-two-title']}>
                  <span>待选学校</span>
                  <span>已选学校</span>
                </div>
                <div className={styles['school-tree-tree']}>
                  <Transfer
                    dataSource={this.state.transferDataSource}
                    showSearch
                    pagination={{ pageSize: 16 }}
                    listStyle={{ width: 290, height: 680 }}
                    targetKeys={this.state.targetTransferKeys}
                    selectedKeys={this.state.selectedTransferKeys}
                    onChange={this.handleTransferChange}
                    onSelectChange={this.onSelectTransferChange}
                    render={(item) => item.title}
                  />
                </div>
              </div>
            </div>
          </Modal>

          {/* 试题板设置参数-2020年12月30日加-张江-试题板设置参数 - 未使用-暂留 */}
          {/* {
            isSetParameterModal ? <SetParameterModal
              isSetParameterModal={isSetParameterModal}
              questionInfo={questionInfo}
              hideSetParameterVisible={(questionInfo) => {
                this.handleSetParameterModal(false, questionInfo)
              }}
            /> : null
          } */}

          {/* 试题板相似题匹配-2021年02月03日加-张江 */}
          {
            isWrongQuestionMatchModal ? <WrongQuestionMatchModal
              isWrongQuestionMatchModal={isWrongQuestionMatchModal}
              questionInfo={questionInfo}
              hideWrongQuestionMatchVisible={(questionInfo) => {
                this.handleWrongQuestionMatchModal(false, questionInfo)
              }}
            /> : null
          }

          {/* 试题板测评目标-2021年03月10日加-张江 */}
          <EvalTargetModal getRef={(ref) => { this.evalTargetRef = ref }} />

          {/* 试题板题目纠错-2021年05月10日加-张江 */}
          <ErrorCorrectionModal onRef={this.getErrorCorrectionModal} />

          <BackBtns tipText={"返回"} />
        </div>
      </Page>
    )
  }
}

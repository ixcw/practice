/**
 * 题目列表页面 单个ListItem渲染组件
 * @author:张江
 * @date:2020年08月20日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Message
} from 'antd';
import queryString from 'query-string';
import { connect } from "dva";
import { routerRedux } from 'dva/router';
import TopicContent from "../TopicContent/TopicContent";
import RenderMaterialAndQuestion from "../RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
import { getIcon, openNotificationWithIcon, handleFetchingField, pushNewPage } from '@/utils/utils';
import styles from './QuestionItem.less';
import UploadMicroModal from './UploadMicroModal';
import renderAnswerAnalysis from "../RenderAnswerAnalysis/index";//渲染题目答案与解析部分
import { ManualCombination as namespace, HomeIndex, Auth } from '@/utils/namespace';
import { collectionType } from '@/utils/const';
import userInfoCache from '@/caches/userInfo';
import accessTokenCache from '@/caches/accessToken';

const IconFont = getIcon();

@connect(state => ({
  loading: state[namespace].loading,
  // authButtonList: state[Auth].authButtonList,//按钮权限数据
}))
export default class QuestionItem extends React.Component {
  static propTypes = {
    QContent: PropTypes.object.isRequired,//题目信息
  };


  constructor() {
    super(...arguments);
    this.state = {
      isUpOrDown: false,
      isShowAnswerAnalysis: false,
      baperBoardId: '',
      collectId: '',
      isUploadVideo: false,

      isCollecting: false,
      isAdding: false
    };
  }

  componentDidMount() {
    const {
      QContent,
      location,
    } = this.props;
    const { pathname, search } = location;
    const query = queryString.parse(search);

  }

  /**
  * 是否撑开题目全部信息
  * @param isUpOrDown  ：是/否
  */
  upToDown = (isUpOrDown) => {
    this.setState({
      isUpOrDown: isUpOrDown
    })
  }

  /**
* 是否显示答案与解析
* @param isShowAnswerAnalysis  ：是/否
*/
  onShowAnswerAnalysis = (isShowAnswerAnalysis) => {
    const { isUpOrDown } = this.state
    this.setState({
      isShowAnswerAnalysis: isShowAnswerAnalysis,
      isUpOrDown: !isShowAnswerAnalysis
    })
  }

  /**
 * 显示上传微课弹窗
 */
  showUploadMicroModal = () => {
    this.setState({
      visibleUploadMicro: true,
    });
  };

  /**
  * 隐藏上传微课弹窗
  */
  handleUploadMicroCancel = e => {
    this.setState({
      visibleUploadMicro: false,
    });
  };

  /**
* 上传微课
*/
  handleUploadMicro = () => {
    this.setState({
      isUploadVideo: true
    }, () => {
      this.handleUploadMicroCancel();
    })
  };

  /**
 * 收藏题目
 *@topicId :题目id
 */
  collectTopic = (topicId, isCollect = true) => {
    const { dispatch, subjectId } = this.props;

    this.setState({
      isCollecting: true
    })

    topicId ?
      isCollect ?
        dispatch({
          type: `${namespace}/collectTopic`,
          payload: {
            itemId: topicId,
            type: collectionType.QUESTION.type
          },
          callback: data => {
            this.setState({
              collectId: topicId,
              isCollecting: false
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
            this.setState({
              collectId: '',
              isCollecting: false
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
  addOrCancelPaperBoard = (topicId, questionCategory, isAdd, subjectId) => {
    const { dispatch } = this.props;
    const getTestQuestionEdition = () => {
      this.setState({
        isAdding: false
      })
      dispatch({
        type: HomeIndex + '/getTestQuestionEdition',
        payload: {},
      });
    }
    this.setState({
      isAdding: true
    })

    // topicId && questionCategory ?
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
            this.setState({
              baperBoardId: topicId,
            })
            getTestQuestionEdition();
            openNotificationWithIcon('success', '添加成功!', 'green', '', 2)
          }
        })
        :
        dispatch({
          type: `${namespace}/removeQuetion`,
          payload: {
            questionId: topicId,
          },
          callback: data => {
            this.setState({
              baperBoardId: '',
            })
            getTestQuestionEdition();
          }
        })
      : openNotificationWithIcon('error', '添加失败！', 'red', !topicId ? '缺少题目id参数' : '缺少题目类型参数', 2)
  }

  /**
* 页面组件即将卸载时：清空数据
*/
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const {
      QContent,
      location,
      dispatch,
      // authButtonList
    } = this.props;
    const {
      isUpOrDown,
      visibleUploadMicro,
      isShowAnswerAnalysis,
      baperBoardId,
      collectId,
      isUploadVideo,

      isCollecting,
      isAdding
    } = this.state;
    const { pathname, search } = location;
    const query = queryString.parse(search);
    const access_token = accessTokenCache();
    let loginUserInfo = userInfoCache() || {};
    const toLogin = () => {//跳转登录页
      dispatch(routerRedux.replace({
        pathname: '/logun'
      }));
    }
    // 权限判断处理 2021年10月14日 张江 添加上传微课入口
    // const powerDeal = (buttonName) => {
    //   return window.$PowerUtils.judgeButtonAuth(authButtonList, buttonName);
    // }
    // const questionDataArray = {
    //   "id": 1512429,
    //   "questionData": {
    //     "id": 440,
    //     "content": "Dialogue 1<br/>Vera: Peter, how often do you exercise?<br/>Peter: Well,&Num&1______.<br/>Vera: Now. Tell me, what do you eat?<br/>Peter: E...&Num&2______6any meat, but I do eat fish and eggs.<br/>Vera:&Num&3______?<br/>Peter: Oh, yes, I love vegetables.<br/>Vera: Do you drink tea or coffee?<br/>Peter: No.&Num&4______.<br/>Vera: &Num&5______?<br/>Peter: Milk. It's very good for our health,<br/>",
    //     "contentPng": null,
    //     "subjectId": 30,
    //     "updateTime": 1602643764000,
    //     "category": null,
    //     "categoryName": null,
    //     "indexNum": null
    //   },
    //   "materialQuestionList": [{
    //     "id": 2590135,
    //     "contentPng": null,
    //     "content": " A. I like swimming very much<br/>B. I swim and run every day<br/>C. I often swim in the swimming pool<br/>D. I can run for 1,000 meters<br/>",
    //     "answerPng": null,
    //     "answer": " B<br/>",
    //     "analysisPng": null,
    //     "analysis": "【解析】问句中关键词“how often”表示“多久一次”，因此问句句意是“你多久锻炼一次”，只有B选项“我每天都要游泳和跑步”最贴切，故选B。<br/>",
    //     "category": 107,
    //     "subjectId": 30, "gradeId": 15, "creatorId": 390, "createTime": 1592447339000, "yearId": 2017, "schoolId": 1, "difficulty": 0.170, "type": 3, "jobId": null, "rangeId": null, "updateTime": 1592544122000, "isSetParam": null, "topicCode": null, "knowName": null, "knowIds": null, "compIds": null, "compName": null, "cognIds": null, "cognName": null, "abilityIds": null, "abilityName": null, "questionData": null, "pointData": null, "serialCode": 1, "difficultyInt": null, "diffName": null, "collect": null, "notes": null, "massage": null, "massageIds": null, "isErro": null, "score": null, "fullMark": null, "tempId": null, "taskId": null, "paperId": null, "studentAnswer": null, "isTrue": null, "isObjective": null, "dataId": 0, "rule": null, "categoryName": null, "cx1": null, "cx2": null, "cy1": null, "cy2": null, "pageId": null, "questionTypeStr": null, "useNumber": 2.0
    //   }, {
    //     "id": 2590136,
    //     "contentPng": null,
    //     "content": " A. I can eat<br/>B. I can't buy<br/>C. I never eat<br/>D. I like<br/>",
    //     "answerPng": null,
    //     "answer": " C<br/>",
    //     "analysisPng": null,
    //     "analysis": "【解析】问句句意:那你吃些什么呢?根据答句关键词“but”可知前后形成转折，答句句意是“但是我会吃鱼和鸡蛋”，可知Peter从不吃肉，故选C。<br/>",
    //     "category": 107,
    //     "subjectId": 30, "gradeId": 15, "creatorId": 390, "createTime": 1592447339000, "yearId": 2017, "schoolId": 1, "difficulty": 0.080, "type": 3, "jobId": null, "rangeId": null, "updateTime": 1592544426000, "isSetParam": null, "topicCode": null, "knowName": null, "knowIds": null, "compIds": null, "compName": null, "cognIds": null, "cognName": null, "abilityIds": null, "abilityName": null, "questionData": null, "pointData": null, "serialCode": 2, "difficultyInt": null, "diffName": null, "collect": null, "notes": null, "massage": null, "massageIds": null, "isErro": null, "score": null, "fullMark": null, "tempId": null, "taskId": null, "paperId": null, "studentAnswer": null, "isTrue": null, "isObjective": null, "dataId": 0, "rule": null, "categoryName": null, "cx1": null, "cx2": null, "cy1": null, "cy2": null, "pageId": null, "questionTypeStr": null, "useNumber": 0.0
    //   }, {
    //     "id": 2590137,
    //     "contentPng": null,
    //     "content": "A. Do you eat a lot of vegetables<br/>B. Do you eat a lot of meat<br/>C. Do you eat a lot of fruit<br/>D. Do you eat a lot of food<br/>",
    //     "answerPng": null,
    //     "answer": " A<br/>",
    //     "analysisPng": null,
    //     "analysis": "【解析】根据肯定回答“是的，我喜欢蔬菜”可知应该是对是否吃蔬菜的提问，故选A。<br/>",
    //     "category": 107,
    //     "subjectId": 30, "gradeId": 15, "creatorId": 390, "createTime": 1592447339000, "yearId": 2017, "schoolId": 1, "difficulty": 0.120, "type": 3, "jobId": null, "rangeId": null, "updateTime": 1592544438000, "isSetParam": null, "topicCode": null, "knowName": null, "knowIds": null, "compIds": null, "compName": null, "cognIds": null, "cognName": null, "abilityIds": null, "abilityName": null, "questionData": null, "pointData": null, "serialCode": 3, "difficultyInt": null, "diffName": null, "collect": null, "notes": null, "massage": null, "massageIds": null, "isErro": null, "score": null, "fullMark": null, "tempId": null, "taskId": null, "paperId": null, "studentAnswer": null, "isTrue": null, "isObjective": null, "dataId": 0, "rule": null, "categoryName": null, "cx1": null, "cx2": null, "cy1": null, "cy2": null, "pageId": null, "questionTypeStr": null, "useNumber": 1.0
    //   }, {
    //     "id": 2590138,
    //     "contentPng": null,
    //     "content": " A. They are good for my body<br/>B. They're very bad for me<br/>C. They are very expensive<br/>D. They smell strange<br/>",
    //     "answerPng": null,
    //     "answer": " B<br/>",
    //     "analysisPng": null,
    //     "analysis": "【解析】根据否定回答“不”，可知Peter不会喝茶或咖啡，故排除A；根据语境B、C、D选项均可，但根据最后一句话“Milk. It's very good for our health. (牛奶有益于健康)”可知前后形成对比，喝茶或咖啡对健康不利，故选B。<br/>",
    //     "category": 107,
    //     "subjectId": 30, "gradeId": 15, "creatorId": 390, "createTime": 1592447339000, "yearId": 2017, "schoolId": 1, "difficulty": 0.020, "type": 3, "jobId": null, "rangeId": null, "updateTime": 1592544453000, "isSetParam": null, "topicCode": null, "knowName": null, "knowIds": null, "compIds": null, "compName": null, "cognIds": null, "cognName": null, "abilityIds": null, "abilityName": null, "questionData": null, "pointData": null, "serialCode": 4, "difficultyInt": null, "diffName": null, "collect": null, "notes": null, "massage": null, "massageIds": null, "isErro": null, "score": null, "fullMark": null, "tempId": null, "taskId": null, "paperId": null, "studentAnswer": null, "isTrue": null, "isObjective": null, "dataId": 0, "rule": null, "categoryName": null, "cx1": null, "cx2": null, "cy1": null, "cy2": null, "pageId": null, "questionTypeStr": null, "useNumber": 1.0
    //   }, {
    //     "id": 2590139,
    //     "contentPng": null,
    //     "content": "A. What do you buy in the supermarket<br/>B. What do you eat in the morning<br/>C. What do you drink every day<br/>D. Which is better,coffee or tea<br/>",
    //     "answerPng": null,
    //     "answer": " C<br/>",
    //     "analysisPng": null,
    //     "analysis": "【解析】根据关键词“tea or coffee”，“ milk”可知是对饮品的提问，故选C。<br/>",
    //     "category": 107,
    //     "subjectId": 30, "gradeId": 15, "creatorId": 390, "createTime": 1592447339000, "yearId": 2017, "schoolId": 1, "difficulty": 0.080, "type": 3, "jobId": null, "rangeId": null, "updateTime": 1592544482000, "isSetParam": null, "topicCode": null, "knowName": null, "knowIds": null, "compIds": null, "compName": null, "cognIds": null, "cognName": null, "abilityIds": null, "abilityName": null, "questionData": null, "pointData": null, "serialCode": 5, "difficultyInt": null, "diffName": null, "collect": null, "notes": null, "massage": null, "massageIds": null, "isErro": null, "score": null, "fullMark": null, "tempId": null, "taskId": null, "paperId": null, "studentAnswer": null, "isTrue": null, "isObjective": null, "dataId": 0, "rule": null, "categoryName": null, "cx1": null, "cx2": null, "cy1": null, "cy2": null, "pageId": null, "questionTypeStr": null, "useNumber": 0.0
    //   }],
    //   "content": "用$N_{\\mathrm{A}}$表示阿伏加德罗常数的值，下列说法正确的是(    )", "contentPng": null, "answer": "C", "answerPng": null, "analysis": "【解析】A项，17g-OH与17g$O H^{-}$都是1mol，电子式如图：[myImgCur]、[myImgCur]，前者比后者电子数少，故A错误；B项，标准状况下，甲为液态，无法用气体摩尔体积进行计算，故B错误；C项，铅蓄电池工作时，正极电极反应：$\\mathrm{Pb} \\mathrm{O}_{2}+2 \\mathrm{e}^{-}+4 \\mathrm{H}^{+}+2 \\mathrm{S} \\mathrm{O}_{4}^{2-}=\\mathrm{PbSO}_{4}+2 \\mathrm{H}_{2} \\mathrm{O}$；正极由$\\mathrm{PbO}_{2}$变为$\\mathrm{PbSO}_{4}$，质量增加的量相当于二氧化硫的质量，转移电子物质的量=32g÷64g/mol×2=1mol，所以转移电子数为$\\mathrm{N}_{\\mathrm{A}}$，故C正确；D项，苯酚中不存在碳碳双键，故D错误。综上，选C。", "analysisPng": "200615143609b82e418.png,2006151436aec7bc688.png", "difficulty": 0.58, "knowIds": "2315,2325,2391", "knowName": "物质的量及单位—摩尔", "optionList": [{ "id": 4676887, "questionId": 1512429, "code": "A.", "content": "17 g -OH 与 17 g$\\mathrm{OH}^{-}$所含电子数均为 10$N_{\\mathrm{A}}$", "contentPng": null, "optionCode": "A", "topicCode": null, "questionTypeStr": null }, { "id": 4676888, "questionId": 1512429, "code": "B.", "content": "标准状况下，11.2 L 的甲醇所含的氢原子数等于 2$N_{\\mathrm{A}}$", "contentPng": null, "optionCode": "B", "topicCode": null, "questionTypeStr": null }, { "id": 4676889, "questionId": 1512429, "code": "C.", "content": "在铅蓄电池放电时，正极增重 32g，转移的电子数为$N_{\\mathrm{A}}$", "contentPng": null, "optionCode": "C", "topicCode": null, "questionTypeStr": null }, { "id": 4676890, "questionId": 1512429, "code": "D.", "content": "1 mol 苯酚分子中含有的碳碳双键数为 3$N_{\\mathrm{A}}$", "contentPng": null, "optionCode": "D", "topicCode": null, "questionTypeStr": null }
    //   ]
    // }
    return (
      <div className={styles['question-item']}>
        {/*【上传微课弹窗】*/}
        {
          visibleUploadMicro ? <UploadMicroModal
            QContent={QContent}
            visibleUploadMicro={visibleUploadMicro}
            handleUploadMicroCancel={this.handleUploadMicroCancel}
            handleUploadMicro={this.handleUploadMicro}
          /> : null
        }
        <div className={styles['question-pre-oper']}>
          <div className={styles['parameters-area']}>
            <div>
              <label>难度：</label>
              <span>{QContent.difficulty}</span>
            </div>
            <div>
              <label>知识点：</label>
              {
                QContent.knowName ? <Tooltip placement="top" title={QContent.knowName}>
                  <span className={styles['know-name']}>{QContent.knowName}</span>
                </Tooltip>
                  : <span style={{ color: '#faad14' }}>暂无(待设置参数)</span>
              }
            </div>
          </div>
          <div className={styles['question-oper']}>
            {/* {
              access_token ? (isUploadVideo ? <span className={styles['isDeal']} onClick={() => { pushNewPage({ questionId: QContent.id, dataId: QContent.dataId }, '/question-detail', dispatch) }}>已上传</span>
                : (loginUserInfo.code == "TEACHER" || loginUserInfo.code == "QUESTION_EXPERT" || loginUserInfo.code == "QUESTION_EXPERT_GROUP" ? <span onClick={() => { pushNewPage({ questionId: QContent.id, dataId: QContent.dataId }, '/question-detail', dispatch) }}>上传微课</span> : null))
                : <span onClick={() => {
                  toLogin();
                }}>查看微课</span>
            } */}
            {//2021年10月14日 张江 添加上传微课入口
              loginUserInfo.code == "TEACHER" || loginUserInfo.code == "QUESTION_EXPERT" || loginUserInfo.code == "QUESTION_EXPERT_GROUP" || loginUserInfo.code == "CLASS_HEAD" ? <span onClick={() => { pushNewPage({ questionId: QContent.id, dataId: QContent.dataId }, '/question-detail', dispatch) }}>上传微课</span> : null
            }
            {/* {
              collectId == QContent.id ? <span onClick={() => {
                this.collectTopic(QContent.id, false);
              }}>取消收藏</span> : <span onClick={() => {
                this.collectTopic(QContent.id, true);
              }}>收藏</span>
            } */}
            {
              access_token ? <span className={QContent.id == collectId ? styles['isDeal'] : ''} onClick={() => {
                this.collectTopic(QContent.id, QContent.id != collectId);
              }}>{isCollecting ? '正在处理...' : collectId ? '已收藏' : '收藏'}</span> : <span onClick={() => {
                toLogin();
              }}>收藏</span>
            }

            {/* {
              baperBoardId == QContent.id ? <span onClick={() => {
                this.addOrCancelPaperBoard(QContent.id,  QContent.category,, false)
              }}>取消加入</span> :
                <span onClick={() => {
                  this.addOrCancelPaperBoard(QContent.id,  QContent.category,, true)
                }}>加入试题板</span>
            } */}
            {
              access_token ? loginUserInfo.subjectId && loginUserInfo.subjectId == QContent.subjectId && (loginUserInfo.code == "TEACHER" || loginUserInfo.code == 'GG_QUESTIONBANKADMIN' || loginUserInfo.code == 'GG_GUIDETOPICMEMBER' ? <span className={QContent.id == baperBoardId ? styles['isDeal'] : ''} onClick={() => {
                this.addOrCancelPaperBoard(QContent.id, QContent.category, QContent.id != baperBoardId, QContent.subjectId)
              }}>{isAdding ? '正在处理...' : baperBoardId ? '已加入试题板' : '加入试题板'}</span> : null) : <span onClick={() => {
                toLogin();
              }}>加入试题板</span>
            }

          </div>
        </div>
        <div className={styles['question-content']}>
          <div className={styles[isUpOrDown ? 'hidden-content' : 'all-content']}>
            {/* <TopicContent topicContent={QContent} contentFiledName={'content'}
              optionsFiledName={"optionList"} optionIdFiledName={"code"} />
            {isShowAnswerAnalysis ? renderAnswerAnalysis(QContent, 1) : null} */}
            {/* {
              questionDataArray && questionDataArray.questionData && questionDataArray.questionData.id ?//渲染 材料及材料下的题目
                RenderMaterialAndQuestion(questionDataArray, isShowAnswerAnalysis, {
                  contentFiledName: 'content',
                  optionsFiledName: 'optionList',
                  optionIdFiledName: 'code',
                },
                (item) => {
                  return (
                    <span onClick={() => { alert(item.id)}}>{item.id}</span>
                  )
                }
                )
                : <div>
                  <TopicContent topicContent={QContent} contentFiledName={'content'}
                    optionsFiledName={"optionList"} optionIdFiledName={"code"} />
                  {isShowAnswerAnalysis ? renderAnswerAnalysis(QContent, 1) : null}
                </div>
            } */}
            {
              RenderMaterialAndQuestion(QContent, isShowAnswerAnalysis, (RAQItem) => {
                return (<TopicContent topicContent={RAQItem} contentFiledName={'content'}
                  optionsFiledName={"optionList"} optionIdFiledName={"code"} />)
              },
              )
            }
          </div>

          <div className={styles['question-buttom']}>
            <span onClick={() => { this.onShowAnswerAnalysis(!isShowAnswerAnalysis) }}>{isShowAnswerAnalysis ? '隐藏答案和解析' : '答案和解析'}</span>
            <span onClick={() => { this.upToDown(!isUpOrDown) }}>{isUpOrDown ? '展开' : '收起'}</span>
          </div>
        </div>
      </div>
    )
  }
}


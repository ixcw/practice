/**
 * 题目列表页面 单个ListItem渲染组件
 * @author:张江
 * @date:2019年11月21日
 * @version:v1.0.1
 * @updateTime :2022年05月20日
 * @updateDescription :添加添加知识维度
 * */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
  Checkbox,
  Input,
  Modal,
  message,
} from 'antd';
import {UpOutlined, DownOutlined} from '@ant-design/icons';
import queryString from 'query-string';
import classNames from 'classnames';
import MarkdownRender from "../MarkdownRender/MarkdownRender";
import QuestionParseUtil from "../MarkDown/QuestionParseUtil";
import TopicContent from "../TopicContent/TopicContent";
import {getIcon, dealQuestionRender, dealQuestionEdit, dealFieldName, pushNewPage} from '@/utils/utils';
import SetParameterForm from "./SetParameterForm";
import EditImageModal from "./EditImageModal";
import EditQuestionModal from "./EditQuestionModal";
import UploadMicroModal from '../QuestionItem/UploadMicroModal';//上传微课弹窗
import ParametersArea from './ParametersArea';//
import styles from './QuestionItem.less';

import renderAnswerAnalysis from "../RenderAnswerAnalysis/index";//渲染题目答案与解析部分
import RenderMaterial from "../RenderMaterial/index";
import ErrorCorrectionModal from "./ErrorCorrectionModal";
import {QuestionBank as namespace} from "@/utils/namespace";
import singleTaskInfoCache from "@/caches/singleTaskInfo";
//渲染材料部分

const {TextArea} = Input;
const {confirm} = Modal;
const IconFont = getIcon();

export default class QuestionItem extends React.Component {
  static propTypes = {
    QContent: PropTypes.object.isRequired,//题目信息
    doEditor: PropTypes.func,//修改题目信息
    knowledgeList: PropTypes.array,//知识点列表
    updateQuestionParameter: PropTypes.func,//设参或更新题目参数

    QEMessageList: PropTypes.array,//题目错误类型列表
    doRejectedFlag: PropTypes.func,//标记驳回
    cancelRejectedFlag: PropTypes.func,//取消标记驳回
    passQuestion: PropTypes.func,//标记通过

    keyAbilityList: PropTypes.array,//关键能力
    coreLiteracyList: PropTypes.array,//核心素养
    cognitiveLevelList: PropTypes.array,//认知层次
    knowledgeDimensionList: PropTypes.array,//知识维度


    comePage: PropTypes.string,//来至的页面
    buttonAuth: PropTypes.any,//按钮权限

  };


  constructor() {
    super(...arguments);
    this.state = {
      isUpOrDown: true,
      isErrorQContent: {
        isErro: false,
      },//是否标记
      errorType: [],// 已选择的错误类型
      rejectionNote: '',//驳回说明
      isTipPass: false,
      wordCount: 120,// 驳回说明的字数
      editImgvisible: false,

      editQuestionVisible: false,
    };
  }

  componentDidMount() {
    const {
      QContent,
      location,
    } = this.props;
    const {pathname, search} = location;
    const query = queryString.parse(search);
    const wordOption = singleTaskInfoCache()||{};
    this.setState({
      isErrorQContent: wordOption.isSee == 4 || wordOption.isSee == 2 ? {
        isErro: false,
      } : QContent,
      rejectionNote: QContent && QContent.notes ? QContent.notes : '',
      errorType: this.dealMassageIds(QContent),
    })
  }

  /**
   * 切割错误类型
   * @param QContent  ：题目内容
   */
  dealMassageIds = (QContent) => {
    let errorType = []
    if (QContent && QContent.massageIds) {
      const massageIdsString = QContent.massageIds.split(',');
      for (let item of massageIdsString) {
        if (item) {
          errorType.push(Number(item));
        }
      }
    }
    return errorType;
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

  onCheckedChange = (errorType) => {
    this.setState({
      errorType
    })
  }

  onChange = ({target: {value}}) => {
    this.setState({rejectionNote: value});
  };

  /**
   * 标记驳回与取消标记
   * @param questionId  ：题目id
   * @param isTip  ：是/否
   */
  handleSign = (questionId, isTip) => {
    const {
      doRejectedFlag,
      cancelRejectedFlag
    } = this.props;
    const {errorType, rejectionNote, isErrorQContent, wordCount} = this.state;
    const massageId = errorType.join(',');
    if (!massageId && isTip) {
      message.warn('请至少选择一个错误类型');
      return;
    }
    if (rejectionNote && rejectionNote.length > wordCount && isTip) {
      message.warn(`驳回说明不能超过 ${wordCount} 个字`);
      return;
    }
    const callback = () => {
      isErrorQContent.isErro = isTip;
      this.setState({
        isErrorQContent
      })
    }
    let payload = {
      questionId,
      massageId,
      notes: rejectionNote,
    }
    if (isTip) {//标记驳回
      doRejectedFlag(payload, callback);
    } else {// 取消标记驳回
      cancelRejectedFlag({questionId}, callback)
    }

  }

  /**
   * 标记通过
   * @param questionId  ：题目id
   * @param isTipPass  ：是/否
   */
  handleSignPass = (questionId, isTipPass) => {
    const {
      passQuestion
    } = this.props;
    const callback = () => {
      this.setState({
        isTipPass
      })
    }
    let payload = {
      questionId,
    }

    confirm({
      title: '标记通过提醒',
      content: '是否确认此题经过驳回后修改已经无误?',
      onOk() {     //标记通过
        passQuestion(payload, callback);
      },
      onCancel() {
      },
    });

  }

  /**
   * 隐藏图片上传弹框
   */
  hideEditImgvisible = () => {
    this.setState({
      editImgvisible: false
    })
  }


  // 题目信息编辑

  /**
   * 显示题目编辑弹窗弹框
   */
  showEditQuestionVisible = () => {
    this.setState({
      editQuestionVisible: true
    })
  }

  /**
   * 显示题目编辑弹窗弹框
   */
  hideQuestionVisible = () => {
    this.setState({
      editQuestionVisible: false
    })
  }

  /**
   * 保存题目信息编辑
   */
  saveQuestionContent = (newQuestionInfo, content, queationInfo) => {
    const {
      // QContent,
      doEditor,
    } = this.props;
    // const questionInfo = dealQuestionEdit(QContent)
    // let tempNewQuestionInfo = newQuestionInfo.replace(new RegExp("【类型标记-", "g"), "[")
    // doEditor(tempNewQuestionInfo ? tempNewQuestionInfo : '', questionInfo ? questionInfo.replace(new RegExp("【类型标记-", "g"), "[") : '', QContent)
    doEditor(newQuestionInfo, content, queationInfo)
    this.hideQuestionVisible();
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
   * @param command  ：口令
   * @param subjectId  ：科目的id
   */
  handleUploadMicro = (command, subjectId) => {
    this.setState({
      isUploadVideo: true
    }, () => {
      this.handleUploadMicroCancel();
    })
  };

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
    this.errorCorrectionRef.onOff(true,questionId)
  }

  render() {
    const {
      QContent,
      doEditor,
      dispatch,
      location,
      knowledgeList,
      keyAbilityList = [],//关键能力
      coreLiteracyList = [],//核心素养
      cognitiveLevelList = [],//认知层次
      knowledgeDimensionList = [],//知识维度
      updateQuestionParameter,
      QEMessageList,
      updateQuestionImage,

      comePage,
      buttonAuth = {}
    } = this.props;
    const {
      isUpOrDown,
      isErrorQContent,
      errorType,
      rejectionNote,
      isTipPass,
      wordCount,
      editImgvisible,

      editQuestionVisible,
      visibleUploadMicro,
      isUploadVideo,
    } = this.state;
    const {pathname, search} = location;
    const query = queryString.parse(search) || {};
    // const questionInfo = dealQuestionEdit(QContent)
    const questionInfo = QContent
    const checkboxOptions = dealFieldName(QEMessageList);

    const pageNumber = Number(query.p) || 1;
    const pageSize = Number(query.s) || 10;
    const serialCode = QContent.serialCode + (pageNumber - 1) * pageSize;
    QContent.serialNumber = serialCode;
    const wordOption = singleTaskInfoCache() || {};

    return (
      <div className={styles['question-list']}
        style={{ paddingRight: wordOption.isSee == -1 || wordOption.isSee == 2 ? '48px' : undefined}}>
        {/*【上传微课弹窗】*/}
        {
          visibleUploadMicro ? <UploadMicroModal
            visibleUploadMicro={visibleUploadMicro}
            handleUploadMicroCancel={this.handleUploadMicroCancel}
            handleUploadMicro={this.handleUploadMicro}
            QContent={QContent}
          /> : null
        }

        <div className={styles['problem-area']} style={{height: isUpOrDown ? '' : '120px'}}>
          <div className={classNames(styles['upDownOper'], 'no-print')} onClick={() => {
            this.upToDown(!isUpOrDown)
          }}>
            {
              isUpOrDown ? <UpOutlined/> : <DownOutlined/>
            }
          </div>
          {/* {
            wordOption.isSee == -1 || wordOption.isSee == 2 ? <div className={styles['editOper']}>
              {
                editQuestionVisible ? <EditQuestionModal
                  location={location}
                  questionInfo={questionInfo}
                  editQuestionVisible={editQuestionVisible}
                  hideQuestionVisible={this.hideQuestionVisible}
                  saveQuestionContent={this.saveQuestionContent}
                /> : null
              }

              <Button onClick={() => { this.showEditQuestionVisible() }} type="primary">修改</Button>
               </div> : null
          } */}
          {//题库监控-题目查询
            pathname == '/all-question-list' ? <div className={classNames(styles['editOper'], 'no-print')}>
              {
                editQuestionVisible ? <EditQuestionModal
                  location={location}
                  questionInfo={questionInfo}
                  editQuestionVisible={editQuestionVisible}
                  hideQuestionVisible={this.hideQuestionVisible}
                  saveQuestionContent={this.saveQuestionContent}
                /> : null
              }
              {
                window.$PowerUtils.judgeButtonAuth(pathname, '修改') ?
                  <Button onClick={() => {
                    this.showEditQuestionVisible()
                  }} type="primary">修改</Button> : null}
            </div> : null
          }
          {
            (pathname == '/question-audit-list' && !!isErrorQContent.isErro && !isTipPass)
              || (pathname == '/question-list' && !!isErrorQContent.isErro && wordOption.isSee == 1 && !isTipPass)
              ?
              <IconFont
                onClick={() => {
                  if (pathname == '/question-audit-list') {
                    this.handleSign(QContent.id, !isErrorQContent.isErro)
                  }
                }
                }
                type={'icon-reject'}
                className={styles['iconfont-fixed']}
                title="驳回标记"/> : null
          }
          {
            pathname == '/question-audit-list' && wordOption.isSee == 4 && isTipPass ?
              <IconFont type={'icon-adopt'} className={styles['iconfont-fixed-adopt']} title="标记通过"/> : null
          }

          {/* {
            wordOption.isSee == -1 || wordOption.isSee == 2 ? <div className={styles['editOper-img']}>
              <EditImageModal
                QContent={QContent}
                location={location}
                editImgvisible={editImgvisible}
                hideEditImgvisible={this.hideEditImgvisible}
                updateQuestionImage={updateQuestionImage}
              />
              <Button onClick={() => { this.setState({ editImgvisible: true }) }} type="primary">修改图片</Button>
            </div> : null
          } */}

          {/* 材料部分 */}
          {
            RenderMaterial(QContent)
          }
          {/*题干区域*/}
          <TopicContent
            topicContent={QContent}
            contentFiledName={'content'}
            optionsFiledName={"optionList"}
            optionIdFiledName={"code"}
            pageSize={Number(query.pageSize) || 10}
          />
          {renderAnswerAnalysis(QContent, 1)}
        </div>
        <div className={styles['upload-micro']}>
          <div>
            <div>
              <label>题号：</label>
              <span>{QContent.id}</span>
            </div>
            {/* {
              comePage && comePage == 'setParam' ? <div style={{ marginLeft: '20px' }}>
                <label>知识点：</label>
                <span>{QContent && QContent.knowName ? QContent.knowName : '暂无'}</span>
              </div>:null
            } */}
          </div>
          <div>
            {
              wordOption.isSee == -1 || wordOption.isSee == 2 ? <div style={{marginRight: 10}}>
                {
                  editQuestionVisible ? <EditQuestionModal
                    location={location}
                    questionInfo={questionInfo}
                    editQuestionVisible={editQuestionVisible}
                    hideQuestionVisible={this.hideQuestionVisible}
                    saveQuestionContent={this.saveQuestionContent}
                  /> : null
                }

                <Button onClick={() => {
                  this.showEditQuestionVisible()
                }} type="primary">修改</Button>
              </div> : null
            }
            {
              wordOption.isSee == -1 || wordOption.isSee == 2 ? <div style={{marginRight: 10}}>
                {
                  editImgvisible ? <EditImageModal
                    QContent={QContent}
                    location={location}
                    editImgvisible={editImgvisible}
                    hideEditImgvisible={this.hideEditImgvisible}
                    updateQuestionImage={updateQuestionImage}
                  /> : null}
                <Button onClick={() => {
                  this.setState({editImgvisible: true})
                }} type="primary">修改图片</Button>
              </div> : null
            }

            <Button type="primary" style={{marginRight: '16px'}} onClick={()=>this.openErrorCorrection(QContent.id)}>题目纠错</Button>

            {/* 录制页面 */}
            <Button
              style={{marginRight: '16px'}}
              onClick={() => {
                pushNewPage({questionId: QContent.id, dataId: QContent.dataId}, '/recording-page', dispatch)
              }}
              type="primary">录制页面</Button>
            {
              comePage == 'setParam' && buttonAuth.isUpload ? <div>
                {
                  isUploadVideo && QContent.id ?
                    <Button
                      disabled
                      onClick={() => {
                        pushNewPage({questionId: QContent.id}, '/question-detail', dispatch)
                      }}
                      type="primary">已上传</Button>
                    : <Button onClick={() => {
                      pushNewPage({questionId: QContent.id, dataId: QContent.dataId,}, '/question-detail', dispatch)
                    }} type="primary">上传微课</Button>
                }
                {/* <Button onClick={this.showUploadMicroModal} type="primary">上传微课</Button> */}
              </div> : null
            }


          </div>
        </div>

        {
          (comePage && (comePage == 'setParam' && !buttonAuth.isSaveParam)) || pathname == '/question-audit-list' || pathname == '/all-question-list' || (pathname == '/question-list' && (wordOption.isSee != -1 && wordOption.isSee != 2)) ? //审核 审核修驳
            <ParametersArea QContent={QContent} comePage={comePage}/>
            : null
        }

        {
          pathname == '/question-audit-list' ? //审核 审核修驳
            <div className={styles['parameters-area']}>
              <div className={styles['show-audit']}>
                <div>
                  <label>错误类型：</label>
                  <span><Checkbox.Group options={checkboxOptions} value={errorType}
                                        onChange={this.onCheckedChange}/></span>
                </div>
                <div>
                  <label>驳回说明：</label>
                  <TextArea
                    onChange={this.onChange}
                    value={rejectionNote}
                    style={{marginTop: '10px'}}
                    placeholder="请输入驳回说明"
                    maxLength={wordCount}
                    autoSize={{minRows: 2, maxRows: 4}}
                  />
                  <div className={styles['word-count']}><font
                    color="gray">你还可以输入{wordCount - rejectionNote.length}个字</font></div>
                </div>
                <div className={styles['audit-oper']}>
                  <Button
                    onClick={() => {
                      this.handleSign(QContent.id, !isErrorQContent.isErro)
                    }}>{isErrorQContent.isErro ? '取消标记' : (wordOption.isSee == 4 ? '再次驳回' : '标记驳回')}</Button>
                  {
                    wordOption.isSee == 4 ? <Button
                      disabled={isTipPass}
                      type="primary"
                      onClick={() => {
                        this.handleSignPass(QContent.id, true)
                      }}>
                      {
                        isTipPass ? '已通过' : '标记通过'
                      }
                    </Button> : null
                  }

                </div>
              </div>
            </div> : <div className={styles['parameters-area']}>
              {/* 预览 */} {/* 设参/编辑  */} {/* 修改驳回  */}
              {
                wordOption.isSee == -1 || wordOption.isSee == 2 || (comePage && (comePage == 'setParam' && buttonAuth.isSaveParam)) ?
                  <SetParameterForm
                    knowledgeList={knowledgeList}
                    QContent={QContent}
                    updateQuestionParameter={updateQuestionParameter}
                    version={query.version || ''}//2020年08月12日 版本题库专用标记
                    otherParam={{
                      keyAbilityList,//关键能力
                      coreLiteracyList,//核心素养
                      cognitiveLevelList,//认知层次
                      knowledgeDimensionList,//知识维度
                      comePage
                    }}

                  /> : null
              }
            </div>
        }
        {
          wordOption.isSee == 2 ?
            <div className={styles['parameters-area']}>
              <div className={styles['show-audit']}>
                <div>
                  <label>错误类型：</label>
                  <span className={styles['warn-tip']}>{QContent.massage}</span>
                </div>
                <div>
                  <label>驳回说明：</label>
                  {
                    QContent.notes ? <span className={styles['warn-tip']}>{QContent.notes}</span>
                      : <span>-</span>
                  }
                </div>
              </div>
            </div> : null
        }
        <ErrorCorrectionModal onRef={this.getErrorCorrectionModal}/>
      </div>
    )
  }
}


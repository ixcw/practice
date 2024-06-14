/**
* 试题板-相似题匹配弹窗
* @author:张江
* @date:2021年02月03日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import {
  Radio,
  Modal,
  message,
  Spin,
  Button,
  Empty,
  Checkbox
} from 'antd';
import { connect } from "dva";
// import { InboxOutlined } from '@ant-design/icons';
import TopicContent from "@/components/TopicContent/TopicContent";
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
// import SetParameterForm from "@/components/QuestionBank/SetParameterForm";
import ParametersArea from '@/components/QuestionBank/ParametersArea';//
import { PaperBoard as namespace } from '@/utils/namespace';
import { existArr, getIcon, dealQuestionToGetDataIdQuestionId, dealQuestionfieldIdOrName } from "@/utils/utils"
import styles from './index.less';

const IconFont = getIcon();
const matchQuestionNumber = 3;//相似题匹配的题目数量

@connect(state => ({
  changeTopicListLoading: state[namespace].changeTopicListLoading,//带选择的题目加载中
  saveLoading: state[namespace].saveLoading,//确认匹配加载中
}))

export default class WrongQuestionMatchModal extends React.Component {
  static propTypes = {
    questionInfo: PropTypes.object.isRequired,//信息
    isWrongQuestionMatchModal: PropTypes.bool.isRequired,//是否显示弹框
    hideWrongQuestionMatchVisible: PropTypes.func.isRequired,//弹框操作隐藏
  };


  constructor() {
    super(...arguments);
    this.state = {
      chooseTopicList: [],

      selectedQuestion: {},
      selectedQuestionArray: [],
      currentPage: 0,
      selectedKnowId: '',
      selectedKnowList: [],
      fristSelectedKnowId: '',
      // initSelectedQuestionId:[],
    };
  }

  componentDidMount() {
    const {
      questionInfo,
    } = this.props;
    // 计算获取知识点列表 并获取默认知识点
    const selectedKnowList = dealQuestionfieldIdOrName(questionInfo);
    if (existArr(selectedKnowList)) {
      const selectedId = selectedKnowList[0].code
      this.setState({
        selectedKnowId: selectedId,
        fristSelectedKnowId: selectedId,
        selectedKnowList,
      })
      this.getQuestionMatesModalState(1, selectedId, true);
    }

  }

  /**
 * 随机换一页（换一批功能）
 */
  batchChange = (pageState) => {
    const { currentPage, selectedKnowId } = this.state
    let pageNum = Number(currentPage) + pageState;
    this.getQuestionMatesModalState(pageNum < 2 ? 1 : pageNum, selectedKnowId);
  }

  /**
  * 获取带选择的题目列表
  * @param pageNum  ：页码
  * @param knowId  ：知识点id
  * @param isFrist  ：是否第一次进入
  */
  getQuestionMatesModalState = (pageNum, knowId, isFrist) => {
    const { dispatch, questionInfo } = this.props;
    // const { initSelectedQuestionId } = this.state;
    dispatch({
      type: `${namespace}/saveState`,
      payload: {
        changeTopicListLoading: true
      }
    })
    this.setState({
      chooseTopicList: []
    })
    dispatch({
      type: `${namespace}/getQuestionMates`,
      payload: {
        page: pageNum,
        size: 10,
        categoryStr: questionInfo.category,
        difficultIntStr: questionInfo.difficulty,
        knowIdStr: knowId,
        subjectId: questionInfo.subjectId,
        questionId: questionInfo.id || questionInfo.questionId,
        paperId: questionInfo.paperId || undefined
        // status: 1
      },
      callback: (result) => {
        let currentPage = pageNum;
        const resultData = result && result.data ? result.data : []
        if (!existArr(resultData) && pageNum != 1) {
          this.getQuestionMatesModalState(1, knowId);
        } else if (existArr(resultData) && resultData.length < 10) {
          currentPage = 0;
        }
        //更新状态，以便于在点击上下一批的时候，记录页码
        this.setState({
          chooseTopicList: resultData,
          currentPage,
          selectedKnowId: knowId,
        }, () => {
          if (isFrist && pageNum == 1) {//第一次进入调用的时候 获取已匹配相似题的题目id
            let selectedQuestionId = [];
            for (const item of resultData) {
              if (item.flag == 1) {
                const questionId = dealQuestionToGetDataIdQuestionId(item, 'id');//处理题目id
                selectedQuestionId.push(questionId);
              } else {
                break;
              }
            }
            if (existArr(selectedQuestionId)){
              // this.setState({
              //   initSelectedQuestionId: selectedQuestionId,
              // },()=>{
              this.onSelectQuestionChange(selectedQuestionId);
            // })
            } 
          }
          dispatch({
            type: `${namespace}/saveState`,
            payload: {
              changeTopicListLoading: false
            }
          })
        })
      }
    })
  }

  /**
  * 选择题目操作处理
  * @param checkedValues  ：选择的值
  */
  onSelectQuestionChange = (checkedValues) => {
    const {
      selectedQuestion,
      currentPage,
      selectedKnowId,
    } = this.state;
    selectedQuestion[selectedKnowId + 'page-' + (currentPage || '1')] = checkedValues;
    let tempSelectedQuestionArray = []
    for (const key in selectedQuestion) {
      tempSelectedQuestionArray.push(...selectedQuestion[key]);
    }
    tempSelectedQuestionArray = Array.from(new Set(tempSelectedQuestionArray))
    // console.log('tempSelectedQuestionArray===', tempSelectedQuestionArray)
    if (tempSelectedQuestionArray.length > matchQuestionNumber) {
      message.warn('最多只能选择三道题目')
      return;
    }
    this.setState({
      selectedQuestion,
      selectedQuestionArray: tempSelectedQuestionArray
    })
  }
  /**
  * 确认匹配题目
  */
  confirmMatch = () => {
    const {
      dispatch,
      hideWrongQuestionMatchVisible,
      questionInfo,
    } = this.props;
    const { selectedQuestionArray } = this.state;
    if (selectedQuestionArray.length == matchQuestionNumber) {
      dispatch({
        type: `${namespace}/saveState`,
        payload: {
          saveLoading: true
        }
      })
      let questionIdArray = [];//题目id
      let dataIdArray = [];//题材id
      selectedQuestionArray.map((item)=>{
        const tempJson = JSON.parse(item);
        questionIdArray.push(tempJson.questionId);
        dataIdArray.push(tempJson.dataId);
      })
      // 题目匹配入临时表
      dispatch({
        type: `${namespace}/addQuestionMateInfo`,
        payload: {
          questionId: questionInfo.id || questionInfo.questionId,
          subjectId: questionInfo.subjectId,
          // questionIdStr: selectedQuestionArray.join(','),
          questionIdStr: questionIdArray.join(','),
          dataIdStr: dataIdArray.join(','),
          paperId: questionInfo.paperId || undefined
        },
        callback: (result) => {
          const returnJudge = window.$HandleAbnormalStateConfig(result);
          if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
          message.success('匹配成功');
          hideWrongQuestionMatchVisible(questionInfo);
        }
      })
    }

  }

  /**
* 页面组件即将卸载时：清空数据
*/
  componentWillUnmount() {
    const { dispatch } = this.props;
    this.setState({
      chooseTopicList: [],
    })
    dispatch({
      type: namespace + '/saveState',
      payload: {
        saveLoading: false,
        changeTopicListLoading: false,
      },
    });
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    const {
      hideWrongQuestionMatchVisible,
      isWrongQuestionMatchModal,
      questionInfo,
      saveLoading,
      changeTopicListLoading
    } = this.props;
    const {
      chooseTopicList,
      selectedQuestion,
      currentPage,
      selectedQuestionArray,
      selectedKnowId,
      selectedKnowList,
      fristSelectedKnowId
    } = this.state;

    return (
      <Modal
        className={styles['WrongQuestion-Match-modal']}
        title={<div> 相似题匹配 <span className='modal-sub-title'>(请选择三道题目进行相似题匹配)</span></div>}
        visible={isWrongQuestionMatchModal}
        onCancel={hideWrongQuestionMatchVisible}
        maskClosable={false}
        closable={!saveLoading}
        width={'80vw'}
        style={{ top: 48 }}
        footer={[
          // <Button key='cancel' loading={!!saveLoading} onClick={hideWrongQuestionMatchVisible}>取消</Button>,
          <Button key='ok' type="primary"
            disabled={selectedQuestionArray.length < matchQuestionNumber}
            loading={!!saveLoading}
            onClick={this.confirmMatch}>确认匹配</Button>
        ]}
      >
        <Spin spinning={!!saveLoading} tip={'正在匹配中,请稍候...'}>
          <Spin spinning={!!changeTopicListLoading} tip={currentPage == 0 ? '加载中...' : '正在换一批,请稍候...'}>
            <div className='Match-header'>
              <div className="left">
                <div>原题信息</div>
                <div>题型：{questionInfo && questionInfo.category && questionInfo.categoryName || '未知'}</div>
                {
                  questionInfo && questionInfo.difficulty ? <div>难度：{questionInfo.difficulty}</div> : ''
                }
                {//&& questionInfo.knowName
                  questionInfo && selectedKnowId ? <div>知识点： <Radio.Group onChange={(event) => {
                    const selectValue = event.target.value;
                    this.getQuestionMatesModalState(1, selectValue);
                  }} defaultValue={selectedKnowId}>
                    {
                      selectedKnowList.map((item) => {
                        return (<Radio.Button key={item.code} value={item.code}>{item.name}</Radio.Button>)
                      })
                    }
                  </Radio.Group>
                  </div> : ''
                }
              </div>
              <div className="Match-right">
                {
                  currentPage > 1 ? <div onClick={() => { this.batchChange(-1) }}>
                    <IconFont type='icon-switch' /> 上一批
              </div> : null
                }

                <div onClick={() => { this.batchChange(1) }}>
                  <IconFont type='icon-switch' /> 下一批
              </div>
              </div>
            </div>
            <div
              id='question-list'
              className={existArr(chooseTopicList) ? 'question-list' : 'empty-box'}>
              {
                existArr(chooseTopicList) ? <Checkbox.Group
                  style={{ width: '100%' }}
                  onChange={this.onSelectQuestionChange}
                  value={selectedQuestionArray}
                >
                  {
                    chooseTopicList.map((topic, index) => {
                      const questionId = dealQuestionToGetDataIdQuestionId(topic, 'id');
                      if (fristSelectedKnowId != selectedKnowId && topic.flag == 1 && currentPage == 1) {
                        return null;
                      } else {
                        return (
                          <div className={'select-question-list'} key={index}>
                            <Checkbox value={questionId}>
                              <div className={'question-item'}>
                                {
                                  RenderMaterialAndQuestion(topic, false, (RAQItem) => {
                                    return (<TopicContent topicContent={RAQItem}
                                      childrenFiledName={'children'}
                                      contentFiledName={'content'}
                                      optionIdFiledName={'code'}
                                      optionsFiledName={"optionList"}
                                      currentPage={currentPage}
                                      currentTopicIndex={index}
                                      pageSize={10}
                                    />)
                                  },
                                    (RAQItem) => {
                                      return <ParametersArea QContent={RAQItem} comePage={''} />;
                                    },
                                  )
                                }
                              </div>
                            </Checkbox>
                          </div>
                        )
                      }
                    })
                  }

                </Checkbox.Group> : <Empty description={'暂无数据,请切换条件查询'} />
              }

            </div>

          </Spin>
        </Spin>
      </Modal>
    )
  }
}


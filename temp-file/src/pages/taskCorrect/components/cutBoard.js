/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/9/3
 *@Modified By:
 * @updateAuthor:张江
 * @updateVersion:v1.0.1
 * @updateDate:2021年09月24日
 * @description 更新描述:路由由push->replace，添加分数平铺点选提交
 */
import React from 'react'
import styles from "./correctJob.less";
import { InputNumber, Input, Button, Empty, message, Popconfirm } from 'antd'
import { DownOutlined } from "@ant-design/icons";
import { TaskCorrect as namespace } from '@/utils/namespace'
import { existArr, existObj, pushNewPage, numericArrayByInterval } from '@/utils/utils'
import { connect } from "dva";

const TextArea = Input.TextArea;


@connect(state => ({}))
export default class CutBoard extends React.Component {
  constructor(porps) {
    super(porps)
    this.state = {
      inputValue: 0,//分数评语
      textInputValue: '',
      valueIsChange: false,//分数是否被改变
    };
    this.input = React.createRef();
  }


  componentDidMount() {
    this.props.onRef(this)
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    const { topic = {} } = nextProps;
    const { topic: _topic = {} } = nextContext;
    const { textInputValue = '', inputValue = 0 } = this.state;
    if (JSON.stringify(topic) !== JSON.stringify(_topic)) {
      this.setState({
        textInputValue: topic.comment ? topic.comment : '',
        inputValue: topic.score ? Number(topic.score) : 0,
      })
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: namespace + '/set',
      payload: {
        findCorrectionLists: '',
        findStudentListsByJobId: []
      }
    });
    this.setState({
      inputValue: 0,
      textInputValue: ''
    })
  }

  /**
   * 重置分数评论
   */
  resetNumbRemark = () => {
    this.setState({
      inputValue: 0,
      textInputValue: '',
      valueIsChange: false
    })
  }

  /**
   * 提交分数
   * @param cutTopic 切换题目
   * @param isCorrect //是否已批改
   */
  submitScore = (cutTopic, isCorrect) => {
    const { location: { query }, dispatch, topicList } = this.props;
    const { textInputValue, inputValue, valueIsChange } = this.state;
    const topic = existArr(topicList) ? topicList.filter(re => re.questionId == query.questionId)[0] : {}
    if ((topic?.score != inputValue && valueIsChange) || (!isCorrect && valueIsChange)) {
      dispatch({
        type: namespace + '/correctionQuestion',
        payload: {
          id: query.topicId || undefined,
          score: inputValue || 0,
          comment: textInputValue || ''
        },
        callback: () => {
          message.success('提交成功')
          this.resetNumbRemark()
          dispatch({
            type: namespace + `${query.jobType === '1' ? '/findAllWaitingCorrectQuestions' : '/findCorrectionLists'}`,
            payload: {
              userId: query?.id === '0' ? undefined : query.id,
              jobId: query.jobId
            }
          })
          dispatch({
            type: namespace + "/findStudentListsByJobId",
            payload: {
              jobId: query.jobId
            }
          })
        }
      })
    }
    cutTopic && cutTopic()
  }

  /**
   * input聚焦
   */
  inputFocus = () => {
    this.input.current.focus()
  }

  //定位到锚点
  cutScrollView = (n, topicList, topic, topicBoxRef) => {
    // topicBoxRef.refs[topicList[_topic.index + n].questionId].scrollIntoView()
    //下一个题自动滚动
    let offsetTop = 0;
    if (n) {
      const indexN = topic.index + (topic.homeworkScrollType == 2 ? -1 : n);// topic.homeworkScrollType == 2 作业点击分数时滚动
      const index = indexN == topicList.length ? topicList.length - 1 : indexN;
      // 优化-计算准确数组的小标
      const nextTopic = topicList[index] || {};
      offsetTop = topicBoxRef.refs[nextTopic.questionId + nextTopic.id]?.offsetTop;//计算可滚动高度
      offsetTop = offsetTop - 100;
    }
    document.getElementById('taskCorrectTopicBox').scrollTo({
      top: offsetTop < 0 ? 0 : offsetTop,//滚动距离
      behavior: "smooth"
    })
    this.inputFocus()
  }

  render() {
    const { topicBoxRef = {}, topicList = [], location: { query, pathname }, dispatch, findStudentListsByJobId, student } = this.props;
    const { textInputValue, inputValue, valueIsChange } = this.state;
    const tp = existArr(topicList) ? topicList.filter(re => re.questionId == query.questionId) : [];
    const _topic = existObj(tp[0]) ? tp[0] : {}
    const isCorrect = student ? student.isCorrect : (query?.id !== '0')//判断当前试卷是否已经完成批改
    const isStudentAnswer = _topic.studentAnswer || _topic.pointData;//判断学生是否有作答或者作答轨迹
    // const isSystemReview = _topic?.correctId == 0;//判断是否系统批阅  为0，则是系统批阅
    const disabledInput = !(_topic?.id && !isCorrect) || !isStudentAnswer;//当学生未作答，或者当前题目已经完成批改禁用掉输入框
    const numericArray = numericArrayByInterval(_topic.totalScore);
    /**
     * 改分输入框
     * @param value
     * @returns {Promise<*>}
     */
    const handlePoints = (value) => {
      // let reg = /^[1-9]\d*\.[5]$|0\.[5]$|^[1-9]\d*$/
      if (isNaN(value)) {
        return null;
      }
      // if(String(value).include('.')&&(value/0.5)){
      //
      // }

      this.setState({
        inputValue: value,
        valueIsChange: true
      })
    };

    /**
     *  写评语
     * @param data
     * @returns {Promise<*>}
     */
    const writeRemark = ({ target: { value } }) => {
      this.setState({ textInputValue: value });
    };

    /**
     * 打分并切换到下一题
     * @param n
     * @param type 1为题目列表请求
     */
    const lastNext = (n = 1, type) => {
      //切换题目和学生
      const cutTopic = () => {
        if (existObj(topicList[_topic.index + n])) {
          pushNewPage(
            {
              ...query,
              questionId: topicList[_topic.index + n].questionId,
              topicId: topicList[_topic.index + n].id ? topicList[_topic.index + n].id : undefined
            },
            '/correctJob', dispatch, 'replace')
        }
      }

      // 作业点击分数时滚动
      if (query?.jobType == '1' && type == 2) {
        _topic.homeworkScrollType = 2;
      }else{
        _topic.homeworkScrollType = undefined;
      }
      /**
       * 作业定位机制： 判断如果分数改变则题目切换时自动定位题目，或者不为作业时或者批改完成
       * @returns {number|boolean|void}
       */
      const switchScrollView = () => ((query?.isCorrect || query?.jobType !== '1') || !valueIsChange) && this.cutScrollView(n, topicList, _topic, topicBoxRef)


      //上一题，并且不是题目列表请求，不批改
      if (n === -1 && type !== 1) {
        this.resetNumbRemark()
        cutTopic();
        switchScrollView()//未完成的：分数未改变允许定位
        return
      }

      //最后一题提交分数
      if (n === 0) {
        this.submitScore(undefined, isCorrect)
        return;
      }

      //学生没提交的题目不改分，直接切换题目
      if (!_topic.id) {
        //下一题
        this.resetNumbRemark();
        cutTopic();
        switchScrollView()
        return;
      }
      if (isCorrect === 1) {
        //下一题
        this.resetNumbRemark();
        switchScrollView()
        cutTopic()
        return;
      }
      //下一题
      // this.resetNumbRemark();
      this.submitScore(cutTopic, isCorrect);
      switchScrollView()

    }

    /**
     * * 获取当前的className用于显示不同样式
     * @param topic
     * @returns {string} gray不能批改，checkedTopic当前选中，isCorrect已批改
     */
    const gridName = (topic = '') => {
      if (topic.questionId == query.questionId) {
        return 'checkedTopic'
      }
      if (!topic.id) {
        return 'gray'
      }
      if (topic.isCorrect) {
        return 'isCorrect'
      }
    }


    /**
     * 完成批改
     */
    const successCorrect = () => {
      this.resetNumbRemark()
      let index = -1
      existArr(findStudentListsByJobId) && findStudentListsByJobId.map((re, i) => {
        if (re.id == query.id) {
          index = i
        }
      })
      /**
       * 如果不为最后的学生则跳转到下一学生
       */
      let nextNewTopic = () => {
        if (index !== -1 && index + 1 != findStudentListsByJobId.length) {
          this.resetNumbRemark()
          query.id = findStudentListsByJobId[index + 1].id;
          query.questionId = undefined;
          pushNewPage(query, pathname, dispatch, 'replace')
        }
      };


      dispatch({
        type: namespace + '/correctionQuestion',
        payload: {
          id: query.topicId || undefined,
          score: inputValue || 0,
          comment: textInputValue || ''
        },
        callback: () => {
          dispatch({
            type: namespace + '/confirmCorrectionComplete',
            payload: {
              jobId: query.jobId,
              userId: query.id
            },
            callback: () => {
              message.success("完成当前学生批改")
              dispatch({
                type: namespace + '/correctionQuestion',
                payload: {
                  id: query.topicId || undefined,
                  score: inputValue || 0,
                  comment: textInputValue || ''
                },
                callback: () => {
                  this.resetNumbRemark()
                  message.success('提交成功')
                  dispatch({
                    type: namespace + '/findCorrectionLists',
                    payload: {
                      userId: query.id,
                      jobId: query.jobId
                    }
                  })
                  dispatch({
                    type: namespace + "/findStudentListsByJobId",
                    payload: {
                      jobId: query.jobId
                    }
                  })
                }
              })
              nextNewTopic()
            }
          })
        }
      })
    }

    //统计未批改的题目可未提交的题目
    const correctMassage = () => {
      let unCorrect = [];//未被批改的数组题号
      let unId = [];//学生未作答的题
      existArr(topicList) && topicList.map((cur, idx) => {
        if (!cur.isCorrect) {
          unCorrect.push(idx + 1)
        }
        if (!cur.id) {
          unId.push(idx + 1)
        }
      })
      unCorrect = existArr(unId) ? unCorrect.filter(re => !unId.includes(re)) : unCorrect
      const text = (arr, type) => {
        return existArr(arr) ? `当前${type ? '没有提交' : '未批改或者部分为零分'}的题是` + arr.join(',') + ',' : ''
      }
      return `${text(unCorrect) + text(unId, 1) + '请确认已经完成当前学生的批改'}`
    }


    /**
     * 得分
     */
    const inputNumValue = () => {
      let n = null;
      if (_topic.isCorrect) {
        n = Number(inputValue);
      } else if (inputValue) {
        n = Number(inputValue)
      }
      return n
    }

    // console.log('cccaa', _topic, !(_topic && _topic.id && !isCorrect))

    /**
    * 点击分数逻辑处理
    */
    const clickScoreToSubmit = (score) => {
      this.setState({
        inputValue: score,
        valueIsChange: !(_topic.isCorrect && Number(score) === Number(_topic.score))
      }, () => {
        lastNext(1, 2)
      })
    }
    const topicNum = (`${'第' + (_topic.index ? _topic.index + 1 : 1) + '题'}`)
    return (
      <div className={styles['cutBoard']}>
        <div className={styles['topicNum']}>
          <span>{`${!query.studentCorrect && query.jobType === '1' ? '满分' : topicNum}（${_topic.totalScore ? _topic.totalScore : ''}分）`}</span>
          {
            query.jobType === '1' ? '' :
              <>
                <span className={styles['downOutlined']}>
                  <DownOutlined />
                </span>
                <div className={styles['num']}>
                  {
                    topicList ? topicList.map((re, index) => (
                      <div key={index} className={styles['grid']} onClick={() => lastNext(index - _topic.index, 1)}>
                        <span className={`${styles[gridName(re)]}`}>
                          {index + 1}
                        </span>
                      </div>
                    )) : <Empty style={{ marginTop: 50 }} />
                  }
                </div>
              </>
          }
        </div>
        <div className={styles['mark']}>
          <div className={styles['goal']}>
            <span>得分：</span>
            <InputNumber
              style={{ width: '160px' }}
              ref={this.input}
              min={0}
              max={_topic.totalScore && Number(_topic.totalScore)}
              placeholder='分数'
              step={0.5}
              disabled={disabledInput}
              value={inputNumValue()}
              onChange={handlePoints}
            />
          </div>
          {/* <div className={styles['comment']}>
            <div className={styles['commentTitle']}>评语</div>
            <TextArea
              disabled={disabledInput}
              value={textInputValue}
              style={{height: '300px'}}
              onChange={writeRemark}
              maxLength={40}
              placeholder="输入最多40字"
              autoSize={{minRows: 2, maxRows: 5}}
            />
            {
              !(_topic && _topic.id) ? <div style={{color: 'red'}}>本题学生未提交无法批改</div> : ''
            }

          </div> */}
          <div className={styles['numeric-array-box']}>
            {
              numericArray.map((item) => {
                return <Button
                  type={_topic.isCorrect && Number(_topic.score) == item ? "primary" : 'default'}
                  key={item}
                  shape="circle"
                  disabled={disabledInput}
                  onClick={() => { clickScoreToSubmit(item) }}
                >
                  {item}
                </Button>
              })
            }
          </div>
        </div>
        <div className={styles['btn']}>
          <div className={styles['first']}>
            <div>
              {_topic.index ? <Button onClick={() => lastNext(-1)}>上一题</Button> : ''}
            </div>
            <div>
              {
                topicList.length - 1 !== _topic.index ?
                  <Button disabled={!topicList.length} onClick={() => lastNext(1)}>下一题</Button> :
                  <Button disabled={isCorrect} onClick={() => lastNext(0)}>提交</Button>
              }
            </div>
          </div>
          {
            query.jobType === '1' ? '' : <div className={styles['last']}>
              <Popconfirm style={{ width: '150px' }} disabled={isCorrect} placement="top" title={correctMassage()}
                onConfirm={successCorrect}
                okText="完成批改" cancelText="取消">
                <Button disabled={isCorrect} type='primary'>完成批改</Button>
              </Popconfirm>
            </div>
          }
        </div>
      </div>
    )
  }
}

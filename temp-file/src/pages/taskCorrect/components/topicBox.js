/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/9/3
 *@Modified By:
 * @updateAuthor:张江
 * @updateVersion:v1.0.1
 * @updateDate:2021年09月24日
 * @description 更新描述:路由由push->replace
 */
import React from 'react'
import styles from "./correctJob.less";
import { Empty, message,Image } from 'antd'
import { existArr, pushNewPage } from '@/utils/utils'
import TopicContent from "@/components/TopicContent/TopicContent";
import renderAnswerAnalysis from "@/components/RenderAnswerAnalysis";
import AnswerPlayback from "@/components/AnswerPlayback/AnswerPlayback";
import { connect } from 'dva'
import RenderMaterial from '@/components/RenderMaterial/index'
import { TaskCorrect as namespace } from "@/utils/namespace";


@connect(state => ({}))
export default class TopicBox extends React.Component {
  state = {
    topicList: [],//题目列表
    unfoldState: [],//题目详情展开组
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  componentWillUnmount() {
    this.setState({ topicList: [], unfoldState: [] })
  }

  static getDerivedStateFromProps(props, state) {
    const dif = (data) => JSON.stringify(data);
    if (existArr(props.topicList) && dif(props.topicList) !== dif(state.topicList)) {
      const unfoldState = () => {
        let unfoldArr = [];
        props.topicList.map((re, index) => {
          if (re.isObjective === 1 || existArr(re.pointData)) {
            unfoldArr.push(index)
          }
        });
        return unfoldArr
      }
      return {
        topicList: props.topicList,
        unfoldState: unfoldState()
      }
    }
    return null;
  }


  render() {
    const { topicList, location: { query }, dispatch, cutBoardRef, student, inputFocus } = this.props
    const { resetNumbRemark = () => undefined, submitScore = () => undefined } = cutBoardRef;
    const { unfoldState } = this.state;
    /**
     * 将题目下标存入state，存在则展开，不存在则关闭
     * @param index
     */
    const handelUnfold = (index) => {
      let _unfoldState = [...unfoldState]
      const unfoldIndex = _unfoldState.indexOf(index);
      if (unfoldIndex === -1) {
        _unfoldState.push(index)
      } else {
        _unfoldState.splice(unfoldIndex, 1)
      }
      this.setState({ unfoldState: _unfoldState })
    }

    /**
     * 切换题目同时重置掉打分框内容
     * @param topic
     * @param resetNumbRemark
     */
    const handleCutQuestion = (topic, resetNumbRemark) => {
      if ((query.questionId != topic.questionId) && query.topicId && (!student?.isCorrect)) {
        submitScore()
      }
      resetNumbRemark()
      pushNewPage(
        {
          ...query,
          questionId: topic.questionId,
          topicId: topic.id ? topic.id : undefined
        },
        '/correctJob', dispatch, 'replace')
      inputFocus()
    }
    return (
      <div className={styles['topicBox']} id={'taskCorrectTopicBox'}>
        {
          topicList ? topicList.map((topic, index) => (
            <div ref={topic.questionId + topic.id} key={index}
              className={`${styles['topic']} ${topic.questionId == query?.questionId && topic.id == query?.topicId ? styles['checkedTopic'] : ''}`}
              onClick={() =>
                handleCutQuestion(topic, resetNumbRemark)
              }>
              <div className={styles['contentBox']}>
                <div className={styles['materials']}>
                  <div className={styles['fold']}>
                    {RenderMaterial(topic)}
                  </div>
                </div>
                <TopicContent
                  showMultiple={true}
                  optionColor={true} topicContent={topic} contentFiledName={'content'}
                  optionsFiledName={"options"} optionIdFiledName={"code"} />
              </div>
              <div className={styles['unfoldShrink']}>
                <a onClick={() => handelUnfold(index)}>答案和解析</a>
                <a onClick={() => handelUnfold(index)}>展开/收起</a>
              </div>
              <div className={`${unfoldState.includes(index) ? styles['element'] : styles['offElement']}`}>
                {
                  //studentAnswerx可能存在主观题图片，在客观题不显示

                  topic?.isObjective && topic?.studentAnswer ?
                    <div className={styles['answerImg']}>
                      <div>学生答案</div>
                      {
                        topic.studentAnswer.split(',').length>0?
                          <section>
                          <Image.PreviewGroup style={{marginRight:'10px'}} >
                            {
                              topic.studentAnswer.split(',').map((imgAnswer,index)=><div key={index} style={{marginRight:'5px',display:'inline-block'}}> <Image  key={index} height={80}  width={80}
                                src={imgAnswer} alt='答案'/> </div>)
                            }
                          </Image.PreviewGroup>
                          </section>
                        :'数据加载中……'
                      }
                      {/*<img className={styles['studentAnswer']} alt='答案' src={imgAnswer} />*/}
                    </div> : ''
                }

                {topic?.pointData ? <div className={styles['AnswerBackBox']}>
                  {/* topic.isObjective */}
                  {Object.keys(topic).length && existArr(topic.pointData) && !(topic?.isObjective && topic?.studentAnswer) ?
                    <AnswerPlayback
                      index={index}
                      isPlayback={false}
                      ref='answerPlaybackDom'
                      query={query}
                      answerTrajectory={topic ? topic.pointData : []}
                      penType={topic.penType || topic?.pointData[0]?.penType || 1} /> : null}
                </div> : ''}
                {
                  topic?.studentAnswer && !topic?.isObjective ? <div className={styles['answerImg']} style={{ flexDirection: 'row' }}>
                    <div>学生答案：</div>

                    <span style={{ color: 'red', marginTop: '3px' }}>{topic?.studentAnswer}</span>
                  </div> : ''
                }
                {!topic?.pointData && !topic?.studentAnswer ? <div className={styles['answerImg']}>
                  <div>学生答案</div>
                  <span style={{ color: 'red', marginTop: '10px' }}>该学生未作答</span>
                </div> : ''}
                {renderAnswerAnalysis(topic, 1)}
              </div>
            </div>
          )) : <Empty style={{ marginTop: 150 }} />
        }
      </div>
    )
  }
}

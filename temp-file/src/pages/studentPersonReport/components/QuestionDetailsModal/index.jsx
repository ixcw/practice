/**
* 题目详情弹窗
* @author:张江
* @date:2021年03月15日
* @version:v1.0.0
* */
import React from 'react'
import { connect } from 'dva'
import {
  Modal,
  message,
  Spin
} from 'antd'
import { StudentPersonReport as namespace } from "@/utils/namespace";
import TopicContent from "@/components/TopicContent/TopicContent";
import ParametersArea from '@/components/QuestionBank/ParametersArea';//
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
import AnswerPlayback from "@/components/AnswerPlayback/AnswerPlayback";//作答轨迹显示
import { existArr, getLocationObj } from "@/utils/utils";
import styles from './index.less'

@connect(state => ({
  questionDetailLoading: state[namespace].questionDetailLoading,//加载中
  questionInfo: state[namespace].questionInfo
}))
export default class QuestionDetailsModal extends React.Component {

  constructor(props) {
    super(...arguments);
    this.state = {
      isModalVisible: false,//modal开关状态
      basicInfo: null,
      evalContent: '',
    }
  }

  componentDidMount() {
    this.props.getRef(this)
  }


  /**
   * 开关
   * @param state
   */
  handleOnOrOff = (state, basicInfo) => {
    const { dispatch, location } = this.props;
    const _location = getLocationObj(location);
    const { query = {} } = _location || {};
    if (state && basicInfo) {
      this.setState({ isModalVisible: state, basicInfo });
      dispatch({// 显示加载数据中
        type: namespace + '/saveState',
        payload: { questionDetailLoading: true }
      });
      //统计微课上传量
      dispatch({
        type: namespace + '/findStudentResponseDetail',
        payload: {
          questionId: basicInfo.questionId,
          studentId: query.id,
          jobId: query.jobId,
        },
        // callback: (result) => {
        //   dispatch({// 显示加载数据中
        //     type: namespace + '/saveState',
        //     payload: { questionDetailLoading: false }
        //   });
        // }
      });
    } else {
      this.setState({
        isModalVisible: state,
        basicInfo: null,
      }
      )
    }
  }


  render() {
    const { questionDetailLoading, questionInfo = {} } = this.props
    const { isModalVisible } = this.state;

    return (
      <Modal
        className={styles['question-details-answer-modal']}
        width={'78%'}
        title={`题目详情`}
        visible={isModalVisible}
        footer={null}
        onCancel={() => this.handleOnOrOff(false)}>
        <Spin tip="正在加载..." spinning={!!questionDetailLoading}>
          <div className='question-details-answer'>
            {
              RenderMaterialAndQuestion(questionInfo, true, (RAQItem) => {
                return (<div>
                  <TopicContent topicContent={RAQItem}
                    contentFiledName={'content'}
                    optionsFiledName={"optionList"}
                    optionIdFiledName={"code"}
                  />
                  {
                    RAQItem.studentAnswer && RAQItem.isObjective ? <div className='answer-show-box'>
                      <div>
                        <span className='my-answer'>学生答案： </span>
                        <img className={'my-answer-img'} alt='答案图片' src={RAQItem.studentAnswer} />
                      </div>
                    </div> : <div className='answer-show-box'>
                      {/* && RAQItem.isObjective */}
                        {Object.keys(RAQItem).length && existArr(RAQItem.pointData) && !(RAQItem?.isObjective && RAQItem?.studentAnswer) ?
                        <AnswerPlayback
                          index={1}
                          isPlayback={false}
                          ref='answerPlaybackDom'
                          // query={query}
                          answerTrajectory={RAQItem.pointData}
                          penType={RAQItem.penType || RAQItem?.pointData[0]?.penType || 1} /> : null}
                      {
                        RAQItem.isObjective || !RAQItem.studentAnswer ? null : <div style={{ paddingTop: '12px' }}><span className='my-answer'>学生答案： </span><span>{RAQItem.studentAnswer}</span></div>
                      }
                    </div>
                  }
                </div>)
              },
                (RAQItem) => {
                  return <div>
                    <ParametersArea QContent={RAQItem} styleObject={{
                      borderTop: 'none',
                      // borderBottom: '1px solid #ddd',
                      // marginBottom: '20px'
                    }} />
                  </div>;
                },
              )
            }
          </div>
        </Spin>
      </Modal>
    )
  }
}

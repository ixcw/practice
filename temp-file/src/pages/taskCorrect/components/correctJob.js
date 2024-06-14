/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/8/27
 *@Modified By:
 * @updateAuthor:张江
 * @updateVersion:v1.0.1
 * @updateDate:2021年09月24日
 * @description 更新描述:路由由push->replace
 */
import React from 'react'
import styles from './correctJob.less'
import { Input, Spin, Button, message } from 'antd';
import { connect } from 'dva'
import { existArr, existObj, replaceSearch, getLocationObj, pushNewPage } from '@/utils/utils'
import { TaskCorrect as namespace } from '@/utils/namespace'
import { DownOutlined, DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons'
import StudentList from "./studentList";
import CutBoard from "./cutBoard";
import TopicBox from "./topicBox";

const { Search } = Input;

@connect(state => ({
  findStudentListsByJobId: state[namespace].findStudentListsByJobId,//通过jobId获取学生列表
  findCorrectionLists: state[namespace].findCorrectionLists,//获取学生作答试卷
  loading: state[namespace].loading
}))
export default class CorrectJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      switchStatus: true,//学生列表开关
    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { query } = getLocationObj(location);
    if (query.jobId) {
      dispatch({
        type: namespace + "/findStudentListsByJobId",
        payload: {
          jobId: query.jobId
        },
        callback: (result) => {
          if (existArr(result)) {
            let tempItem = {};
            if (query.id) {//解决刷新出现的BUG 取指定的学生信息 2021年11月17日 张江加
              for (let item of result) {
                if (item.id == query.id) {
                  tempItem = item;
                  break
                }
              }
            }
            setTimeout(() => {
              pushNewPage({
                ...query,
                id: tempItem.id ? tempItem.id : result[0].id,//学生id
                studentCorrect: tempItem.id ? tempItem.isCorrect || undefined : result[0].isCorrect || undefined,//学生批阅状态
              }, '/correctJob', dispatch, 'replace')
            }, 100)
          }
        }
      })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    const { findCorrectionLists: _findCorrectionLists } = nextProps;
    const { findCorrectionLists, location, dispatch } = this.props;
    const { query } = getLocationObj(location);

    //切换题目获取当前题目数据
    if (query.questionId && (nextProps.findCorrectionLists || findCorrectionLists)) {
      let _findCorrectionLists = findCorrectionLists;
      if (nextProps.findCorrectionLists) {
        _findCorrectionLists = nextProps.findCorrectionLists;
      }
      let topic = _findCorrectionLists && (_findCorrectionLists.length > 0) && _findCorrectionLists.filter(re => (re.questionId).toString() === query.questionId)[0];
      this.setState({ topic })
    }


    if (nextProps.findCorrectionLists && !(query.questionId) && JSON.stringify(nextProps.findCorrectionLists) !== JSON.stringify(findCorrectionLists) && nextProps.findCorrectionLists.length > 0) {
      let topic = nextProps.findCorrectionLists[0];
      //刚进入页面获取当前题目数据
      query.questionId = topic.questionId;
      query.topicId = topic.id ? topic.id : undefined;
      pushNewPage(query, '/correctJob', dispatch, 'replace')
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: namespace + '/set',
      payload: {
        findCorrectionLists: [],
        findStudentListsByJobId: []
      }
    })
  }

  /**
   * 获取cutBoard的ref
   * @param ref
   */
  getCutBoardRef = (ref) => {
    this.cutBoardRef = ref
  }

  /**
   * 获取TopicBox的ref
   * @param ref
   */
  getTopicBoxRef = (ref) => {
    this.topicBoxRef = ref
  }


  render() {
    const { location, findStudentListsByJobId, loading, findCorrectionLists, dispatch } = this.props;
    const { switchStatus } = this.state;
    const { query } = getLocationObj(location) || {}
    const _location = getLocationObj(location);
    const _findStudentListsByJobId = existArr(findStudentListsByJobId) ? [...findStudentListsByJobId] : '';//学生列表
    const _findCorrectionLists = existArr(findCorrectionLists) ? [...findCorrectionLists] : '';//题目列表
    const student = existArr(_findStudentListsByJobId) ? _findStudentListsByJobId.filter(re => re.id == query.id)[0] : {};//当前学生
    const topic = existArr(_findCorrectionLists) ? _findCorrectionLists.filter((re, index) => {
      re.index = index;
      return re.questionId == query.questionId
    })[0] : {}


    /**
     * 学生列表开关方法
     */
    const handleSwitchStatus = () => {
      this.setState({
        switchStatus: !switchStatus
      })
    }

    const getNewTopic = () => {
      dispatch({
        type: namespace + `${query.studentCorrect ? '/findCorrectionLists' : '/findAllWaitingCorrectQuestions'}`,
        payload: {
          userId: query.id === '0' ? undefined : query.id,
          jobId: query.jobId
        }
      })
      dispatch({
        type: namespace + "/findStudentListsByJobId",
        payload: {
          jobId: query.jobId
        },
        callback: () => {
          message.success('刷新成功')

        }
      })
    }

    return (
      <div style={{ overflow: 'hidden' }}>
        <Spin spinning={!!loading}>
          <div className={styles['correctJob']}>
            <div className={styles['studentBox']}>
              <div className={styles['title']}>
                学生列表
              </div>
              <StudentList
                cutBoardRef={this.cutBoardRef}
                switchStatus={switchStatus}
                topicList={_findCorrectionLists}
                resetNumbRemark={this.cutBoardRef ? this.cutBoardRef.resetNumbRemark : {}}
                location={_location}
                studentList={_findStudentListsByJobId} />
              <DoubleRightOutlined onClick={handleSwitchStatus}
                className={`${switchStatus ? styles['doubleRightOutlined'] : styles['doubleLightOutlined']}`} />
            </div>
            <div className={styles['correctContent']}>
              <div style={query.id === '0' ? { justifyContent: 'flex-end' } : {}} className={styles['title']}>
                {
                  query.id === '0' ? '' : <div className={styles['leftBox']}>
                    <div className={styles['name']}>
                      <span>{`姓名：${student && student.userName ? student.userName : ''}`}</span>
                    </div>
                    <div className={styles['score']}>
                      <span>{`目前总得分：${student && student.score ? student.score : 0}`}</span>
                    </div>
                  </div>
                }
                <div className={styles['rightBox']}>
                  {query.jobType === '1' ? <Button shape={'round'} onClick={getNewTopic}>刷新题目</Button> : ''}
                </div>
              </div>
              <div className={styles['correctBox']}>
                <TopicBox
                  inputFocus={this.cutBoardRef ? this.cutBoardRef.inputFocus : () => undefined}
                  cutBoardRef={this.cutBoardRef ? this.cutBoardRef : {}}
                  onRef={this.getTopicBoxRef}
                  student={student}
                  topicList={_findCorrectionLists} location={_location} />
                <CutBoard student={student}
                  findStudentListsByJobId={_findStudentListsByJobId}
                  topicBoxRef={this.topicBoxRef}
                  onRef={this.getCutBoardRef}
                  topic={topic} topicList={_findCorrectionLists}
                  location={_location} />
              </div>
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}

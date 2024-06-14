/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/8/25
 *@Modified By:
 */
import React from 'react'
import styles from './checkTopicList.less'
import TopicList from "@/components/TopicList/topicList";
import KnowledgeList from "@/components/KnowledgeList/KnowledgeList";
import { existArr, existObj } from '@/utils/utils'
import { connect } from 'dva'
import { Empty } from 'antd'
import { AssignTask as namespace } from '@/utils/namespace'

@connect(state => ({ findQuestionByKnowId: state[namespace].findQuestionByKnowId }))
export default class CheckTopicList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkArr: [],//选中的题目数组
      checkName: '',//知识点名称
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }


  render() {
    const { location, dispatch, findQuestionByKnowId } = this.props;
    const { checkArr = [] } = this.state
    const _findQuestionByKnowId = existArr(findQuestionByKnowId) ? [...findQuestionByKnowId] : []
    /**
     * 选择或取消当前题目
     * @param item
     */
    const handleTopic = (item) => {
      const _checkArr = [...checkArr];
      let index = -1;
      _checkArr.map((re, i) => {
        if (re.questionId == item.id) {
          index = i
        }
      });
      if (index !== -1) {
        _checkArr.splice(index, 1)
      } else {
        _checkArr.push({
          questionId: item.id,
          score: 5,
          code: item.topicCode,
          questionCategory: item.category
        })
      }
      this.setState({
        checkArr: _checkArr
      })
    }
    /**
     * 全选反选取消
     * @param type all去选，re反选，cancel取消
     */
    const check = (topicLists, type) => {
      const { checkArr } = this.state;
      let _checkArr = [...checkArr];
      let _checkArrId = _checkArr.map(re => re.questionId)
      const _topicLists = existArr(topicLists) ? topicLists : ''
      switch (type) {
        case 'all':
          _checkArr = _topicLists ? _topicLists.map(re => ({
            questionId: re.id,
            score: 5,
            code: re.topicCode,
            questionCategory: re.category
          })) : []
          break;
        case 're':
          _checkArr = _topicLists.filter(re => !_checkArrId.includes(re.id)).map(re => ({
            questionId: re.id,
            score: 5,
            code: re.topicCode,
            questionCategory: re.category
          }))
          break;
        case 'cancel':
          _checkArr = []
          break;
        default:
      }
      this.setState({ checkArr: _checkArr })
    }
    /**
     * 点击树形结构回调
     * @param info
     */
    const getSelectedParam = (info) => {
      if(!info.node){
        dispatch({
          type:namespace+'/set',
          payload:{
            findQuestionByKnowId:[]
          }
        })
      }
      if (info) {
        if (existObj(info.node)) {
          dispatch({
            type: namespace + '/findQuestionByKnowId',
            payload: {
              knowId: info.node.key
            }
          })
          this.setState({ checkArr: [], checkName: info.node.name })
        }
      } else if (info.checkedNodes && existArr(info.checkedNodes)) {
        const checkedNodesJson = info.checkedNodes[0];
        if (existObj(checkedNodesJson) && !existArr(info.childList)) {
          dispatch({
            type: namespace + '/findQuestionByKnowId',
            payload: {
              knowId: checkedNodesJson.id
            }
          })
          this.setState({ checkArr: [], checkName: checkedNodesJson.name })
        }
      }
    }

    /**
     * 修改分数
     * @param id 下标
     * @param value 分数
     */
    const handleInputNumber = (id, value) => {
      const { checkArr } = this.state;
      const _checkArr = [...checkArr]
      _checkArr.map(re => {
        if (re.questionId == id) {
          re.score = value
        }
      })
      this.setState({ checkArr: _checkArr })
    }


    const checkObj = (checkArr, id) => {
      return checkArr.filter(re => re.questionId == id)[0]
    }

    return (
      <div className={styles['checkTopicList']}>
        <KnowledgeList type={1} location={location} getSelectedParam={getSelectedParam} />
        <div className={styles['topicBox']}>
          <div className={styles['aTag']}>
            <a onClick={() => check(_findQuestionByKnowId, 'all')}>全选</a>
            <a onClick={() => check(_findQuestionByKnowId, 're')}>反选</a>
            <a onClick={() => check(_findQuestionByKnowId, 'cancel')}>取消选择</a>
          </div>
          <div className={styles['topicLists']}>
            {
              _findQuestionByKnowId.length ? _findQuestionByKnowId.map((re, index) => <TopicList
                handleInputNumber={handleInputNumber}
                value={existObj(checkObj(checkArr, re.id)) ? checkObj(checkArr, re.id).score : 5}
                isCheck={!!checkArr.filter(item => item.questionId == re.id)[0]}
                key={re.id}
                onCheck={() => handleTopic(re)}
                topic={re}
              />) : <Empty style={{marginTop:150}} />
            }
          </div>
        </div>
      </div>
    )
  }
}

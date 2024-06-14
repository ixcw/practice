/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/8/25
 *@Modified By:
 */
import React from 'react'
import PropTypes from 'prop-types';
import styles from './topicList.less'
import {InputNumber} from 'antd'
import {existObj} from '@/utils/utils'
import TopicContent from "../TopicContent/TopicContent";
import renderAnswerAnalysis from "../RenderAnswerAnalysis";

export default class TopicList extends React.Component {
  static propTypes = {
    topic: PropTypes.object,//题目信息
    styles: PropTypes.object,//自定义样式
    isCheck: PropTypes.bool,//选中项
    onCheck: PropTypes.func,//点击事件
    value: PropTypes.number,//评分
    handleInputNumber: PropTypes.func,//修改分数
  }

  constructor(props) {
    super(props);
    this.state = {
      isUpOrDown: false,
      num: 5
    };
  }

  /**
   * 是否撑开题目全部信息
   * @param isUpOrDown  ：是/否
   * @param e
   */
  upToDown = (e, isUpOrDown) => {
    // // 阻止合成事件的冒泡
    e.stopPropagation && e.stopPropagation();
    this.setState({
      isUpOrDown: isUpOrDown
    })
  }


  render() {
    const {isCheck = false, topic = {}, onCheck = () => undefined, value, handleInputNumber} = this.props;
    const {isUpOrDown, num} = this.state;
    /**
     *
     * @param id
     * @param num
     */
    const putScore = (e) => {
      // // 阻止合成事件的冒泡
      e.stopPropagation && e.stopPropagation();
    }
    return (
      <div id={styles['topicList']} >
        <div className={`${styles['radio']} ${isCheck ? styles['checkRadio'] : ''}`}>
          <span onClick={() => onCheck(topic.id)}/>
        </div>
        <div className={styles['topicAnalysis']}>
          <div className={styles['hidden-content']}>
            <TopicContent topicContent={topic} contentFiledName={'content'}
                          optionsFiledName={"optionList"} optionIdFiledName={"code"}/>
            <div className={`${isUpOrDown ? styles['element'] : styles['offElement']}`}>
              {renderAnswerAnalysis(topic, 1)}
            </div>
          </div>
          <div className={styles['question-buttom']}>
            <span onClick={(e) => {
              this.upToDown(e, !isUpOrDown)
            }}>答案和解析</span>
            <span>
              <span>{`难度：${topic.diffName?topic.diffName:'未知'}`}</span>
              <span>
                <span>分数：</span>
                 <InputNumber
                   value={value}
                   size="small"
                   min={0}
                   max={100}
                   disabled={!isCheck}
                   formatter={value => `${value}分`}
                   parser={value => value.replace('分', '')}
                   onClick={putScore}
                   onChange={(num) => handleInputNumber(topic.id, num)}
                 />
              </span>
            </span>
          </div>
        </div>
      </div>
    )
  }
}

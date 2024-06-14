/**
* 预览打印-题目大题标题
* @author:张江
* @date:2020年09月01日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { uppercaseNum, existArr, calQuestionNum } from '@/utils/utils';
import styles from './index.less';

export default class BigTopicInfo extends React.Component {
  static propTypes = {
    tItem: PropTypes.object.isRequired,//信息
    tIndex: PropTypes.number.isRequired,//信息
    isEdit: PropTypes.bool,//是否可编辑
  };


  constructor() {
    super(...arguments);
    this.state = {};
  }

  /**
  * 计算分数
  */
  calScore = (list) => {
    let totlaScroe = 0;
    list && list.map((item) => {
      if (existArr(item.materialQuestionList)) {
        item.materialQuestionList.map((cItem) => {
          totlaScroe += cItem.score;
        })
      } else {
        totlaScroe += item.score;
      }
    })
    return totlaScroe;
  }

  render() {
    const {
      tItem,
      tIndex,
      isEdit = true,
    } = this.props;

    return (
      <div className={styles['big-topic-info']}>
        {/* contentEditable={isEdit} suppressContentEditableWarning={isEdit} */}
        {
          tItem.rule == 4 ?//解答题的情况
            <div className={'question-type'}>
              {
                tItem.categoryName
                  ? `${uppercaseNum(tIndex + 1)}、${tItem.categoryName}`
                  : "未知题型"}
              （
              本大题共{calQuestionNum(tItem.questionList)}小题,
              共{this.calScore(tItem.questionList)}分） {
                isEdit ? ';请把答案填在指定的虚线区域,否则视为无效' : ''
              }
            </div> : <div className={'question-type'} >
              {/* contentEditable={isEdit} suppressContentEditableWarning={isEdit} */}
              {
                tItem.categoryName
                  ? `${uppercaseNum(tIndex + 1)}、${tItem.categoryName}`
                  : "未知题型"}
              （
              本大题共{calQuestionNum(tItem.questionList)}小题,
              每题{tItem.questionList[0] && existArr(tItem.questionList[0].materialQuestionList) ? tItem.questionList[0]?.materialQuestionList[0]?.score : tItem.questionList[0]?.score}分,
              共{this.calScore(tItem.questionList)}分） {
                isEdit ? ';请把答案填在指定的虚线区域,否则视为无效' : ''
              }
            </div>
        }
      </div>
    )
  }
}


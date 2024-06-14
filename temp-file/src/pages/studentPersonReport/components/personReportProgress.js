/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/10/15
 *@Modified By:
 */
import React from 'react'
import styles from './personReportProgress.less'
import {Progress} from "antd";
import {existObj} from "@/utils/utils";
import PropTypes from "prop-types";

export default class PersonReportProgress extends React.Component{
  static propTypes = {
    reportTotalScore: PropTypes.object,//学生得分
  }
  render() {
    const {reportTotalScore={}} = this.props;
    const percentNmb = (score) => score ? ((score.score / score.totalScore).toFixed(2)) * 100 : 0; //计算分数百分比
    return(
      <div className={styles['personReportProgress']}>
        <div className={styles['gradeEvaluate']}>
          <div className={styles['score']}>
            <div className={styles['boxL']}>
              <Progress
                strokeColor='#579cf4'
                className='gradeProgress'
                strokeLinecap="square"
                strokeWidth={15}
                width={250}
                type="circle"
                percent={percentNmb(reportTotalScore)}
                format={percent => (
                  <div className='gradeBox'>
                    <div><span>{reportTotalScore.score ? reportTotalScore.score : 0}</span></div>
                    <div>
                      <span style={{color: "#a8a8a8"}}>{reportTotalScore.standard}</span>
                    </div>
                  </div>
                )}/>
            </div>
            <div>满分：{reportTotalScore.totalScore ? reportTotalScore.totalScore : 0} 分</div>
          </div>
          <div className={styles['evaluate']}>
            <img className={styles['evaluateImg']} src="https://reseval.gg66.cn/personal-triangle.png" alt=""/>
          </div>
        </div>
      </div>
    )
  }
}

/**
 *@Author:ChaiLong
 *@Description:报告列表
 *@Date:Created in  2020/9/2
 *@Modified By:
 */
import React from 'react'
import {dealTimestamp, existArr, existObj, getIcon, pushNewPage} from "@/utils/utils";
import queryString from 'query-string'
import styles from './reportList.less'
import {Button, Empty, Tag} from "antd";
import {connect} from 'dva'


const IconFont = getIcon();
@connect(state => ({}))
export default class ReportList extends React.Component {
  render() {
    const {data, dispatch, location} = this.props;
    const {search} = location;
    const query = existObj(queryString.parse(search)) ? queryString.parse(search) : {};
    return (
      <div className={styles['reportList']}>
        {
          existArr(data) ? data.map(item => {
            return (
              <div key={item.jobId} className={styles['report-item']}>
                <div className={styles['left']}>
                  <span>{item.score ? item.score : 0}</span>
                  <label>分</label>
                </div>
                <div className={styles['right']}>
                  <div className={styles['title']}>
                    <div>
                      {item.name || '暂无标题'}
                      {/* {item.equities ? '' :
                        <IconFont style={{fontSize: 28, marginLeft: 10, lineHeight: '28px'}} type='icon-vip-f'/>} */}
                    </div>
                    {
                      item.paperFrom === 1 ? <Tag color="#2db7f5">数据入库</Tag> : ''
                    }
                  </div>
                  <div className={styles['time-oper']}>
                                                <span>
                                                    报告生成时间：{dealTimestamp(item.createTime, 'YYYY-MM-DD HH:mm')}
                                                </span>
                    <div className={styles['oper-box']}>
                      {/*<Button type="primary" onClick={() => {*/}
                      {/*}}>下载报告</Button>*/}
                      <Button type="primary"
                              onClick={() => pushNewPage({
                                id: query.id,
                                jobId: item.jobId,
                                classId: item.classId,
                                userId: item.userId,
                                paperId: item.paperId,
                                jobType: item.jobType,
                                equities: item.equities ? 1 : 0//是否有权限查看报告
                              }, '/studentPersonReport', dispatch)}>
                        个人报告
                      </Button>
                      <Button type="primary"
                              onClick={() => pushNewPage({
                                id: query.id,
                                classId: item.classId,
                                userId: item.userId,
                                jobId: item.jobId,
                                jobType: item.jobType,
                                paperId: item.paperId,
                              }, '/testReport', dispatch)}>
                        班级报告
                      </Button>
                      {
                        item.paperFrom === 1 ? <Button type="primary"
                                                       onClick={() => pushNewPage({
                                                         jobId: item.id,//年级报告传入的是id
                                                         paperId: item.paperId,
                                                         jobType: item.jobType,
                                                       }, '/gradeReport', dispatch)}>
                          年级报告
                        </Button> : ''
                      }
                      <Button type="primary"
                              onClick={() => pushNewPage({
                                id: query.id,
                                classId: item.classId,
                                userId: item.userId,
                                jobId: item.jobId,
                                jobType: item.jobType,
                                equities: item.equities ? 1 : 0//是否有权限查看报告
                              }, '/mistakeTopicReport', dispatch)}>
                        错题报告
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            )
          }) : <Empty style={{marginTop: '180px'}}/>
        }
      </div>
    )
  }
}

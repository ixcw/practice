/**
 *@Author:ChaiLong
 *@Description: 题目分析
 *@Date:Created in  2020/10/15
 *@Modified By:
 */

import React from 'react'
import styles from './subjectAnalyse.less'
import {Table, Rate, Tooltip} from 'antd'
import PropTypes from 'prop-types'

export default class SubjectAnalyse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paperAnalysisDetails: [],//题目分析数据
      visible:false,//折叠状态
    }
  }

  static propTypes = {
    paperAnalysisDetails: PropTypes.array,//题目分析数据
  }

  componentDidMount() {
    const {paperAnalysisDetails} = this.props;
    const _paperAnalysisDetails=[...paperAnalysisDetails];
    _paperAnalysisDetails.sort((a,b)=>(a.id-b.id))
    this.setState({paperAnalysisDetails:_paperAnalysisDetails})
  }

  render() {
    const {paperAnalysisDetails,visible} = this.state;
    const columns = [
      {
        title: '题目编号',
        dataIndex: 'code',
        key: 'name',
        align: 'center'
      },
      {
        title: '题型',
        dataIndex: 'category',
        key: 'category',
        align: 'center'
      },
      {
        title: '知识点',
        dataIndex: 'knowledges',
        key: 'knowledges',
        align: 'center',
        onCell: () => {
          return {
            style: {
              maxWidth: 200
            }
          }
        },
        render: (text) => {
          return (
            <Tooltip placement="topLeft" title={text}>
              <div style={{WebkitLineClamp: 2}} className={styles['knowledgesText']}>{text}</div>
            </Tooltip>
          )
        }
      },
      {
        title: '满分',
        key: 'totalScore',
        dataIndex: 'totalScore',
        align: 'center'
      },
      {
        title: '个人得分',
        key: 'studentScore',
        dataIndex: 'studentScore',
        align: 'center'
      },
      {
        title: '个人得分率',
        key: 'scoreRate',
        dataIndex: 'scoreRate',
        align: 'center',
        render:(text)=><div>{text}%</div>
      },
      {
        title: '班级得分率',
        key: 'classScoreRate',
        dataIndex: 'classScoreRate',
        align: 'center',
        render:(text)=><div>{text}%</div>
      },
      {
        title: '难度',
        key: 'difficultyVal',
        dataIndex: 'difficultyVal',
        align: 'center',
        render: (text) => {
          return (<Rate disabled defaultValue={text}/>)
        }
      },
    ];

    return (
      <div className={styles['subjectAnalyse']}>
        <Table rowKey='id' className={`${visible?styles['subjectAnalyseTable']:''}`} pagination={false} columns={columns} dataSource={paperAnalysisDetails}/>
        {paperAnalysisDetails.length > 10 ?
          <div onClick={() =>{this.setState({visible:!visible})}} className={styles['fold']}>{visible ? "收起" : "展开"}</div> : ''}
      </div>
    )
  }
}

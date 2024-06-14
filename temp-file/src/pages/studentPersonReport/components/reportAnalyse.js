/**
 *@Author:ChaiLong
 *@Description:知识点分析
 *@Date:Created in  2020/10/13
 *@Modified By:
 */

import React from 'react';
import styles from './reportAnalyse.less'
import {Table, Tooltip, Tag} from 'antd';
import PropTypes from 'prop-types'
import ExpertsConcluded from "./expertsConcluded";

export default class ReportAnalyse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advantageReport: [],//优势知识点
      weaknessReport: [],//劣势知识点
      excellent: [],//优秀知识点80%以上
      feeble: [],//弱项知识点40%以下
      weaknessVisible: false,//劣势折叠开关
      advantageVisible: false,//优势折叠开关
      evaluateData: {},//专家评论
    }
  }

  static propTypes = {
    findKnowledgePointAnalysis: PropTypes.array,//知识点分析所需优势知识点和劣势知识点
    subject: PropTypes.string,//科目
  }

  componentDidMount() {
    const {findKnowledgePointAnalysis = [], subject = ''} = this.props;
    let advantageReport = [];//优势知识点
    let weaknessReport = [];//劣势知识点
    let excellent = [];//优秀知识点80%以上
    let feeble = [];//弱项知识点40%以下
    const joinArr = (arr) => {
      return Array.from(new Set(arr.map(re => re.knowledges).join(",").split(",").filter(Boolean)));
    }
    const _findKnowledgePointAnalysis = [...findKnowledgePointAnalysis];
    _findKnowledgePointAnalysis && _findKnowledgePointAnalysis.map(re => {
      if (re.type === 1) {
        re.code = advantageReport.length + 1;
        advantageReport.push(re)
      } else {
        re.code = weaknessReport.length + 1;
        weaknessReport.push(re)
      }
      if (re.rating === "优分") {
        excellent.push(re)
      }
      if (re.rating === "低分") {
        feeble.push(re)
      }
    })
    let evaluateData = this.evaluate(joinArr(advantageReport), joinArr(weaknessReport), joinArr(excellent), joinArr(feeble), subject)
    this.setState({advantageReport, weaknessReport, excellent, feeble, evaluateData})
  }


  /**
   * 通过知识点遍历出专家评价
   * @param advantageReport 优势知识点
   * @param weaknessReport 劣势知识点
   * @param excellent 优秀知识点80%以上
   * @param feeble 弱项知识点40%以下
   * @param subject 科目
   */
  evaluate = (advantageReport, weaknessReport, excellent, feeble, subject) => {
    let tagArr = {subTitle1: '', subTitle2: ''};
    tagArr.subTitle1 = (
      <div>
        {`根据${subject}学科课程标准和测试数据。`}
        {excellent.length ? <>您在{excellent.map((re, index) => <Tag key={index}
                                                                   color="#2db7f5">{re}</Tag>)}共{excellent.length}个知识点上的掌握程度为优秀（得分率80%及以上）;</>
          :
          '您没有优秀（得分率80%及以上）的知识点'
        }
        {
          feeble.length ? <>您在{feeble.map((re, index) => <Tag key={index}
                                                              color="#f50">{re}</Tag>)}方面共{feeble.length}个知识点上掌握的程度为低分（得分率在40%以下）,这些知识点是您的弱项,需要加强学习！</>
            :
            '您没有低分知识点。'
        }
      </div>
    )

    tagArr.subTitle2 = (
      <div>
        与同班同学相比,
        {advantageReport.length ? <>您在{advantageReport.map((re, index) => <Tag key={index}
                                                                               color="#2db7f5">{re}</Tag>)}共{advantageReport.length}个知识点上的掌握程度超过平均水平，这些是您在知识点方面的优势，希望您继续保持。</>
          :
          '您没有掌握程度超平均水平的知识点。'
        }
        {
          weaknessReport.length ? <>您在{weaknessReport.map((re, index) => <Tag key={index}
                                                                              color="#f50">{re}</Tag>)}方面共{weaknessReport.length}个知识点上掌握的程度低于平均水平,这些是您在题型上的弱项,是您需要着重解决的问题！</>
            :
            '您没有低分于平均水平的知识点'
        }
      </div>
    )
    return tagArr
  }

  render() {
    const {advantageReport, weaknessReport, evaluateData} = this.state;
    const titleMessage = {
      rating: () => <div>
        <p>优分：得分率80%以上</p>
        <p>及格：得分率在80%-60%之间</p>
        <p>不及格：得分率在60%-40%之间</p>
        <p>低分：得分率40%以下</p>
      </div>,
      rateData: '个人得分与全班平均分的差值'
    }
    const columns = [
      {
        align: 'center',
        title: '序号',
        dataIndex: 'code',
        key: 'code',
      },
      {
        align: 'center',
        title: '知识点',
        key: 'knowledges',
        dataIndex: 'knowledges',
        onCell: () => {
          return {
            style: {
              maxWidth: 150
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
        align: 'center',
        title: <Tooltip placement="topLeft" title={titleMessage.rating}>
          <div>评级</div>
        </Tooltip>,
        dataIndex: 'rating',
        key: 'rating',
      },
      {
        align: 'center',
        title: <Tooltip placement="topLeft" title={titleMessage.rateData}>
          <div>较全班</div>
        </Tooltip>,
        dataIndex: 'rateData',
        key: 'rateData',
      }
    ];
    //折叠
    const fold = (status) => {
      this.setState({[status]: !this.state[status]})
    }

    //知识点列表渲染
    const KnowledgeTable = (props) => {
      const {knowledgeName = '', dataList = [], visibleName = ''} = props;
      const visible = this.state[visibleName];
      return (
        <div className={styles['reportTableBox']}>
          <div className={styles['tableName']}>{knowledgeName}</div>
          <Table className={visible ? styles['offFold'] : ''} rowKey='code' bordered
                 pagination={false} columns={columns}
                 dataSource={dataList}/>
          {dataList.length > 5 ?
            <div onClick={() => fold(visibleName)} className={styles['fold']}>{visible ? "收起" : "展开"}</div> : ''}
        </div>
      )
    }

    //专家总结数据
    const TestPaperSum = {
      title: '专家总结',
      textArr: [
        {
          subTitle: '①得分评级',
          depict: (evaluateData.subTitle1)
        },
        {
          subTitle: '②优劣势分析',
          depict: (evaluateData.subTitle2)
        },
      ]
    }

    return (
      <div className={styles['reportAnalyse']}>
        <div className={styles['doubleTable']}>
          <KnowledgeTable knowledgeName='优势知识点' dataList={advantageReport} visibleName='advantageVisible'/>
          <KnowledgeTable knowledgeName='劣势知识点' dataList={weaknessReport} visibleName='weaknessVisible'/>
        </div>
        {/* <ExpertsConcluded textData={TestPaperSum} style={{margin: '15px 55px'}}/> */}
      </div>
    )
  }
}

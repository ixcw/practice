/**
 *@Author:xiongwei
 *@Description:异常分析表格
 *@Date:Created in  2021/3/8
 *@Modified By:
 */
import React from 'react'
import { Table, Tooltip } from 'antd';
import styles from './AbnormalAnalysisOfAnswersTable.less';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import classNames from 'classnames';
export default class AbnormalAnalysisOfAnswersTable extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      unfoldObjectiveTable: false,//表格是否展开
    }
  }
  /**
* 页面组件即将卸载时：清空数据
*/
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    const { exemQuestionExpetionAnalysis = {} } = this.props;
    const { unfoldObjectiveTable } = this.state;
    const titles = <div>
      <p>异常失分：能力范围之内却做错；</p>
      <p>异常得分：能力范围之外却做对；</p>
      <p>正常失分：能力范围之外正常失分；</p>
      <p>正常得分：能力范围之内正常得分；</p>
    </div>
    const column = [
      {
        title: '题号',
        dataIndex: 'serialCode',
        key: 'serialCode',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '题型',
        dataIndex: 'category',
        key: 'category',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '难度',
        dataIndex: 'difficulty',
        key: 'difficulty',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '能力要求',
        dataIndex: 'abilityNeed',
        key: 'abilityNeed',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '能力水平',
        dataIndex: 'ability',
        key: 'ability',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '知识点',
        dataIndex: 'knowledges',
        key: 'knowledges',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: <Tooltip placement="topLeft" title={titles}>
          <span>得分状态</span>
        </Tooltip>,
        dataIndex: 'excepName',
        key: 'excepName',
        align: 'center',
        render: (text) => text == null ? '--' : <Tooltip placement="topLeft"
          title={text == '异常得分' ? '能力范围之外却做对' : text == '异常失分' ? '能力范围之内却做错' : text == '正常失分' ? '能力范围之外正常失分' : text == '正常得分' ? '能力范围之内正常得分' : ''}
        >
          <span style={{ color: text == '异常得分' ? '#8AF33C' : text == '异常失分' ? '#F23B63' : '#000' }} >{text}</span>
        </Tooltip>
      },
      {
        title: '得失分',
        dataIndex: 'excepScore',
        key: 'excepScore',
        align: 'center',
        render: (text) => text == null ? '--' : text + '分'
      }
    ];
    return (
      <div>
        <div>
          <div className={styles['title']}>
            <div className={styles['title-one']}>
              <div className={styles['title-one-img']}></div>
              <div style={{ color: '#8AACC6' }}>提分空间</div>
              <div>
                <div><span style={{ color: '#DE181A', fontSize: '50px' }}>
                  {exemQuestionExpetionAnalysis.upSpaceScore}</span>分</div>
              </div>
            </div>
            <div className={styles['title-one']}>
              <div>
                <div>
                  {/* <span style={{ color: '#789E68', fontSize: '30px' }}>
                  {exemQuestionExpetionAnalysis.countExceptTrueNum}
                  </span>
                  /{exemQuestionExpetionAnalysis.totalQuestionNum} */}
                  <span style={{ color: '#789E68', fontSize: '30px' }}>{exemQuestionExpetionAnalysis.countExceptTrueNum}</span> 道
                </div>
                <div>异常正确</div>
              </div>
              <div>
                <div><span style={{ color: '#789E68', fontSize: '30px' }}>
                  {exemQuestionExpetionAnalysis.totalExceptTrueScore}</span> 分
                  </div>
                <div>异常得分</div>
              </div>
            </div>
            <div className={styles['title-one']}>
              <div>
                <div>
                  {/* <span style={{ color: '#DE181A', fontSize: '30px' }}>
                  {exemQuestionExpetionAnalysis.countExceptErrorNum}
                  </span>
                  /{exemQuestionExpetionAnalysis.totalQuestionNum} */}
                  <span style={{ color: '#789E68', fontSize: '30px' }}>{exemQuestionExpetionAnalysis.countExceptErrorNum}</span> 道
                </div>
                <div>异常错误</div>
              </div>
              <div>
                <div><span style={{ color: '#DE181A', fontSize: '30px' }}>
                  {exemQuestionExpetionAnalysis.totalExceptErrorScore}</span> 分
                  </div>
                <div>异常失分</div>
              </div>
            </div>
          </div>
          <div className={classNames(styles['Table'], 'classReport-sprin-open')}>
            <div style={{ maxHeight: unfoldObjectiveTable ? '20000px' : '608px', overflow: 'hidden' }}>
              <Table
                columns={column}
                dataSource={exemQuestionExpetionAnalysis.reportVoList ? exemQuestionExpetionAnalysis.reportVoList : []}
                bordered
                pagination={false}
                rowKey='id'
              />
            </div>
            {
              exemQuestionExpetionAnalysis.reportVoList ?
                <div className={classNames(styles['Table-down'], 'no-print')} >
                  <a onClick={() => { this.setState({ unfoldObjectiveTable: !unfoldObjectiveTable }) }}>{!unfoldObjectiveTable ? <span>展开<DownOutlined /></span> : <span>收起<UpOutlined /></span>}</a>
                </div>
                : null
            }
          </div>
        </div>
      </div>
    )
  }
}
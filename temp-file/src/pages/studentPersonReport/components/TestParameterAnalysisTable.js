/**
 *@Author:xiongwei
 *@Description:考题分布表格
 *@Date:Created in  2021/3/8
 *@Modified By:
 */
import React from 'react'
import { Table, Tooltip } from 'antd';
import styles from './TestParameterAnalysisTable.less';
import queryString from 'query-string'
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { Modal, Button } from 'antd';
import classNames from 'classnames';
import QuestionDetailsModal from './QuestionDetailsModal';//题目详情弹窗

export default class TestParameterAnalysisTable extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      unfoldObjectiveTable: false,//表格是否展开
      topicId: undefined,
      isModalVisible: false,//modal开关
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
    const { parameterAnalysis = [], location } = this.props;
    const { unfoldObjectiveTable, topicId, isModalVisible } = this.state;
    const { search } = location;
    const query = queryString.parse(search);
    const titles = <div>
      <p>异常失分：能力范围之内却做错；</p>
      <p>异常得分：能力范围之外却做对；</p>
      <p>正常失分：能力范围之外正常失分；</p>
      <p>正常得分：能力范围之内正常得分；</p>
    </div>
    const handleCancel = () => {
      this.setState({
        isModalVisible: false
      })
    }
    const column =()=>{ 
      if(query.jobType==1){//作业报告
        return [
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
            title: '认知层次',
            dataIndex: 'cognName',
            key: 'cognName',
            align: 'center',
            render: (text) => text == null ? '--' : text
          },
          {
            title: '关键能力',
            dataIndex: 'abilityName',
            key: 'abilityName',
            align: 'center',
            render: (text) => text == null ? '--' : text
          },
          // {
          //   title: '测评目标',
          //   dataIndex: 'testTarget',
          //   key: 'testTarget',
          //   align: 'center',
          //   render: (text) => text == null ? '--' : text
          // },
          {
            title: '个人评级',
            dataIndex: 'scoreLevel',
            key: 'scoreLevel',
            align: 'center',
            render: (text) => text == null ? '--' : text
          },
          {
            title: '班级平均评级',
            dataIndex: 'classAvgScoreLevel',
            key: 'classAvgScoreLevel',
            align: 'center',
            render: (text) => text == null ? '--' : text
          },
          {
            title: <Tooltip placement="topLeft" title={titles}>
              <span>答题状态</span>
            </Tooltip>,
            dataIndex: 'excepName',
            key: 'excepName',
            align: 'center',
            render: (text) => text == null ? '--' : <Tooltip placement="topLeft"
              title={text == '异常得分' ? '能力范围之外却做对' : text == '异常失分' ? '能力范围之内却做错' : text == '正常失分' ? '能力范围之外正常失分' : text == '正常得分' ? '能力范围之内正常得分' : ''}
            >
              <span style={{ color: text == '异常得分' ? '#8AF33C' : text == '异常失分' ? '#F23B63' : '#000' }}>{text}</span>
            </Tooltip>,
          },
          {
            title: '操作',
            dataIndex: 'wdssswtotalsSdcores1',
            key: '11',
            align: 'center',
            // render: (text, record, index) => <a onClick={() => {this.setState({topicId:record.id,isModalVisible:true}) }}>详情</a>,
            render: (text, record, index) => <a onClick={() => { this.questionDetailsRef.handleOnOrOff(true, record) }}>详情</a>,
          },
        ];
      }else{
        return [
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
          title: '认知层次',
          dataIndex: 'cognName',
          key: 'cognName',
          align: 'center',
          render: (text) => text == null ? '--' : text
        },
        {
          title: '关键能力',
          dataIndex: 'abilityName',
          key: 'abilityName',
          align: 'center',
          render: (text) => text == null ? '--' : text
        },
        {
          title: '个人得分/满分',
          dataIndex: 'scoreAndFullScore',
          key: 'scoreAndFullScore',
          align: 'center',
          render: (text) => text == null ? '--' : text
        },
        {
          title: '个人得分率',
          dataIndex: 'scoreRate',
          key: 'scoreRate',
          align: 'center',
          render: (text) => text == null ? '--' : text + '%'
        },
        {
          title: '班级得分率',
          dataIndex: 'classScoreRate',
          key: 'classScoreRate',
          align: 'center',
          render: (text) => text == null ? '--' : text + '%'
        },
        {
          title: <Tooltip placement="topLeft" title={titles}>
            <span>答题状态</span>
          </Tooltip>,
          dataIndex: 'excepName',
          key: 'excepName',
          align: 'center',
          render: (text) => text == null ? '--' : <Tooltip placement="topLeft"
            title={text == '异常得分' ? '能力范围之外却做对' : text == '异常失分' ? '能力范围之内却做错' : text == '正常失分' ? '能力范围之外正常失分' : text == '正常得分' ? '能力范围之内正常得分' : ''}
          >
            <span style={{ color: text == '异常得分' ? '#8AF33C' : text == '异常失分' ? '#F23B63' : '#000' }}>{text}</span>
          </Tooltip>,
        },
        {
          title: '操作',
          dataIndex: 'wdssswtotalsSdcores1',
          key: '11',
          align: 'center',
          // render: (text, record, index) => <a onClick={() => {this.setState({topicId:record.id,isModalVisible:true}) }}>详情</a>,
          render: (text, record, index) => <a onClick={() => { this.questionDetailsRef.handleOnOrOff(true, record) }}>详情</a>,
        },
      ];
    }
  }
    return (
      <div>
        <div className={classNames(styles['Table'], 'classReport-sprin-open')} >
          <div style={{ maxHeight: unfoldObjectiveTable ? '20000px' : '608px', overflow: 'hidden' }}>
            <Table
              columns={column()}
              dataSource={parameterAnalysis}
              bordered
              rowKey='id'
              pagination={false}
            />
          </div>
          {
            parameterAnalysis ?
              <div className={classNames(styles['Table-down'], 'no-print')} >
                <a onClick={() => { this.setState({ unfoldObjectiveTable: !unfoldObjectiveTable }) }}>{!unfoldObjectiveTable ? <span>展开<DownOutlined /></span> : <span>收起<UpOutlined /></span>}</a>
              </div>
              : null
          }
          {/* <Modal
          visible={isModalVisible}
          onCancel={handleCancel}
          destroyOnClose={true}
          > */}
          {/* <DetailsOfTheQuestions/> */}
          {/* </Modal> */}
          <QuestionDetailsModal location={location} getRef={(ref) => { this.questionDetailsRef = ref }} />
        </div>
      </div>
    )
  }
}
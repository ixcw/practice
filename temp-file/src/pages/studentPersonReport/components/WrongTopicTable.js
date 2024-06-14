/**
 *@Author:xiongwei
 *@Description:错题分析
 *@Date:Created in  2021/8/27
 *@Modified By:
 */
import React from 'react'
import { Table, Tooltip } from 'antd';
import styles from './WrongTopicTable.less';
import { getLocationObj } from "@/utils/utils";
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import classNames from 'classnames';
export default class WrongTopicTable extends React.Component {
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
    const { exemQuestionExpetionAnalysis = [], location } = this.props;
    const _location = getLocationObj(location);
    const { query } = _location || {};
    let tableData = exemQuestionExpetionAnalysis.length > 0 ? exemQuestionExpetionAnalysis.map((item, index) => {
      let obj = item;
      obj.key = index
      return obj
    }) : []
    const { unfoldObjectiveTable } = this.state;
    const titles = <div>
      <p>异常失分：能力范围之内却做错；</p>
      <p>异常得分：能力范围之外却做对；</p>
      <p>正常失分：能力范围之外正常失分；</p>
      <p>正常得分：能力范围之内正常得分；</p>
    </div>
    // const column = query.jobType == 1 ?
    const column =[
      {
        title: '题号',
        dataIndex: 'code',
        key: 'code',
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
        title: '知识点',
        dataIndex: 'knowName',
        key: 'knowName',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: query.jobType == 1 ? '等级' : '得分',
        dataIndex: query.jobType == 1 ? 'scoreLevel' : 'score',
        key: query.jobType == 1 ? 'scoreLevel' : 'score',
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
          <span style={{ color: text == '异常得分' ? '#8AF33C' : text == '异常失分' ? '#F23B63' : '#000' }} >{text}</span>
        </Tooltip>
      },
      {
        title: '订正状态',
        dataIndex: 'revise',
        key: 'revise',
        align: 'center',
        render: (text) => text ? '已订正' : <span style={{ color: 'red' }}>未订正</span>
      },
      {
        title: '专练次数',
        dataIndex: 'trainNum',
        key: 'trainNum',
        align: 'center',
        render: (text) => text == null ? '--' : text
      },
      {
        title: '专练正确率',
        dataIndex: 'avgCorrectRate',
        key: 'avgCorrectRate',
        align: 'center',
        render: (text) => text == null ? '--' : text + '%'
      },
      {
        title: '掌握情况',
        dataIndex: 'flag',
        key: 'flag',
        align: 'center',
        render: (text) => text ? '已掌握' : <span style={{ color: 'red' }}>未掌握</span>
      }
    ]
    // :
    // [
    //   {
    //     title: '题号',
    //     dataIndex: 'code',
    //     key: 'code',
    //     align: 'center',
    //     render: (text) => text == null ? '--' : text
    //   },
    //   {
    //     title: '难度',
    //     dataIndex: 'difficulty',
    //     key: 'difficulty',
    //     align: 'center',
    //     render: (text) => text == null ? '--' : text
    //   },
    //   {
    //     title: '知识点',
    //     dataIndex: 'knowName',
    //     key: 'knowName',
    //     align: 'center',
    //     render: (text) => text == null ? '--' : text
    //   },
    //   {
    //     title: query.jobType == 1 ? '等级' : '得分',
    //     dataIndex: query.jobType == 1 ? 'scoreLevel' : 'score',
    //     key: query.jobType == 1 ? 'scoreLevel' : 'score',
    //     align: 'center',
    //     render: (text) => text == null ? '--' : text
    //   },
    //   {
    //     title: <Tooltip placement="topLeft" title={titles}>
    //       <span>答题状态</span>
    //     </Tooltip>,
    //     dataIndex: 'excepName',
    //     key: 'excepName',
    //     align: 'center',
    //     render: (text) => text == null ? '--' : <Tooltip placement="topLeft"
    //       title={text == '异常得分' ? '能力范围之外却做对' : text == '异常失分' ? '能力范围之内却做错' : text == '正常失分' ? '能力范围之外正常失分' : text == '正常得分' ? '能力范围之内正常得分' : ''}
    //     >
    //       <span style={{ color: text == '异常得分' ? '#8AF33C' : text == '异常失分' ? '#F23B63' : '#000' }} >{text}</span>
    //     </Tooltip>
    //   },
    //   {
    //     title: '专练次数',
    //     dataIndex: 'trainNum',
    //     key: 'trainNum',
    //     align: 'center',
    //     render: (text) => text == null ? '--' : text
    //   },
    //   {
    //     title: '专练正确率',
    //     dataIndex: 'avgCorrectRate',
    //     key: 'avgCorrectRate',
    //     align: 'center',
    //     render: (text) => text == null ? '--' : text + '%'
    //   },
    //   {
    //     title: '掌握情况',
    //     dataIndex: 'flag',
    //     key: 'flag',
    //     align: 'center',
    //     render: (text) => text ? '已掌握' : <span style={{ color: 'red' }}>未掌握</span>
    //   }
    // ];
    return (
      <div>
        <div>
          <div className={classNames(styles['Table'], 'classReport-sprin-open')}>
            <div style={{ maxHeight: unfoldObjectiveTable ? '20000px' : '608px', overflow: 'hidden' }}>
              <Table
                columns={column}
                dataSource={tableData}
                bordered
                pagination={false}
                rowKey='key'
              />
            </div>
            {
              tableData.length > 0 ?
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
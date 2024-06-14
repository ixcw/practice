/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2021/3/10
 *@Modified By:
 */
import React from 'react';
import { Modal, Button, Table, Tooltip } from 'antd'
import { MistakeTopicReport as namespace } from '@/utils/namespace'
import { connect } from 'dva'
import { existArr, uppercaseNum } from "@/utils/utils";
import queryString from 'query-string'

@connect(state => ({
  findClassAnalysisTableInfo: state[namespace].findClassAnalysisTableInfo,//获取答题分析统计详情
  findErrorTrainInfoByUserId: state[namespace].findErrorTrainInfoByUserId,//获取错题专练列表统计详情
}))
export default class DetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,//modal开关状态
    };
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  /**
   * modal开关
   * @param status
   */
  detailSwitch = (status) => {
    this.setState({ visible: status })
    if (!status) {
      this.props.dispatch({
        type: namespace + '/set',
        payload: {
          findClassAnalysisTableInfo: [],
          findErrorTrainInfoByUserId: []
        }
      })
    }
  }


  render() {
    const { visible } = this.state;
    const { findClassAnalysisTableInfo = [], findErrorTrainInfoByUserId = [], location } = this.props;
    const analysisList = existArr(findClassAnalysisTableInfo) || [];//获取答题分析统计详情
    const trainList = existArr(findErrorTrainInfoByUserId) || [];//获取错题专练列表统计详情
    const { search } = location;
    const query = queryString.parse(search);
    //获取答题分析统计详情列表配置
    const analysisColumns = query.jobType == 1 ? [
      {
        title: '序号',
        align: 'center',
        dataIndex: 'categoryName',
        key: 'categoryName',
        render: (text, record, index) => <span>{index + 1}</span>
      },
      {
        title: '姓名',
        align: 'center',
        dataIndex: 'studentName',
        key: 'studentName',
      },
      {
        title: '能力要求',
        align: 'center',
        dataIndex: 'abilityNeed',
        key: 'abilityNeed',
      },
      {
        title: '能力水平',
        align: 'center',
        dataIndex: 'ability',
        key: 'ability',
      },
      {
        title: '订正情况',
        align: 'center',
        dataIndex: 'revise',
        key: 'revise',
        render: (text) => text ? '已订正' : <span style={{ color: 'red' }}>未订正</span>
      },
      {
        title: '答题状态',
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
          <Tooltip placement='top' title={[
            '能力范围之内正常得分',
            '能力范围之内却做错',
            '能力范围之外却做对',
            '能力范围之外正常失分'
          ][parseInt(record.status, 10) - 1 || 0]}>
            <span
              style={{ color: parseInt(text, 10) === 2 ? 'red' : '' }}>{record.statusName}
            </span>
          </Tooltip>)
      },
      {
        title: '失分',
        align: 'center',
        dataIndex: 'studentScore',
        key: 'studentScore',
        render: (text, record) => <span>{record.statusName === "正常失分" ? 0 : text}</span>
      }
    ] : [
        {
          title: '序号',
          align: 'center',
          dataIndex: 'categoryName',
          key: 'categoryName',
          render: (text, record, index) => <span>{index + 1}</span>
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'studentName',
          key: 'studentName',
        },
        {
          title: '能力要求',
          align: 'center',
          dataIndex: 'abilityNeed',
          key: 'abilityNeed',
        },
        {
          title: '能力水平',
          align: 'center',
          dataIndex: 'ability',
          key: 'ability',
        },
        {
          title: '答题状态',
          align: 'center',
          dataIndex: 'status',
          key: 'status',
          render: (text, record) => (
            <Tooltip placement='top' title={[
              '能力范围之内正常得分',
              '能力范围之内却做错',
              '能力范围之外却做对',
              '能力范围之外正常失分'
            ][parseInt(record.status, 10) - 1 || 0]}>
              <span
                style={{ color: parseInt(text, 10) === 2 ? 'red' : '' }}>{record.statusName}
              </span>
            </Tooltip>)
        },
        {
          title: '失分',
          align: 'center',
          dataIndex: 'studentScore',
          key: 'studentScore',
          render: (text, record) => <span>{record.statusName === "正常失分" ? 0 : text}</span>
        }
      ];

    /**
     * 获取错题专练列表统计详情列表配置
     * @param trainList
     * @returns {{}}
     */
    const trainColumns = (trainList) => {
      const trainMapObj = [];
      const trainMap = existArr(trainList) ? existArr(trainList)[0].trainMap : [];//专练正确率对象集合
      if (existArr(trainMap)) {
        trainMap.map((re, index) => {
          trainMapObj.push({
            title: `专练${uppercaseNum(index + 1)}`,
            align: 'center',
            dataIndex: 'trainMap',
            key: 'trainMap',
            width: 100,
            render: (text) => {
              const item = text[index];
              return (
                <span>{`${item.correctRate !== null ? item.correctRate + '%' : '--'}`}</span>
              )
            }
          })
        })
      }
      if (query.jobType == 1) {
        return [
          {
            title: '题号',
            align: 'center',
            dataIndex: 'CODE',
            width: 60,
            key: 'CODE',
            fixed: 'left',
          },
          {
            title: '题型',
            width: 100,
            align: 'center',
            fixed: 'left',
            dataIndex: 'categoryName',
            key: 'categoryName',
          },
          {
            title: '难度',
            width: 60,
            align: 'center',
            fixed: 'left',
            dataIndex: 'difficulty',
            key: 'difficulty',
          },
          {
            title: '能力要求',
            width: 100,
            fixed: 'left',
            align: 'center',
            dataIndex: 'abilityNeed',
            key: 'abilityNeed',
          },
          {
            title: '能力水平',
            width: 100,
            align: 'center',
            dataIndex: 'ability',
            fixed: 'left',
            key: 'ability',
          },
          {
            title: '掌握状态',
            width: 100,
            align: 'center',
            dataIndex: 'flag',
            key: 'flag',
            render: (text) => <span
              style={{ color: parseInt(text, 10) ? '' : 'red' }}>{["未掌握", "已掌握"][text ? parseInt(text, 10) : 0]}</span>
          },
          {
            title: '订正情况',
            align: 'center',
            width: 200,
            dataIndex: 'revise',
            key: 'revise',
            render: (text) => text ? '已订正' : <span style={{ color: 'red' }}>未订正</span>
          },
          {
            title: '知识点',
            width: 200,
            align: 'center',
            dataIndex: 'knowName',
            key: 'knowName',
          },
          {
            title: '认知层次',
            width: 200,
            align: 'center',
            dataIndex: 'cognLevelName',
            key: 'cognLevelName',
          },
          {
            title: '关键能力',
            width: 200,
            align: 'center',
            dataIndex: 'keyAbilityName',
            key: 'keyAbilityName',
          },
          
          ...trainMapObj
        ]
      } else {
        return [
          {
            title: '题号',
            align: 'center',
            dataIndex: 'CODE',
            width: 60,
            key: 'CODE',
            fixed: 'left',
          },
          {
            title: '题型',
            width: 100,
            align: 'center',
            fixed: 'left',
            dataIndex: 'categoryName',
            key: 'categoryName',
          },
          {
            title: '难度',
            width: 60,
            align: 'center',
            fixed: 'left',
            dataIndex: 'difficulty',
            key: 'difficulty',
          },
          {
            title: '能力要求',
            width: 100,
            fixed: 'left',
            align: 'center',
            dataIndex: 'abilityNeed',
            key: 'abilityNeed',
          },
          {
            title: '能力水平',
            width: 100,
            align: 'center',
            dataIndex: 'ability',
            fixed: 'left',
            key: 'ability',
          },
          {
            title: '掌握状态',
            width: 100,
            align: 'center',
            dataIndex: 'flag',
            key: 'flag',
            render: (text) => <span
              style={{ color: parseInt(text, 10) ? '' : 'red' }}>{["未掌握", "已掌握"][text ? parseInt(text, 10) : 0]}</span>
          },
          {
            title: '知识点',
            width: 200,
            align: 'center',
            dataIndex: 'knowName',
            key: 'knowName',
          },
          {
            title: '认知层次',
            width: 200,
            align: 'center',
            dataIndex: 'cognLevelName',
            key: 'cognLevelName',
          },
          {
            title: '关键能力',
            width: 200,
            align: 'center',
            dataIndex: 'keyAbilityName',
            key: 'keyAbilityName',
          },
          ...trainMapObj
        ]
      }
    }
    return (
      <Modal
        title={`${analysisList.length ? '学生失分名单' : '错题专练详情'}`}
        visible={visible}
        onOk={() => this.detailSwitch(false)}
        onCancel={() => this.detailSwitch(false)}
        width={'80%'}
        footer={[
          <Button key="back" onClick={() => this.detailSwitch(false)}>
            确认
          </Button>
        ]}
      >
        <div>
          {analysisList.length ?
            <Table scroll={{ y: 580 }} pagination={false} rowKey='studentName' columns={analysisColumns}
              dataSource={analysisList} /> : ''}
          {trainList.length ?
            <Table scroll={{ y: 580, x: 1200 + trainList[0].trainMap.length * 100 }} pagination={false}
              rowKey='questionId' columns={trainColumns(trainList)}
              dataSource={trainList} /> : ''}
        </div>
      </Modal>
    )
  }
}
